<?php
/**
 * Clever Canyon™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Strict types, namespace, use statements, and other headers.">

/**
 * Lint configuration.
 *
 * @since        2021-12-25
 *
 * @noinspection PhpUsageOfSilenceOperatorInspection
 * phpcs:disable WordPress.PHP.NoSilencedErrors.Discouraged
 *
 * phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize
 * phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.serialize_unserialize
 */

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
trait Serialize_Members {
	/**
	 * Checks serialized string validity.
	 *
	 * @since 2022-02-11
	 *
	 * @param string $str String to consider.
	 *
	 * @return bool True if serialized by {@see U\Str::serialize()}.
	 */
	public static function is_serialized( string $str ) : bool {
		return $str && 0 === mb_strpos( $str, U\Str::SERIALIZED_MARKER );
	}

	/**
	 * Serializes a value.
	 *
	 * Regarding {@see U\Str::SERIALIZED_MARKER}.
	 * There are two objectives in mind when adding a marker.
	 *
	 * 1. A marker makes it easy to detect serialized strings.
	 *    e.g., {@see U\Str::is_serialized()}.
	 *
	 * 2. In certain special cases, to serialize data our way, exclusively.
	 *    Or, to put it another way, to prevent other code; e.g., {@see is_serialized()} in WordPress,
	 *    from detecting serialized strings and attempting to reserialize|unserialize before we can.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $value Value to serialize.
	 *
	 *                     * PHP does not allow a {@see \Closure} to be serialized whatsoever.
	 *                       Do not serialize values containing a closure; either directly or indirectly.
	 *                       If you must serialize a closure, consider {@see U\Code_Stream_Closure}.
	 *
	 *                     * PHP serializes a resource as `0`, and therefore works, but it's a bad practice.
	 *                       Do not serialize resource values; either directly or indirectly.
	 *                       Future versions of PHP will likely disallow altogether.
	 *
	 * @param bool  $sign  Sign the serialized string? Default is `false`.
	 *                     Recommend setting as `true` when serializing sensitive data.
	 *                     e.g., When data could potentially be exposed to untrusted parties.
	 *
	 * @return string Serialized value; i.e., a string.
	 *                Always beginning with {@see U\Str::SERIALIZED_MARKER}.
	 *
	 *                * If `$sign` is `true` it will also start with a 64-byte signature,
	 *                  followed by a separator; {@see U\Str::SERIALIZED_SIGNATURE_SEPARATOR}.
	 *
	 * @see   serialize()
	 * @see   unserialize()
	 *
	 * @see   is_serialized()
	 * @see   maybe_serialize()
	 * @see   maybe_unserialize()
	 *
	 * @see   U\Str::serialize()
	 * @see   U\Str::unserialize()
	 * @see   U\Str::maybe_unserialize()
	 *
	 * @see   U\Code_Stream_Closure
	 */
	public static function serialize( /* mixed */ $value, bool $sign = false ) : string {
		assert( ! is_resource( $value ) );
		assert( ! $value instanceof \Closure );

		if ( ! $sign ) {
			$s8d_value = serialize( $value );
			return U\Str::SERIALIZED_MARKER . $s8d_value;
		}
		$s8d_value = serialize( $value );
		$signature = hash_hmac( 'sha256', $s8d_value, U\Crypto::salt() );

		return U\Str::SERIALIZED_MARKER .
			$signature . U\Str::SERIALIZED_SIGNATURE_SEPARATOR . $s8d_value;
	}

	/**
	 * Unserializes a value (maybe).
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $value  Value to consider unserializing.
	 *
	 * @param bool  $signed Serialized value is signed? Default is `false`.
	 *                      {@see U\Str::unserialize()} for details.
	 *
	 * @return mixed Unserialized original value; else `null` on failure.
	 *               Values that are not serialized are returned as-is (no change).
	 */
	public static function maybe_unserialize( /* mixed */ $value, bool $signed = false ) /* : mixed */ {
		if ( ! is_string( $value ) || ! U\Str::is_serialized( $value ) ) {
			return $value; // Not serialized; no change.
		}
		return U\Str::unserialize( $value, $signed );
	}

	/**
	 * Unserializes a value.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $s8d_value Serialized value to be unserialized.
	 *
	 * @param bool   $signed    Serialized value is signed? Default is `false`.
	 *                          When `false` (default) a signature must not be present.
	 *                          When `true`, a signature must be present and pass validation.
	 *
	 * @return mixed Unserialized original value; else `null` on failure.
	 *
	 *               * This function can also return `null` when unserializing a `null` value.
	 *                 In general, it is a best practice not to serialize `null` values.
	 *
	 *               * Classes not listed in `allowed_classes` (see code) will be instantiated as
	 *                 instances of `__PHP_Incomplete_Class`. {@see unserialize()} for further details.
	 */
	public static function unserialize( string $s8d_value, bool $signed = false ) /* : mixed */ {
		static $s8d_false, $marker_length; // Memoize.
		$s8d_false     ??= serialize( false );
		$marker_length ??= mb_strlen( U\Str::SERIALIZED_MARKER );

		if ( ! U\Str::is_serialized( $s8d_value ) ) {
			return null; // Failure.
		}
		// Remove serialization marker.

		$s8d_value = mb_substr( $s8d_value, $marker_length );

		// If it's supposed to be signed, separate the signature
		// from the serialized value and require a valid signature.

		if ( $signed ) { // A valid signature must be present.
			if ( 64 !== mb_strpos( $s8d_value, U\Str::SERIALIZED_SIGNATURE_SEPARATOR ) ) {
				return null; // Failure to locate signature separator.
			}
			[ $signature, $s8d_value ] = explode( U\Str::SERIALIZED_SIGNATURE_SEPARATOR, $s8d_value, 2 );
			$valid_signature = hash_hmac( 'sha256', $s8d_value, U\Crypto::salt() );

			if ( ! hash_equals( $valid_signature, $signature ) ) {
				return null; // Signature mismatch.
			}
		}
		// Catch `false` explicitly.
		// This allows a failure to return `null` below.

		if ( $s8d_false === $s8d_value ) {
			return false; // Explicit `false`.
		}
		// Try to unserialize. Return `null` on failure.

		$options = [
			'allowed_classes' => [
				\stdClass::class,
				U\Generic::class,
				U\Code_Stream_Closure::class,
			],
		];
		$value   = @unserialize( $s8d_value, $options );

		return false === $value ? null : $value;
	}
}
