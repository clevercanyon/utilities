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
 * On `post-update-cmd` hook.
 *
 * @since 2021-12-15
 */
final class On_Post_Update_Cmd extends U\A6t\CLI_Tool {
	/**
	 * Project.
	 *
	 * @since 2021-12-15
	 */
	protected U\Dev\Project $project;

	/**
	 * Version.
	 *
	 * @since 2021-12-15
	 */
	protected const VERSION = '1.0.0';

	/**
	 * Tool name.
	 *
	 * @since 2021-12-15
	 */
	protected const NAME = 'Composer/On_Post_Update_Cmd';

	/**
	 * Constructor.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|array|null $args_to_parse Optional custom args to parse instead of `$_SERVER['argv']`.
	 *                                         If not given, defaults internally to `$_SERVER['argv']`.
	 */
	public function __construct( /* string|array|null */ $args_to_parse = null ) {
		parent::__construct( $args_to_parse );

		$this->add_commands( [
			'symlink' => [
				'callback'    => [ $this, 'symlink' ],
				'synopsis'    => 'Updates project symlinks.',
				'description' => 'Updates project symlinks. See ' . __CLASS__ . '::symlink()',
				'options'     => [
					'project-dir' => [
						'required'    => true,
						'description' => 'Project directory path.',
						'validator'   => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, 'dir' ) )
							&& is_file( U\Dir::join( $abs_path, '/composer.json' ) ),
					],
				],
			],
			'update'  => [
				'callback'    => [ $this, 'update' ],
				'synopsis'    => 'Updates project dotfiles and NPM packages.',
				'description' => 'Updates project dotfiles and NPM packages. See ' . __CLASS__ . '::update()',
				'options'     => [
					'project-dir' => [
						'required'    => true,
						'description' => 'Project directory path.',
						'validator'   => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, 'dir' ) )
							&& is_file( U\Dir::join( $abs_path, '/composer.json' ) ),
					],
				],
			],
		] );
		$this->route_request();
	}

	/**
	 * Command: `symlink`.
	 *
	 * @since 2021-12-15
	 */
	protected function symlink() : void {
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: Symlinking ...' );

			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			$this->maybe_symlink_local_repos();

			U\CLI::done( '[' . __METHOD__ . '()]: Symlinking complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::error( $throwable->getMessage() );
			U\CLI::error( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `update`.
	 *
	 * @since 2021-12-15
	 */
	protected function update() : void {
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: Updating ...' );

			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			$this->maybe_setup_dotfiles();
			$this->maybe_run_npm_update();
			$this->maybe_run_npx_webpack();

			$this->maybe_compile_distro_lib_dir();
			$this->maybe_compile_distro_lib_zip();
			$this->maybe_s3_upload_distro_lib_zip();

			U\CLI::done( '[' . __METHOD__ . '()]: Update complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::error( $throwable->getMessage() );
			U\CLI::error( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Maybe symlink local repos.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Exception On any failure.
	 */
	protected function maybe_symlink_local_repos() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		$symlink_local_packages_prop = '&.post_update_cmd_handler.symlink_local_packages';
		$symlink_local_packages      = $this->project->extra_json_prop( $symlink_local_packages_prop );

		if ( null === $symlink_local_packages ) {
			return; // Nothing to do here.
		}
		if ( ! is_object( $symlink_local_packages ) ) {
			throw new U\Exception(
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
				throw new U\Exception(
					'Unexpected extra prop: `' . $symlink_local_packages_prop . '` in: `' . $this->project->file . '`.' .
					' Each packages directory must match pattern: `' . U\Dev\Composer::PACKAGES_DIR_REGEXP . '`.'
				);
			}
			if ( ! is_array( $_package_names ) ) {
				throw new U\Exception(
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
							throw new U\Exception(
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
							throw new U\Exception(
								'Unexpected extra prop: `' . $symlink_local_packages_prop . '` with package name: `' . $_package_name . '`' .
								' in: `' . $this->project->file . '`. Package name must match pattern: `' . U\Dev\Composer::PACKAGE_NAME_REGEXP . '`' .
								' and be <= `' . U\Dev\Composer::PACKAGE_NAME_MAX_BYTES . '` bytes in length.'
							);
						}
						break;
					default:
						throw new U\Exception(
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
					if ( ! U\Fs::delete( $_package_dir ) ) {
						throw new U\Exception( 'Prior to symlink creation, failed to delete: `' . $_package_dir . '`.' );
					}
					if ( ! U\Fs::make_link( $_local_repo_dir, $_package_dir, [], false, false ) ) {
						throw new U\Exception( 'Failed to symlink: `' . $_package_dir . '`.' );
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
	 * @throws U\Exception On any failure.
	 */
	protected function maybe_setup_dotfiles() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		$dotfiles_dir  = U\Dir::name( __FILE__, 6, '/dev/libraries/dotfiles' );
		$dotfiles_file = U\Dir::join( $dotfiles_dir, '/.dotfiles.json' );

		if ( ! is_dir( $dotfiles_dir ) || ! is_readable( $dotfiles_dir ) ) {
			throw new U\Exception( 'Missing readable directory: `' . $dotfiles_dir . '`.' );
		}
		if ( ! is_file( $dotfiles_file ) || ! is_readable( $dotfiles_file ) ) {
			throw new U\Exception( 'Missing readable file: `' . $dotfiles_file . '`.' );
		}
		$dotfiles_iterator = U\Dir::iterator( $dotfiles_dir );
		$dotfiles_json     = U\File::read_json( $dotfiles_file, false );

		if ( ! is_object( $dotfiles_json ) || ! is_array( $dotfiles_json->manifest ?? null ) ) {
			throw new U\Exception( 'Failed to parse `manifest` in `' . $dotfiles_json . '`.' );
		}
		foreach ( $dotfiles_iterator as $_resource ) {
			if ( ! $_resource->isFile() ) {
				continue; // Not applicable.
			}
			$_from_path    = U\Fs::normalize( $_resource->getPathname() );
			$_from_subpath = U\Fs::normalize( $_resource->getSubPathname() );
			$_to_path      = U\Dir::join( $this->project->dir, '/' . $_from_subpath );

			if ( ! in_array( $_from_subpath, $dotfiles_json->manifest, true ) ) {
				continue; // Not in the manifest; ignore.
			}
			if ( ! is_file( $_from_path ) || ! is_readable( $_from_path ) ) {
				throw new U\Exception( 'Unable to read dotfile: `' . $_from_path . '`.' );
			}
			if ( is_file( $_to_path ) && ( ! is_readable( $_to_path ) || ! is_writable( $_to_path ) ) ) {
				throw new U\Exception( 'Unable to update existing dotfile: `' . $_to_path . '`.' );
			}
			switch ( $_from_subpath ) {
				case 'package.json': // If exists, update. Do NOT overwrite.
					if ( is_file( $_to_path ) ) {
						// Parse JSON objects.

						$_from_path_json = U\File::read_json( $_from_path, false );
						$_to_path_json   = U\File::read_json( $_to_path, false );

						// Validate `$_from_path_json`.

						if ( ! is_object( $_from_path_json ) ) {
							throw new U\Exception( 'Unable to parse JSON in: `' . $_from_path . '`.' );
						}
						$_from_path_json->devDependencies      ??= (object) [];
						$_from_path_json->config               ??= (object) [];
						$_from_path_json->config->clevercanyon ??= (object) [];

						if ( ! is_object( $_from_path_json->devDependencies ) ) {
							throw new U\Exception( 'Unexpected `devDependencies` in: `' . $_from_path . '`.' );
						}
						if ( ! is_object( $_from_path_json->config ) ) {
							throw new U\Exception( 'Unexpected `config` in: `' . $_from_path . '`.' );
						}
						if ( ! is_object( $_from_path_json->config->clevercanyon ) ) {
							throw new U\Exception( 'Unexpected `config->clevercanyon` in: `' . $_from_path . '`.' );
						}
						// Validate `$_to_path_json`.

						if ( ! is_object( $_to_path_json ) ) {
							throw new U\Exception( 'Unable to parse JSON in: `' . $_to_path . '`.' );
						}
						$_to_path_json->devDependencies      ??= (object) [];
						$_to_path_json->config               ??= (object) [];
						$_to_path_json->config->clevercanyon ??= (object) [];

						if ( ! is_object( $_to_path_json->devDependencies ) ) {
							throw new U\Exception( 'Unexpected `devDependencies` in: `' . $_to_path . '`.' );
						}
						if ( ! is_object( $_to_path_json->config ) ) {
							throw new U\Exception( 'Unexpected `config` in: `' . $_to_path . '`.' );
						}
						if ( ! is_object( $_to_path_json->config->clevercanyon ) ) {
							throw new U\Exception( 'Unexpected `config->clevercanyon` in: `' . $_to_path . '`.' );
						}
						// Update `$_to_path_json`.

						foreach ( $_from_path_json->devDependencies as $_package => $_version ) {
							if ( '@' . $this->project->pkg_name !== $_package ) {
								$_to_path_json->devDependencies->{$_package} = $_version;
							} // Package should NOT depend on itself ^.
						}
						$_to_path_json->devDependencies      = U\Obj::sort_by( 'prop', $_to_path_json->devDependencies );
						$_to_path_json->config->clevercanyon = U\Bundle::merge( $_to_path_json->config->clevercanyon, $_from_path_json->config->clevercanyon );

						if ( ! U\File::write( $_to_path, U\Str::json_encode( $_to_path_json, true ), false ) ) {
							throw new U\Exception( 'Failed to update `devDependencies` in: `' . $_to_path . '`.' );
						}
						U\CLI::log( '[' . __FUNCTION__ . '()]: Updated: `' . $_to_path . '`.' );
						break; // We can stop here.

					} // Please note the important fallthrough from above.
				default: // Everything falls through unless there's a `break` above.
					if ( ! U\Fs::copy( $_from_path, $_to_path ) ) {
						throw new U\Exception( 'Failed to setup dotfile: `' . $_to_path . '`.' );
					}
					U\CLI::log( '[' . __FUNCTION__ . '()]: Copied: `' . $_from_path . '`' . "\n" . ' →  `' . $_to_path . '`.' );
			}
		}
	}

	/**
	 * Maybe run NPM updates.
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

		if ( $this->project->has_file( '.webpack.cjs' ) ) {
			U\CLI::log( '[' . __FUNCTION__ . '()]: Running `npx webpack` ...' );
			U\CLI::run( [ 'npx', 'webpack', '--config', U\Dir::join( $this->project->dir, '/.webpack.cjs' ) ], $this->project->dir );
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
	 * @throws U\Exception On any failure.
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
			throw new U\Exception( 'Failed to create `./._x/comp`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Copied: `' . $this->project->dir . '`' . "\n" . ' →  `' . $comp_dir . '`.' );

		// Installs composer dependencies in `._x/comp`.
		// We didn't ignore `composer.json` when copying, so it's available.
		// The autoloader is optimized here, as we are compiling for production.

		U\CLI::run( [
			[ 'composer', 'install' ],
			[ '--profile', '--no-dev', '--no-scripts', '--no-plugins' ],
			[ '--optimize-autoloader', '--classmap-authoritative' ],
		], $comp_dir );
		U\CLI::log( '[' . __FUNCTION__ . '()]: Ran `composer install` in: `' . $comp_dir . '`.' );

		// Prunes the `./._x/comp` directory, which speeds up remaining tasks.
		// This prunes everything in `.gitignore`, except: `vendor`, `composer.json`.
		// It also prunes a bunch of other things; {@see Project::comp_dir_prune_config()}.

		if ( ! U\Dir::prune(
			$comp_dir,
			$comp_dir_prune_config[ 'prune' ],
			array_merge( $comp_dir_prune_config[ 'exceptions' ], [
				'/(?:^|.+?\/)composer\.json$/ui',
			] ),
		) ) {
			throw new U\Exception( 'Failed to prune `./._x/comp`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Pruned: `' . $comp_dir . '`.' );

		// Runs PHP Scoper on full `._x/comp` directory; outputting to `._x/distro`.
		// PHP Scoper ignores files based on Finders in the `.scoper.cfg.php` file.
		// We're not using that functionality, though, as we have already pruned the directory.

		if ( 'clevercanyon/utilities' === $this->project->pkg_name ) {
			$scoper_bin_script = U\Dir::join( $this->project->dir, '/dev/cli-tools/php-scoper/scoper' );
		} else {
			$scoper_bin_script = U\Dir::join( $this->project->dir, '/vendor/clevercanyon/utilities/dev/cli-tools/php-scoper/scoper' );
		}
		U\CLI::run( [
			[ $scoper_bin_script, 'scope' ],
			[ '--project-dir', $this->project->dir ],
			[ '--work-dir', $comp_dir ],
			[ '--prefix', $this->project->namespace_scope ],
			[ '--output-dir', $distro_dir ],
			[ '--output-project-dir', $distro_dir ],
		] );
		U\CLI::log( '[' . __FUNCTION__ . '()]: Scoped: `' . $comp_dir . '`' . "\n" . ' →  `' . $distro_dir . '`.' );

		// Prunes the `./._x/distro` directory now.
		// This prunes everything in `.gitignore`, except `vendor`. This time, including `composer.json` files.
		// It also prunes a bunch of other things; {@see Project::comp_dir_prune_config()}.

		if ( ! U\Dir::prune(
			$distro_dir,
			$comp_dir_prune_config[ 'prune' ],
			$comp_dir_prune_config[ 'exceptions' ]
		) ) {
			throw new U\Exception( 'Failed to prune `./._x/distro`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Pruned: `' . $distro_dir . '`.' );
	}

	/**
	 * Maybe compile project’s distro zip file.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Exception On any failure.
	 */
	protected function maybe_compile_distro_lib_zip() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		if ( ! $this->project->is_distro_lib() ) {
			return; // Not applicable.
		}
		$distro_dir = U\Dir::join( $this->project->dir, '/._x/distro' );

		if ( ! is_dir( $distro_dir ) ) {
			throw new U\Exception( 'Failed to zip `./._x/distro` directory. Missing: `' . $distro_dir . '`.' );
		}
		$zip_basename = $this->project->slug . '-v' . $this->project->version . '.zip';
		$zip_path     = U\Dir::join( $this->project->dir, '/._x/distro-zips/' . $zip_basename );

		if ( ! U\Fs::zip_er( $distro_dir . '->' . $this->project->slug, $zip_path ) ) {
			throw new U\Exception( 'Failed to zip: `' . $distro_dir . '->' . $this->project->slug . '`, to: `' . $zip_path . '`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Zipped: `' . $distro_dir . '`' . "\n" . ' →  `' . $zip_path . '`.' );
	}

	/**
	 * Maybe upload project’s distro zip file to AWS S3.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Exception On any failure.
	 * @throws \Throwable On some failures.
	 */
	protected function maybe_s3_upload_distro_lib_zip() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Maybe; looking ...' );

		if ( ! $this->project->is_distro_lib() ) {
			return; // Not applicable.
		}
		$zip_basename = $this->project->slug . '-v' . $this->project->version . '.zip';
		$zip_path     = U\Dir::join( $this->project->dir, '/._x/distro-zips/' . $zip_basename );

		if ( ! is_file( $zip_path ) ) {
			throw new U\Exception( 'Missing zip file: `' . $zip_path . '`.' );
		}
		$s3_zip_hash           = $this->project->s3_hash_hmac_sha256( $this->project->unbranded_slug . $this->project->version );
		$s3_zip_file_subpath   = 'cdn/product/' . $this->project->unbranded_slug . '/zips/' . $s3_zip_hash . '/' . $zip_basename;
		$s3_index_file_subpath = 'cdn/product/' . $this->project->unbranded_slug . '/data/index.json';

		$s3 = new S3Client( $this->project->s3_bucket_config() );

		// Get index w/ tagged versions.

		try {
			$_s3r     = $s3->getObject( [
				'Bucket' => $this->project->s3_bucket(),
				'Key'    => $s3_index_file_subpath,
			] );
			$s3_index = U\Str::json_decode( (string) $_s3r->get( 'Body' ) );

			if ( ! is_object( $s3_index )
				|| ! isset( $s3_index->versions->tags )
				|| ! isset( $s3_index->versions->stable_tag )
				|| ! is_object( $s3_index->versions->tags )
				|| ! is_string( $s3_index->versions->stable_tag )
			) {
				throw new U\Exception(
					'Unable to retrieve valid JSON data from: ' .
					' `' . U\Dir::join( 's3://' . $this->project->s3_bucket(), '/' . $s3_index_file_subpath ) . '`.'
				);
			}
		} catch ( \Throwable $throwable ) {
			if ( ! $throwable instanceof AwsException ) {
				throw $throwable; // Problem.
			}
			if ( 'NoSuchKey' !== $throwable->getAwsErrorCode() ) {
				throw $throwable; // Problem.
			}
			$s3_index = (object) [
				'versions' => (object) [
					'tags'       => (object) [],
					'stable_tag' => '',
				],
			]; // No index file yet, we'll create below.
		}
		// Upload zip file. Throws exception on failure, which we intentionally do not catch.

		$s3->putObject( [
			'SourceFile' => $zip_path,
			'Bucket'     => $this->project->s3_bucket(),
			'Key'        => $s3_zip_file_subpath,
		] );
		U\CLI::log(
			'[' . __FUNCTION__ . '()]: Uploaded: `' . $zip_path . '`' . "\n" .
			' →  `' . U\Dir::join( 's3://' . $this->project->s3_bucket(), '/' . $s3_zip_file_subpath ) . '`.'
		);
		// Update index w/ tagged versions.
		// Throws exception on failure, which we intentionally do not catch.

		$s3_index->versions->tags = (array) $s3_index->versions->tags;
		$s3_index->versions->tags = array_merge( $s3_index->versions->tags, [ $this->project->version => time() ] );

		uksort( $s3_index->versions->tags, 'version_compare' ); // Example: <https://3v4l.org/QitGb>.
		$s3_index->versions->tags = array_reverse( $s3_index->versions->tags );

		$s3_index->versions->stable_tag = $this->project->stable_tag;

		$s3->putObject( [
			'Body'   => U\Str::json_encode( $s3_index ),
			'Bucket' => $this->project->s3_bucket(),
			'Key'    => $s3_index_file_subpath,
		] );
		U\CLI::log(
			'[' . __FUNCTION__ . '()]: Updated: `' .
			U\Dir::join( 's3://' . $this->project->s3_bucket(), '/' . $s3_index_file_subpath ) .
			'`.'
		);
	}
}
