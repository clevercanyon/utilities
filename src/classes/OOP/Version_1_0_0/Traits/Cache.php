<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
namespace Clever_Canyon\Utilities\OOP\Version_1_0_0\Traits;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Exception;

/**
 * Cache traits.
 *
 * @since 1.0.0
 */
trait Cache {
	/**
	 * OOP cache.
	 *
	 * @since 1.0.0
	 */
	protected array $oop_cache = [];

	/**
	 * Gets|sets OOP cache.
	 *
	 * @since 1.0.0
	 *
	 * @param string|array $key   Cache key part(s) to get or set.
	 * @param mixed        $value Cache value, when setting cache.
	 *
	 * @return mixed Cached value, by reference. Defaults to `null`.
	 */
	protected function &oop_cache( /* string|array */ $key, /* mixed */ $value = null ) /* : mixed */ {
		if ( is_array( $key ) ) {
			$key = implode( '|©|', array_map( 'strval', $key ) );
		}
		$key = (string) $key; // Force string key.

		if ( func_num_args() >= 2 ) {
			$this->oop_cache[ $key ] = $value;
		} else {
			$this->oop_cache[ $key ] ??= null;
		}
		return $this->oop_cache[ $key ];
	}

	/**
	 * Clears OOP cache.
	 *
	 * @since 1.0.0
	 */
	protected function oop_cache_clear() : void {
		$this->oop_cache = [];
	}
}
