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
namespace Clever_Canyon\Utilities\Traits\File\Utilities;

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
 * @see   U\File
 */
trait Content_Type_Members {
	/**
	 * Gets a file's MIME type + charset, suitable for `content-type:` header.
	 *
	 * @since 2022-01-19
	 *
	 * @param string      $file    File path.
	 * @param string|null $default {@see U\File::mime_type()} for details.
	 *
	 * @param string|null $charset Optional charset code to use in `content-type` header. Default is `null`.
	 *
	 *                             * If `null` (default), charset applies only to text/, +xml, JS/JSON, and a few others;
	 *                               using the current environment charset code returned by {@see U\Env::charset()}.
	 *
	 *                             * You should generally pass this explicitly based on what is being served to a user,
	 *                               and based on the charset used by the file. The current charset may or may not be accurate.
	 *
	 *                             * To explicitly force no charset to be added, set this to an empty string.
	 *
	 * @return string MIME type + charset; suitable for `content-type:` header.
	 */
	public static function content_type( string $file, /* string|null */ ?string $default = null, /* string|null */ ?string $charset = null ) : string {
		$charset      ??= null; // See below.
		$content_type = U\File::mime_type( $file, $default );

		if ( null !== $charset ) {
			if ( '' !== $charset ) {
				$content_type .= '; charset=' . $charset;
			} // Empty indicates no charset explicitly.

		} elseif ( $charset = U\File::content_type_charset( $content_type ) ) {
			$content_type .= '; charset=' . $charset;
		}
		return $content_type;
	}

	/**
	 * Gets charset for a given MIME content type.
	 *
	 * @since 2022-04-17
	 *
	 * @param string $content_type MIME content type.
	 *
	 * @return string Charset for MIME content type; else empty string.
	 */
	public static function content_type_charset( string $content_type ) : string {
		if ( ! $content_type ) {
			return ''; // Not applicable.
		}
		switch ( true ) {
			case ( 'application/hta' === $content_type ):
			case ( 'application/xml-dtd' === $content_type ):
			case ( 'application/json' === $content_type ):
			case ( 'application/javascript' === $content_type ):
			case ( 'application/x-php-source' === $content_type ):
			case ( 'application/php-archive' === $content_type ):
			case ( U\Str::begins_with( $content_type, 'text/' ) ):
			case ( U\Str::ends_with( $content_type, '+xml' ) ):
			case ( U\Str::ends_with( $content_type, '+json' ) ):
				return U\Env::charset();
		}
		return '';
	}
}
