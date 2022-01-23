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
namespace Clever_Canyon\Utilities\Traits\Env\Utilities;

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
trait Static_Var_Members {
	/**
	 * Static vars.
	 *
	 * @since 2022-01-16
	 *
	 * @see   U\Env::static_var()
	 */
	protected static array $vars = [];

	/**
	 * Gets/sets static environment variables.
	 *
	 * @since 2021-12-22
	 *
	 * @param string $name  Static environment variable name.
	 * @param mixed  $value Static environment variable value; i.e., when setting|updating.
	 *                      Passing `null` explicitly will {@see unset()} variable.
	 *                      If not passed, this function simply operates as a getter.
	 *
	 * @return mixed Value of static environment variable, else `null`.
	 */
	public static function static_var( string $name, /* mixed */ $value = null ) /* : mixed */ {
		if ( null !== $value || func_num_args() >= 2 ) {
			if ( null === $value ) {
				unset( static::$vars[ $name ] );
			} else {
				static::$vars[ $name ] = $value;
			}
		}
		return static::$vars[ $name ] ?? null;
	}
}
