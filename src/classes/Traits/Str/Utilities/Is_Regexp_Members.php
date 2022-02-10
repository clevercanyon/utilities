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
trait Is_Regexp_Members {
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
}
