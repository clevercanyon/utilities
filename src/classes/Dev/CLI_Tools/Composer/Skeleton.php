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
 * Skeleton.
 *
 * @since 2021-12-15
 */
final class Skeleton extends U\A6t\CLI_Tool {
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
	protected const NAME = 'Composer/Skeleton';

	/**
	 * User input data.
	 *
	 * @since 2022-02-23
	 */
	protected ?object $data;

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
			'prepare' => [
				'callback'    => [ $this, 'prepare' ],
				'synopsis'    => 'Prepares project skeleton.',
				'description' => 'Prepares project skeleton. See ' . __CLASS__ . '::prepare()',
				'options'     => [
					'project-dir' => [
						'optional'     => true,
						'arg_required' => true,
						'description'  => 'Project directory path.',
						'validator'    => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, 'dir' ) )
							&& is_file( U\Dir::join( $abs_path, '/composer.json' ) ),
						'default'      => $this->locate_nearest_project_dir(),
					],
				],
			],
		] );
		$this->route_request();
	}

	/**
	 * Command: `prepare`.
	 *
	 * @since 2021-12-15
	 */
	protected function prepare() : void {
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: Preparing ...' );

			$this->check_skeleton_project_dir();
			$this->gather_user_input();
			$this->prepare_project();

			U\CLI::success( '[' . __METHOD__ . '()]: Preparation complete ✔.' );

			if ( $remaining_references = $this->check_skeleton_references_in_textual_files() ) {
				U\CLI::heading( 'The word `skeleton` still appears in the following files, however. Please review.' );
				U\CLI::log( $remaining_references );
			}
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Checks skeleton project directory.
	 *
	 * @since 2022-02-23
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function check_skeleton_project_dir() : void {
		$skeleton_project_dir       = U\Fs::abs( $this->get_option( 'project-dir' ) );
		$skeleton_project_json_file = U\Dir::join( $skeleton_project_dir, '/composer.json' );

		if ( false === mb_stripos( basename( $skeleton_project_dir ), 'skeleton' ) ) {
			throw new U\Fatal_Exception(
				'This is not a project skeleton directory.' .
				' Directory basename doesn’t contain the word `skeleton`.' .
				' Got: `' . basename( $skeleton_project_dir ) . '`.'
			);
		}
		if ( ! is_file( $skeleton_project_json_file ) ) {
			throw new U\Fatal_Exception(
				'This is not a project skeleton directory.' .
				' There is no `composer.json` @: `' . $skeleton_project_json_file . '`.'
			);
		}
		$skeleton_project_json = U\File::read_json_obj( $skeleton_project_json_file );

		if ( false === mb_stripos( basename( $skeleton_project_json->name ?? '' ), 'skeleton' ) ) {
			throw new U\Fatal_Exception(
				'This is not a project skeleton directory.' .
				' The basename of `name` in `composer.json` doesn’t contain the word `skeleton`.' .
				' Got: `' . basename( $skeleton_project_json->name ?? '' ) . '`.'
			);
		}
	}

	/**
	 * Gathers user input.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function gather_user_input() : void {
		/*
		 * Skeleton project directory.
		 */
		$skeleton_project_dir = U\Fs::abs( $this->get_option( 'project-dir' ) );

		/*
		 * Brand n7m.
		 */
		$brand_n7m = U\CLI::question(
			'Start with this project’s Brand Numeronym.' . "\n" .
			'A Brand Numeronym is sometimes referred to as an n7m.' . "\n" .
			'... n7m is the numeronym for numeronym ;)' . "\n\n" .

			'Examples of Brand Numeronyms:' . "\n" .
			' - c10n' . "\n" .
			' - w6e' . "\n\n" .

			'Brand Numeronym must be given as:' . "\n" .
			'e.g., https://en.wikipedia.org/wiki/Numeronym' . "\n\n" .

			'Brand Numeronym: ',
			true, // Require answer.
			function ( string $answer ) : bool {
				$answer = mb_strtolower( $answer );
				return U\Str::is_n7m( $answer ) && U\Brand::get( $answer );
			}
		);
		$brand     = U\Brand::get( mb_strtolower( $brand_n7m ) );
		unset( $brand_n7m ); // Ditch, we don't need this now.

		U\CLI::output(
			"\n" . 'Great! That’s Brand Slug: `' . $brand->slug . '`.' . "\n" .
			'You’re starting a new Project — how exciting!',
			'blue'
		);

		/*
		 * Package name.
		 */
		if ( $brand->org->n7m === $brand->n7m ) {
			$pkg_name       = U\CLI::question(
				"\n" . 'Please choose a Package Name.' . "\n\n" .

				'Examples of Package Names:' . "\n" .
				' - ' . $brand->org->slug . '/spectacular' . "\n" .
				' - ' . $brand->org->slug . '/amazing-addon-for-spectacular' . "\n\n" .

				'Package Name must be given as:' . "\n" .
				'e.g., ' . $brand->org->slug . '/[project-slug]' . "\n\n" .

				'Package Name: ',
				true, // Require answer.
				function ( string $answer ) use ( $brand ) : bool {
					return preg_match( U\Dev\Composer::PACKAGE_NAME_REGEXP, $answer )
						&& count( $parts = explode( '/', $answer ) ) === 2
						&& $parts[ 0 ] === $brand->org->slug
						&& U\Str::is_lede_slug( $parts[ 1 ] )
						&& ! U\Str::is_lede_slug( $parts[ 1 ], $brand->slug_prefix );
				}
			);
			$slug           = U\Str::to_lede_slug( $pkg_name );
			$unbranded_slug = mb_substr( $slug, mb_strlen( $brand->slug_prefix ) );
		} else {
			$pkg_name       = U\CLI::question(
				"\n" . 'Please choose a Package Name.' . "\n\n" .

				'Examples of Package Names:' . "\n" .
				' - ' . $brand->org->slug . '/' . $brand->slug_prefix . 'spectacular' . "\n" .
				' - ' . $brand->org->slug . '/' . $brand->slug_prefix . 'amazing-addon-for-spectacular' . "\n\n" .

				'Package Name must be given as:' . "\n" .
				'e.g., ' . $brand->org->slug . '/' . $brand->slug_prefix . '[project-slug]' . "\n\n" .

				'Package Name: ',
				true, // Require answer.
				function ( string $answer ) use ( $brand ) : bool {
					return preg_match( U\Dev\Composer::PACKAGE_NAME_REGEXP, $answer )
						&& count( $parts = explode( '/', $answer ) ) === 2
						&& $parts[ 0 ] === $brand->org->slug
						&& U\Str::is_lede_slug( $parts[ 1 ], $brand->slug_prefix );
				}
			);
			$slug           = basename( $pkg_name );
			$unbranded_slug = mb_substr( $slug, mb_strlen( $brand->slug_prefix ) );
		}
		U\CLI::output( "\n" . 'Thanks!', 'blue' );

		/*
		 * Namespace crux.
		 */
		$namespace_crux = U\CLI::question(
			"\n" . 'You’ll also need a Namespace Crux.' . "\n\n" .

			'Examples of Namespace Cruxes:' . "\n" .
			' - ' . $brand->namespace . '\\Spectacular' . "\n" .
			' - ' . $brand->namespace . '\\Amazing_Addon_For_Spectacular' . "\n\n" .

			'Namespace Crux must be given as:' . "\n" .
			'e.g., ' . $brand->namespace . '\\[Project_Namespace]' . "\n\n" .

			'The [Project_Namespace] part, when converted to a lede slug, must match up' . "\n" .
			'with the project’s unbranded slug, which is derived from your Package Name: `' . $unbranded_slug . '`.' . "\n\n" .

			'Namespace Crux: ',
			true, // Require answer.
			function ( string $answer ) use ( $brand, $unbranded_slug ) : bool {
				return U\Str::is_namespace_crux( $answer, $brand->n7m, $unbranded_slug );
			}
		);
		U\CLI::output( "\n" . 'Thanks!', 'blue' );

		/*
		 * Short namespace alias.
		 */
		$short_namespace_alias = U\CLI::question(
			"\n" . 'You’ll also need a Short Namespace Alias.' . "\n\n" .

			'Examples of Short Namespace Aliases:' . "\n" .
			' - U (references Clever_Canyon\\Utilities)' . "\n" .
			' - WPG (references WP_Groove\\Framework)' . "\n\n" .

			'Short Namespace Alias must be given as:' . "\n" .
			'e.g., [Alias] (first letter capitalized)' . "\n\n" .

			'Note: The following are already consumed by dependencies:' . "\n" .
			' D, S, U, UT, WPG, WPGT ... please choose something other than these.' . "\n\n" .

			'Short Namespace Alias (3 chars max): ',
			true, // Require answer.
			function ( string $answer ) use ( $brand, $unbranded_slug ) : bool {
				return preg_match( '/^[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9]*)*$/u', $answer )
					&& ! in_array( $answer, [ 'D', 'S', 'U', 'UT', 'WPG', 'WPGT' ], true )
					&& mb_strlen( $answer ) <= 3;
			}
		);
		U\CLI::output( "\n" . 'Thanks!', 'blue' );

		/*
		 * Project name.
		 */
		$name = U\CLI::question(
			"\n" . 'What will your Project Name be?' . "\n\n" .

			'Examples of Project Names:' . "\n" .
			' - Spectacular' . "\n" .
			' - Amazing Addon for Spectacular' . "\n\n" .

			'Project Name must be given as:' . "\n" .
			'e.g., Project Name' . "\n\n" .

			'Project Name: ',
			true, // Require answer.
			function ( string $answer ) : bool {
				return U\Str::is_name( $answer );
			}
		);
		U\CLI::output( "\n" . 'Thanks!', 'blue' );

		/*
		 * Project description.
		 */
		$description = U\CLI::question(
			"\n" . 'One line Project Description, please.' . "\n\n" .

			'Examples of Project Descriptions:' . "\n" .
			' - Spectacular code providing amazing features.' . "\n" .
			' - Amazing addon providing everything you need to extend Spectacular.' . "\n\n" .

			'Project Description must be given as:' . "\n" .
			'e.g., Project description.' . "\n\n" .

			'Project Description (5+ words): ',
			true, // Require answer.
			function ( string $answer ) : bool {
				return str_word_count( $answer ) >= 5;
			}
		);
		U\CLI::output( "\n" . 'Thanks!', 'blue' );

		/*
		 * Package type.
		 */
		$type = U\CLI::question(
			"\n" . 'What Composer Package Type will this be?' . "\n\n" .

			'Examples of Composer Package Types:' . "\n" .
			' - library' . "\n" .
			' - symfony-bundle' . "\n" .
			' - wordpress-plugin' . "\n" .
			' - typo3-cms-extension' . "\n\n" .

			'Composer Package Type:' . "\n" .
			'e.g., library {@see https://getcomposer.org/doc/04-schema.md#type}' . "\n\n" .

			'Composer Package Types are a Composer plugin installation feature.' . "\n" .
			'If you’re creating a typical library for use in other packages, just use `library`.' . "\n" .
			'Most of our projects, including WP plugins|themes, use the default `library` Package Type.' . "\n" .
			'You can always change this later by editing your `composer.json` file.' . "\n\n" .

			'Composer Package Type: ',
			true, // Require answer.
			function ( string $answer ) : bool {
				return U\Str::is_slug( $answer );
			},
			'library'
		);
		U\CLI::output( "\n" . 'Thanks!', 'blue' );

		/*
		 * Project layout.
		 */
		$layout = U\CLI::question(
			"\n" . 'What Project Layout will this have?' . "\n\n" .

			'Valid Project Layouts:' . "\n" .
			' - library (default; no compilation)' . "\n" .
			' - distro-lib (for release; compiles to distro zip)' . "\n" .
			' - wp-plugin (for release; compiles as a WordPress plugin)' . "\n" .
			' - wp-theme (for release; compiles as a WordPress theme)' . "\n" .
			' - wp-website (potentially private; compiles as a WP website)' . "\n" .
			' - website (potentially private; compiles as a website)' . "\n\n" .

			'Project Layout:' . "\n" .
			'e.g., library' . "\n\n" .

			'Project Layouts are a Clever Canyon compilation feature.' . "\n" .
			'If you’re creating a typical library for use in other projects, just use `library`.' . "\n" .
			'You can always change this later by editing your `composer.json` file.' . "\n\n" .

			'Project Layout: ',
			true, // Require answer.
			function ( string $answer ) : bool {
				return U\Str::is_slug( $answer )
					&& in_array( $answer, [ 'library', 'distro-lib', 'wp-plugin', 'wp-theme', 'wp-website', 'website' ], true );
			},
			'library'
		);

		/*
		 * Directory to prepare.
		 */
		if ( $brand->org->n7m === $brand->n7m ) {
			$prepare_project_dir = U\Dir::name( $skeleton_project_dir, 1, $unbranded_slug );
		} else {
			$prepare_project_dir = U\Dir::name( $skeleton_project_dir, 1, $slug );
		}

		/*
		 * User review phase.
		 */
		U\CLI::output( "\n" . 'Thanks! I’ve got:', 'blue' );
		$data = (object) [
			'brand' => $brand,

			'pkg_name'              => $pkg_name,
			'namespace_crux'        => $namespace_crux,
			'short_namespace_alias' => $short_namespace_alias,

			'name'        => $name,
			'description' => $description,

			'slug'           => $slug,
			'unbranded_slug' => $unbranded_slug,

			'type'   => $type,
			'layout' => $layout,

			'from:skeleton_project_dir' => $skeleton_project_dir,
			'to:prepare_project_dir'    => $prepare_project_dir,
		];
		U\CLI::log( $data );

		/*
		 * User confirmation.
		 */
		if ( ! U\CLI::confirm(
			"\n" . 'Does all of this look OK?' . "\n" .
			'Ready to proceed?'
		) ) {
			U\CLI::exit_status( 1 );
		}
		$this->data = $data;
	}

	/**
	 * Prepares project.
	 *
	 * @since 2022-02-23
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function prepare_project() : void {
		$from_dir = $this->data->{'from:skeleton_project_dir'};
		$to_dir   = $this->data->{'to:prepare_project_dir'};

		if ( ! $from_dir || ! $to_dir ) {
			throw new U\Fatal_Exception( 'Missing user input data.' );
		}
		if ( ! $from_dir || ! is_dir( $from_dir ) ) {
			throw new U\Fatal_Exception( 'Missing skeleton project directory: `' . $from_dir . '`.' );
		}
		if ( ! is_readable( $from_dir ) ) {
			throw new U\Fatal_Exception( 'Skeleton project directory is not readable: `' . $from_dir . '`.' );
		}
		if ( U\Fs::exists( $to_dir ) ) {
			throw new U\Fatal_Exception( 'New project directory already exists: `' . $to_dir . '`.' );
		}
		if ( ! U\Fs::copy( $from_dir, $to_dir, [ U\Fs::typically_ignore_regexp_lookahead( 'positive' ), '/^\._x$/ui' ] ) ) {
			throw new U\Fatal_Exception( 'Failed to copy: `' . $from_dir . '` → `' . $to_dir . '`.' );
		}
		// OK. Let's begin updating.

		foreach ( U\Dir::iterator( $to_dir, '.+\.php$' ) as $_php_file ) {
			if ( $_php_file->isFile() ) {
				$this->update_php_file( $_php_file->getPathname() );
			}
		}
		foreach ( U\Dir::iterator( $to_dir, '(?:.+\/)?composer.json$' ) as $_composer_json_file ) {
			if ( $_composer_json_file->isFile() ) {
				$this->update_composer_json_file( $_composer_json_file->getPathname() );
			}
		}
		foreach ( U\Dir::iterator( $to_dir, '(?:(?:.+\/)?(?:readme\.(?:md|txt|html))|trunk\/(?:plugin|theme)\.php)$' ) as $_readme_file ) {
			if ( $_readme_file->isFile() ) {
				$this->update_readme_or_docblock_file( $_readme_file->getPathname() );
			}
		}
		U\CLI::run( [ 'composer', 'install', '--no-interaction' ], $to_dir );
	}

	/**
	 * Updates a PHP file.
	 *
	 * @since        2022-02-23
	 *
	 * @param string $file File path.
	 *
	 * @throws U\Fatal_Exception If running with less than PHP v8.
	 *
	 * @noinspection PhpElementIsNotAvailableInCurrentPhpVersionInspection
	 */
	protected function update_php_file( string $file ) : void {
		static $is_lt_php8; // Memoize.
		$is_lt_php8 ??= version_compare( PHP_VERSION, '8.0', '<' );

		if ( $is_lt_php8 ) {
			throw new U\Fatal_Exception(
				'PHP version 8.0+ is required for parsing tokens.' .
				'The way whitespace is handled in tokens changed in PHP 8.0+.' .
				'This code is written to support the new and improved handling of whitespace.'
			);
		}
		$file_contents = U\File::read( $file );
		$tokens        = token_get_all( $file_contents );

		$token_type  = function ( int $i ) use ( $tokens ) /* : string|int */ {
			return U\Debug::token_type( $tokens, $i );
		};
		$token_value = function ( int $i, ?string $new_value = null ) use ( &$tokens ) : string {
			return U\Debug::token_value( $tokens, $i, $new_value );
		};
		foreach ( array_keys( $tokens ) as $_i ) {
			if ( T_NAME_QUALIFIED === $token_type( $_i ) ) {
				if ( false !== mb_strpos( $token_value( $_i ), '\\Skeleton' ) ) {
					$token_value( $_i, preg_replace( '/[^\\\]+\\\Skeleton[^\\\]*/u', $this->data->namespace_crux, $token_value( $_i ) ) );

				} elseif ( 0 === mb_strpos( $token_value( $_i ), 'S\\' ) ) {
					$token_value( $_i, preg_replace( '/^S\\\/u', $this->data->short_namespace_alias . '\\', $token_value( $_i ) ) );
				}
			} elseif ( T_NS_SEPARATOR === $token_type( $_i ) && T_STRING === $token_type( $_i - 1 ) && '{' === $token_type( $_i + 1 ) ) {
				if ( $token_value( $_i - 1 ) && T_STRING === $token_type( $_i + 2 ) && $token_value( $_i + 2 ) ) {
					if ( U\Str::begins_with( $token_value( $_i + 2 ), 'Skeleton' ) ) {
						$token_value( $_i - 1, explode( '\\', $this->data->namespace_crux, 2 )[ 0 ] );
						$token_value( $_i + 2, explode( '\\', $this->data->namespace_crux, 2 )[ 1 ] );
						if (
							T_WHITESPACE === $token_type( $_i + 3 )
							&& T_AS === $token_type( $_i + 4 )
							&& T_WHITESPACE === $token_type( $_i + 5 )
							&& T_STRING === $token_type( $_i + 6 )
						) {
							$token_value( $_i + 6, $this->data->short_namespace_alias );
						}
					}
				}
			} elseif ( T_NS_SEPARATOR === $token_type( $_i ) && T_STRING === $token_type( $_i - 1 ) && T_STRING === $token_type( $_i + 1 ) ) {
				if ( $token_value( $_i - 1 ) && U\Str::begins_with( $token_value( $_i + 1 ), 'Skeleton' ) ) {
					$token_value( $_i - 1, explode( '\\', $this->data->namespace_crux, 2 )[ 0 ] );
					$token_value( $_i + 1, explode( '\\', $this->data->namespace_crux, 2 )[ 1 ] );
				}
			} elseif ( T_DOC_COMMENT === $token_type( $_i ) && false !== mb_strpos( $token_value( $_i ), 'Skeleton' ) ) {
				$token_value( $_i, preg_replace( '/\b[^\\\]+\\\Skeleton[^\\\]*/u', $this->data->namespace_crux, $token_value( $_i ) ) );
			}
		}
		$modified_file_contents = ''; // Initialize.

		foreach ( $tokens as $_token ) { // Modified file contents.
			$modified_file_contents .= is_array( $_token ) ? $_token[ 1 ] : $_token;
		}
		U\File::write( $file, $modified_file_contents );
	}

	/**
	 * Updates a `composer.json` file.
	 *
	 * @since 2022-02-23
	 *
	 * @param string $file File path.
	 */
	protected function update_composer_json_file( string $file ) : void {
		$json = U\File::read_json_obj( $file );

		if ( isset( $json->type ) ) {
			$json->type = $this->data->type;
		}
		if ( isset( $json->name ) ) {
			$json->name = $this->data->pkg_name;
		}
		if ( isset( $json->extra->{U\Brand::get( '&', 'var' )}->{'&'}->project->data ) ) {
			$_data                 = &$json->extra->{U\Brand::get( '&', 'var' )}->{'&'}->project->data;
			$_data->layout         = $this->data->layout;
			$_data->namespace_crux = $this->data->namespace_crux;
			$_data->name           = $this->data->name;
		}
		foreach ( [ 'autoload', 'autoload-dev' ] as $_autoload_prop ) {
			if ( isset( $json->{$_autoload_prop}->{'psr-4'} ) && is_object( $json->{$_autoload_prop}->{'psr-4'} ) ) {
				$_psr_4s = clone $json->{$_autoload_prop}->{'psr-4'};

				foreach ( $_psr_4s as $_namespace_prefix => $_dir_path_or_paths ) {
					$_namespace_prefix_parts = explode( '\\', $_namespace_prefix );

					foreach ( $_namespace_prefix_parts as $_i => $_namespace_prefix_part ) {
						if ( $_i > 0 && U\Str::begins_with( $_namespace_prefix_part, 'Skeleton' ) ) {
							$_namespace_prefix_parts[ $_i - 1 ] = explode( '\\', $this->data->namespace_crux, 2 )[ 0 ];
							$_namespace_prefix_parts[ $_i ]     = explode( '\\', $this->data->namespace_crux, 2 )[ 1 ];

							unset( $json->{$_autoload_prop}->{'psr-4'}->{$_namespace_prefix} );
							$json->{$_autoload_prop}->{'psr-4'}->{implode( '\\', $_namespace_prefix_parts )} = $_dir_path_or_paths;
							break; // Stop iterating parts for this prefix.
						}
					}
				}
			}
		}
		U\File::write( $file, U\Str::json_encode( $json ) );
	}

	/**
	 * Updates a readme or docblock file.
	 *
	 * @since 2022-02-23
	 *
	 * @param string $file File path.
	 */
	protected function update_readme_or_docblock_file( string $file ) : void {
		$file_contents = U\File::read( $file );

		$file_contents = preg_replace( '/\{\{name\s*\:.*?\}\}/uis', U\Str::esc_reg_brs( $this->data->name ), $file_contents );
		$file_contents = preg_replace( '/\{\{description\s*\:.*?\}\}/uis', U\Str::esc_reg_brs( $this->data->description ), $file_contents );

		$file_contents = preg_replace( '/^(\s*\*\s*Text\s*Domain\s*\:\s*).*\bskeleton\b.*$/uim', '${1}' . U\Str::esc_reg_brs( $this->data->slug ), $file_contents );
		$file_contents = preg_replace( '/^(\s*\*\s*Description\s*\:\s*).*\bskeleton\b.*$/uim', '${1}' . U\Str::esc_reg_brs( $this->data->description ), $file_contents );
		$file_contents = preg_replace( '/^(\s*\*\s*[a-z0-9_\-]+\s*URI\s*\:.*\/product\/)[^\v\/]*\bskeleton\b[^\v\/]*(\/update)?$/uim', '${1}' . U\Str::esc_reg_brs( $this->data->slug ) . '${2}', $file_contents );

		U\File::write( $file, $file_contents );
	}

	/**
	 * Check textual subpaths containing `skeleton` references.
	 *
	 * Just in case we missed something, let's inform the developer.
	 *
	 * @since 2022-02-23
	 *
	 * @return array Textual subpaths.
	 */
	protected function check_skeleton_references_in_textual_files() : array {
		$to_dir                            = $this->data->{'to:prepare_project_dir'};
		$subpaths_with_skeleton_references = []; // Initialize.

		foreach ( U\Dir::iterator( $to_dir, '.+\.(?:php|c?[tj]s|[tj]sx?|json5?|s?css|md|txt|html|xml)$' ) as $_textual_file ) {
			if ( $_textual_file->isFile() && false !== mb_stripos( U\File::read( $_textual_file->getPathname() ), 'skeleton' ) ) {
				$subpaths_with_skeleton_references[] = $_textual_file->getSubPathname();
			}
		}
		return $subpaths_with_skeleton_references;
	}
}
