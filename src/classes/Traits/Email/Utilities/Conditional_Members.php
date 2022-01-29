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
namespace Clever_Canyon\Utilities\Traits\Email\Utilities;

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
 * @see   U\Email
 */
trait Conditional_Members {
	/**
	 * Checks email validity; e.g., `user@example.com`.
	 *
	 * Maximum length is 320 characters, not bytes.
	 * A trailing dot is not allowed in email address hostnames.
	 * A user@local address is not allowed by this validator.
	 *
	 * @since 2021-12-26
	 *
	 * @param mixed $value Value to check.
	 *
	 * @return bool True if it's a valid email address.
	 *
	 * @see   https://o5p.me/cZpuIh
	 */
	public static function is( /* mixed */ $value ) : bool {
		return false !== filter_var( $value, FILTER_VALIDATE_EMAIL, [ 'flags' => FILTER_FLAG_EMAIL_UNICODE ] );
	}
}
