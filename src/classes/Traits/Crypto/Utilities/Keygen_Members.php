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
namespace Clever_Canyon\Utilities\Traits\Crypto\Utilities;

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
 * @see   U\Crypto
 */
trait Keygen_Members {
	/**
	 * Random key generator.
	 *
	 * @since 2021-12-15
	 *
	 * @param int  $bytes                   Byte length. Default is `32`.
	 * @param bool $url_safe                Default is `false`. If `true`, only URL-safe characters are used.
	 *
	 * @param bool $include_numbers         Default is `true`. If `false`, numeric characters are not used.
	 * @param bool $include_lowercase       Default is `true`. If `false`, lowercase characters are not used.
	 * @param bool $include_uppercase       Default is `true`. If `false`, uppercase characters are not used.
	 * @param bool $include_symbols         Default is `true`. If `false`, symbols are not used.
	 *
	 * @param bool $exclude_similar_chars   Default is `true`. `iIlL|1oO0` characters are not used (too similar).
	 * @param bool $exclude_ambiguous_chars Default is `true`. `$`~()[]{}<>\/.,;:'"` characters are not used (ambiguous).
	 *
	 * @throws U\Fatal_Exception If parameters exclude everything there is nothing to randomize.
	 *
	 * @return string Random key at requested length.
	 */
	public static function keygen(
		int $bytes = 32,
		bool $url_safe = false,
		bool $include_numbers = true,
		bool $include_lowercase = true,
		bool $include_uppercase = true,
		bool $include_symbols = true,
		bool $exclude_similar_chars = true,
		bool $exclude_ambiguous_chars = true
	) : string {
		$bytes    = max( 0, $bytes );
		$sb_chars = ''; // Initialize.

		if ( $include_numbers ) {
			$sb_chars .= '0123456789';
		}
		if ( $include_lowercase ) {
			$sb_chars .= 'abcdefghijklmnopqrstuvwxyz';
		}
		if ( $include_uppercase ) {
			$sb_chars .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		}
		if ( $include_symbols ) {
			$sb_chars .= '`~!@#$%^&*+-=_()[]{}<>|\\/?.,;:\'"';
		}
		if ( $exclude_similar_chars ) {
			$sb_chars = str_replace( [ 'i', 'I', 'l', 'L', '|', '1', 'o', 'O', '0' ], '', $sb_chars );
		}
		if ( $exclude_ambiguous_chars ) {
			$sb_chars = str_replace( [ '$', '`', '~', '(', ')', '[', ']', '{', '}', '<', '>', '\\', '/', '.', ',', ';', ':', "'", '"' ], '', $sb_chars );
		}
		if ( $url_safe ) {
			$sb_chars = preg_replace( '/[^a-z0-9.~_\-]/ui', '', $sb_chars );
		}
		$sb_chars_length = strlen( $sb_chars );

		if ( $sb_chars_length <= 1 ) {
			throw new U\Fatal_Exception( 'Everything excluded. Nothing to randomize.' );
		}
		try { // Catch issues with {@see random_int()}.
			for ( $key = '', $_i = 0; $_i < $bytes; ++$_i ) {
				$key .= substr( $sb_chars, random_int( 0, $sb_chars_length - 1 ), 1 );
			}
		} catch ( \Throwable $throwable ) {
			$fn_rand = U\Env::is_wordpress()
				? 'wp_rand' // {@see https://developer.wordpress.org/reference/functions/wp_rand/}.
				: 'mt_rand'; // {@see https://www.php.net/manual/en/function.mt-rand.php}.

			for ( $key = '', $_i = 0; $_i < $bytes; ++$_i ) {
				$key .= substr( $sb_chars, $fn_rand( 0, $sb_chars_length - 1 ), 1 );
			}
		}
		return $key;
	}
}
