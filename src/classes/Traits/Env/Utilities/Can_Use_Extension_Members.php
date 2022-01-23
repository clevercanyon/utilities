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
trait Can_Use_Extension_Members {
	/**
	 * Can use extension(s)?
	 *
	 * @since 2021-12-18
	 *
	 * @param string ...$extensions Extension(s).
	 *
	 * @return bool True if all extensions are useable.
	 *
	 * @see   https://www.php.net/manual/en/extensions.membership.php
	 * @see   https://www.php.net/manual/en/function.get-loaded-extensions.php
	 */
	public static function can_use_extension( string ...$extensions ) : bool {
		if ( ! $extensions ) {
			return true; // Nothing to check.
		}
		if ( null === ( $cache = &static::cls_cache( __FUNCTION__ ) ) ) {
			$cache                    = (object) [ 'can' => [] ];
			$cache->loaded_extensions = array_merge( get_loaded_extensions( true ), get_loaded_extensions( false ) );
			$cache->loaded_extensions = array_map( 'mb_strtolower', array_unique( $cache->loaded_extensions ) );
		}
		foreach ( array_map( 'mb_strtolower', $extensions ) as $_extension ) {
			if ( ! $_extension ) {
				continue; // Nothing to check.
			}
			if ( isset( $cache->can[ $_extension ] ) ) {
				if ( false === $cache->can[ $_extension ] ) {
					return $cache->can[ $_extension ];
				}
				continue; // Cached already.
			}
			if ( ! in_array( $_extension, $cache->loaded_extensions, true ) ) {
				return $cache->can[ $_extension ] = false;
			}
			$cache->can[ $_extension ] = true;
		}
		return true;
	}
}
