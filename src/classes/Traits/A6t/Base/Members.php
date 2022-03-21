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
namespace Clever_Canyon\Utilities\Traits\A6t\Base;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\Base
 */
trait Members {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\A6t\Base\Magic\Constructable_Members;
	use U\Traits\A6t\Base\Magic\Destructable_Members;
	use U\Traits\A6t\Base\Magic\Cloneable_Members;

	use U\Traits\A6t\Base\Magic\Unreadable_Members;
	use U\Traits\A6t\Base\Magic\Unwritable_Members;
	use U\Traits\A6t\Base\Magic\Uncallable_Members;

	use U\Traits\A6t\Base\Magic\Debuggable_Members;
	use U\Traits\A6t\Base\Magic\Stringable_Members;

	use U\Traits\A6t\Base\Magic\Unserializable_Members;
	use U\Traits\A6t\Base\I7e\JsonSerializable_Members;

	use U\Traits\A6t\Base\Properties\Property_Members;

	use U\Traits\A6t\Base\Utilities\Equals_Members;
	use U\Traits\A6t\Base\Utilities\INS_Cache_Members;
}
