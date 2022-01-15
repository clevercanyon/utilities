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
namespace Clever_Canyon\Utilities\Traits\Base\Utilities\Finals;

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
 * @see   U\I7e\Base
 */
trait OOP_Cache_Members {
	/**
	 * OOP cache.
	 *
	 * @since 2021-12-15
	 */
	private array $oop_cache = [];

	/**
	 * Gets|sets OOP cache.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|array $key   Cache key part(s) to get or set.
	 * @param mixed        $value Cache value, when setting cache.
	 *
	 * @return mixed Cached value, by reference. Defaults to `null`.
	 */
	final protected function &oop_cache(
		/* string|array */ $key,
		/* mixed */ $value = null
	) /* : mixed */ {
		assert( is_string( $key ) || is_array( $key ) );

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
	 * @since 2021-12-15
	 */
	final protected function oop_cache_clear() : void {
		$this->oop_cache = [];
	}
}
