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
	 * Examples: `Xae3c7c368fe2e3c`, `Xfe2c1c36abe8e3e`.
	 *
	 * @since 2021-12-15
	 */
	public const NAMESPACE_SCOPE_REGEXP = '/^X[0-9a-f]{15}$/u';

	/**
	 * Brand namespace regexp.
	 *
	 * Examples: `My_Brand`, `Clever_Canyon`.
	 * Note: Must be exactly one level in depth.
	 *
	 * @since 2021-12-15
	 */
	public const BRAND_NAMESPACE_REGEXP = '/^(?!^[Xx][0-9a-f]{15}\\\)[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9]*)*$/u';

	/**
	 * Namespace crux regexp.
	 *
	 * Examples: `My_Brand\My_Project`, `Clever_Canyon\Utilities`.
	 * Note: Must be exactly two levels in depth and begin with a brand namespace.
	 *
	 * @since 2021-12-15
	 */
	public const NAMESPACE_CRUX_REGEXP = '/^(?!^[Xx][0-9a-f]{15}\\\)[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9]*)*\\\[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9]*)*$/u';

	/**
	 * Class FQN crux regexp.
	 *
	 * Examples: `My_Brand\My_Project\Foo\Bar`, `Clever_Canyon\Utilities\A6t\Base`.
	 * Note: A FQN crux must be at least two levels in depth, otherwise it would be missing a namespace crux.
	 *
	 * @since 2021-12-15
	 */
	public const CLASS_FQN_CRUX_REGEXP = '/^(?![Xx][0-9a-f]{15}\\\)[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9]*)*(?:\\\[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9]*)*)+$/u';

	/**
	 * FQN crux regexp; {@see https://www.php.net/manual/en/functions.user-defined.php}.
	 *
	 * Examples: `My_Brand\My_Project\Foo\Bar`, `Clever_Canyon\Utilities\A6t\Base::props`.
	 * Note: A FQN crux must be at least two levels in depth, otherwise it would be missing a namespace crux.
	 *
	 * @since 2021-12-15
	 */
	public const FQN_CRUX_REGEXP = '/^(?![Xx][0-9a-f]{15}\\\)[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9]*)*(?:\\\[A-Z](?:(?:_[A-Z])?[a-zA-Z0-9]*)*)+(?:(?:\\\|\:{2}|-\>)[a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*)?$/u';
}
