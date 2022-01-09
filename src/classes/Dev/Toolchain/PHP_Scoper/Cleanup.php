<?php
/**
 * CLEVER CANYON™ {@see https://clevercanyon.com}
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
 * phpcs:disable WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase
 * phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\Dev\Toolchain\PHP_Scoper;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

/**
 * Toolchain.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\Dev\Toolchain\{Tools as T};
use Clever_Canyon\Utilities\Dev\Toolchain\Composer\{Project};

/**
 * File-specific.
 *
 * @since 2021-12-15
 */
use PhpParser;

// </editor-fold>

/**
 * PHP Scoper cleanup suite.
 *
 * @since 2021-12-15
 */
class Cleanup extends \Clever_Canyon\Utilities\OOP\Abstracts\A6t_CLI_Tool {
	/**
	 * Version.
	 */
	protected const VERSION = '1.0.0';

	/**
	 * Tool name.
	 */
	protected const NAME = 'PHP_Scoper/Cleanup';

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
			'fix-comments' => [
				'callback'    => [ $this, 'fix_comments' ],
				'synopsis'    => 'Fixes docBlocks and other types of comments.',
				'description' => 'Fixes docBlocks and other types of comments. See ' . __CLASS__ . '::fix_comments()',
				'options'     => [
					'dir' => [
						'optional'    => true,
						'description' => 'Directory path.',
						'validator'   => fn( $value ) => is_dir( $value ),
						'default'     => getcwd(),
					],
				],
			],
		] );
		$this->route_request();
	}

	/**
	 * Command: `fix-comments`.
	 *
	 * @since 2021-12-15
	 */
	protected function fix_comments() : void {
		try {
			$dir                = $this->get_option( 'dir' );
			$php_files_iterator = U\Dir::iterator( $dir, '.+\.php$' );

			foreach ( $php_files_iterator as $_php_file ) {
				$this->fix_comments_process_file( $_php_file->getPathname() );
			}
		} catch ( \Throwable $throwable ) {
			U\CLI::error( $throwable->getMessage() );
			U\CLI::error( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Fixes comments in a single file.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $file File path.
	 *
	 * @throws Exception On any failure.
	 */
	protected function fix_comments_process_file( string $file ) : void {
		if ( ! $file || ! is_readable( $file ) || ! is_writable( $file ) ) {
			throw new Exception( 'Unable to process file: `' . $file . '`. Is it readable and writable?' );
		}
		if ( false === file_put_contents( $file, $this->fix_comments_process_string( file_get_contents( $file ) ) ) ) {
			throw new Exception( 'Failed processing file: `' . $file . '`. Is the file readable and writable?' );
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
	 */
	protected function fix_comments_process_tokens( array $tokens ) : string {
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

			if ( T_DOC_COMMENT === $_this_token_type ) {
				if (
					T_WHITESPACE === $_prev_token_type
					&& U\Str::ends_with( $_prev_token_value, "\n" )
				) {
					// Double line break before doc comments.
					$_prev_token_value = rtrim( $_prev_token_value ) . "\n\n";
				}
			} elseif ( T_COMMENT === $_this_token_type ) {
				if (
					T_WHITESPACE === $_prev_token_type
					&& U\Str::ends_with( $_prev_token_value, "\n" )
					&& (
						'// ｡･:*:･ﾟ★.' . "\n" === $_this_token_value
						|| U\Str::begins_with( $_this_token_value, '// phpcs:ignore' )
					)
					&& U\Str::ends_with( $_this_token_value, "\n" )
				) {
					// Move comment to end of previous line.
					$_prev_token_value = rtrim( $_prev_token_value ) . ' ';
				} elseif (
					T_WHITESPACE === $_prev_token_type
					&& U\Str::ends_with( $_prev_token_value, "\n" )
					&& ! U\Str::ends_with( $_this_token_value, "\n" )
					&& U\Str::begins_with( $_next_token_value, "\n" )
				) {
					$_this_token_value = ''; // Remove comment & empty line.
					$_prev_token_value = rtrim( $_prev_token_value );
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
