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
namespace Clever_Canyon\Utilities\Traits\A6t\Base\Properties;

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
trait Property_Members {
	/**
	 * Object INS cache.
	 *
	 * @since 2021-12-15
	 */
	private array $ins_cache = [];

	/**
	 * Gets non-static properties, by value.
	 *
	 * @since 2021-12-27
	 *
	 * @param string|null $filter Optional filter. Default is `null`.
	 *                            {@see U\Obj::props()} for further details.
	 *
	 * @param bool        $clean  Clean property names? Default is `false`.
	 *                            {@see U\Obj::props()} for further details.
	 *
	 * @return array Non-static properties using the given `$filter`.
	 */
	final public function props( /* string|null */ ?string $filter = null, bool $clean = false ) : array {
		return U\Obj::props( $this, $filter, $clean );
	}
}
