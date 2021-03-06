<?php
/**
 * Clever Canyon™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Strict types, namespace, use statements, and other headers.">

/**
 * Lint configuration.
 *
 * @since 2021-12-15
 *
 * phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Dev\CLI_Tools\Composer;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

/**
 * File-specific.
 *
 * @since 2021-12-15
 */
use Aws\S3\S3Client;
use Aws\Exception\AwsException;

// </editor-fold>

/**
 * Base operations class.
 *
 * @since 2021-12-15
 */
abstract class Operations extends U\A6t\CLI_Tool {
	/**
	 * Project.
	 *
	 * @since 2021-12-15
	 */
	protected U\Dev\Project $project;

	/**
	 * Maybe symlink local repos.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function maybe_symlink_local_repos() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		$symlink_local_packages_prop = '&.post_cmd_handler.symlink_local_packages';
		$symlink_local_packages      = $this->project->extra_json_prop( $symlink_local_packages_prop );

		if ( null === $symlink_local_packages ) {
			return; // Nothing to do here.
		}
		if ( ! is_object( $symlink_local_packages ) ) {
			throw new U\Fatal_Exception(
				'Unexpected extra prop: `' . $symlink_local_packages_prop . '` in: `' . $this->project->file . '`.' .
				' Must be an object with props matching pattern: `' . U\Dev\Composer::PACKAGES_DIR_REGEXP . '`.'
			);
		}
		foreach ( $symlink_local_packages as $_packages_dir => $_package_names ) {
			if (
				! $_packages_dir
				|| ! is_string( $_packages_dir )
				|| ! preg_match( U\Dev\Composer::PACKAGES_DIR_REGEXP, $_packages_dir )
			) {
				throw new U\Fatal_Exception(
					'Unexpected extra prop: `' . $symlink_local_packages_prop . '` in: `' . $this->project->file . '`.' .
					' Each packages directory must match pattern: `' . U\Dev\Composer::PACKAGES_DIR_REGEXP . '`.'
				);
			}
			if ( ! is_array( $_package_names ) ) {
				throw new U\Fatal_Exception(
					'Unexpected extra prop: `' . $symlink_local_packages_prop . '` in: `' . $this->project->file . '`.' .
					' Package names must be an array, each matching a pattern appropriate for a given packages directory.'
				);
			}
			foreach ( $_package_names as $_package_name ) {
				switch ( $_packages_dir ) {
					case 'node_modules':
						if ( ! $_package_name
							|| ! is_string( $_package_name )
							|| ! preg_match( U\Dev\NPM::PACKAGE_NAME_REGEXP, $_package_name )
							|| strlen( $_package_name ) > U\Dev\NPM::PACKAGE_NAME_MAX_BYTES
						) {
							throw new U\Fatal_Exception(
								'Unexpected extra prop: `' . $symlink_local_packages_prop . '` with package name: `' . $_package_name . '`' .
								' in: `' . $this->project->file . '`. Package name must match pattern: `' . U\Dev\NPM::PACKAGE_NAME_REGEXP . '`' .
								' and be <= `' . U\Dev\NPM::PACKAGE_NAME_MAX_BYTES . '` bytes in length.'
							);
						}
						break;
					case 'vendor':
						if ( ! $_package_name
							|| ! is_string( $_package_name )
							|| ! preg_match( U\Dev\Composer::PACKAGE_NAME_REGEXP, $_package_name )
							|| strlen( $_package_name ) > U\Dev\Composer::PACKAGE_NAME_MAX_BYTES
						) {
							throw new U\Fatal_Exception(
								'Unexpected extra prop: `' . $symlink_local_packages_prop . '` with package name: `' . $_package_name . '`' .
								' in: `' . $this->project->file . '`. Package name must match pattern: `' . U\Dev\Composer::PACKAGE_NAME_REGEXP . '`' .
								' and be <= `' . U\Dev\Composer::PACKAGE_NAME_MAX_BYTES . '` bytes in length.'
							);
						}
						break;
					default:
						throw new U\Fatal_Exception(
							'Unexpected extra prop: `' . $symlink_local_packages_prop . '` in: `' . $this->project->file . '`.' .
							' Unable to properly validate package names for directory: `' . $_packages_dir . '`.'
						);
				}
				$_package_dir = U\Dir::join( $this->project->dir, '/' . $_packages_dir . '/' . $_package_name );

				if ( ! is_dir( $_package_dir ) ) {
					continue; // Not even the package path is available.
				}
				for ( $_i = 1; $_i <= 25; $_i++ ) { // Searches higher up directory tree.
					$_local_repo_dir = U\Dir::join( $this->project->dir, '/../' . str_repeat( '../', $_i ) . $_package_name );

					if ( ! is_dir( $_local_repo_dir ) ) {
						continue; // Not far enough up yet?
					}
					if ( ! U\Fs::delete( $_package_dir, true, false ) ) {
						throw new U\Fatal_Exception( 'Prior to symlink creation, failed to delete: `' . $_package_dir . '`.' );
					}
					if ( ! U\Fs::make_link( $_local_repo_dir, $_package_dir, [], false, false ) ) {
						throw new U\Fatal_Exception( 'Failed to symlink: `' . $_package_dir . '`.' );
					}
					U\CLI::log( '[' . __FUNCTION__ . '()]: Symlinked: `' . $_package_dir . '`' . "\n" . ' →  `' . $_local_repo_dir . '`.' );
					break; // We can stop this loop.
				}
			}
		}
	}

	/**
	 * Maybe setup dotfiles.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function maybe_setup_dotfiles() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		$org_brand_var      = U\Brand::get( '&', 'var' );
		$dotfiles_dir       = U\Dir::name( __FILE__, 6, '/dev/libraries/dotfiles' );
		$dotfiles_json_file = U\Dir::join( $dotfiles_dir, '/.dotfiles.json' );

		if ( ! is_dir( $dotfiles_dir ) || ! is_readable( $dotfiles_dir ) ) {
			throw new U\Fatal_Exception( 'Missing readable directory: `' . $dotfiles_dir . '`.' );
		}
		if ( ! is_file( $dotfiles_json_file ) || ! is_readable( $dotfiles_json_file ) ) {
			throw new U\Fatal_Exception( 'Missing readable JSON file: `' . $dotfiles_json_file . '`.' );
		}
		$dotfiles_json = U\File::read_json( $dotfiles_json_file, false );

		if ( ! is_object( $dotfiles_json )
			|| ! is_object( $dotfiles_json->manifest ?? null )
			|| ! is_array( $dotfiles_json->deletion_manifest ?? null ) ) {
			throw new U\Fatal_Exception( 'Failed to parse `manifest|deletion_manifest` in `' . $dotfiles_json_file . '`.' );
		}
		foreach ( $dotfiles_json->deletion_manifest as $_subpath ) {
			if ( ! U\Fs::delete( $_path = U\Dir::join( $this->project->dir, '/' . $_subpath ), true, false ) ) {
				throw new U\Fatal_Exception( 'Unable to delete: `' . $_path . '`.' );
			}
		}                         // After all of the deletions, clear stat cache.
		U\Fs::clear_stat_cache(); // i.e., Loop below needs up-to-date info.

		foreach ( $dotfiles_json->manifest as $_from_subpath => $_to_subpath ) {
			$_to_subpath = '@' === $_to_subpath ? $_from_subpath : $_to_subpath;

			$_from_path        = U\Dir::join( $dotfiles_dir, '/' . $_from_subpath );
			$_to_path          = U\Dir::join( $this->project->dir, '/' . $_to_subpath );
			$_to_path_basename = basename( $_to_path ); // e.g., `package.json`.

			if ( ! is_file( $_from_path ) ) { // Files only.
				// We don't copy entire directories. Must be file-by-file.
				// Instead of directories, maintain the manifest's structure.
				throw new U\Fatal_Exception( 'Not a file: `' . $_from_path . '`.' );
			}
			if ( ! is_readable( $_from_path ) ) {
				throw new U\Fatal_Exception( 'Unable to read: `' . $_from_path . '`.' );
			}
			switch ( true ) {
				case ( (bool) preg_match( '/~prj\./ui', $_to_path_basename ) ):
					if ( U\Fs::exists( $_to_path ) ) {
						break; // Do not update. Do NOT overwrite.
					} // Please note this fallthrough to `default` case.

				case ( 'package.json' === $_to_subpath ): // Update. Do NOT overwrite.
					if ( is_file( $_to_path ) ) {
						// Parse JSON objects.

						$_from_path_json = U\File::read_json( $_from_path, false );
						$_to_path_json   = U\File::read_json( $_to_path, false );

						// Validate `$_from_path_json`.

						if ( ! is_object( $_from_path_json ) ) {
							throw new U\Fatal_Exception( 'Unable to parse JSON in: `' . $_from_path . '`.' );
						}
						$_from_path_json->devDependencies          ??= (object) [];
						$_from_path_json->config                   ??= (object) [];
						$_from_path_json->config->{$org_brand_var} ??= (object) [];

						if ( ! is_object( $_from_path_json->devDependencies ) ) {
							throw new U\Fatal_Exception( 'Unexpected `devDependencies` in: `' . $_from_path . '`.' );
						}
						if ( ! is_object( $_from_path_json->config ) ) {
							throw new U\Fatal_Exception( 'Unexpected `config` in: `' . $_from_path . '`.' );
						}
						if ( ! is_object( $_from_path_json->config->{$org_brand_var} ) ) {
							throw new U\Fatal_Exception( 'Unexpected `config->' . $org_brand_var . '` in: `' . $_from_path . '`.' );
						}
						// Validate `$_to_path_json`.

						if ( ! is_object( $_to_path_json ) ) {
							throw new U\Fatal_Exception( 'Unable to parse JSON in: `' . $_to_path . '`.' );
						}
						$_to_path_json->devDependencies          ??= (object) [];
						$_to_path_json->config                   ??= (object) [];
						$_to_path_json->config->{$org_brand_var} ??= (object) [];

						if ( ! is_object( $_to_path_json->devDependencies ) ) {
							throw new U\Fatal_Exception( 'Unexpected `devDependencies` in: `' . $_to_path . '`.' );
						}
						if ( ! is_object( $_to_path_json->config ) ) {
							throw new U\Fatal_Exception( 'Unexpected `config` in: `' . $_to_path . '`.' );
						}
						if ( ! is_object( $_to_path_json->config->{$org_brand_var} ) ) {
							throw new U\Fatal_Exception( 'Unexpected `config->' . $org_brand_var . '` in: `' . $_to_path . '`.' );
						}
						// Update `$_to_path_json`.

						foreach ( $_from_path_json->devDependencies as $_package => $_version ) {
							if ( '@' . $this->project->pkg_name !== $_package ) {
								$_to_path_json->devDependencies->{$_package} = $_version;
							} // Package should NOT depend on itself ^.
						}
						$_to_path_json->devDependencies          = U\Obj::sort_by( 'prop', $_to_path_json->devDependencies );
						$_to_path_json->config->{$org_brand_var} = U\Bundle::merge( $_to_path_json->config->{$org_brand_var}, $_from_path_json->config->{$org_brand_var} );

						if ( ! U\File::write( $_to_path, U\Str::json_encode( $_to_path_json, true ), false ) ) {
							throw new U\Fatal_Exception( 'Failed to update `devDependencies` in: `' . $_to_path . '`.' );
						}
						U\CLI::log( '[' . __FUNCTION__ . '()]: Updated: `' . $_to_path . '`.' );
						break; // We can stop here.

					} // Please note this fallthrough to `default` case.

				default: // Everything falls through unless there's a `break` above.
					if ( ! U\Fs::copy( $_from_path, $_to_path ) ) {
						throw new U\Fatal_Exception( 'Failed to copy: `' . $_to_path . '`.' );
					}
					U\CLI::log( '[' . __FUNCTION__ . '()]: Copied: `' . $_from_path . '`' . "\n" . ' →  `' . $_to_path . '`.' );
			}
		}
	}

	/**
	 * Maybe run NPM install.
	 *
	 * @since 2021-12-15
	 */
	protected function maybe_run_npm_install() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		if ( $this->project->has_file( 'package.json' ) ) {
			U\CLI::log( '[' . __FUNCTION__ . '()]: Running `npm install` ...' );
			U\CLI::run( [ 'npm', 'install' ], $this->project->dir );
		}
	}

	/**
	 * Maybe run NPM update.
	 *
	 * @since 2021-12-15
	 */
	protected function maybe_run_npm_update() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		if ( $this->project->has_file( 'package.json' ) ) {
			U\CLI::log( '[' . __FUNCTION__ . '()]: Running `npm update` ...' );
			U\CLI::run( [ 'npm', 'update' ], $this->project->dir );
		}
	}

	/**
	 * Maybe run NPX webpack.
	 *
	 * @since 2021-12-15
	 */
	protected function maybe_run_npx_webpack() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		if ( $this->project->has_file( 'dev/.libs/webpack/config.cjs' ) ) {
			U\CLI::log( '[' . __FUNCTION__ . '()]: Running `npx webpack` ...' );
			U\CLI::run( [ 'npx', 'webpack', '--config', U\Dir::join( $this->project->dir, '/dev/.libs/webpack/config.cjs' ) ], $this->project->dir );
		}
	}

	/**
	 * Maybe compile project’s distro directory.
	 *
	 * Regarding use of `--no-plugins` in Composer calls below.
	 * {@see https://github.com/humbug/php-scoper#composer-plugins}.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function maybe_compile_distro_lib_dir() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		if ( ! $this->project->is_distro_lib() ) {
			return; // Not applicable.
		}
		$comp_dir_copy_config  = $this->project->comp_dir_copy_config();
		$comp_dir_prune_config = $this->project->comp_dir_prune_config();

		$comp_dir   = U\Dir::join( $this->project->dir, '/._x/comp' );
		$distro_dir = U\Dir::join( $this->project->dir, '/._x/distro' );

		// Copies project directory into `._x/comp`.
		// This copy ignores everything in `.gitignore`, and nothing else.
		// For further details {@see Project::comp_dir_copy_config()}.

		if ( ! U\Fs::copy(
			$this->project->dir,
			$comp_dir,
			$comp_dir_copy_config[ 'ignore' ],
			$comp_dir_copy_config[ 'exceptions' ]
		) ) {
			throw new U\Fatal_Exception( 'Failed to create `./._x/comp`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Copied: `' . $this->project->dir . '`' . "\n" . ' →  `' . $comp_dir . '`.' );

		// Installs composer dependencies in `._x/comp`.
		// Good that we didn't ignore `composer.json|lock` when copying.
		// The autoloader is optimized here, as we are compiling for production.

		U\CLI::run( [
			[ 'composer', 'install', '--no-interaction' ],
			[ '--profile', '--no-dev', '--no-scripts', '--no-plugins' ],
			[ '--optimize-autoloader', '--classmap-authoritative' ],
		], $comp_dir );
		U\CLI::log( '[' . __FUNCTION__ . '()]: Ran `composer install` in: `' . $comp_dir . '`.' );

		// Prunes the `./._x/comp` directory, which speeds up remaining tasks.
		// This prunes everything in `.gitignore`, except: `vendor` (off by default) and `composer.json|lock`.
		// It also prunes a bunch of other things; {@see Project::comp_dir_prune_config()}.

		if ( ! U\Dir::prune(
			$comp_dir,
			$comp_dir_prune_config[ 'prune' ],
			array_merge( $comp_dir_prune_config[ 'exceptions' ], [
				'/(?:^|.+\/)composer\.(?:json|lock)$/ui',
			] ),
		) ) {
			throw new U\Fatal_Exception( 'Failed to prune `./._x/comp`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Pruned: `' . $comp_dir . '`.' );

		// Runs PHP Scoper on full `._x/comp` directory; outputting to `._x/distro`.
		// PHP Scoper can expose, exclude, and apply patchers. To learn more, see `./dev/.libs/php-scoper/config.php` file.
		// We're not excluding anything extra special here, though, as we have already pruned the directory.

		if ( 'clevercanyon/utilities' === $this->project->pkg_name ) {
			$scoper_bin_script = U\Dir::join( $this->project->dir, '/dev/cli-tools/php-scoper/scoper' );
		} else {
			$scoper_bin_script = U\Dir::join( $this->project->dir, '/vendor/clevercanyon/utilities/dev/cli-tools/php-scoper/scoper' );
		}
		U\CLI::run( [
			[ $scoper_bin_script, 'scope' ],
			[ '--project-dir', $this->project->dir ],
			[ '--prefix', $this->project->namespace_scope ],

			[ '--work-dir', $comp_dir ],
			[ '--output-dir', $distro_dir ],
			[ '--output-project-dir', $distro_dir ],
		] );
		U\CLI::log( '[' . __FUNCTION__ . '()]: Scoped: `' . $comp_dir . '`' . "\n" . ' →  `' . $distro_dir . '`.' );

		// Prunes the `./._x/distro` directory now.
		// This prunes everything in `.gitignore`, except `vendor` (off by default).
		// It also prunes a bunch of other things; {@see Project::comp_dir_prune_config()}.

		if ( ! U\Dir::prune(
			$distro_dir,
			$comp_dir_prune_config[ 'prune' ],
			$comp_dir_prune_config[ 'exceptions' ]
		) ) {
			throw new U\Fatal_Exception( 'Failed to prune `./._x/distro`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Pruned: `' . $distro_dir . '`.' );
	}

	/**
	 * Maybe compile project’s distro tests directory.
	 *
	 * Regarding use of `--no-plugins` in Composer calls below.
	 * {@see https://github.com/humbug/php-scoper#composer-plugins}.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function maybe_compile_distro_lib_tests_dir() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		if ( ! $this->project->is_distro_lib() ) {
			return; // Not applicable.
		}
		$comp_dir_copy_config  = $this->project->comp_dir_copy_config();
		$comp_dir_prune_config = $this->project->comp_dir_prune_config();

		$comp_tests_dir   = U\Dir::join( $this->project->dir, '/._x/comp-tests' );
		$distro_tests_dir = U\Dir::join( $this->project->dir, '/._x/distro-tests' );

		// Copies project directory into `._x/comp-tests`.
		// This copy ignores everything in `.gitignore`, and nothing else.
		// For further details {@see Project::comp_dir_copy_config()}.

		if ( ! U\Fs::copy(
			$this->project->dir,
			$comp_tests_dir,
			$comp_dir_copy_config[ 'ignore' ],
			$comp_dir_copy_config[ 'exceptions' ]
		) ) {
			throw new U\Fatal_Exception( 'Failed to create `./._x/comp-tests`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Copied: `' . $this->project->dir . '`' . "\n" . ' →  `' . $comp_tests_dir . '`.' );

		// Installs composer dependencies in `._x/comp-tests`.
		// Good that we didn't ignore `composer.json|lock` when copying.
		// This locates a PSR-4 `\Tests\$` prefix in `autoload-dev` and copies it to the `autoload` prop.
		// This way it's possible to run `composer install --no-dev`, but still get autoloading for tests.
		// The autoloader is optimized here, as we are compiling for pseudo-production tests.

		$comp_tests_composer_json_file = U\Dir::join( $comp_tests_dir, '/composer.json' );
		$comp_tests_composer_json      = U\File::read_json_obj( $comp_tests_composer_json_file );

		if ( isset( $comp_tests_composer_json->{'autoload-dev'}->{'psr-4'} ) ) {
			foreach ( $comp_tests_composer_json->{'autoload-dev'}->{'psr-4'} as $_prefix => $_dir ) {
				if ( U\Str::ends_with( $_prefix, '\\Tests\\' ) ) {
					$comp_tests_composer_json->{'autoload'}                        ??= (object) [];
					$comp_tests_composer_json->{'autoload'}->{'psr-4'}             ??= (object) [];
					$comp_tests_composer_json->{'autoload'}->{'psr-4'}->{$_prefix} = $_dir;
				}
			}
			U\File::write(
				$comp_tests_composer_json_file,
				U\Str::json_encode( $comp_tests_composer_json )
			);
		}
		U\CLI::run( [
			[ 'composer', 'install', '--no-interaction' ],
			[ '--profile', '--no-dev', '--no-scripts', '--no-plugins' ],
			[ '--optimize-autoloader', '--classmap-authoritative' ],
		], $comp_tests_dir );
		U\CLI::log( '[' . __FUNCTION__ . '()]: Ran `composer install` in: `' . $comp_tests_dir . '`.' );

		// Prunes the `./._x/comp-tests` directory, which speeds up remaining tasks.
		// This prunes everything in `.gitignore`, except: `vendor` (off by default), `tests`, and `composer.json|lock`.
		// It also prunes a bunch of other things; {@see Project::comp_dir_prune_config()}.

		if ( ! U\Dir::prune(
			$comp_tests_dir,
			$comp_dir_prune_config[ 'prune' ],
			array_merge( $comp_dir_prune_config[ 'exceptions' ], [
				'/^tests(?:$|\/)/ui',
				'/(?:^|.+\/)composer\.(?:json|lock)$/ui',
			] ),
		) ) {
			throw new U\Fatal_Exception( 'Failed to prune `./._x/comp-tests`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Pruned: `' . $comp_tests_dir . '`.' );

		// Runs PHP Scoper on full `._x/comp-tests` directory; outputting to `._x/distro-tests`.
		// PHP Scoper can expose, exclude, and apply patchers. To learn more, see `.scoper.cfg.php` file.
		// We're not excluding anything extra special here, though, as we have already pruned the directory.

		if ( 'clevercanyon/utilities' === $this->project->pkg_name ) {
			$scoper_bin_script = U\Dir::join( $this->project->dir, '/dev/cli-tools/php-scoper/scoper' );
		} else {
			$scoper_bin_script = U\Dir::join( $this->project->dir, '/vendor/clevercanyon/utilities/dev/cli-tools/php-scoper/scoper' );
		}
		U\CLI::run( [
			[ $scoper_bin_script, 'scope' ],
			[ '--project-dir', $this->project->dir ],
			[ '--prefix', $this->project->namespace_scope ],

			[ '--work-dir', $comp_tests_dir ],
			[ '--output-dir', $distro_tests_dir ],
			[ '--output-project-dir', $distro_tests_dir ],
		] );
		U\CLI::log( '[' . __FUNCTION__ . '()]: Scoped: `' . $comp_tests_dir . '`' . "\n" . ' →  `' . $distro_tests_dir . '`.' );

		// Prunes the `./._x/distro-tests` directory now.
		// This prunes everything in `.gitignore`, except `vendor` (off by default) and `tests`.
		// It also prunes a bunch of other things; {@see Project::comp_dir_prune_config()}.

		if ( ! U\Dir::prune(
			$distro_tests_dir,
			$comp_dir_prune_config[ 'prune' ],
			array_merge( $comp_dir_prune_config[ 'exceptions' ], [
				'/^tests(?:$|\/)/ui',
			] ),
		) ) {
			throw new U\Fatal_Exception( 'Failed to prune `./._x/distro-tests`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Pruned: `' . $distro_tests_dir . '`.' );
	}

	/**
	 * Maybe compile project’s distro zip file.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function maybe_compile_distro_lib_zip() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		if ( ! $this->project->is_distro_lib() ) {
			return; // Not applicable.
		}
		$distro_dir = U\Dir::join( $this->project->dir, '/._x/distro' );

		if ( ! is_dir( $distro_dir ) ) {
			throw new U\Fatal_Exception( 'Failed to zip `./._x/distro` directory. Missing: `' . $distro_dir . '`.' );
		}
		$zip_file_name = $this->project->slug . '-v' . $this->project->version . '.zip';
		$zip_file_path = U\Dir::join( $this->project->dir, '/._x/distro-zips/' . $zip_file_name );

		if ( ! U\Fs::zip_er( $distro_dir . '->' . $this->project->slug, $zip_file_path ) ) {
			throw new U\Fatal_Exception( 'Failed to zip: `' . $distro_dir . '->' . $this->project->slug . '`, to: `' . $zip_file_path . '`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Zipped: `' . $distro_dir . '`' . "\n" . ' →  `' . $zip_file_path . '`.' );
	}

	/**
	 * Maybe upload project’s distro zip file to AWS S3.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 * @throws \Throwable On some failures.
	 */
	protected function maybe_s3_upload_distro_lib_zip() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		if ( ! $this->project->is_distro_lib() ) {
			return; // Not applicable.
		}
		$zip_file_name = $this->project->slug . '-v' . $this->project->version . '.zip';
		$zip_file_path = U\Dir::join( $this->project->dir, '/._x/distro-zips/' . $zip_file_name );

		if ( ! is_file( $zip_file_path ) ) {
			throw new U\Fatal_Exception( 'Missing zip file: `' . $zip_file_path . '`.' );
		}
		$s3_zip_file_hash                 = $this->project->s3_hash_hmac_sha256( $this->project->unbranded_slug . $zip_file_name . $this->project->version );
		$s3_zip_file_subpath              = 'cdn/product/' . $this->project->unbranded_slug . '/files/' . $s3_zip_file_hash . '/' . $zip_file_name;
		$s3_distro_zips_json_file_subpath = 'cdn/product/' . $this->project->unbranded_slug . '/data/distro-zips.json';

		$s3 = new S3Client( $this->project->s3_bucket_config() );

		// Get `distro-zips.json` w/ tagged versions.

		try {
			$_s3r                = $s3->getObject( [
				'Bucket' => $this->project->s3_bucket(),
				'Key'    => $s3_distro_zips_json_file_subpath,
			] );
			$s3_distro_zips_json = U\Str::json_decode( (string) $_s3r->get( 'Body' ) );

			if ( ! is_object( $s3_distro_zips_json )

				|| ! isset( $s3_distro_zips_json->headers )
				|| ! is_object( $s3_distro_zips_json->headers )

				|| ! isset( $s3_distro_zips_json->versions->tags )
				|| ! is_object( $s3_distro_zips_json->versions->tags )

				|| ! isset( $s3_distro_zips_json->versions->stable_tag )
				|| ! is_string( $s3_distro_zips_json->versions->stable_tag )
			) {
				throw new U\Fatal_Exception(
					'Unable to retrieve valid JSON data from: ' .
					' `' . U\Dir::join( 's3://' . $this->project->s3_bucket(), '/' . $s3_distro_zips_json_file_subpath ) . '`.'
				);
			}
		} catch ( \Throwable $throwable ) {
			if ( ! $throwable instanceof AwsException ) {
				throw $throwable; // Problem.
			}
			if ( 'NoSuchKey' !== $throwable->getAwsErrorCode() ) {
				throw $throwable; // Problem.
			}
			$s3_distro_zips_json = (object) [
				'headers'  => (object) [],
				'versions' => (object) [
					'tags'       => (object) [],
					'stable_tag' => '',
				],
			]; // No `distro-zips.json` file yet, we'll create below.
		}
		// Upload zip file. Throws exception on failure, which we intentionally do not catch.

		$s3->putObject( [
			'SourceFile' => $zip_file_path,
			'Bucket'     => $this->project->s3_bucket(),
			'Key'        => $s3_zip_file_subpath,
		] );
		U\CLI::log(
			'[' . __FUNCTION__ . '()]: Uploaded: `' . $zip_file_path . '`' . "\n" .
			' →  `' . U\Dir::join( 's3://' . $this->project->s3_bucket(), '/' . $s3_zip_file_subpath ) . '`.'
		);
		// Update `distro-zips.json` w/ tagged versions.
		// Throws exception on failure, which we intentionally do not catch.

		$s3_distro_zips_json->headers                                   = (object) []; // None for now.
		$s3_distro_zips_json->versions->tags                            = (array) $s3_distro_zips_json->versions->tags;
		$s3_distro_zips_json->versions->tags[ $this->project->version ] = (object) [
			'time'    => U\Time::utc(),
			'version' => $this->project->version,
		];
		uksort( $s3_distro_zips_json->versions->tags, 'version_compare' ); // {@see https://3v4l.org/QitGb}.
		$s3_distro_zips_json->versions->tags       = (object) array_reverse( $s3_distro_zips_json->versions->tags );
		$s3_distro_zips_json->versions->stable_tag = $this->project->stable_tag;

		$s3->putObject( [
			'Body'   => U\Str::json_encode( $s3_distro_zips_json ),
			'Bucket' => $this->project->s3_bucket(),
			'Key'    => $s3_distro_zips_json_file_subpath,
		] );
		U\CLI::log(
			'[' . __FUNCTION__ . '()]: Updated: `' .
			U\Dir::join( 's3://' . $this->project->s3_bucket(), '/' . $s3_distro_zips_json_file_subpath ) .
			'`.'
		);
	}
}
