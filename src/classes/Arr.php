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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Array utilities.
 *
 * @since 2021-12-15
 */
final class Arr extends U\A6t\Stc_Utilities {
	/**
	 * Gets first value from array.
	 *
	 * @since 2021-12-23
	 *
	 * @param array $arr Array to query.
	 *
	 * @return mixed First value, else `null` if array is empty.
	 *
	 * @see   Compliments the built-in {@see array_key_first()} function.
	 */
	public static function value_first( array $arr ) /* : mixed */ {
		return $arr ? ( $arr[ array_key_first( $arr ) ] ?? null ) : null;
	}

	/**
	 * Gets last value from array.
	 *
	 * @since 2021-12-23
	 *
	 * @param array $arr Array to query.
	 *
	 * @return mixed Last value, else `null` if array is empty.
	 *
	 * @see   Compliments the built-in {@see array_key_last()} function.
	 */
	public static function value_last( array $arr ) /* : mixed */ {
		return $arr ? ( $arr[ array_key_last( $arr ) ] ?? null ) : null;
	}

	/**
	 * Checks if an array is associative.
	 *
	 * @since 2021-12-26
	 *
	 * @param array $arr Array to check.
	 *
	 * @return bool True if array is associative.
	 */
	public static function is_assoc( array $arr ) : bool {
		return array_keys( $arr ) !== range( 0, count( $arr ) - 1 );
	}

	/**
	 * Gets an array's hash.
	 *
	 * @since 2022-01-15
	 *
	 * @param array $arr Array to hash.
	 *
	 * @return string The array's hash. 40 bytes in length.
	 */
	public static function hash( array $arr ) : string {
		return sha1( serialize( U\Arr::hash_helper( $arr ) ) ); // phpcs:ignore.
	}

	/**
	 * Helps get an array's hash.
	 *
	 * @since 2022-01-15
	 *
	 * @param array $arr Array to hash.
	 *
	 * @return array Output array for {@see U\Arr::hash()}.
	 */
	protected static function hash_helper( array $arr ) : array {
		foreach ( $arr as &$_value ) {
			if ( is_array( $_value ) ) {
				$_value = U\Arr::hash_helper( $arr );
			} elseif ( is_object( $_value ) ) {
				$_value = '#' . "\0" . 'obj:' . "\0" . spl_object_id( $_value );
			} elseif ( is_resource( $_value ) ) { // {@see get_resource_id()} is PHP 8+ only.
				$_value = '#' . "\0" . 'res:' . "\0" . ( function_exists( 'get_resource_id' ) ? get_resource_id( $_value ) : (string) $_value );
			}
		}
		return U\Arr::sort_by( 'key', $arr );
	}

	/**
	 * Key accessor.
	 *
	 * @since 2021-12-15
	 *
	 * @param array  $arr       Array to query.
	 * @param string $path      Path to query array for.
	 * @param string $delimiter Delimiter used in path. Defaults to `.`.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 *
	 * @see   U\Ctn::get_prop_key() For collection use.
	 */
	public static function get_key( array $arr, string $path, string $delimiter = '.' ) /* : mixed */ {
		if ( ! $arr || '' === $path || '' === $delimiter ) {
			return null; // Not possible.
		}
		return array_reduce( explode( $delimiter, $path ), function ( $ctn, $var ) {
			$is_array_ctn  = is_array( $ctn );
			$is_object_ctn = ! $is_array_ctn && is_object( $ctn );

			if ( $is_array_ctn && isset( $ctn[ $var ] ) ) {
				return $ctn[ $var ];
			} elseif ( $is_object_ctn && isset( $ctn->{$var} ) ) {
				return $ctn->{$var};
			} else {
				return null;
			}
		}, $arr );
	}

	/**
	 * Sorts an array.
	 *
	 * @since 2021-12-17
	 *
	 * @param string $by    One of `key|value`. Be careful by `value`.
	 *                      When sorting by `value`, array keys are NOT preserved.
	 *
	 * @param array  $arr   Input array to be sorted.
	 * @param int    $flags Optional flags. Defaults to `SORT_NATURAL`.
	 *
	 * @throws U\Fatal_Exception If attempting to sort by non-scalar values.
	 * @throws U\Fatal_Exception If attempting to sort by an unexpected directive.
	 *
	 * @return array Sorted array.
	 *
	 * @see   U\Ctn::sort_by() For collection use.
	 * @see   https://www.php.net/manual/en/array.sorting.php
	 */
	public static function sort_by( string $by, array $arr, int $flags = SORT_NATURAL ) : array {
		switch ( $by ) {
			case 'key':
				ksort( $arr, $flags );
				break;

			case 'value':
				foreach ( $arr as $_value ) {
					if ( ! is_null( $_value ) && ! is_scalar( $_value ) ) {
						throw new U\Fatal_Exception( 'All values must be null|scalar.' );
					}
				}
				sort( $arr, $flags );
				break;

			default:
				throw new U\Fatal_Exception( 'Unexpected sort by directive: `' . $by . '`.' );
		}
		return $arr;
	}

	/**
	 * Takes a desired key, a prefix, and returns shortest key available.
	 *
	 * @since 2021-12-29
	 *
	 * @param string|int $key         Desired key.
	 * @param array      $arr         Array to query.
	 * @param string     $prefix_char Optional prefix char. Default is `:`.
	 *                                If `$key` is not available we'll start prefixing.
	 *
	 * @return string Shortest key available.
	 */
	public static function maybe_prefix_key( /* string|int */ $key, array $arr, string $prefix_char = ':' ) : string {
		$starting_mb_strlen_key = mb_strlen( $key );

		while ( array_key_exists( $key, $arr ) ) {
			$key           = $prefix_char . $key;
			$mb_strlen_key = mb_strlen( $key );

			if ( $mb_strlen_key - $starting_mb_strlen_key > 32 || $mb_strlen_key > 512 ) {
				$key = $prefix_char . U\Crypto::uuid_v4() . $prefix_char . $key;
				break; // Let's not go on looking forever in an endless loop.
				// The `512` check also guards against keys growing way too long.
			}
		}
		return $key;
	}

	/**
	 * Flattens a multidimensional array.
	 *
	 * @since 2022-01-09
	 *
	 * @param array $arr           Input array to flatten.
	 * @param bool  $preserve_keys Should keys be preserved? Default is `false`.
	 *
	 * @return array Flattened array.
	 */
	public static function flatten( array $arr, bool $preserve_keys = false ) : array {
		$flat = []; // Initialize.

		array_walk_recursive( $arr, function ( $value, $key ) use ( &$flat, $preserve_keys ) {
			if ( $preserve_keys ) {
				$flat[ $key ] = $value;
			} else {
				$flat[] = $value;
			}
		} );
		return $flat; // Flattened array.
	}
}
