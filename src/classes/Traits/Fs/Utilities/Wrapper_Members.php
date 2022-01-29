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
namespace Clever_Canyon\Utilities\Traits\Fs\Utilities;

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
 * @see   U\Fs
 */
trait Wrapper_Members {
	/**
	 * Checks if path may have wrappers.
	 *
	 * @since 2021-12-30
	 *
	 * @param string $path Path to check.
	 * @param array  $_d   Internal use only — do not pass.
	 *
	 * @return bool True if path may have wrappers.
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::may_have_wrappers()
	 */
	public static function may_have_wrappers( string $path, array $_d = [] ) : bool {
		if ( empty( $_d[ 'skip:str_replace' ] ) ) {
			$path = str_replace( '\\', '/', $path );
		}
		return false !== mb_strpos( $path, ':' ) || '//' === mb_substr( $path, 0, 2 );
	}

	/**
	 * Gets a path's wrappers.
	 *
	 * This function is not URL scheme-safe. That's another set of concerns.
	 * Therefore, don't use with `http://`, `data://` or other remote protocols.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $path     Path to parse.
	 *
	 * @param string $rtn_type Return type. Default is ``, indicating string.
	 *                         Set to `array` to return an array of all wrappers.
	 *                         Setting this to anything other than `array` returns a string.
	 *
	 * @param array  $_d       Internal use only — do not pass.
	 *
	 * @return string|array Wrappers. Empty string|array = no wrappers.
	 *
	 * @see   U\Fs::normalize()
	 * @see   U\Fs::split_wrappers()
	 *
	 * @see   https://regex101.com/r/elgxgZ/8
	 * @see   https://www.php.net/manual/en/wrappers.php
	 *
	 * @see   https://o5p.me/PnKPmm
	 * @see   https://o5p.me/llPqdv
	 * @see   https://o5p.me/z52z8j
	 * @see   https://stackoverflow.com/a/21194605/1219741
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::wrappers()
	 */
	public static function wrappers( string $path, string $rtn_type = '', array $_d = [] ) /* : string|array */ {
		if ( empty( $_d[ 'bypass:may_have_wrappers' ] ) && false === U\Fs::may_have_wrappers( $path ) ) {
			return 'array' === $rtn_type ? [] : '';
		}
		if ( empty( $_d[ 'bypass:normalize' ] ) ) {
			$path = U\Fs::normalize( $path );
		}
		if ( preg_match( U\Fs::$path_wrappers_regexp, $path, $_m ) ) {
			return 'array' === $rtn_type ? U\Fs::split_wrappers( $_m[ 0 ] ) : $_m[ 0 ];
		}
		return 'array' === $rtn_type ? [] : '';
	}

	/**
	 * Splits a string of wrappers into an array.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $wrappers String of wrappers from {@see U\Fs::wrappers()}.
	 *
	 * @return array An array of all wrappers, in sequence.
	 *
	 * @see   U\Fs::wrappers()
	 * @see   U\Fs::normalize()
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::split_wrappers()
	 */
	public static function split_wrappers( string $wrappers ) : array {
		return preg_split( U\Fs::$path_wrappers_split_regexp, $wrappers, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE );
	}
}
