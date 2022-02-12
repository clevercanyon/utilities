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
trait Replace_Members {
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
	 * @return array|string {@see replace()}..
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
	 *
	 * This is a clone {@see str_replace()} that supports a `$limit` param.
	 * This function is caSe-sensitive. Use {@see ireplace()} for caSe-insensitive replace.
	 * This function is binary safe; i.e., multibyte-safe.
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
	 * @return string|array {@see str_replace()}. Same behavior here.
	 *
	 * @throws U\Fatal_Exception When `$replace` is passed as an array, but `$search` is passed as a string. Makes no sense.
	 *                           Throwing an exception matches the behavior of {@see str_replace()} in PHP 8.0+.
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
			throw new U\Fatal_Exception( '`$limit` must be `-1`, or >= `1`.' );
		}
		if ( $replace_is_array && ! $search_is_array ) {
			throw new U\Fatal_Exception( '`$replace` must be a string when `$search` is a string.' );
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
}
