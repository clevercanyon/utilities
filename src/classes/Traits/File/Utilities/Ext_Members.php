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
trait Ext_Members {
	/**
	 * Gets file extension.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $file File path.
	 *
	 * @return string File extension, else empty string.
	 */
	public static function ext( string $file ) : string {
		return mb_strtolower( mb_substr( mb_strrchr( $file, '.' ) ?: '', 1 ) );
	}

	/**
	 * Get a file's ext type; e.g., Image, Audio, Video, MS Office, etc.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $file    File path.
	 * @param string $default Default ext. type, if unable to determine.
	 *                        Default for this is: `File`.
	 *
	 * @return string File's ext type; e.g., Image, Audio, Video, MS Office, etc.
	 */
	public static function ext_type( string $file, string $default = 'File' ) : string {
		$ext_type = $default;
		$ext      = U\File::ext( $file );

		foreach ( U\File::$mime_types as $_ext_type => $_mime_types ) {
			foreach ( $_mime_types as $_exts => $_mime_type ) {
				if ( in_array( $ext, explode( '|', $_exts ), true ) ) {
					$ext_type = $_ext_type;
					break 2; // Done.
				}
			}
		}
		return $ext_type;
	}
}
