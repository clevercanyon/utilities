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
namespace Clever_Canyon\Utilities\Traits\Env\Utilities;

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
 * @see   U\Env
 */
trait Charset_Members {
	/**
	 * Current charset is `utf-8`?
	 *
	 * @since 2022-01-20
	 *
	 * @return bool True if current charset is `utf-8`.
	 */
	public static function is_charset_utf8() : bool {
		return 'utf-8' === U\Env::charset();
	}

	/**
	 * Gets environment charset code.
	 *
	 * @since 2022-01-20
	 *
	 * @return string Current charset code.
	 *
	 * @see   https://o5p.me/kdiIi5
	 * @see   https://www.php.net/manual/en/ini.core.php#ini.default-charset
	 *
	 * @note  In WordPress, {@see mb_internal_encoding()} is set to the `blog_charset` option value.
	 *        That option value defaults to `utf-8`, but it could potentially be set to something other than `utf-8`.
	 *
	 * @note  WordPress doesn't alter `default_charset`. Rather, it takes the approach of using {@see mb_internal_encoding()}.
	 *        Then it uses the `mb_*` functions w/o specifying a charset, since it has already defined an internal encoding.
	 *
	 * @note  In the case of {@see htmlentities()}, {@see htmlspecialchars()}, and {@see html_entity_decode()};
	 *        WordPress passes the charset explictly. It has to, given that it doesn't modify the `default_charset` value.
	 *
	 * @note  Conclusions and guidance based on the above and other research:
	 *
	 *        - In a WordPress environment it is safe to use `mb_*` functions w/o explicitly defining a charset.
	 *        - In a WordPress environment, {@see htmlentities()}, {@see htmlspecialchars()}, and {@see html_entity_decode()};
	 *          must be explicitly told which charset to use for encoding, given that it doesn't modify the `default_charset` value.
	 *            - WordPress does. This codebase must do the same!
	 *
	 *        - Outside of WordPress, PHP's default behavior is to use `default_charset` for all `mb_*` and `html*` functions.
	 *          Thus, outside of WordPress it is generally safe to use `mb_*` and `html*` functions w/o explicitly defining a charset.
	 *
	 *        - If a charset is explicitly defined anywhere, it should be taken from the `blog_charset` option in a WordPress environment.
	 *          Or, from some other application-level config. Otherwise, use `default_charset`, or whatever is required in a specific case.
	 *
	 *        - It is not safe to assume that `utf-8` is the charset this codebase is working in.
	 *          If a string manipulation function must work with `utf-8`, or would like to inject `utf-8`,
	 *          then it must first look at the current charset by reading this function's return value.
	 */
	public static function charset() : string {
		$is_wordpress = U\Env::is_wordpress();

		$charset = $is_wordpress ? get_option( 'blog_charset' ) : ini_get( 'default_charset' );
		$charset = $is_wordpress && ( 'utf8' === $charset || 'UTF8' === $charset ) ? 'utf-8' : $charset;
		$charset = mb_strtolower( (string) $charset ?: 'utf-8' );

		return $charset;
	}
}
