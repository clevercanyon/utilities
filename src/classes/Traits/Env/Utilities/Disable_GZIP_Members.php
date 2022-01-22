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
trait Disable_GZIP_Members {
	/**
	 * Disables GZIP compression.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if GZIP disabled successfully.
	 *
	 * @note  You may need to set `content-encoding`, `transfer-encoding`, or `content-transfer-encoding`
	 *        headers after calling this method. They are all forced to default values here.
	 *
	 * @see   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
	 * @see   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding
	 * @see   https://www.w3.org/Protocols/rfc1341/5_Content-Transfer-Encoding.html
	 *
	 * @see   https://stackoverflow.com/a/11664307/1219741
	 * @see   https://www.php.net/manual/en/function.headers-sent.php
	 * @see   https://www.php.net/manual/en/function.apache-setenv.php
	 * @see   https://www.php.net/manual/en/zlib.configuration.php#ini.zlib.output-compression
	 */
	public static function disable_gzip() : bool {
		$apache_setenv_response = null;
		$set_headers            = null;

		if ( ! headers_sent() ) {
			$set_headers // If all of these are true.
				= 'nill' !== header( 'content-encoding: none' )
				&& 'nill' !== header( 'transfer-encoding: binary' )
				&& 'nill' !== header( 'content-transfer-encoding: binary' )
				// This also requires that headers not be sent yet, else it triggers a warning.
				&& false !== ini_set( 'zlib.output_compression', 'off' ); // phpcs:ignore.
		}
		if ( U\Env::can_use_function( 'apache_setenv' ) ) {
			/** @noinspection PhpUndefinedFunctionInspection */        // phpcs:ignore.
			$apache_setenv_response = apache_setenv( 'no-gzip', '1' ); // phpcs:ignore.
		}
		return $set_headers && false !== $apache_setenv_response;
	}
}
