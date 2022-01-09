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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\STC;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * String utilities.
 *
 * @since 2021-12-15
 */
class Str extends \Clever_Canyon\Utilities\STC\Abstracts\A6t_Stc_Base {
	/**
	 * Escapes single quotes.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_sq( string $str ) : string {
		return str_replace( "'", "\\'", $str );
	}

	/**
	 * Escapes double quotes.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_dq( string $str ) : string {
		return str_replace( '"', '\\"', $str );
	}

	/**
	 * Escapes regexp dynamics.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str       String.
	 * @param string $delimiter Optional delimiter. Default is `/`.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_reg( string $str, string $delimiter = '/' ) : string {
		return preg_quote( $str, $delimiter );
	}

	/**
	 * Escapes regexp backreferences.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_reg_brs( string $str ) : string {
		return str_replace( [ '\\', '$' ], [ '\\\\', '\$' ], $str );
	}

	/**
	 * Escapes a string for use in HTML.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_html( string $str ) : string {
		return U\Env::is_wordpress()
			? esc_html( $str )
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, null, false );
	}

	/**
	 * Escapes a string for use in HTML attributes.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_attr( string $str ) : string {
		return U\Env::is_wordpress()
			? esc_attr( $str )
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, null, false );
	}

	/**
	 * Escapes a string for use in HTML `src|href|...` attributes.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_url( string $str ) : string {
		return U\Env::is_wordpress()
			? esc_url( $str )
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, null, false );
	}

	/**
	 * Escapes a string for use in HTML `textarea` tags.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_textarea( string $str ) : string {
		return U\Env::is_wordpress()
			? esc_textarea( $str )
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, null, true );
	}

	/**
	 * Escapes a string for use as a shell argument.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @throws Fatal_Exception If {@see escapeshellarg()} is not available.
	 * @return string Escaped string. It's actually an escaped and `'single-quoted'` string.
	 */
	public static function esc_shell_arg( string $str ) : string {
		if ( ! U\Env::can_use_function( 'escapeshellarg' ) ) {
			throw new Fatal_Exception( 'Unable to use PHP’s `escapeshellarg()` function. Disabled?' );
		}
		return escapeshellarg( $str );
	}

	/**
	 * Checks if string begins with needle.
	 *
	 * @since 2022-01-08
	 *
	 * @param string $haystack Haystack string.
	 * @param string $needle   Needle string to search for.
	 *
	 * @return bool True if `$needle` is at beginning of `$haystack`.
	 */
	public static function begins_with( string $haystack, string $needle ) : bool {
		return 0 === mb_strpos( $haystack, $needle );
	}

	/**
	 * Checks if string begins with needle (caSe-insensitive).
	 *
	 * @since 2022-01-08
	 *
	 * @param string $haystack Haystack string.
	 * @param string $needle   Needle string to search for.
	 *
	 * @return bool True if `$needle` is at beginning of `$haystack`.
	 */
	public static function ibegins_with( string $haystack, string $needle ) : bool {
		return 0 === mb_stripos( $haystack, $needle );
	}

	/**
	 * Checks if string ends with needle.
	 *
	 * @since 2022-01-08
	 *
	 * @param string $haystack Haystack string.
	 * @param string $needle   Needle string to search for.
	 *
	 * @return bool True if `$needle` is at end of `$haystack`.
	 */
	public static function ends_with( string $haystack, string $needle ) : bool {
		return mb_substr( $haystack, -mb_strlen( $needle ) ) === $needle;
	}

	/**
	 * Checks if string ends with needle (caSe-insensitive).
	 *
	 * @since 2022-01-08
	 *
	 * @param string $haystack Haystack string.
	 * @param string $needle   Needle string to search for.
	 *
	 * @return bool True if `$needle` is at end of `$haystack`.
	 */
	public static function iends_with( string $haystack, string $needle ) : bool {
		return mb_strtolower( mb_substr( $haystack, -mb_strlen( $needle ) ) ) === mb_strtolower( $needle );
	}

	/**
	 * Checks if string contains needle.
	 *
	 * @since 2022-01-08
	 *
	 * @param string $haystack Haystack string.
	 * @param string $needle   Needle string to search for.
	 *
	 * @return bool True if `$needle` is at end of `$haystack`.
	 */
	public static function contains( string $haystack, string $needle ) : bool {
		return false !== mb_strpos( $haystack, $needle );
	}

	/**
	 * Checks if string contains needle (caSe-insensitive).
	 *
	 * @since 2022-01-08
	 *
	 * @param string $haystack Haystack string.
	 * @param string $needle   Needle string to search for.
	 *
	 * @return bool True if `$needle` is at end of `$haystack`.
	 */
	public static function icontains( string $haystack, string $needle ) : bool {
		return false !== mb_stripos( $haystack, $needle );
	}

	/**
	 * Normalizes line breaks.
	 *
	 * @since 2022-01-08
	 *
	 * @param string $str Input string to normalize.
	 *
	 * @return string Normalized output string.
	 */
	public static function normalize_eols( string $str ) : string {
		$str = str_replace( [ "\r\n", "\r", "\n" ], "\n", $str );
		return preg_replace( "/\n{3,}/", "\n\n", $str );
	}

	/**
	 * Checks name validity; e.g., `My Name`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to check.
	 * @param string $prefix Require it to have a prefix?
	 *                       Default is ``, no required prefix.
	 *
	 * @return bool True if it's a valid name.
	 */
	public static function is_name( string $str, string $prefix = '' ) : bool {
		return U\Str::is_valid( $str, 2, 128, '/^.+$/ui', $prefix );
	}

	/**
	 * Checks slug validity; e.g., `my-slug`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to check.
	 * @param string $prefix Require it to have a prefix?
	 *                       Default is ``, no required prefix.
	 *
	 * @return bool True if it's a valid slug.
	 */
	public static function is_slug( string $str, string $prefix = '' ) : bool {
		return U\Str::is_valid( $str, 2, 128, '/^[a-z](?:-{0,2}[a-z0-9])+$/u', $prefix );
	}

	/**
	 * Checks var validity; e.g., `my_var`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to check.
	 * @param string $prefix Require it to have a prefix?
	 *                       Default is ``, no required prefix.
	 *
	 * @return bool True if it's a valid var.
	 */
	public static function is_var( string $str, string $prefix = '' ) : bool {
		return U\Str::is_valid( $str, 2, 128, '/^[a-z](?:_{0,2}[a-z0-9])+$/u', $prefix );
	}

	/**
	 * Checks version validity; e.g., `1.0.0`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid version.
	 */
	public static function is_version( string $str ) : bool {
		return U\Str::is_valid( $str, 1, 100, '/^[0-9]+(?:\.[0-9]+)*(?:\.(?:dev|alpha|beta|rc)\.[0-9](?:\.[0-9]+)*)?$/u' );
	}

	/**
	 * Checks string validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str       String to check.
	 *
	 * @param int    $min_chars Optional minimum chars. Default is `2`.
	 * @param int    $max_chars Optional maximum chars. Default is `100`.
	 * @param string $regexp    Optional valid regular expression pattern.
	 *
	 * @param string $prefix    Optional required prefix. Default is ``, no prefix requirement.
	 *                          If given, `$min_chars`, `$max_chars`, and `$regexp` are tested against
	 *                          both the full string and also the unprefixed string.
	 *
	 * @param string $suffix    Optional required suffix. Default is ``, no suffix requirement.
	 *                          If given, `$min_chars`, `$max_chars`, and `$regexp` are tested against
	 *                          both the full string and also the unsuffixed string.
	 *
	 * @return bool True if it's a valid string.
	 */
	public static function is_valid(
		string $str,
		int $min_chars = 2,
		int $max_chars = 100,
		string $regexp = '',
		string $prefix = '',
		string $suffix = ''
	) : bool {
		$str_chars = mb_strlen( $str );
		$min_chars = max( 0, $min_chars );
		$max_chars = max( 0, $max_chars );

		if ( $min_chars && $str_chars < $min_chars ) {
			return false;
		} elseif ( $max_chars && $str_chars > $max_chars ) {
			return false;
		} elseif ( $regexp && ! preg_match( $regexp, $str ) ) {
			return false;
		}
		if ( '' !== $prefix ) {
			$unprefixed_str       = preg_replace( '/^' . U\Str::esc_reg( $prefix ) . '/u', '', $str );
			$unprefixed_str_chars = mb_strlen( $unprefixed_str );

			if ( $unprefixed_str === $str ) {
				return false;
			} elseif ( $min_chars && $unprefixed_str_chars < $min_chars ) {
				return false;
			} elseif ( $max_chars && $unprefixed_str_chars > $max_chars ) {
				return false;
			} elseif ( $regexp && ! preg_match( $regexp, $unprefixed_str ) ) {
				return false;
			}
		}
		if ( '' !== $suffix ) {
			$unsuffixed_str       = preg_replace( '/' . U\Str::esc_reg( $suffix ) . '$/u', '', $str );
			$unsuffixed_str_chars = mb_strlen( $unsuffixed_str );

			if ( $unsuffixed_str === $str ) {
				return false;
			} elseif ( $min_chars && $unsuffixed_str_chars < $min_chars ) {
				return false;
			} elseif ( $max_chars && $unsuffixed_str_chars > $max_chars ) {
				return false;
			} elseif ( $regexp && ! preg_match( $regexp, $unsuffixed_str ) ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * CaSe-insensitive {@see replace()} variant.
	 *
	 * @since 2021-12-25
	 *
	 * @param string|array $search  {@see replace()}.
	 * @param string|array $replace {@see replace()}.
	 * @param string|array $subject {@see replace()}.
	 * @param int          $limit   {@see replace()}.
	 * @param int|null     $count   {@see replace()}.
	 *
	 * @throws Exception {@see replace()}.
	 * @return array|string {@see replace()}.
	 */
	public static function ireplace(
		/* string|array */ $search,
		/* string|array */ $replace,
		/* string|array */ $subject,
		/* int|null */ int $limit = -1,
		/* int|null */ ?int &$count = null
	) /* : string|array */ {
		return U\Str::replace( $search, $replace, $subject, $limit, $count, [ 'case:insensitive' => true ] );
	}

	/**
	 * Performs search & replace operation.
	 * This is a clone {@see str_replace()} that supports a `$limit` param.
	 *
	 * @since 2021-12-25
	 *
	 * @param string|array $search  {@see str_replace()}. No change; same behavior.
	 * @param string|array $replace {@see str_replace()}. No change; same behavior.
	 * @param string|array $subject {@see str_replace()}. No change; same behavior.
	 *
	 * @param int          $limit   Max replacements. Not supported by {@see str_replace()}.
	 *                              Default is `-1`, indicating no limit with infinite replacements.
	 *                              Set to any value `>=1` to limit the number of replacements in each search.
	 *                              If `$search` is an array, `$limit` applies to each of the searches, individually.
	 *
	 * @param int|null     $count   {@see str_replace()}. Similar behavior, but different position in list of args.
	 *                              Also, in the case of `$search` or `$subject` being an array, `$count` reflects
	 *                              the total number of replacements across all subjects and searches.
	 *
	 * @param array        $_d      Internal use only — do not pass.
	 *
	 * @throws Exception When `$replace` is passed as an array, but `$search` is passed as a string. Makes no sense.
	 *                   Throwing an exception matches the behavior of {@see str_replace()} in PHP 8.0+.
	 *
	 * @return string|array {@see str_replace()}. Same behavior here.
	 *
	 * @note  This function is caSe-sensitive. Use {@see ireplace()} for caSe-insensitive replace.
	 * @note  This function is binary safe; i.e., multibyte-safe.
	 */
	public static function replace(
		/* string|array */ $search,
		/* string|array */ $replace,
		/* string|array */ $subject,
		/* int */ int $limit = -1,
		/* int|null */ ?int &$count = null,
		array $_d = []
	) /* string|array */ {
		$count = 0; // Initialize.

		$searches = (array) $search;
		$replaces = (array) $replace;
		$subjects = (array) $subject;

		$search_is_array  = is_array( $search );
		$replace_is_array = is_array( $replace );
		$subject_is_array = is_array( $subject );

		assert( is_string( $search ) || is_array( $search ) );
		assert( is_string( $replace ) || is_array( $replace ) );
		assert( is_string( $subject ) || is_array( $subject ) );

		if ( ! ( -1 === $limit || $limit >= 1 ) ) {
			throw new Exception( '`$limit` must be `-1`, or >= `1`.' );
		}
		if ( $replace_is_array && ! $search_is_array ) {
			throw new Exception( '`$replace` must be a string when `$search` is a string.' );
		}
		$is_case_insensitive = ! empty( $_d[ 'case:insensitive' ] );

		foreach ( $subjects as &$_subject ) {
			foreach ( $searches as $_key => $_search ) {
				$_replace = $search_is_array && $replace_is_array ? ( $replaces[ $_key ] ?? '' ) : $replaces[ 0 ];

				if ( 1 === $limit ) {
					$strpos_fn ??= $is_case_insensitive ? 'stripos' : 'strpos';
					if ( false !== $_search_strpos = $strpos_fn( $_subject, $_search ) ) {
						$_subject = substr_replace( $_subject, $_replace, $_search_strpos, strlen( $_search ) );
						$count    += 1;
					}
				} else {
					$regexp_flags ??= $is_case_insensitive ? 'ui' : 'u';
					$_replace     = U\Str::esc_reg_brs( $_replace ); // Escapes backreferences.
					$_subject     = preg_replace( '/' . U\Str::esc_reg( $_search ) . '/' . $regexp_flags, $_replace, $_subject, $limit, $_rp );
					$count        += $_rp;
				}
			}
		}
		return $subject_is_array ? $subjects : $subjects[ 0 ];
	}

	/**
	 * Stringifies data.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed     $data         Data to stringify.
	 * @param bool|null $pretty_print Pretty print? Default is `true`. Let's make JSON editing easy.
	 *                                This enables `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT`.
	 *
	 * @return string String representation.
	 *
	 * @note  This is NOT purely a JSON-encoder.
	 *        For example, null, scalar, and resource values are simply converted to strings.
	 *        They are not converted to JSON. Instead, {@see U\Str::json_encode()}.
	 *
	 * @see   U\Ctn::stringify()
	 * @see   U\Str::json_encode()
	 */
	public static function stringify( /* mixed */ $data, /* bool|null */ ?bool $pretty_print = true ) : string {
		$pretty_print ??= true; // For callers who prefer to depend on default here.
		$flags        = $pretty_print ? JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT : 0;

		if ( is_null( $data ) || is_scalar( $data ) || is_resource( $data ) ) {
			$string = (string) $data; // Cannot be decoded as JSON.
		} else {
			$string = json_encode( $data, $flags );
		}
		return $string;
	}

	/**
	 * JSON-encodes data.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed     $data         Data to JSON-encode.
	 * @param bool|null $pretty_print Pretty print? Default is `true`. Let's make JSON editing easy.
	 *                                This enables `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT`.
	 *
	 * @return string JSON-encoded string.
	 *
	 * @see   json_encode()
	 * @see   U\Str::json_decode()
	 * @see   wp_json_encode()
	 */
	public static function json_encode( /* mixed */ $data, /* bool|null */ ?bool $pretty_print = true ) : string {
		$pretty_print ??= true; // For callers who prefer to depend on default here.
		$flags        = $pretty_print ? JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT : 0;

		if ( is_resource( $data ) ) {
			$data = (string) $data; // Will be JSON-encoded below.
		}
		if ( U\Env::is_wordpress() ) {
			return wp_json_encode( $data, $flags );
		}
		return json_encode( $data, $flags );
	}

	/**
	 * JSON-decodes data.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $data    Data to JSON-decode.
	 * @param mixed  ...$args {@see json_decode()}.
	 *
	 * @return mixed JSON-decoded data.
	 *
	 * @see   json_decode()
	 * @see   U\Str::json_encode()
	 */
	public static function json_decode( string $data, ...$args ) /* : mixed */ {
		return json_decode( $data, ...$args );
	}

	/**
	 * Does a {@see preg_match()} against an array of patterns.
	 *
	 * @since 2021-12-30
	 *
	 * @param object|array $patterns Array of regexp patterns.
	 * @param string       $str      Subject string to test against patterns.
	 *
	 * @param array|null   $matches  No change. {@see preg_match()} for details.
	 *
	 * @param mixed        ...$args  No change. {@see preg_match()} for details.
	 *                               Not all args are documented here, but it's fine to pass
	 *                               in the others. Such as `$flags` and `$offset`.
	 *
	 * @return int|false Same as {@see preg_match()}.
	 */
	public static function preg_match_in(
		/* object|array */ $patterns,
		string $str,
		/* array|null */ ?array &$matches = null,
		...$args // e.g., $flags, $offset, etc.
	) /* : int|false */ {
		assert( U\Ctn::is( $patterns ) );

		foreach ( $patterns as $_pattern ) {
			if ( $_preg_match = preg_match( $_pattern, $str, $matches, ...$args ) ) {
				return $_preg_match; // Number of matches.
			}
		}
		return 0; // No match.
	}
}
