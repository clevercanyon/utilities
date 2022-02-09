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
 * Pkg utilities.
 *
 * @since 2021-12-15
 */
final class Pkg extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Pkg\Members;

	/**
	 * Namespace scope regexp.
	 *
	 * @since 2021-12-15
	 */
	public const NAMESPACE_SCOPE_REGEXP = '/^X[0-9a-f]{15}$/u';

	/**
	 * Namespace crux regexp.
	 *
	 * @since 2021-12-15
	 */
	public const NAMESPACE_CRUX_REGEXP = '/^(?!X[0-9a-f]{15}\\\)[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9])*[a-zA-Z0-9]\\\[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9])*[a-zA-Z0-9]$/u';

	/**
	 * FQN crux regexp; {@see https://www.php.net/manual/en/functions.user-defined.php}.
	 *
	 * @since 2021-12-15
	 */
	public const FQN_CRUX_REGEXP = '/^(?!X[0-9a-f]{15}\\\)[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9])*[a-zA-Z0-9](?:\\\[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9])*[a-zA-Z0-9])+(?:(?:\\\|\:{2}|-\>)[a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*)?$/u';
}
