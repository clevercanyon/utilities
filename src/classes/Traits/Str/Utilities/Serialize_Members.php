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
	 * Serializes a value.
	 *
	 * @since 2021-12-15
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
	 * @param bool  $sign  Sign the serialized string? Default is `false`.
	 *                     Recommend setting as `true` when serializing sensitive data.
	 *                     e.g., When data could potentially be exposed to untrusted parties.
	 *
	 * @return string Serialized value; i.e., a string.
	 *                * If `$sign` is `true` it will start with a 64-byte signature,
	 *                  followed by a separator; {@see U\Str::SERIALIZE_SIGNATURE_SEPARATOR}.
	 *
	 * @see   \serialize()
	 */
	public static function serialize( /* mixed */ $value, bool $sign = false ) : string {
		assert( ! is_resource( $value ) );
		assert( ! $value instanceof \Closure );

		if ( ! $sign ) {
			return serialize( $value );
		}
		$s8d_value = serialize( $value );
		$signature = hash_hmac( 'sha256', $s8d_value, U\Crypto::salt() );

		return $signature . U\Str::SERIALIZE_SIGNATURE_SEPARATOR . $s8d_value;
	}

	/**
	 * Unserializes a value.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $s8d_value Serialized value to be unserialized.
	 *
	 * @param bool  $signed    Serialized value is signed? Default is `false`.
	 *                         When `false` (default) a signature must not be present.
	 *                         When `true`, a signature must be present and pass validation.
	 *
	 * @return mixed Unserialized original value; else `null` on failure.
	 *
	 *               * This function can also return `null` when unserializing a `null` value.
	 *                 In general, it is a best practice not to serialize `null` values.
	 *
	 *               * Classes not listed in `allowed_classes` (see code) will be instantiated as
	 *                 instances of `__PHP_Incomplete_Class`. {@see \unserialize()} for further details.
	 *
	 * @see   \unserialize()
	 */
	public static function unserialize( /* mixed */ $s8d_value, bool $signed = false ) /* : mixed */ {
		if ( ! is_string( $s8d_value ) || '' === $s8d_value ) {
			return null; // Failure.
		}
		if ( $signed ) { // Must be present, and it must be a valid signature.
			if ( 64 !== mb_strpos( $s8d_value, U\Str::SERIALIZE_SIGNATURE_SEPARATOR ) ) {
				return null; // Failure to locate signature separator.
			}
			[ $signature, $s8d_value ] = explode( U\Str::SERIALIZE_SIGNATURE_SEPARATOR, $s8d_value, 2 );
			$valid_signature = hash_hmac( 'sha256', $s8d_value, U\Crypto::salt() );

			if ( ! hash_equals( $valid_signature, $signature ) ) {
				return null; // Signature mismatch.
			}
		}
		static $s8d_false; // Memoize.
		$s8d_false ??= serialize( false );

		if ( ':' !== ( $s8d_value[ 1 ] ?? '' ) ) {
			return null; // Not a serialized value.
		}
		if ( $s8d_false === $s8d_value ) {
			return false; // Explicit `false`.
		}
		$value = @unserialize(
			$s8d_value,
			[
				'allowed_classes' => [
					\stdClass::class,
					U\Generic::class,
				],
			]
		);
		return false === $value ? null : $value;
	}
}
