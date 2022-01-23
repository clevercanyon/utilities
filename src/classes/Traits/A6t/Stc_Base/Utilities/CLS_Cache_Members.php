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
namespace Clever_Canyon\Utilities\Traits\A6t\Stc_Base\Utilities;

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
 * @see   U\I7e\Stc_Base
 */
trait CLS_Cache_Members {
	/**
	 * Static CLS cache.
	 *
	 * @since 2021-12-15
	 */
	private static array $cache = [];

	/**
	 * Gets|sets static CLS cache.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|array $key_parts A single string part, or an array containing multiple parts.
	 *                                These are key part(s) used to formulate an actual key of what to get|set.
	 *
	 *                                Whatever you pass, it will be hashed; i.e., converted to a key.
	 *                                Passing `__FUNCTION__` as one part is a highly recommended best practice.
	 *
	 *                                Embedding objects or resources in a key parts array is not recommended.
	 *                                It works, just know they'll be identified by ID via {@see U\Arr::hash()}.
	 *
	 *                                * The more parts you pass, the longer it will take to hash.
	 *                                It is recommended that you pass a string for best performance.
	 *                                When passing an array, try to keep it simple for best performance.
	 *
	 * @param mixed        $value     Cache value, when setting cache.
	 *
	 * @return mixed Cached value, by reference. Defaults to `null`.
	 */
	final protected static function &cls_cache( /* string|array */ $key_parts, /* mixed */ $value = null ) /* : mixed */ {
		assert( is_string( $key_parts ) || is_array( $key_parts ) );

		$key = is_array( $key_parts )
			? U\Arr::hash( $key_parts )
			: sha1( $key_parts );

		static::$cache[ static::class ] ??= [];

		if ( null !== $value || func_num_args() >= 2 ) {
			static::$cache[ static::class ][ $key ] = $value;
		} else {
			static::$cache[ static::class ][ $key ] ??= null;
		}
		return static::$cache[ static::class ][ $key ];
	}

	/**
	 * Clears static CLS cache.
	 *
	 * @since 2021-12-15
	 */
	final protected static function cls_cache_clear() : void {
		static::$cache[ static::class ] = [];
	}
}
