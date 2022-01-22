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
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\Env\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Utility members.
 *
 * @since 2021-12-15
 *
 * @see   U\Env
 */
trait Can_Use_Function_Members {
	/**
	 * Can use function(s)?
	 *
	 * @since 2021-12-18
	 *
	 * @param string ...$functions Function(s).
	 *
	 * @return bool True if all functions are useable.
	 *
	 * @see   https://www.php.net/manual/en/ini.core.php#ini.disable-functions
	 * @see   https://php.watch/versions/8.0/disable_functions-redeclare
	 */
	public static function can_use_function( string ...$functions ) : bool {
		if ( ! $functions ) {
			return true; // Nothing to check.
		}
		if ( null === ( $cache = &static::cache( __FUNCTION__ ) ) ) {
			$cache                    = (object) [ 'can' => [] ];
			$cache->disable_functions = mb_strtolower( (string) ini_get( 'disable_functions' ) );
			$cache->disable_functions = preg_split( '/[\s,]+/u', $cache->disable_functions, -1, PREG_SPLIT_NO_EMPTY );

			// These are not really functions, they're language constructs.
			// `function_exists()` returns `false`, but we return `true` here.
			$cache->language_constructs = [
				'__halt_compiler',
				'die',
				'echo',
				'empty',
				'eval',
				'exit',
				'include_once',
				'include',
				'isset',
				'list',
				'print',
				'require_once',
				'require',
				'return',
				'unset',
			];
		}
		foreach ( array_map( 'mb_strtolower', $functions ) as $_function ) {
			if ( ! $_function ) {
				continue; // Nothing to check.
			}
			if ( isset( $cache->can[ $_function ] ) ) {
				if ( false === $cache->can[ $_function ] ) {
					return $cache->can[ $_function ];
				}
				continue; // Cached already.
			}
			if ( in_array( $_function, $cache->language_constructs, true ) ) {
				$cache->can[ $_function ] = true;
				continue; // Construct ok.
			}
			if ( ! function_exists( $_function ) || in_array( $_function, $cache->disable_functions, true ) ) {
				return $cache->can[ $_function ] = false;
			}
			$cache->can[ $_function ] = true;
		}
		return true;
	}
}
