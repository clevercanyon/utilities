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
trait Apache_Members {
	/**
	 * Is Apache?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if server is Apache.
	 */
	public static function is_apache() : bool {
		static $is; // Memoize.

		if ( null !== $is ) {
			return $is; // Saves time.
		}
		return $is = false !== mb_stripos( U\Env::server_api(), 'apache' )
			|| false !== mb_stripos( U\Env::var( 'SERVER_SOFTWARE' ), 'apache' );
	}

	/**
	 * Attempts to get Apache web server version.
	 *
	 * @since        2021-12-18
	 *
	 * @return string Apache web server version; else empty string.
	 *
	 * @see          https://o5p.me/AZBIIJ
	 *
	 * @noinspection PhpUndefinedFunctionInspection
	 */
	public static function apache_version() : string {
		static $version; // Memoize.

		if ( null !== $version ) {
			return $version; // Saves time.
		}
		/**
		 * Environment variable.
		 *
		 * - Confirmed working with Apache v2.4.46; Apache API version 20120211; PHP version 7.4.12; on 2022-02-02.
		 *   - It was tested with the `apache2handler` PHP SAPI and Apache server tokens were exposing the version.
		 *   - Also tested with the CGI/FastCGI PHP SAPI and Apache server tokens were exposing the version.
		 */
		$server_software = U\Env::var( 'SERVER_SOFTWARE' );
		preg_match( '/^Apache\/([0-9][0-9a-z._\-]*)/ui', $server_software, $_m );
		$version = trim( $_m[ 1 ] ?? '', '._-' ); // Version string.

		if ( ! $version && U\Env::can_use_function( 'apache_get_version' ) ) {
			/**
			 * Using {@see apache_get_version()} function.
			 *
			 * This function gets basically the exact same thing as `SERVER_SOFTWARE`.
			 * It is not clear if this function returns all server tokens, regardless of configuration,
			 * or if it always returns the very same thing as `SERVER_SOFTWARE` — I think it does.
			 *
			 * - Confirmed working with Apache v2.4.46; Apache API version 20120211; PHP version 7.4.12; on 2022-02-02.
			 *   - It was tested with the `apache2handler` PHP SAPI and Apache server tokens were exposing the version.
			 *   - *Not* working with the CGI/FastCGI PHP SAPI. The function is only available in the `apache2handler`;
			 *     i.e., when Apache runs PHP as a module and the two are fully integrated with each other.
			 */
			$server_software = trim( (string) apache_get_version() );
			preg_match( '/^Apache\/([0-9][0-9a-z._\-]*)/ui', $server_software, $_m );
			$version = trim( $_m[ 1 ] ?? '', '._-' ); // Version string.
		}
		return $version;
	}

	/**
	 * Gets Apache request header names.
	 *
	 * @since 2022-02-26
	 *
	 * @return string Apache request header names.
	 */
	public static function apache_conf_request_header_names() : string {
		return implode( ', ', U\HTTP::REQUEST_HEADER_NAMES );
	}

	/**
	 * Gets Apache response header names.
	 *
	 * @since 2022-02-26
	 *
	 * @return string Apache response header names.
	 */
	public static function apache_conf_response_header_names() : string {
		return implode( ', ', U\HTTP::RESPONSE_HEADER_NAMES );
	}

	/**
	 * Gets Apache static file extensions.
	 *
	 * @since 2022-02-26
	 *
	 * @return string Apache static file extensions.
	 */
	public static function apache_conf_static_exts() : string {
		return implode( '|', U\File::static_exts() );
	}

	/**
	 * Gets Apache encodings.
	 *
	 * @since 2022-02-26
	 *
	 * @return string Apache encodings.
	 */
	public static function apache_conf_encodings() : string {
		return implode( "\n", [
			'AddEncoding gzip .gz .tgz .svgz',
		] );
	}

	/**
	 * Gets Apache charsets.
	 *
	 * @since 2022-02-26
	 *
	 * @return string Apache charsets.
	 */
	public static function apache_conf_charsets() : string {
		$charsets          = ''; // Initialize.
		$exts_by_mime_type = []; // Initialize.
		$static_utf8_exts  = []; // Initialize.

		foreach ( U\File::MIME_TYPES as $_mime_types ) {
			foreach ( $_mime_types as $_exts => $_mime_type ) {
				$_exts                            = explode( '|', $_exts );
				$exts_by_mime_type[ $_mime_type ] = array_merge( $exts_by_mime_type[ $_mime_type ] ?? [], $_exts );
			}
		}
		foreach ( $exts_by_mime_type as $_mime_type => $_exts ) {
			if ( 'utf-8' === U\File::content_type_charset( $_mime_type ) ) {
				$static_utf8_exts = array_merge( $static_utf8_exts, $_exts );
			}
		}
		$static_utf8_exts = array_unique( array_diff( $static_utf8_exts, U\File::dynamic_exts() ) );
		$static_utf8_exts = U\Arr::sort_by( 'value', $static_utf8_exts );

		foreach ( array_chunk( $static_utf8_exts, 18 ) as $_exts ) {
			$charsets .= $charsets ? "\t" : 'AddCharset utf-8 ';
			$charsets .= '.' . implode( ' .', $_exts ) . ' \\' . "\n";
		}
		return rtrim( $charsets, U\Str::TRIM_CHARS . '\\' );
	}

	/**
	 * Gets Apache MIME types.
	 *
	 * @since 2022-02-26
	 *
	 * @return string Apache MIME types.
	 */
	public static function apache_conf_mime_types() : string {
		$exts_by_mime_type   = []; // Initialize.
		$mime_types          = []; // Initialize.
		$max_mime_type_chars = 0;  // Initialize.

		foreach ( U\File::MIME_TYPES as $_mime_types ) {
			foreach ( $_mime_types as $_exts => $_mime_type ) {
				$_exts                            = explode( '|', $_exts );
				$exts_by_mime_type[ $_mime_type ] = array_merge( $exts_by_mime_type[ $_mime_type ] ?? [], $_exts );
			}
		}
		$exts_by_mime_type = U\Arr::sort_by( 'key', $exts_by_mime_type );

		foreach ( $exts_by_mime_type as $_mime_type => $_exts ) {
			$max_mime_type_chars = max( $max_mime_type_chars, mb_strlen( 'AddType ' . $_mime_type ) );
		}
		foreach ( $exts_by_mime_type as $_mime_type => $_exts ) {
			$_mime_type_chars = mb_strlen( 'AddType ' . $_mime_type );
			$_spaces          = str_repeat( ' ', $max_mime_type_chars - $_mime_type_chars + 1 );

			$_exts        = array_unique( U\Arr::sort_by( 'value', $_exts ) );
			$mime_types[] = 'AddType ' . $_mime_type . $_spaces . '.' . implode( ' .', $_exts );
		}
		return implode( "\n", $mime_types );
	}

	/**
	 * Gets Apache deflate MIME types.
	 *
	 * @since 2022-02-26
	 *
	 * @return string Apache deflate MIME types.
	 */
	public static function apache_conf_deflate_mime_types() : string {
		return implode( "\n", [
			'AddOutputFilterByType DEFLATE text/plain text/html text/xml',
			'AddOutputFilterByType DEFLATE application/rss+xml application/atom+xml',
			'AddOutputFilterByType DEFLATE application/xsd+xml application/xslt+xml',
			'AddOutputFilterByType DEFLATE application/xml-dtd application/xhtml+xml',
			'AddOutputFilterByType DEFLATE application/rdf+xml application/ttaf+xml application/vnd.google-earth.kml+xml',
			'AddOutputFilterByType DEFLATE application/x-font-otf application/x-font-ttf application/vnd.ms-fontobject',
			'AddOutputFilterByType DEFLATE text/css application/javascript application/json application/ld+json',
			'AddOutputFilterByType DEFLATE application/php-archive application/x-php-source',
			'AddOutputFilterByType DEFLATE text/csv text/tab-separated-values',
			'AddOutputFilterByType DEFLATE text/x-component application/hta',
			'AddOutputFilterByType DEFLATE image/x-icon image/svg+xml',
		] );
	}
}
