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
namespace Clever_Canyon\Utilities\Traits\Fs\Utilities;

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
 * @see   U\Fs
 */
trait Type_Members {
	/**
	 * Gets path type.
	 *
	 * A `link` may or may not point to a location that exists.
	 * i.e., A link can exist, but be broken; {@see U\Fs::real_type()}.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path to check.
	 *
	 * @return string One of `link`, `dir`, `file`, or `` (nonexistent).
	 */
	public static function type( string $path ) : string {
		if ( is_link( $path ) ) {
			return 'link';
		}
		if ( is_dir( $path ) ) {
			return 'dir';
		}
		if ( is_file( $path ) ) {
			return 'file'; // Possibly broken.
		}
		return ''; // Nonexistent path.
	}

	/**
	 * Gets real path type.
	 *
	 * The difference here is the order of the filesystem checks.
	 * Instead of checking {@see is_link()} first, check if: {@see is_dir()} || {@see is_file()}.
	 * Then, in the case of it being a link, we know that it's actually a `broken-link`.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path to check.
	 *
	 * @return string One of `dir`, `file`, `broken-link`, or `` (nonexistent).
	 */
	public static function real_type( string $path ) : string {
		if ( is_dir( $path ) ) {
			return 'dir';
		}
		if ( is_file( $path ) ) {
			return 'file';
		}
		if ( is_link( $path ) ) {
			return 'broken-link'; // Definitely broken.
		}
		return ''; // Nonexistent path.
	}
}
