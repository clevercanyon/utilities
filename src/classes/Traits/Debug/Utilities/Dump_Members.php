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
namespace Clever_Canyon\Utilities\Traits\Debug\Utilities;

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
 * @see   U\Debug
 */
trait Dump_Members {
	/**
	 * A better {@see var_dump()}, typically for debugging.
	 *
	 * Unlike {@see var_dump()} this takes just one value to dump at a time.
	 * i.e., Favoring configurable options over the ability to pass multiple values.
	 * If you need to dump multiple values, recommendaton is to pass an associative array.
	 *
	 * @param mixed       $value       Value or expression to dump.
	 * @param bool        $rtn         Return? Default is `false`, like {@see var_dump()}.
	 * @param bool        $show_ids    Show `object`, `array`, and `resource` IDs?
	 *                                 Default is `true`, like {@see var_dump()}.
	 *
	 * @param int         $indent_size Indent size. Default is `1` for tabbed indentation.
	 *                                 Must be `>= 1`. There is also an upper limit of `12` max.
	 *                                 Set this to (e.g., `4`) if using spaced indentation.
	 *
	 * @param string      $indent_char Indent char. Default is `"\t` for tabbed indentation.
	 *                                 Set this to `' '` for spaced indentation.
	 *
	 * @param array       $_c          Internal use only — do not pass.
	 * @param object|null $_r          Internal use only — do not pass.
	 *
	 * @return string A dump of the input `$var` (always in string format).
	 */
	public static function dump(
		/* mixed */ $value,
		bool $rtn = false,
		bool $show_ids = true,
		int $indent_size = 1,
		string $indent_char = "\t",
		array $_c = [],
		/* object|null */ ?object $_r = null
	) : string {
		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		if ( ! $is_recursive ) {
			$_c          = [
				'indent_size'   => 0,
				'circular_idxs' => [],
			];
			$indent_size = min( 12, $indent_size );
			$indent_size = max( 1, $indent_size );
		}
		$dump_value = &$value; // Alias for clarity.

		switch ( $dump_type = gettype( $dump_value ) ) {
			case 'object':
			case 'array':
				// Note: `c_`, `_c` = "current".
				// Note: `x_`, `_x` = "nested children".

				$x_dump_rtn                     = true; // Return.
				$x_dumps                        = [];   // Initialize.
				$x_dump_longest_prop_key_length = 0;    // For indentation.

				$dump_indent_size   = $_c[ 'indent_size' ] + ( $indent_size * 1 );
				$x_dump_indent_size = $_c[ 'indent_size' ] + ( $indent_size * 2 );

				$c_indents      = str_repeat( $indent_char, $_c[ 'indent_size' ] );
				$dump_indents   = $c_indents . str_repeat( $indent_char, $dump_indent_size );
				$x_dump_indents = $c_indents . str_repeat( $indent_char, $x_dump_indent_size );

				switch ( $dump_type ) {
					case 'object':
						$dump_opening_encap      = '{';
						$dump_closing_encap      = '}';
						$dump_prop_key_value_sep = ': ';

						$_x_dump_values = method_exists( $dump_value, '__debugInfo' )
							? $dump_value->__debugInfo() : U\Obj::props( $dump_value, 'debug' );

						$dump_display_type = '(object) [' . count( $_x_dump_values ) . '] \\' . get_class( $dump_value ) .
							( $show_ids ? ' #' . spl_object_id( $dump_value ) : '' );
						break;
					case 'array':
					default: // Array.
						$dump_opening_encap      = '[';
						$dump_closing_encap      = ']';
						$dump_prop_key_value_sep = ' => ';

						$_x_dump_values    = $dump_value;
						$dump_display_type = '(array) [' . count( $_x_dump_values ) . ']' .
							( $show_ids ? ' #' . U\Arr::hash_id( $dump_value ) : '' );
						break;
				}
				$dump = $dump_display_type . "\n" . $dump_indents . $dump_opening_encap . "\n";

				foreach ( $_x_dump_values as $_x_dump_prop_key => $_x_dump_value ) {
					if ( is_string( $_x_dump_prop_key ) ) {
						$_x_dump_prop_key = "'" . $_x_dump_prop_key . "'";
					}
					$_x_prop_key_length             = mb_strlen( (string) $_x_dump_prop_key );
					$x_dump_longest_prop_key_length = max( $x_dump_longest_prop_key_length, $_x_prop_key_length );

					switch ( $_x_dump_type = gettype( $_x_dump_value ) ) {
						case 'object':
						case 'array':
							switch ( $_x_dump_type ) {
								case 'object':
									$_x_dump_opening_encap = '{';
									$_x_dump_closing_encap = '}';

									$_x_dump_circular_idx = spl_object_id( $_x_dump_value );
									$_x_dump_display_type = '(object) [${count}] \\' . get_class( $_x_dump_value ) .
										( $show_ids ? ' #' . $_x_dump_circular_idx : '' );
									break;
								case 'array':
								default: // Array.
									$_x_dump_opening_encap = '[';
									$_x_dump_closing_encap = ']';

									$_x_dump_circular_idx = U\Arr::hash_id( $_x_dump_value );
									$_x_dump_display_type = '(array) [${count}]' .
										( $show_ids ? ' #' . $_x_dump_circular_idx : '' );
									break;
							}
							if ( isset( $_c[ 'circular_idxs' ][ $_x_dump_circular_idx ] ) ) {
								$x_dumps[ $_x_dump_prop_key ] = str_replace( '${count}', '*', $_x_dump_display_type ) .
									' ' . $_x_dump_opening_encap . $_x_dump_closing_encap . ' *circular*';
							} else {
								$_x_dump = U\Debug::dump(
									$_x_dump_value,
									$x_dump_rtn,
									$show_ids,
									$indent_size,
									$indent_char,
									[ // Current indent size & circular IDs.
										'indent_size'   => $dump_indent_size,
										'circular_idxs' => $_c[ 'circular_idxs' ] + [ $_x_dump_circular_idx => 1 ],
									] + $_c,
									$_r
								);
								if ( $_x_dump ) {
									$x_dumps[ $_x_dump_prop_key ] = $_x_dump;
								} else {
									$x_dumps[ $_x_dump_prop_key ] = str_replace( '${count}', '0', $_x_dump_display_type ) .
										' ' . $_x_dump_opening_encap . $_x_dump_closing_encap;
								}
							}
							break; // Break switch.

						default: // Everything else is simpler.
							$x_dumps[ $_x_dump_prop_key ] = U\Debug::dump(
								$_x_dump_value,
								$x_dump_rtn,
								$show_ids,
								$indent_size,
								$indent_char,
								[ // Current indent size.
									'indent_size' => $dump_indent_size,
								] + $_c,
								$_r
							);
							break; // Break switch.
					}
				}
				if ( $x_dumps ) {
					foreach ( $x_dumps as $_x_dump_prop_key => $_x_dump ) {
						$_x_dump_align = str_repeat( ' ', $x_dump_longest_prop_key_length - mb_strlen( (string) $_x_dump_prop_key ) );
						$dump          .= $x_dump_indents . $_x_dump_prop_key . $_x_dump_align . $dump_prop_key_value_sep . $_x_dump . "\n";
					}
					$dump = $dump . $dump_indents . $dump_closing_encap;
				} else {
					$dump = rtrim( $dump, "\n" . $indent_char . $dump_opening_encap ) . ' ' . $dump_opening_encap . $dump_closing_encap;
				}
				break; // Break switch.

			// Everything else is simpler.

			case 'null':
			case 'NULL':
				$dump = 'null';
				break; // Break switch.

			case 'int':
			case 'integer':
				$dump = '(int) ' . $dump_value;
				break; // Break switch.

			case 'double':
			case 'float':
				$dump = '(float) ' . $dump_value;
				break; // Break switch.

			case 'bool':
			case 'boolean':
				$dump = '(bool) ' . ( $dump_value ? 'true' : 'false' );
				break; // Break switch.

			case 'string': // Measures numbers of characters and also number of bytes.
				$dump = '(string) [' . mb_strlen( $dump_value ) . '/' . strlen( $dump_value ) . '] ' . "'" . $dump_value . "'";
				break; // Break switch.

			case 'resource': // Similar to an object. It has a type and an ID.
			case 'resource (closed)': // Similar to an object. It has a type and an ID.
				$dump = '(' . $dump_type . ') \\' . get_resource_type( $dump_value ) . // @future-review: {@see get_resource_id()} is PHP 8+.
					( $show_ids ? ' #' . ( function_exists( 'get_resource_id' ) ? get_resource_id( $dump_value ) : (int) $dump_value ) : '' );
				break; // Break switch.

			case 'unknown':
			case 'unknown type':
			default: // Default case handler.
				$dump = '(unknown) \\' . $dump_type;
				break; // Break switch.
		}
		if ( $rtn ) {
			return $dump; // Returns dump.
		}
		echo $dump . "\n"; // phpcs:ignore -- output ok.
		return '';         // Return empty string in this case.
	}
}
