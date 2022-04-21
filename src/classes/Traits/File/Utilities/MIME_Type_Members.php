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
trait MIME_Type_Members {
	/**
	 * Gets all static file extensions.
	 *
	 * @since 2022-02-26
	 *
	 * @return array Static file extensions.
	 */
	public static function static_exts() : array {
		static $exts; // Memoize.

		if ( null !== $exts ) {
			return $exts; // Saves time.
		}
		$exts = []; // Initialize.

		foreach ( U\File::MIME_TYPES as $_mime_types ) {
			foreach ( $_mime_types as $_exts => $_mime_type ) {
				$exts = array_merge( $exts, explode( '|', $_exts ) );
			}
		}
		$exts = array_unique( $exts );
		$exts = array_diff( $exts, [
			'php',
			'phtm',
			'phtml',

			'shtm',
			'shtml',

			'asp',
			'aspx',

			'pl',
			'plx',
			'cgi',
			'ppl',
			'perl',
		] );
		foreach ( $exts as $_i => $_ext ) {
			if ( preg_match( '/^(?:php|[ps]?html?|aspx?|plx?|cgi|ppl|perl)(?:[.~_\-]*[0-9]+)$/u', $_ext ) ) {
				unset( $_ext[ $_i ] ); // Version suffix.
			}
		}
		return $exts = U\Arr::sort_by( 'value', $exts );
	}

	/**
	 * Gets all dynamic file extensions.
	 *
	 * @since 2022-02-26
	 *
	 * @return array Dynamic file extensions.
	 */
	public static function dynamic_exts() : array {
		static $exts; // Memoize.

		if ( null !== $exts ) {
			return $exts; // Saves time.
		}
		$exts = []; // Initialize.

		foreach ( U\File::MIME_TYPES as $_mime_types ) {
			foreach ( $_mime_types as $_exts => $_mime_type ) {
				$exts = array_merge( $exts, explode( '|', $_exts ) );
			}
		}
		$exts = array_unique( $exts );
		$exts = array_diff( $exts, U\File::static_exts() );
		return $exts = U\Arr::sort_by( 'value', $exts );
	}

	/**
	 * Gets a file's MIME type.
	 *
	 * @since 2022-01-19
	 *
	 * @param string      $file    File path.
	 * @param string|null $default Default MIME type, if unable to determine.
	 *                             Default for this is: `null`, indicating `application/octet-stream`.
	 *
	 * @return string MIME type; e.g., text/html, image/svg+xml, etc.
	 */
	public static function mime_type( string $file, /* string|null */ ?string $default = null ) : string {
		$mime_type = null; // Initialize.
		$default   ??= 'application/octet-stream';

		if ( ! $ext = U\File::ext( $file, true ) ) {
			return $default; // Not possible.
		}
		foreach ( U\File::MIME_TYPES as $_mime_types ) {
			foreach ( $_mime_types as $_exts => $_mime_type ) {
				if ( in_array( $ext, explode( '|', $_exts ), true ) ) {
					$mime_type = $_mime_type;
					break 2; // Done.
				}
			}
		}
		if ( ! $mime_type
			&& U\Env::can_use_extension( 'fileinfo' )
			&& U\Env::can_use_function( 'mime_content_type' )
		) {
			/** @noinspection PhpComposerExtensionStubsInspection */ // phpcs:ignore.
			$mime_type = @mime_content_type( $file ) ?: '';          // phpcs:ignore.
		}
		return $mime_type ?: $default;
	}
}
