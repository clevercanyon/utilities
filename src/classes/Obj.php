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
 * Object utilities.
 *
 * @since 2021-12-15
 */
final class Obj extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Obj\Members;

	/**
	 * Object is empty?
	 *
	 * @since 2021-12-16
	 *
	 * @param object $obj Value to check.
	 *
	 * @return bool True if object is empty.
	 */
	public static function empty( object $obj ) : bool {
		return empty( U\Obj::props( $obj ) );
	}

	/**
	 * Gets non-static properties, by value.
	 *
	 * @since 2021-12-27
	 *
	 * @param object      $obj    Object to get properties from.
	 *
	 * @param string|null $filter Optional filter. Default is `public+`.
	 *
	 *  - `public+` (default behavior) returns publicly-accessible non-static properties.
	 *    Plus it returns pseudo-properties like `+offsets`, which is technically a private property,
	 *    but offsets are publicly-accessible through `[]` syntax in supporting implementations of {@see U\I7e\Offsets}.
	 *
	 *  - `public` returns publicly-accessible non-static properties only.
	 *  - `protected` returns protected non-static properties only.
	 *  - `private` returns private non-static properties only.
	 *
	 *  - `public...protected` returns public and protected non-static properties.
	 *  - `public...private` returns public, protected, and private non-static properties.
	 *  - `protected...private` returns protected and private non-static properties.
	 *
	 *  - `debug` returns public, protected, and private non-static properties. Same as `public...private`.
	 *  - `debug+` Includes some internals like `obj_cache`, which is not returned otherwise.
	 *
	 * @return array All accessible non-static properties using the given `$filter`.
	 *
	 * @note  Protected properties are always prefixed with `"\0"*"\0"`, just like {@see get_mangled_object_vars()}.
	 * @note  Private properties are always prefixed with `"\0"[class]"\0"`, just like {@see get_mangled_object_vars()}.
	 *
	 * @note  Pseudo-properties are always prefixed with `"\0"+"\0"`, which is a behavior unique to this function.
	 *        For example, `public+` returns `"\0"+"\0"offsets` for implementations of {@see U\I7e\Offsets}.
	 *
	 * @note  Pseudo-properties are only returned when using the default `public+` filter.
	 *        For example, if you ask for `public...private` you will get offsets, but under a different key;
	 *        e.g., `"\0"[class]"\0"offsets` instead of the pseudo `"\0"+"\0"offsets` key.
	 */
	public static function props( object $obj, /* string|null */ ?string $filter = null ) : array {
		$props  = [];          // Initialize.
		$filter ??= 'public+'; // Default behavior.

		switch ( $filter ) {
			case 'public':
				$props = get_object_vars( $obj );
				break;

			case 'protected':
				foreach ( get_mangled_object_vars( $obj ) as $_prop => $_value ) {
					if ( is_string( $_prop )
						&& "\0" === ( $_prop[ 0 ] ?? '' )
						&& '*' === ( $_prop[ 1 ] ?? '' )
					) {
						$props[ $_prop ] = $_value;
					}
				}
				break;

			case 'private':
				foreach ( get_mangled_object_vars( $obj ) as $_prop => $_value ) {
					if ( is_string( $_prop )
						&& "\0" === ( $_prop[ 0 ] ?? '' )
						&& '*' !== ( $_prop[ 1 ] ?? '' )
					) {
						$props[ $_prop ] = $_value;
					}
				}
				break;

			case 'public...protected':
				foreach ( get_mangled_object_vars( $obj ) as $_prop => $_value ) {
					if ( ! is_string( $_prop )
						|| "\0" !== ( $_prop[ 0 ] ?? '' )
						|| '*' === ( $_prop[ 1 ] ?? '' )
					) {
						$props[ $_prop ] = $_value;
					}
				}
				break;

			case 'protected...private':
				foreach ( get_mangled_object_vars( $obj ) as $_prop => $_value ) {
					if ( is_string( $_prop )
						&& "\0" === ( $_prop[ 0 ] ?? '' )
					) {
						$props[ $_prop ] = $_value;
					}
				}
				break;

			case 'debug':
			case 'debug+':
			case 'public...private':
				$props = get_mangled_object_vars( $obj );
				break;

			case 'public+':
			default: // Default behavior.
				$props = get_object_vars( $obj );
				if ( $obj instanceof U\I7e\Offsets ) {
					$props[ U\Arr::maybe_prefix_key( "\0" . '+' . "\0" . 'offsets', $props, "\0" ) ] = $obj->offsets();
				}
				break;
		}
		if ( 'debug+' !== $filter ) {
			// Remove `obj_cache` (uninteresting and super noisy).
			unset( $props[ "\0" . U\A6t\Base::class . "\0" . 'obj_cache' ] );
		}
		return $props;
	}

	/**
	 * Property accessor, by path.
	 *
	 * @since 2021-12-15
	 *
	 * @param object $obj       Object to query.
	 * @param string $path      Path to query object for.
	 * @param string $delimiter Delimiter used in path. Defaults to `.`.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 *
	 * @see   U\Ctn::get_prop_key()
	 */
	public static function get_prop( object $obj, string $path, string $delimiter = '.' ) /* : mixed */ {
		if ( '' === $path || '' === $delimiter ) {
			return null; // Not possible.
		}
		return array_reduce( explode( $delimiter, $path ), function ( $ctn, $var ) {
			$is_object_ctn = is_object( $ctn );
			$is_array_ctn  = ! $is_object_ctn && is_array( $ctn );

			if ( $is_object_ctn && isset( $ctn->{$var} ) ) {
				return $ctn->{$var};
			} elseif ( $is_array_ctn && isset( $ctn[ $var ] ) ) {
				return $ctn[ $var ];
			} else {
				return null;
			}
		}, $obj );
	}

	/**
	 * Sorts an object.
	 *
	 * @since 2021-12-17
	 *
	 * @param string $by    One of `prop|value`. Be careful by `value`.
	 *                      When sorting by `value`, props are NOT preserved.
	 *
	 * @param object $obj   Input object to be sorted.
	 * @param int    $flags Optional flags. Defaults to `SORT_NATURAL`.
	 *
	 * @throws U\Exception If attempting to sort by non-scalar values.
	 * @throws U\Exception If attempting to sort by an unexpected directive.
	 *
	 * @return object Sorted object, converted to {@see \stdClass}.
	 *
	 * @see   U\Ctn::sort_by()
	 * @see   https://www.php.net/manual/en/array.sorting.php
	 */
	public static function sort_by( string $by, object $obj, int $flags = SORT_NATURAL ) : object {
		$obj = (array) $obj; // For sorting below.

		switch ( $by ) {
			case 'prop':
				ksort( $obj, $flags );
				break;

			case 'value':
				foreach ( $obj as $_value ) {
					if ( ! is_null( $_value ) && ! is_scalar( $_value ) ) {
						throw new U\Exception( 'All values must be null|scalar.' );
					}
				}
				sort( $obj, $flags );
				break;

			default:
				throw new U\Exception( 'Unexpected sort by directive: `' . $by . '`.' );
		}
		return (object) $obj;
	}
}
