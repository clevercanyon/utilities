<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
namespace Clever_Canyon\Utilities\OOPs\Version_1_0_0\Traits;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;

/**
 * Cache traits.
 *
 * @since 1.0.0
 */
trait Cache {
	/**
	 * Static cache.
	 *
	 * @since 1.0.0
	 */
	protected static array $static_cache = [];

	/**
	 * Gets|sets static cache.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $key   Cache key to get or set.
	 * @param  mixed  $value Cache value, when setting cache.
	 *
	 * @return mixed         Cached value, by reference. Defaults to `null`.
	 */
	protected static function &static_cache( string $key, $value = null ) {
		$called_class                            = get_called_class();
		static::$static_cache[ $called_class ] ??= [];

		if ( func_num_args() >= 2 ) {
			static::$static_cache[ $called_class ][ $key ] = $value;
		} else {
			static::$static_cache[ $called_class ][ $key ] ??= null;
		}
		return static::$static_cache[ $called_class ][ $key ];
	}

	/**
	 * Clears static cache.
	 *
	 * @since 1.0.0
	 */
	protected static function static_cache_clear() : void {
		$called_class                          = get_called_class();
		static::$static_cache[ $called_class ] = [];
	}
}
