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
namespace Clever_Canyon\Utilities\Traits\Str\Utilities;

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
 * @see   U\Str
 */
trait No_WP_Serialize_Members {
	/**
	 * Serializes a value using a no-WP approach.
	 *
	 * @since 2021-12-15
	 *
	 * The goal here is to serialize data in a better, more secure way.
	 * Also, in a way that prevents WordPress core from reserializing|unserializing;
	 * i.e., for this to work we need to maintain control over data serialized by this function.
	 *
	 * @param mixed $value Value to serialize.
	 *
	 *                     * PHP does not allow a {@see \Closure} to be serialized whatsoever.
	 *                       Do not serialize values containing a closure; either directly or indirectly.
	 *
	 *                     * PHP serializes a resource as `0`, and therefore works, but it's a bad practice.
	 *                       Do not serialize resource values; either directly or indirectly.
	 *                       Future versions of PHP will likely disallow altogether.
	 *
	 * @return string Serialized string representation.
	 *
	 * @see   \maybe_serialize()
	 * @see   \maybe_unserialize()
	 * @see   U\Str::maybe_unserialize_no_wp()
	 */
	public static function serialize_no_wp( /* mixed */ $value ) : string {
		assert( ! is_resource( $value ) );
		assert( ! $value instanceof \Closure );

		return U\Str::SERIALIZE_NO_WP_PREFIX .
			U\Str::serialize( $value );
	}

	/**
	 * Unserializes a value serialized with {@see U\Str::serialize_no_wp()} (maybe).
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $value Value to unserialize.
	 *
	 * @return mixed Unserialized original value; else `null` on failure.
	 *
	 *               * This function can also return `null` when unserializing a `null` value.
	 *                 In general, it is a best practice not to serialize `null` values.
	 *
	 *               * A `false` or `null` input `$value` will always return `null`.
	 *                 WordPress APIs return `false` on failure, which is translated to `null` here.
	 *
	 *               * Values that do not begin with {@see U\Str::SERIALIZE_NO_WP_PREFIX} are returned as-is (no change).
	 *                 This behavior provides compatibility with WordPress APIs that set values internally in core,
	 *                 which may not pass through {@see U\Str::serialize_no_wp()} for one reason or another.
	 *
	 * @see   U\Str::serialize_no_wp()
	 */
	public static function maybe_unserialize_no_wp( /* mixed */ $value ) /* : mixed */ {
		if ( null === $value || false === $value ) {
			return null; // WordPress APIs return `false` on failure.
		}
		if ( ! is_string( $value ) || '' === $value ) {
			return $value; // Not serialized this way, no change.
		}
		if ( 0 !== mb_strpos( $value, U\Str::SERIALIZE_NO_WP_PREFIX ) ) {
			return $value; // Not serialized this way, no change.
		}
		static $prefix_length; // Memoize.
		$prefix_length ??= mb_strlen( U\Str::SERIALIZE_NO_WP_PREFIX );

		$value = mb_substr( $value, $prefix_length );
		return U\Str::unserialize( $value );
	}
}
