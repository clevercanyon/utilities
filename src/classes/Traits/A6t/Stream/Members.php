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
namespace Clever_Canyon\Utilities\Traits\A6t\Stream;

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
 * @see   U\I7e\Stream
 */
trait Members {
	/**
	 * Traits.
	 *
	 * @since 2021-12-28
	 */
	use U\Traits\A6t\Stream\Magic\Constructable_Members;
	use U\Traits\A6t\Stream\Magic\Destructable_Members;
	use U\Traits\A6t\Stream\Properties\Property_Members;

	use U\Traits\A6t\Stream\Utilities\Open_Members;
	use U\Traits\A6t\Stream\Utilities\Lock_Members;
	use U\Traits\A6t\Stream\Utilities\Close_Members;

	use U\Traits\A6t\Stream\Utilities\Read_Members;
	use U\Traits\A6t\Stream\Utilities\Cast_Members;
	use U\Traits\A6t\Stream\Utilities\Write_Members;

	use U\Traits\A6t\Stream\Utilities\Stat_Members;
	use U\Traits\A6t\Stream\Utilities\Position_Members;

	use U\Traits\A6t\Stream\Utilities\Directory_Members;
	use U\Traits\A6t\Stream\Utilities\Filesystem_Members;

	use U\Traits\A6t\Stream\Utilities\Utility_Members;
}
