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
namespace Clever_Canyon\Utilities\Traits\Str;

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
trait Members {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Str\Utilities\Base64_Members;
	use U\Traits\Str\Utilities\Begins_With_Members;
	use U\Traits\Str\Utilities\Contains_Members;
	use U\Traits\Str\Utilities\Ends_With_Members;
	use U\Traits\Str\Utilities\Escape_Members;
	use U\Traits\Str\Utilities\FSC_Members;
	use U\Traits\Str\Utilities\Is_Namespace_Members;
	use U\Traits\Str\Utilities\Is_Regexp_Members;
	use U\Traits\Str\Utilities\Is_UTF8_Members;
	use U\Traits\Str\Utilities\Is_Valid_Helper_Members;
	use U\Traits\Str\Utilities\JSON_Members;
	use U\Traits\Str\Utilities\Multibyte_Members;
	use U\Traits\Str\Utilities\N7M_Members;
	use U\Traits\Str\Utilities\Name_Members;
	use U\Traits\Str\Utilities\Normalize_EOL_Members;
	use U\Traits\Str\Utilities\Preg_Match_In_Members;
	use U\Traits\Str\Utilities\Replace_Members;
	use U\Traits\Str\Utilities\Serialize_Members;
	use U\Traits\Str\Utilities\Slug_Members;
	use U\Traits\Str\Utilities\Stringify_Members;
	use U\Traits\Str\Utilities\To_ASCII_Members;
	use U\Traits\Str\Utilities\Unquote_Members;
	use U\Traits\Str\Utilities\Var_Members;
}
