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
namespace Clever_Canyon\Utilities\Traits\A6t\DB_Query;

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
 * @see   U\I7e\DB_Query
 */
trait Members {
	/**
	 * Traits.
	 *
	 * @since 2021-12-28
	 */
	use U\Traits\A6t\DB_Query\Magic\Constructable_Members;
	use U\Traits\A6t\DB_Query\Utilities\Property_Members;
	use U\Traits\A6t\DB_Query\Magic\Stringable_Members;
	use U\Traits\A6t\Base\Magic\Readable_Members;

	use U\Traits\A6t\DB_Query\Utilities\Bind_Members;
	use U\Traits\A6t\DB_Query\Utilities\Execute_Members;

	use U\Traits\A6t\DB_Query\Utilities\Prepare_Members;
	use U\Traits\A6t\DB_Query\Utilities\Quote_Members;
	use U\Traits\A6t\DB_Query\Utilities\Escape_Members;
}
