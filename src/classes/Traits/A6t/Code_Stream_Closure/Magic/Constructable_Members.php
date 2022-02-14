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
namespace Clever_Canyon\Utilities\Traits\A6t\Code_Stream_Closure\Magic;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\Code_Stream_Closure
 */
trait Constructable_Members {
	/**
	 * Constructor.
	 *
	 * ```
	 * // Example arrow function.
	 *
	 * new U\Code_Stream_Closure( <<<'ooo'
	 *     fn( $foo ) => foo( $foo )
	 *     ooo
	 * );
	 *
	 * // Example anonymous function.
	 *
	 * new U\Code_Stream_Closure( <<<'ooo'
	 *     function( $foo ) {
	 *         return foo( $foo );
	 *     };
	 *     ooo
	 * );
	 *
	 * // Example w/ `use` directive.
	 *
	 * new U\Code_Stream_Closure(
	 *     [ Foo_Namespace::class, 'F' ],
	 *     <<<'ooo'
	 *     function( $foo ) {
	 *         return F\foo( $foo );
	 *     };
	 *     ooo
	 * );
	 * ```
	 *
	 * @since        2021-12-15
	 *
	 * @param string|array ...$args Arguments.
	 *
	 * These two arguments can be passed in any order:
	 *
	 * string $code Closure; as code. See examples above.
	 *              Recommend nowdoc syntax; {@see https://o5p.me/gP9z5Q}.
	 *
	 * array  $use  Optional 'use' directives (associative array).
	 *              Default, and always-on, are the following. These provide easy
	 *              access to `Clever_Canyon\Utilities` and `WP_Groove\Framework`.
	 *
	 *              ```
	 *              [
	 *                  'Clever_Canyon\\Utilities' => 'U',
	 *                  'WP_Groove\\Framework'     => 'WPG',
	 *              ]
	 *              ```.
	 *
	 * @noinspection PhpUndefinedClassInspection
	 * @noinspection PhpMultipleClassDeclarationsInspection
	 *
	 * @throws U\Fatal_Exception If `$code` is missing or empty.
	 */
	public function __construct( /* string|array */ ...$args ) {
		parent::__construct();

		if ( $args && is_string( $args[ 0 ] ) ) {
			$code = $args[ 0 ] ?? '';
			$use  = $args[ 1 ] ?? [];
		} else {
			$use  = $args[ 0 ] ?? [];
			$code = $args[ 1 ] ?? '';
		}
		if ( ! $code ) {
			throw new U\Fatal_Exception( 'Missing required `$code` argument.' );
		}
		if ( ! is_string( $code ) ) {
			throw new U\Fatal_Exception( 'Invalid `$code` argument type. Got `' . gettype( $code ) . '`.' );
		}
		if ( ! is_array( $use ) ) {
			throw new U\Fatal_Exception( 'Invalid `$use` argument type. Got `' . gettype( $use ) . '`.' );
		}
		$code = rtrim( $code, U\Str::TRIM_CHARS . ';' );
		$code = 'return ' . $code . ';';

		if ( $namespace_scope = U\Pkg::namespace_scope() ) {
			$use[ $namespace_scope . '\\Clever_Canyon\\Utilities' ] = 'U';
			$use[ $namespace_scope . '\\WP_Groove\\Framework' ]     = 'WPG';
		} else {
			$use[ 'Clever_Canyon\\Utilities' ] = 'U';
			$use[ 'WP_Groove\\Framework' ]     = 'WPG';
		}
		foreach ( array_reverse( $use ) as $_use => $_as ) {
			$code = 'use ' . $_use . ' as ' . $_as . ';' . "\n" .
				$code; // Existing.
		}
		$this->code = $code;
	}
}
