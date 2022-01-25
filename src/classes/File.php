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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * File utilities.
 *
 * @since 2021-12-15
 */
final class File extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\File\Members;

	/**
	 * 1kb in bytes.
	 *
	 * @since 2021-12-15
	 */
	public const KB_IN_BYTES = 1024;

	/**
	 * 1MB in bytes.
	 *
	 * @since 2021-12-15
	 */
	public const MB_IN_BYTES = 1024 * U\File::KB_IN_BYTES;

	/**
	 * 1GB in bytes.
	 *
	 * @since 2021-12-15
	 */
	public const GB_IN_BYTES = 1024 * U\File::MB_IN_BYTES;

	/**
	 * 1TB in bytes.
	 *
	 * @since 2021-12-15
	 */
	public const TB_IN_BYTES = 1024 * U\File::GB_IN_BYTES;

	/**
	 * 1PB in bytes.
	 *
	 * @since 2021-12-15
	 */
	public const PB_IN_BYTES = 1024 * U\File::TB_IN_BYTES;
}
