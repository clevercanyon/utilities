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
	private static array $cls_cache = [];

	/**
	 * Gets|sets static CLS cache.
	 *
	 * @since         2021-12-15
	 *
	 * @param string|array $key_parts A single string part, or an array containing multiple parts.
	 *                                These are key part(s) used to formulate an actual cache key identifier.
	 *
	 *                                Whatever you pass, it will be hashed; i.e., converted to a string key.
	 *                                Passing `__FUNCTION__` as one part is a highly recommended best practice.
	 *
	 *                                Embedding objects or resources in a key parts array is not recommended.
	 *                                It works, just know they'll be identified by ID via {@see U\Arr::hash()}.
	 *
	 *                                * The more parts you pass, the longer it will take to hash.
	 *                                It is recommended that you pass a string for best performance.
	 *                                When passing an array, try to keep it simple for best performance.
	 *
	 * @param mixed        $value     Value to cache; i.e., when setting|updating the cache.
	 *                                If not passed, this function simply operates as a getter.
	 *
	 *                                Passing `null` explicitly will {@see unset()} a given cache key.
	 *                                Whenever you set `$value` to `null` explicitly (i.e., to {@see unset()}),
	 *                                you'll get back a useless dummy reference instead of a real cache reference.
	 *
	 * @return mixed Cached `$value`, by reference. Default `$value` is `null`.
	 *               If you set `$value` to `null` explicitly (i.e., to {@see unset()}),
	 *               you'll get back a useless dummy reference instead of a real cache reference.
	 */
	final protected static function &cls_cache(
		/* string|array */ $key_parts,
		/* mixed */ $value = U\FUNC_PARAM_DEFAULT_NULL_STR
	) /* : mixed */ {
		assert( is_string( $key_parts ) || is_array( $key_parts ) );

		$key = is_array( $key_parts )
			? U\Arr::hash( $key_parts )
			: sha1( $key_parts );

		static::$cls_cache[ static::class ] ??= [];

		if ( U\FUNC_PARAM_DEFAULT_NULL_STR !== $value ) {
			if ( null === $value ) {
				unset( static::$cls_cache[ static::class ][ $key ] );
				$_null = null; // Null variable.
				return $_null; // Return by reference.
			} else {
				static::$cls_cache[ static::class ][ $key ] = $value;
			}
		} else {
			static::$cls_cache[ static::class ][ $key ] ??= null;
		}
		return static::$cls_cache[ static::class ][ $key ];
	}

	/**
	 * Clears static CLS cache.
	 *
	 * @since 2021-12-15
	 */
	final protected static function cls_cache_clear() : void {
		static::$cls_cache[ static::class ] = [];
	}
}
