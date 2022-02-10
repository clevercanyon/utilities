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
namespace Clever_Canyon\Utilities\Traits\Pkg\Utilities;

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
 * @see   U\Pkg
 */
trait Formatting_Members {
	/**
	 * Formats package strings.
	 *
	 * @since 2022-01-30
	 *
	 * @param string $str    String to format.
	 * @param string $format One of: `sha1`, `x_sha`, `slug`, `var`.
	 *
	 * @return string String with desired formatting applied.
	 *
	 * @throws U\Fatal_Exception If `$format` is an unexpected value.
	 */
	protected static function format_str_helper( string $str, string $format ) : string {
		if ( '' === $str ) {
			return ''; // Not applicable.
		}
		switch ( $format ) {
			case 'sha1':
				return sha1( mb_strtolower( $str ) );

			case 'x_sha':
				return U\Crypto::x_sha( mb_strtolower( $str ) );

			case 'fsc':
				return U\Str::to_fsc( $str );

			case 'slug':
				return U\Str::to_slug( $str );

			case 'var':
				return U\Str::to_var( $str );

			default: // Trigger fatal exception.
				throw new U\Fatal_Exception( 'Unexpected format: `' . $format . '`.' );
		}
	}
}
