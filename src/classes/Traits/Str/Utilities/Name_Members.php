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
trait Name_Members {
	/**
	 * Checks name validity; e.g., `My Name`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to check.
	 *
	 * @param string $prefix Require it to have a prefix?
	 *                       Default is ``, no required prefix.
	 *
	 * @return bool True if it's a valid name.
	 */
	public static function is_name( string $str, string $prefix = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 128, '/^.+$/ui', $prefix );
	}

	/**
	 * Converts string to name.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to convert to name.
	 *
	 * @return string String converted to name.
	 *
	 * @see   U\Str::to_slug()
	 * @see   U\Str::to_var()
	 */
	public static function to_name( string $str ) : string {
		if ( '' === $str ) {
			return $str; // Don't modify.
		}
		$name = $str; // Working copy.

		$name = U\Str::strip_clean_name_helper( $name );
		$name = preg_replace( '/[^\p{L}\p{N}]+/u', ' ', $name );
		$name = U\Str::uc_words( $name );
		$name = trim( $name );

		return $name;
	}

	/**
	 * Strips name encapsulation, prefixes, and suffixes.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $name Name to strip clean.
	 *
	 * @return string Name w/o encapsulation, prefixes, or suffixes.
	 */
	protected static function strip_clean_name_helper( string $name ) : string {
		$name = trim( $name, U\Str::TRIM_CHARS . '"' . "'" );
		$name = preg_replace( '/^(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?)\s+/ui', '', $name );
		$name = preg_replace( '/\s+(?:Sr\.?|Jr\.?|IV|I{2,})$/ui', '', $name );
		$name = preg_replace( '/\s+/u', ' ', $name );
		return $name; // Clean name.
	}
}
