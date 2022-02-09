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
namespace Clever_Canyon\Utilities\Traits\Dir;

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
 * @see   U\Dir
 */
trait Members {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Dir\Utilities\Iterator_Members;
	use U\Traits\Dir\Utilities\Join_Members;
	use U\Traits\Dir\Utilities\Make_Members;
	use U\Traits\Dir\Utilities\Name_Members;
	use U\Traits\Dir\Utilities\Private_Members;
	use U\Traits\Dir\Utilities\Prune_Members;
	use U\Traits\Dir\Utilities\Subpath_Members;
	use U\Traits\Dir\Utilities\Sys_Cache_Members;
	use U\Traits\Dir\Utilities\Sys_Config_Members;
	use U\Traits\Dir\Utilities\Sys_Data_Members;
	use U\Traits\Dir\Utilities\Sys_Helper_Members;
	use U\Traits\Dir\Utilities\Sys_State_Members;
	use U\Traits\Dir\Utilities\Sys_Temp_Members;
}
