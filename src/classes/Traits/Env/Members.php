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
namespace Clever_Canyon\Utilities\Traits\Env;

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
trait Members {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Env\Utilities\Can_Use_Class_Members;
	use U\Traits\Env\Utilities\Can_Use_Extension_Members;
	use U\Traits\Env\Utilities\Can_Use_Function_Members;
	use U\Traits\Env\Utilities\Charset_Members;
	use U\Traits\Env\Utilities\Close_Session_Members;
	use U\Traits\Env\Utilities\Config_Mode_Members;
	use U\Traits\Env\Utilities\Config_Robots_Members;
	use U\Traits\Env\Utilities\Disable_Caching_Members;
	use U\Traits\Env\Utilities\Disable_GZIP_Members;
	use U\Traits\Env\Utilities\End_Output_Buffering_Members;
	use U\Traits\Env\Utilities\Is_CLI_Members;
	use U\Traits\Env\Utilities\Is_INI_Setting_Changeable_Members;
	use U\Traits\Env\Utilities\Is_OS_Members;
	use U\Traits\Env\Utilities\Is_WordPress_Members;
	use U\Traits\Env\Utilities\Maybe_Define_Members;
	use U\Traits\Env\Utilities\Prep_For_Members;
	use U\Traits\Env\Utilities\Raise_Memory_Limit_Members;
	use U\Traits\Env\Utilities\Set_Time_Limit_Members;
	use U\Traits\Env\Utilities\Static_Var_Members;
	use U\Traits\Env\Utilities\Var_Members;
}
