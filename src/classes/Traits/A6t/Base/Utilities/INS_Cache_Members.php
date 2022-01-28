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
namespace Clever_Canyon\Utilities\Traits\A6t\Base\Utilities;

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
trait INS_Cache_Members {
	/**
	 * Object INS cache.
	 *
	 * @since 2021-12-15
	 */
	private array $ins_cache = [];

	/**
	 * Gets|sets object INS cache.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $key_parts A single key part or a bundle containing multiple key parts.
	 *                         These are key parts used to formulate an actual cache key identifier.
	 *
	 *                         Whatever you pass, it will be serialized & hashed; i.e., converted to a string key.
	 *                         Passing a `__FUNCTION__` name as one part is a highly recommended best practice.
	 *
	 *                         * The more parts you pass, the longer it will take to hash.
	 *                           When passing a bundle, try to keep it simple for best performance.
	 *
	 *                         * PHP serializes a resource as `0`, and therefore works, but it's a bad practice.
	 *                           Do not pass resource values as a key part; either directly or indirectly.
	 *                           Future versions of PHP will likely disallow altogether.
	 *
	 * @param mixed $value     Value to cache; i.e., when setting|updating the cache.
	 *                         If not passed, this function simply operates as a getter.
	 *
	 *                         * Passing `null` explicitly will {@see unset()} a given cache key.
	 *                           Whenever you set `$value` to `null` explicitly (i.e., to {@see unset()}),
	 *                           you'll get back a useless dummy reference instead of a real cache reference.
	 *
	 *                         * Passing a resource value is acceptable.
	 *
	 * @return mixed Cached `$value`, by reference. Default `$value` is `null`.
	 *               If you set `$value` to `null` explicitly (i.e., to {@see unset()}),
	 *               you'll get back a useless dummy reference instead of a real cache reference.
	 */
	final protected function &ins_cache(
		/* mixed */ $key_parts,
		/* mixed */ $value = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		assert( ! is_resource( $key_parts ) );  // Bad practice.
		$key = sha1( U\Str::serialize( $key_parts, false ) );

		if ( U\Func::PARAM_DEFAULT_NULL !== $value ) {
			if ( null === $value ) {
				unset( $this->ins_cache[ $key ] );
				$_null = null; // Null variable.
				return $_null; // Return by reference.
			} else {
				$this->ins_cache[ $key ] = $value;
			}
		} else {
			$this->ins_cache[ $key ] ??= null;
		}
		return $this->ins_cache[ $key ];
	}

	/**
	 * Clears object INS cache.
	 *
	 * @since 2021-12-15
	 */
	final protected function ins_cache_clear() : void {
		$this->ins_cache = [];
	}
}
