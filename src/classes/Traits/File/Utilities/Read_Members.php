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
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\File\Utilities;

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
 * @see   U\File
 */
trait Read_Members {
	/**
	 * Reads contents of file.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $file             File path to read from.
	 * @param bool   $throw_on_failure Throw exceptions on failure? Default is `true`.
	 * @param array  $_d               Internal use only — do not pass.
	 *
	 * @return string|null File contents; else `null` on failure.
	 *
	 *                     * If `$throw_on_failure` is `true` (default), always returns a string.
	 *                     * If `$throw_on_failure` is `false`, `null` is returned on failure.
	 *
	 *                     * A string return value is {@see trim()}'d up automtically.
	 *                       However, if {@see U\File::read_bytes()} is used, no trimming occurs.
	 *
	 * @throws U\Fatal_Exception On any failure; if `$throw_on_failure` is `true`.
	 */
	public static function read( string $file, bool $throw_on_failure = true, array $_d = [] ) : ?string {
		if ( '' !== $file && is_file( $file ) && is_readable( $file ) ) {
			if ( isset( $_d[ 'bytes' ] ) ) {
				if ( is_array( $_d[ 'bytes' ] ) ) {
					$offset = $_d[ 'bytes' ][ 0 ] ?? 0;
					$length = $_d[ 'bytes' ][ 1 ] ?? 0;
				} else {
					$offset = 0; // N/A.
					$length = $_d[ 'bytes' ];
				}
				if ( false !== ( $contents = file_get_contents( $file, false, null, $offset, $length ) ) ) {
					return $contents; // Don't trim when reading bytes; leave it to the caller.
				}
			} else {
				if ( false !== ( $contents = file_get_contents( $file ) ) ) {
					return trim( $contents );
				}
			}
		}
		if ( $throw_on_failure ) {
			throw new U\Fatal_Exception(
				'Failed to read contents of: `' . $file . '`.' .
				' Have filesystem permissions changed?'
			);
		}
		return null;
	}

	/**
	 * Reads a specific number of bytes from of file.
	 *
	 * @since 2021-12-19
	 *
	 * @param string    $file             File path to read from.
	 *
	 * @param int|array $bytes            Max bytes to read; or offset array.
	 *                                    If you pass an `int`, it indicates max bytes to read, from beginning of file.
	 *                                    If you pass an `array`, key `0` is offset position to read from,
	 *                                    and key `1` is bytes to read from the offset position.
	 *
	 * @param bool      $throw_on_failure Throw exceptions on failure? Default is `true`.
	 *
	 * @return string|null File contents; else `null` on failure; {@see U\File::read()}.
	 *                     * There's no automatic {@see trim()} when reading bytes.
	 *
	 * @throws U\Fatal_Exception On any failure; if `$throw_on_failure` is `true`.
	 */
	public static function read_bytes( string $file, /* int|array */ $bytes, bool $throw_on_failure = true ) : ?string {
		assert( is_int( $bytes ) || is_array( $bytes ) );
		return U\File::read( $file, $throw_on_failure, [ 'bytes' => $bytes ] );
	}

	/**
	 * Reads and decodes a JSON file.
	 *
	 * @since        2021-12-19
	 *
	 * @param string $file             File path to read from.
	 * @param bool   $throw_on_failure Throw exceptions on failure? Default is `true`.
	 *
	 * @return mixed Decoded JSON value in a PHP data type; else `null` on failure.
	 *
	 *               * It's also possible for a JSON-decoded value to itself be a `null` value.
	 *
	 *                 * If `$throw_on_failure` is `true`, a `null` return value will indicate success.
	 *                   In other words, it indicates the JSON-encoded value was in fact `null`. Not a decoding issue.
	 *
	 *                 * If `$throw_on_failure` is `false`, there is no way of detecting the difference at this time.
	 *                   It's generally not a good idea to JSON-encode `null`. This is one of the reasons.
	 *
	 * @throws U\Fatal_Exception On read|decode failure; if `$throw_on_failure` is `true`.
	 *
	 * @noinspection PhpRedundantCatchClauseInspection
	 */
	public static function read_json( string $file, bool $throw_on_failure = true ) /* : mixed */ {
		$contents = U\File::read( $file, $throw_on_failure );

		if ( null !== $contents ) {
			try { // Possible `null` return value; but it's OK if no exception.
				return U\Str::json_decode( $contents, null, 512, JSON_THROW_ON_ERROR );
			} catch ( \JsonException $exception ) {
				// Fall through to below.
			}
		}
		if ( $throw_on_failure ) {
			throw new U\Fatal_Exception(
				'Failed to read JSON from: `' . $file . '`.' .
				' Does the JSON file contain valid syntax?'
			);
		}
		return null;
	}

	/**
	 * Reads and decodes an object in a JSON file.
	 *
	 * @since        2021-12-19
	 *
	 * @param string $file             File path to read from.
	 * @param bool   $throw_on_failure Throw exceptions on failure? Default is `true`.
	 *
	 * @return object|null Decoded JSON object; else `null` on failure.
	 *
	 * @throws U\Fatal_Exception On read|decode failure; if `$throw_on_failure` is `true`.
	 */
	public static function read_json_obj( string $file, bool $throw_on_failure = true ) /* : object|null */ : ?object {
		$contents = U\File::read( $file, $throw_on_failure );

		if ( null !== $contents ) {
			if ( is_object( $obj = U\Str::json_decode( $contents ) ) ) {
				return $obj; // Success.
			}
		}
		if ( $throw_on_failure ) {
			throw new U\Fatal_Exception(
				'Failed to read JSON object from: `' . $file . '`.' .
				' Does the JSON file contain valid syntax?'
			);
		}
		return null;
	}
}
