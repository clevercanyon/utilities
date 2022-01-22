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
 * String utilities.
 *
 * @since 2021-12-15
 */
final class Str extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Str\Members;

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
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, U\Env::charset(), false );
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
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, U\Env::charset(), false );
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
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, U\Env::charset(), false );
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
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, U\Env::charset(), true );
	}

	/**
	 * Escapes a string for use as a shell argument.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @throws U\Fatal_Exception If {@see escapeshellarg()} is not available.
	 * @return string Escaped string. It's actually an escaped and `'single-quoted'` string.
	 *
	 * @note  On Windows, {@see escapeshellarg()} instead replaces percent signs, exclamation marks (delayed variable substitution)
	 *        and double quotes with spaces; and adds double quotes around the string. Furthermore, each streak of
	 *        consecutive backslashes (\) is escaped by one additional backslash.
	 */
	public static function esc_shell_arg( string $str ) : string {
		if ( ! U\Env::can_use_function( 'escapeshellarg' ) ) {
			throw new U\Fatal_Exception( 'Unable to use PHP’s `escapeshellarg()` function. Disabled?' );
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
	 * Normalizes IPv4 and IPv6 addresses.
	 *
	 * @since 2022-01-21
	 *
	 * @param string $ip IPv4 or IPv6 address.
	 *
	 * @return string Normalized IPv4 or IPv6 address.
	 */
	public static function normalize_ip( string $ip ) : string {
		if ( '' === $ip ) {
			return ''; // Nothing.
		}
		$bin = inet_pton( $ip );
		$ip  = false !== $bin ? inet_ntop( $bin ) : '';
		$ip  = '' !== $ip ? mb_strtolower( $ip ) : '';

		return $ip;
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
		return preg_replace( "/\n{3,}/u", "\n\n", $str );
	}

	/**
	 * Converts to ASCII-range equivalents (`intl` extension required).
	 *
	 * @since        2022-01-08
	 *
	 * @param string $str Input string.
	 *
	 * @throws U\Fatal_Exception If missing `intl` extension.
	 * @return string|false ASCII-range string, else `false` on failure.
	 *
	 * @see          https://www.php.net/manual/en/transliterator.transliterate.php
	 * @see          https://unicode-org.github.io/icu/userguide/transforms/general/
	 *
	 * @note         From the docs on `Any-Latin; Latin-ASCII`. Here are the relevant details.
	 *               `Latin-ASCII` converts non-ASCII-range punctuation, symbols, and letters to an approximate ASCII-range equiv.
	 *               For example: © → ‘(C)’, Æ → AE. When combined with `Any-Latin` you get a transform that converts as
	 *               much as possible to an ASCII-range representation; i.e., `Any-Latin; Latin-ASCII`.
	 *
	 * @noinspection PhpComposerExtensionStubsInspection
	 */
	public static function to_ascii_er( string $str ) /* : string|false */ {
		if ( ! U\Env::can_use_extension( 'intl' ) ) {
			throw new U\Fatal_Exception( 'Missing PHP `intl` extension.' );
		}
		return transliterator_transliterate( 'Any-Latin; Latin-ASCII', $str );
	}

	/**
	 * Is valid UTF-8?
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str Input string.
	 *
	 * @return bool True if valid UTF-8.
	 */
	public static function is_utf8( string $str ) : bool {
		if ( ! isset( $str[ 0 ] ) ) {
			return true; // Nothing to do.
		}
		return (bool) preg_match( '/^./us', $str );
	}

	/**
	 * Checks regular expression validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 *
	 * @param bool   $rtn_delimiter Return delimiter when valid? Default is `false`.
	 *                              If `true`, and it's a valid regeular expression, the delimiter
	 *                              is returned in string format; changing this function's return type.
	 *
	 * @return bool|string True if it's a valid regular expression.
	 *                     Valid delimiters are: `/`, `~`, `@`, `;`, `%`, '`', `#`,
	 *                     which is what {@see https://regex101.com} suggests.
	 */
	public static function is_regexp( string $str, bool $rtn_delimiter = false ) /* : bool|string */ {
		preg_match( '/^([\/~@;%`#]).*\\1[a-z]*$/ui', $str, $m );
		return ! empty( $m[ 1 ] ) ? ( $rtn_delimiter ? $m[ 1 ] : true ) : false;
	}

	/**
	 * Checks hostname validity; e.g., `127.0.0.1`, `localhost`, `example.com`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid hostname.
	 *
	 * @see   https://o5p.me/d3ayZ8
	 * @note  See also the tests for function.
	 *
	 * @note  A trailing dot is allowed. Recommend trimming.
	 * @note  Max length of each dotted label is `63` bytes.
	 * @note  Max overall length is 253 bytes, not counting final `.`, which is optional.
	 */
	public static function is_hostname( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_DOMAIN, [ 'flags' => FILTER_FLAG_HOSTNAME ] );
	}

	/**
	 * Checks URL validity; e.g., `https://example.com`, `https://[::ffff:2d4f:713]`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid URL containing scheme & hostname.
	 *
	 * @see   https://o5p.me/kEENZa
	 * @note  See also the tests for function.
	 *
	 * @see   U\Str::is_hostname() for inherited validations for hostname.
	 * @note  Additional schemes are allowed and some do not require a hostname;
	 *        e.g., `mailto:`, `news:`, `file:`.
	 */
	public static function is_url( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_URL );
	}

	/**
	 * Checks URL validity; e.g., `https://example.com/?v=1`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid URL containing scheme, hostname, and query.
	 *              {@see U\Str::is_url()} for inherited validations.
	 *
	 * @see   https://o5p.me/kEENZa
	 * @note  See also the tests for function.
	 *
	 * @see   U\Str::is_url() for inherited validations.
	 * @note  Query string must come before an optional `#fragment`.
	 */
	public static function is_url_query( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_URL, [ 'flags' => FILTER_FLAG_QUERY_REQUIRED ] );
	}

	/**
	 * Checks email validity; e.g., `user@example.com`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid email address.
	 *
	 * @see   https://o5p.me/cZpuIh
	 * @note  See also the tests for function.
	 *
	 * @note  Maximum length is 320 characters, not bytes.
	 * @note  A trailing dot is not allowed in email address hostnames.
	 * @note  A user@local address is not allowed by this validator.
	 */
	public static function is_email( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_EMAIL, [ 'flags' => FILTER_FLAG_EMAIL_UNICODE ] );
	}

	/**
	 * Checks MAC address validity; e.g., `00:0C:F1:56:98:AD`.
	 * Also in these formats: `00-0C-F1-56-98-AD`, `000C.F156.98AD`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid MAC address.
	 *
	 * @see   https://o5p.me/q7tGiP
	 * @note  See also the tests for function.
	 */
	public static function is_mac( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_MAC );
	}

	/**
	 * Checks IP address validity; e.g., `127.0.0.1`, `45.79.7.19`.
	 * Or IPv6; e.g., `::1`, `::ffff:2d4f:713`, `0:0:0:0:0:ffff:2d4f:0713`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid IP address.
	 *
	 * @see   https://o5p.me/9JSgKk
	 * @note  See also the tests for function.
	 */
	public static function is_ip( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP );
	}

	/**
	 * Checks IPv4 address validity; e.g., `127.0.0.1`, `45.79.7.19`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid IPv4 address.
	 *
	 * @see   https://o5p.me/yxPYQG
	 * @note  See also the tests for function.
	 */
	public static function is_ipv4( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_IPV4 ] );
	}

	/**
	 * Checks IPv6 address validity; e.g., `::1`, `::ffff:2d4f:713`, `0:0:0:0:0:ffff:2d4f:0713`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid IPv6 address.
	 *
	 * @see   https://o5p.me/XsExYc
	 * @note  See also the tests for function.
	 */
	public static function is_ipv6( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_IPV6 ] );
	}

	/**
	 * Checks public IP address validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid public IP address.
	 *
	 * @see   https://o5p.me/9JSgKk
	 * @note  See also the tests for function.
	 */
	public static function is_public_ip( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_NO_PRIV_RANGE ] );
	}

	/**
	 * Checks user/public IP address validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid user/public IP address.
	 *
	 * @see   https://o5p.me/9JSgKk
	 * @note  See also the tests for function.
	 */
	public static function is_user_public_ip( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ] );
	}

	/**
	 * Checks private IP address validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid private IP address.
	 *
	 * @see   https://o5p.me/9JSgKk
	 * @note  See also the tests for function.
	 */
	public static function is_private_ip( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP )
			&& false === filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_NO_PRIV_RANGE ] );
	}

	/**
	 * Checks reserved IP address validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid reserved IP address.
	 *
	 * @see   https://o5p.me/9JSgKk
	 * @note  See also the tests for function.
	 */
	public static function is_reserved_ip( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP )
			&& false === filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_NO_RES_RANGE ] );
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
		return U\Str::is_valid_helper( $str, 2, 128, '/^.+$/ui', $prefix );
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
		return U\Str::is_valid_helper( $str, 2, 128, '/^[a-z](?:-{0,2}[a-z0-9])+$/u', $prefix );
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
		return U\Str::is_valid_helper( $str, 2, 128, '/^[a-z](?:_{0,2}[a-z0-9])+$/u', $prefix );
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
		return U\Str::is_valid_helper( $str, 1, 100, '/^[0-9]+(?:\.[0-9]+)*(?:\.(?:dev|alpha|beta|rc)\.[0-9](?:\.[0-9]+)*)?$/u' );
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
	protected static function is_valid_helper(
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
	 * @throws U\Exception {@see replace()}.
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
	 * @throws U\Exception When `$replace` is passed as an array, but `$search` is passed as a string. Makes no sense.
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
			throw new U\Exception( '`$limit` must be `-1`, or >= `1`.' );
		}
		if ( $replace_is_array && ! $search_is_array ) {
			throw new U\Exception( '`$replace` must be a string when `$search` is a string.' );
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
	 * @param bool|null $pretty_print Pretty print? {@see U\Str::json_encode()} for details.
	 *
	 * @return string String representation.
	 *
	 * @note  This is NOT purely a JSON-encoder.
	 *        For example, null, scalar, and resource values are simply converted to strings.
	 *        They are not converted to JSON. Instead, {@see U\Str::json_encode()}.
	 *
	 * @see   U\Ctn::stringify()
	 */
	public static function stringify( /* mixed */ $data, /* bool|null */ ?bool $pretty_print = null ) : string {
		if ( is_null( $data ) || is_scalar( $data ) || is_resource( $data ) ) {
			return (string) $data; // Cannot be decoded as JSON.
		}
		return U\Str::json_encode( $data, $pretty_print );
	}

	/**
	 * JSON-encodes data.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed     $data         Data to JSON-encode.
	 * @param bool|null $pretty_print Pretty print? Default is `null`, which equates to `true`. Let's make JSON editing easy.
	 *                                This enables `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT`.
	 *
	 * @return string JSON-encoded string.
	 *
	 * @see   U\Str::json_decode()
	 */
	public static function json_encode( /* mixed */ $data, /* bool|null */ ?bool $pretty_print = null ) : string {
		$pretty_print ??= true; // For callers who prefer to depend on default here.
		$flags        = $pretty_print ? JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT : 0;

		if ( is_resource( $data ) ) {
			$data = (string) $data; // JSON-encoded below.
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

	/**
	 * A better {@see var_dump()}, typically for debugging.
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
	 *
	 * @note Unlike {@see var_dump()} this takes just one value to dump at a time.
	 *       i.e., Favoring configurable options over the ability to pass multiple values.
	 *       If you need to dump multiple values, recommendaton is to pass an associative array.
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
							( $show_ids ? ' #' . U\Arr::hash( $dump_value ) : '' );
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

									$_x_dump_circular_idx = U\Arr::hash( $_x_dump_value );
									$_x_dump_display_type = '(array) [${count}]' .
										( $show_ids ? ' #' . $_x_dump_circular_idx : '' );
									break;
							}
							if ( isset( $_c[ 'circular_idxs' ][ $_x_dump_circular_idx ] ) ) {
								$x_dumps[ $_x_dump_prop_key ] = str_replace( '${count}', '*', $_x_dump_display_type ) .
									' ' . $_x_dump_opening_encap . $_x_dump_closing_encap . ' *circular*';
							} else {
								$_x_dump = U\Str::dump(
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
							$x_dumps[ $_x_dump_prop_key ] = U\Str::dump(
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

			case 'real':
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
				$dump = '(resource) \\' . get_resource_type( $dump_value ) . // @future-review: {@see get_resource_id()} is PHP 8+.
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
