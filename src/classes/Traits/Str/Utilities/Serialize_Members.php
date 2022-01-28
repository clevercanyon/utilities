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

/**
 * File-specific.
 *
 * @since 2021-12-15
 */
//use Laravel\SerializableClosure\{SerializableClosure as Serializable_Closure};
//use Laravel\SerializableClosure\Serializers\{Native as Serialized_Closure};

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
	 * Serializes a value with additional security considerations.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $value Value to serialize.
	 *
	 *                     * PHP serializes a resource as `0`, and therefore works, but it's a bad practice.
	 *                       Do not serialize resource values; either directly or indirectly.
	 *                       Future versions of PHP will likely disallow altogether.
	 *
	 * @param bool  $sign  Sign the serialized string? Default is `true` (more secure).
	 *                     Recommended best practice is to set as `false` for performance gains in certain cases.
	 *                     For example, when serializing values that'll never be unserialized or will never be untrusted.
	 *
	 * @throws U\Fatal_Exception On failure to serialize a {@see \Closure} (in debugging mode).
	 *
	 * @return string Serialized string representation.
	 *
	 * @see   \serialize()
	 */
	public static function serialize( /* mixed */ $value, bool $sign = true ) : string {
		assert( ! is_resource( $value ) ); // Bad practice.

		if ( ! $sign ) {
			return serialize( $value );
		}
		$serialized_value = serialize( $value );
		$signature        = U\Str::serialized_signature_helper( $serialized_value );

		return $signature .
			U\Str::SERIALIZE_SIGNATURE_SEPARATOR .
			$serialized_value;
	}

	/**
	 * Unserializes a value.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $value  Value to unserialize.
	 *
	 * @param bool  $signed Input string is signed? Default is absolutely `true` (more secure).
	 *                      When `true`, a signature must be present, and it must be a valid signature.
	 *
	 *                      * If `false`, a signature must not be present, and therefore will not be considered.
	 *                        Care should be taken before setting this to `false`. It's potentially dangerous.
	 *
	 * @throws U\Fatal_Exception On failure to unserialize a {@see \Closure} (in debugging mode).
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
	public static function unserialize( /* mixed */ $value, bool $signed = true ) /* : mixed */ {
		if ( '' === $value || ! is_string( $value ) ) {
			return null; // Failure.
		}
		if ( $signed ) { // Must be present, and it must be a valid signature.
			if ( 12 !== mb_strpos( $value, U\Str::SERIALIZE_SIGNATURE_SEPARATOR ) ) {
				return null; // Failure to locate signature separator.
			}
			[ $signature, $value ] = explode( U\Str::SERIALIZE_SIGNATURE_SEPARATOR, $value, 2 );
			$valid_signature = U\Str::serialized_signature_helper( $value );

			if ( ! hash_equals( $valid_signature, $signature ) ) {
				return null; // Signature mismatch.
			}
		}
		static $serialized_false; // Memoize.
		$serialized_false ??= serialize( false );

		if ( $serialized_false === $value ) {
			return false; // Explicit `false` return value.
		}
		$options = [
			'allowed_classes' => [
				\stdClass::class,
				U\Generic::class,
			],
		];
		$value   = @unserialize( $value, $options );

		return false === $value ? null : $value;
	}

	/**
	 * Calculates serialized value's signature.
	 *
	 * @since 2022-01-28
	 *
	 * @param string $serialized_value Serialized value.
	 *
	 * @return string Serialized value's signature.
	 */
	protected static function serialized_signature_helper( string $serialized_value ) : string {
		$signature = hash_hmac( 'sha1', $serialized_value, U\Str::SERIALIZE_SIGNATURE_KEY );
		$signature = mb_substr( $signature, 0, 12 ); // Keeps it reasonable.

		return $signature;
	}
}
