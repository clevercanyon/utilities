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
trait Is_OS_Members {
	/**
	 * Is OS Mac/Darwin?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if OS is Mac/Darwin.
	 */
	public static function is_mac() : bool {
		return 'Darwin' === PHP_OS_FAMILY;
	}

	/**
	 * Is OS Windows?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if OS is Windows.
	 */
	public static function is_windows() : bool {
		return 'Windows' === PHP_OS_FAMILY;
	}

	/**
	 * Is OS Linux?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if OS is Linux.
	 */
	public static function is_linux() : bool {
		return 'Linux' === PHP_OS_FAMILY;
	}

	/**
	 * Is OS Unix-based?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if OS is based on Unix.
	 */
	public static function is_unix_based() : bool {
		static $is; // Memoize.

		if ( null !== $is ) {
			return $is; // Saves time.
		}
		return $is = in_array( PHP_OS_FAMILY, [ 'BSD', 'Darwin', 'Solaris', 'Linux' ], true );
	}

	/**
	 * Is OS unknown?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if OS is unknown.
	 */
	public static function is_unknown_os() : bool {
		return 'Unknown' === PHP_OS_FAMILY;
	}
}
