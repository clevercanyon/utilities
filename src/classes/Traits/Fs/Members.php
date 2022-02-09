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
namespace Clever_Canyon\Utilities\Traits\Fs;

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
trait Members {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Fs\Utilities\Abs_Members;
	use U\Traits\Fs\Utilities\Copy_Members;
	use U\Traits\Fs\Utilities\Delete_Members;
	use U\Traits\Fs\Utilities\Exists_Members;
	use U\Traits\Fs\Utilities\Git_Ignore_Members;
	use U\Traits\Fs\Utilities\Make_Members;
	use U\Traits\Fs\Utilities\Normalize_Members;
	use U\Traits\Fs\Utilities\Path_Wrapper_Properties;
	use U\Traits\Fs\Utilities\Perms_Members;
	use U\Traits\Fs\Utilities\Realize_Members;
	use U\Traits\Fs\Utilities\Stat_Members;
	use U\Traits\Fs\Utilities\Type_Members;
	use U\Traits\Fs\Utilities\Wrapper_Members;
	use U\Traits\Fs\Utilities\Zip_Members;
}
