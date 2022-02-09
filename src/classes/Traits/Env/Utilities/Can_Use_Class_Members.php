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
trait Can_Use_Class_Members {
	/**
	 * Can use class(es)?
	 *
	 * This also checks all parent classes.
	 *
	 * @since 2021-12-18
	 *
	 * @param string ...$classes Class(es).
	 *
	 * @return bool True if all classes (including parents) are useable.
	 *
	 * @see   https://www.php.net/manual/en/ini.core.php#ini.disable-classes
	 */
	public static function can_use_class( string ...$classes ) : bool {
		static $cache; // Memoize.

		if ( ! $classes ) {
			return true; // Nothing to check.
		}
		if ( null === $cache ) { // Initialize.
			$cache                  = (object) [ 'can' => [] ];
			$cache->disable_classes = mb_strtolower( (string) ini_get( 'disable_classes' ) );
			$cache->disable_classes = preg_split( '/[\s,]+/u', $cache->disable_classes, -1, PREG_SPLIT_NO_EMPTY );
		}
		foreach ( array_map( 'mb_strtolower', $classes ) as $_class_key => $_class ) {
			if ( ! $_class ) {
				continue; // Nothing to check.
			}
			if ( isset( $cache->can[ $_class ] ) ) {
				if ( false === $cache->can[ $_class ] ) {
					return $cache->can[ $_class ];
				} else {
					continue; // Cached already.
				}
			}
			$_class_in_case = $classes[ $_class_key ]; // CaSe.
			// Using class in caSe so this doesn't confuse autoloaders.

			if ( ! class_exists( $_class_in_case ) || in_array( $_class, $cache->disable_classes, true ) ) {
				return $cache->can[ $_class ] = false;
			}
			$_parent_classes = // Let's look at parents also.
				class_parents( $_class_in_case );

			foreach ( array_map( 'mb_strtolower', $_parent_classes ) as $_parent_class_key => $_parent_class ) {
				$_parent_class_in_case = // CaSe.
					$_parent_classes[ $_parent_class_key ];

				if ( ! class_exists( $_parent_class_in_case ) || in_array( $_parent_class, $cache->disable_classes, true ) ) {
					return $cache->can[ $_class ] = false;
				}
			}
			$cache->can[ $_class ] = true;
		}
		return true;
	}
}
