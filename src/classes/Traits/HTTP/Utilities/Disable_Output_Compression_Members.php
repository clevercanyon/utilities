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
namespace Clever_Canyon\Utilities\Traits\HTTP\Utilities;

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
 * @see   U\HTTP
 */
trait Disable_Output_Compression_Members {
	/**
	 * Disables output compression.
	 *
	 * You may need to set `transfer-encoding` or `content-transfer-encoding`
	 * headers after calling this method. They are forced to default values here.
	 *
	 * We recommend setting `cache-control` headers before calling this function.
	 * If you do, it will add the `no-transform` piece for you, which covers CDNs like Cloudflare.
	 * If you don't, then be sure to do that yourself whenever you set `cache-control` headers.
	 *
	 * Note that {@apache_setenv()} is only possible with `mod_php` and there is no equivalent for
	 * Apache otherwise, or for LiteSpeed, or Nginx either. A workaround for Apache (outside of `mod_php`)
	 * is to set `content-encoding: none`; {@see https://o5p.me/NInqKw}.
	 *
	 * For LiteSpeed and Nginx we can disable output compression at the server level by setting
	 * `content-encoding: identity`, which is an RFC standard that means no compression explicitly.
	 * {@see https://o5p.me/sJbl15} for further details. I've confirmed working on LiteSpeed.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if output compression disabled successfully.
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
	public static function disable_output_compression() : bool {
		if ( headers_sent() ) {
			return false; // Not possible.
		}

		/**
		 * Sets headers.
		 *
		 * @since 2022-04-15
		 *
		 * @return bool `true` on success.
		 */
		$set_headers = function () : bool {
			if ( U\Env::is_apache() ) {
				header( 'content-encoding: none' );
			} else { // Nginx, LiteSpeed, others.
				header( 'content-encoding: identity' );
			}
			header( 'transfer-encoding: binary' );
			header( 'content-transfer-encoding: binary' );

			if ( ! $existing_cache_control_header = U\HTTP::response_header( 'cache-control' ) ) {
				header( 'cache-control: no-transform' );
			} elseif ( false === mb_stripos( $existing_cache_control_header, 'no-transform' ) ) {
				header( 'cache-control: ' . $existing_cache_control_header . ', no-transform' );
			}
			return true; // Always true if we get this far.
		};

		/**
		 * Configures server.
		 *
		 * @since 2022-04-15
		 *
		 * @return bool `true` on success.
		 */
		$configure_server = function () : bool {
			$did_apache_setenv_no_gzip   = null;
			$did_apache_setenv_no_brotli = null;

			$did_zlib_output_compression_off = U\Env::can_use_function( 'ini_set' )
				&& false !== ini_set( 'zlib.output_compression', 'off' ); // phpcs:ignore.

			if ( U\Env::is_apache() && U\Env::can_use_function( 'apache_setenv' ) ) {
				/** @noinspection PhpUndefinedFunctionInspection */              // phpcs:ignore.
				$did_apache_setenv_no_gzip = apache_setenv( 'no-gzip', '1' );    // phpcs:ignore.

				/** @noinspection PhpUndefinedFunctionInspection */               // phpcs:ignore.
				$did_apache_setenv_no_brotli = apache_setenv( 'no-brotli', '1' ); // phpcs:ignore.
			}
			return $did_zlib_output_compression_off
				&& false !== $did_apache_setenv_no_gzip
				&& false !== $did_apache_setenv_no_brotli;
		};

		$did_set_headers      = $set_headers();
		$did_configure_server = $configure_server();
		$did_set_static_var   = null !== U\Env::static_var( 'C10N_HTTP_OUTPUT_COMPRESSION', false );

		return $did_set_headers
			&& $did_configure_server
			&& $did_set_static_var;
	}
}
