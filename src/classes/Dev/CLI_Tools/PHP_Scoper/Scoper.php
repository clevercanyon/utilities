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
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Dev\CLI_Tools\PHP_Scoper;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * PHP Scoper.
 *
 * @since 2021-12-15
 */
final class Scoper extends U\A6t\CLI_Tool {
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
	protected const NAME = 'PHP_Scoper/Scoper';

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
			'scope' => [
				'callback'    => [ $this, 'scope' ],
				'synopsis'    => 'Runs PHP scoper, fixes docBlocks, formatting, and autoloader.',
				'description' => 'Runs PHP scoper, fixes docBlocks, formatting, and autoloader. See ' . __CLASS__ . '::scope()',
				'options'     => [
					'project-dir'                   => [
						'required'    => true,
						'description' => 'Project directory path.',
						'validator'   => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, 'dir' ) )
							&& is_file( U\Dir::join( $abs_path, '/composer.json' ) ),
					],
					'work-dir'                      => [
						'required'    => true,
						'description' => 'Work directory path.',
						'validator'   => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, 'dir' ) )
							&& preg_match( '/\/\._[^\/]*\//u', $abs_path ),
					],
					'prefix'                        => [
						'required'    => true,
						'description' => 'Namespace prefix to apply.',
						'validator'   => fn( $value ) => $value && is_string( $value )
							&& U\Str::is_namespace_scope( $value ),
					],
					'output-dir'                    => [
						'required'    => true,
						'description' => 'Directory to output scoped files to.',
						'validator'   => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, [ '', 'dir' ] ) )
							&& preg_match( '/\/\._[^\/]*\//u', $abs_path ),
					],
					'output-project-dir'            => [
						'required'    => true,
						'multiple'    => true,
						'description' => 'Output project directories; e.g., `--output-project-dir [output-dir] --output-project-dir [output-dir]/trunk`.',
						'validator'   => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, [ '', 'dir' ] ) )
							&& preg_match( '/\/\._[^\/]*\//u', $abs_path ),
					],
					'output-project-dir-entry-file' => [
						'optional'    => true,
						'multiple'    => true,
						'description' => 'Output project directory entry files; e.g., `--output-project-dir-entry-file [output-dir]/trunk/plugin.php`.',
						'validator'   => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, [ '', 'file' ] ) )
							&& preg_match( '/\/\._[^\/]*\//u', $abs_path )
							&& preg_match( '/\.php$/ui', $abs_path ),
					],
				],
			],
		] );
		$this->route_request();
	}

	/**
	 * Command: `scope`.
	 *
	 * @since 2021-12-15
	 */
	protected function scope() : void {
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: Scoping ...' );

			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			$this->run_scoper();
			$this->fix_comments();
			// $this->fix_formatting(); // This approach works well, but it takes too long.
			// Disabling for now. PHP Scoper is already working to improve formatting, which isn't terrible as-is.
			$this->fix_autoloader();

			U\CLI::done( '[' . __METHOD__ . '()]: Scoping complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::error( $throwable->getMessage() );
			U\CLI::error( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Runs PHP Scoper.
	 *
	 * @since        2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function run_scoper() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Running PHP Scoper ...' );

		$prefix      = $this->get_option( 'prefix' );
		$work_dir    = U\Fs::abs( $this->get_option( 'work-dir' ) );
		$output_dir  = U\Fs::abs( $this->get_option( 'output-dir' ) );
		$config_file = U\Dir::join( $this->project->dir, '/.scoper.cfg.php' );

		if ( ! is_file( $config_file ) ) {
			throw new U\Fatal_Exception( 'Missing `[project-dir]/.scoper.cfg.php`: `' . $config_file . '`.' );
		}
		U\CLI::run( [
			[ 'composer', 'exec', '--profile', '--', 'php-scoper', 'add-prefix' ],
			[ '--force', '--no-interaction', '--stop-on-failure' ],
			[ '--config', $config_file, '--prefix', $prefix ],
			[ '--working-dir', $work_dir ],
			[ '--output-dir', $output_dir ],
		], $this->project->dir );
	}

	/**
	 * Fixes docBlocks and other types of comments.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function fix_comments() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Fixing comments ...' );

		$output_dir = U\Fs::abs( $this->get_option( 'output-dir' ) );

		if ( ! is_dir( $output_dir ) ) {
			throw new U\Fatal_Exception( 'Missing `output-dir`: `' . $output_dir . '`.' );
		}
		$regexp             = U\Fs::gitignore_regexp_lookahead( 'negative', '.+\.php$', [ 'vendor' => false ] );
		$php_files_iterator = U\Dir::iterator( $output_dir, $regexp );

		foreach ( $php_files_iterator as $_php_file ) {
			$this->fix_comments_process_file( $_php_file->getPathname() );
			U\CLI::log( '[' . __FUNCTION__ . '()]: Fixed: `' . $_php_file->getPathname() . '`.' );
		}
	}

	/**
	 * Fixes formatting; aligns with coding standards.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function fix_formatting() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Fixing formatting ...' );

		$standard   = U\Dir::join( $this->project->dir, '/.phpcs.xml' );
		$output_dir = U\Fs::abs( $this->get_option( 'output-dir' ) );

		if ( ! is_dir( $output_dir ) ) {
			throw new U\Fatal_Exception( 'Missing `output-dir`: `' . $output_dir . '`.' );
		}
		if ( ! is_file( $standard ) ) {
			throw new U\Fatal_Exception( 'Missing `[project-dir]/.phpcs.xml`: `' . $standard . '`.' );
		}
		$ignore            = U\Fs::gitignore_phpcs_regexp_lookahead_positive( $output_dir, [ 'except:vendor/' => 'clevercanyon' ] );
		$phpcbf_bin_script = U\Dir::join( $this->project->dir, '/vendor/bin/phpcbf' );

		if ( ! is_file( $phpcbf_bin_script ) ) {
			throw new U\Fatal_Exception( 'Missing `[project-dir]/vendor/bin/phpcbf`: `' . $phpcbf_bin_script . '`.' );
		}
		U\CLI::log( '[' . __FUNCTION__ . '()]: Running PHPCBF w/ standard: `' . $standard . '` ...' );

		if ( // This tool has non-standard exit codes. Exit status of `3` or higher is an issue.
			// {@see https://github.com/squizlabs/PHP_CodeSniffer/issues/1818#issuecomment-354420927}.
			3 <= U\CLI::run( [
				[ $phpcbf_bin_script ],
				[ '-p', '--parallel=4', '--standard=' . $standard ],
				[ '--extensions=php', '--ignore=' . $ignore ],
				$output_dir, // ← directory to fix.
			], $this->project->dir, false ) ) {
			throw new U\Fatal_Exception(
				'Got unexpected exit status from `phpcbf` while formatting: `' . $output_dir . '`.' .
				' Running from: `' . $this->project->dir . '`.'
			);
		}
	}

	/**
	 * Fixes autoloader; aligns with PHP Scoper autoloader.
	 *
	 * Regarding use of `--no-plugins` in Composer calls below.
	 * {@see https://github.com/humbug/php-scoper#composer-plugins}.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function fix_autoloader() : void {
		U\CLI::output( '[' . __FUNCTION__ . '()]: Fixing autoloader ...' );

		// Handle required output project directories.

		if ( ! $output_project_dirs = $this->get_option( 'output-project-dir' ) ) {
			throw new U\Fatal_Exception( 'Missing `output-project-dir`.' );
		}
		foreach ( $output_project_dirs as $_output_project_dir ) {
			$_output_project_dir = U\Fs::abs( $_output_project_dir );

			if ( ! is_dir( $_output_project_dir ) ) {
				throw new U\Fatal_Exception( 'Missing `output-project-dir`: `' . $_output_project_dir . '`.' );
			}
			if ( ! is_dir( U\Dir::join( $_output_project_dir, '/vendor' ) ) ) {
				throw new U\Fatal_Exception( 'Missing `[output-project-dir]/vendor`: `' . U\Dir::join( $_output_project_dir, '/vendor' ) . '`.' );
			}
			if ( ! is_file( U\Dir::join( $_output_project_dir, '/composer.json' ) ) ) {
				throw new U\Fatal_Exception( 'Missing `[output-project-dir]/composer.json`: `' . U\Dir::join( $_output_project_dir, '/composer.json' ) . '`.' );
			}
			U\CLI::run( [
				[ 'composer', 'dump-autoload' ],
				[ '--profile', '--no-dev', '--no-scripts', '--no-plugins' ],
				[ '--optimize', '--classmap-authoritative' ],
			], $_output_project_dir );
			U\CLI::log( '[' . __FUNCTION__ . '()]: Dumped composer autoloader.' );
		}
		// Handle optional output project directory entry file(s).

		foreach ( $this->get_option( 'output-project-dir-entry-file' ) as $_output_project_dir_entry_file ) {
			$_output_project_dir_entry_file = U\Fs::abs( $_output_project_dir_entry_file );

			if ( ! $_output_project_dir_entry_file || ! is_file( $_output_project_dir_entry_file ) ) {
				throw new U\Fatal_Exception( 'Missing `output-project-dir-entry-file`: `' . $_output_project_dir_entry_file . '`.' );
			}
			if (
				! is_readable( $_output_project_dir_entry_file )
				|| ! is_writable( $_output_project_dir_entry_file )
				|| null === ( $_f15s = U\File::read( $_output_project_dir_entry_file, false ) )
				|| ! U\File::write( $_output_project_dir_entry_file, str_replace( '/autoload.php', '/scoper-autoload.php', $_f15s ), false )
			) {
				throw new U\Fatal_Exception( 'Failed to change `/autoload.php` to `/scoper-autoload.php` in `' . $_output_project_dir_entry_file . '`.' );
			}
			U\CLI::log( '[' . __FUNCTION__ . '()]: Updated: `' . $_output_project_dir_entry_file . '`.' );
		}
	}

	// -- Comment fixing helpers. -------------------------------------------------------------------------------------

	/**
	 * Fixes comments in a single file.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $file File path.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function fix_comments_process_file( string $file ) : void {
		if ( ! $file || ! is_readable( $file ) || ! is_writable( $file ) ) {
			throw new U\Fatal_Exception( 'Unable to process file: `' . $file . '`. Is it readable and writable?' );
		}
		if ( ! U\File::write( $file, $this->fix_comments_process_string( U\File::read( $file ) ), false ) ) {
			throw new U\Fatal_Exception( 'Failed processing file: `' . $file . '`. Is the file readable and writable?' );
		}
	}

	/**
	 * Fixes comments in a string of PHP.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $str PHP file contents.
	 *
	 * @return string Modified PHP file contents.
	 */
	protected function fix_comments_process_string( string $str ) : string {
		return $this->fix_comments_process_tokens( token_get_all( U\Str::normalize_eols( $str ) ) );
	}

	/**
	 * Fixes comments in a set of PHP tokens.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $tokens PHP file tokens.
	 *
	 * @return string Modified PHP file contents (tokens converted to string).
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function fix_comments_process_tokens( array $tokens ) : string {
		if ( version_compare( PHP_VERSION, '8.0', '<' ) ) {
			throw new U\Fatal_Exception(
				'PHP version 8.0+ is required for parsing tokens.' .
				'The way whitespace is handled in tokens changed in PHP 8.0+.' .
				'This code is written to support the new and improved handling of whitespace.'
			);
		}
		foreach ( $tokens as $_i => &$_this_token ) {
			// Current token references.

			if ( is_array( $_this_token ) ) {
				$_this_token_type  = &$_this_token[ 0 ];
				$_this_token_value = &$_this_token[ 1 ];
			} else {
				$_this_token_type  = &$_this_token;
				$_this_token_value = &$_this_token;
			}
			// Previous token references.

			if ( isset( $tokens[ $_i - 1 ] ) ) {
				$_prev_token = &$tokens[ $_i - 1 ];

				if ( is_array( $_prev_token ) ) {
					$_prev_token_type  = &$_prev_token[ 0 ];
					$_prev_token_value = &$_prev_token[ 1 ];
				} else {
					$_prev_token_type  = &$_prev_token;
					$_prev_token_value = &$_prev_token;
				}
			} else {
				unset( $_prev_token, $_prev_token_type, $_prev_token_value );
				$_prev_token = $_prev_token_type = $_prev_token_value = '';
			}
			// Next token references.

			if ( isset( $tokens[ $_i + 1 ] ) ) {
				$_next_token = &$tokens[ $_i + 1 ];

				if ( is_array( $_next_token ) ) {
					$_next_token_type  = &$_next_token[ 0 ];
					$_next_token_value = &$_next_token[ 1 ];
				} else {
					$_next_token_type  = &$_next_token;
					$_next_token_value = &$_next_token;
				}
			} else {
				unset( $_next_token, $_next_token_type, $_next_token_value );
				$_next_token = $_next_token_type = $_next_token_value = '';
			}
			// Token inspection & modification.

			if ( 0 === $_i && T_OPEN_TAG === $_this_token_type ) {
				if (
					T_WHITESPACE === $_next_token_type
					&& U\Str::begins_with( $_next_token_value, "\n" )
					&& is_array( $tokens[ $_i + 2 ] ?? null )
					&& T_DOC_COMMENT === $tokens[ $_i + 2 ][ 0 ]
				) {
					// Removes line break after PHP open tag
					// whenever there's a file docBlock section.
					$_next_token_value = ltrim( $_next_token_value, "\n" );
				}
			} elseif ( T_DOC_COMMENT === $_this_token_type ) {
				if (
					T_WHITESPACE === $_prev_token_type
					&& U\Str::begins_with( $_prev_token_value, "\n" )
					&& ( ! isset( $tokens[ $_i - 2 ] ) || '{' !== $tokens[ $_i - 2 ] )
				) {
					// Adds double line break before docBlock comments.
					// So long as they don't appear right after an opening `{`.
					$_prev_token_value = "\n\n" . ltrim( $_prev_token_value, "\n" );
				}
			} elseif ( T_COMMENT === $_this_token_type ) {
				if (
					T_WHITESPACE === $_prev_token_type
					&& U\Str::begins_with( $_prev_token_value, "\n" )
					&& U\Str::begins_with( $_this_token_value, '// phpcs:ignore' )
					&& U\Str::begins_with( $_next_token_value, "\n" )
				) {
					// Moves special comments to end of previous line.
					$_prev_token_value = trim( $_prev_token_value ) . ' ';
				} elseif (
					T_WHITESPACE === $_prev_token_type
					&& U\Str::begins_with( $_prev_token_value, "\n" )
					&& U\Str::begins_with( $_next_token_value, "\n" )
				) {
					$_this_token_value = '';                                // Removes comment.
					$_prev_token_value = ltrim( $_prev_token_value, "\n" ); // ... and empty line it leaves behind.
				} else {
					$_this_token_value = ''; // Remove comment only.
				}
			}
		}
		unset( $_this_token, $_this_token_type, $_this_token_value ); // References.
		unset( $_prev_token, $_prev_token_type, $_prev_token_value ); // References.
		unset( $_next_token, $_next_token_type, $_next_token_value ); // References.

		$modified_file_contents = ''; // Initialize.

		foreach ( $tokens as $_token ) { // Modified file contents.
			$modified_file_contents .= is_array( $_token ) ? $_token[ 1 ] : $_token;
		}
		return $modified_file_contents;
	}
}
