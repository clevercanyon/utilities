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
namespace Clever_Canyon\Utilities\Traits\Ctn\Utilities;

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
 * @see   U\Ctn
 */
trait Resolve_Env_Vars_Members {
	/**
	 * Resolves `~/`, `${HOME}`, and other environment vars recursively.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array $ctn      Value(s) to resolve deeply.
	 *                               This will recurse arrays/objects.
	 *
	 * @param array        $env_vars An array of any additional environment vars. Defaults to `[]`.
	 *                               These will override any existing environment vars with same name.
	 *
	 * @param object|null  $_r       Internal use only — do not pass.
	 *
	 * @return object|array The collection after having resolved environment vars recursively.
	 */
	public static function resolve_env_vars(
		/* object|array */ $ctn,
		array $env_vars = [],
		/* object|null */ ?object $_r = null
	) /* : object|array */ {
		assert( U\Ctn::is( $ctn ) );
		$_r ??= (object) [ 'env_vars' => (object) U\Env::vars( $env_vars ) ];

		foreach ( $ctn as &$_value ) {
			if ( is_string( $_value ) ) {
				foreach ( $_r->env_vars as $_env_var => $_env_var_value ) {
					$_value = str_replace( '${' . $_env_var . '}', $_env_var_value, $_value );
				}
				$_value = preg_replace( '/^~\//u', U\Dir::join_ets( $_r->env_vars->HOME, '/' ), $_value );
				$_value = preg_replace( '/\$\{[a-z0-9_\-]+\}/ui', '', $_value );
			} elseif ( U\Ctn::is( $_value ) ) {
				$_value = U\Ctn::resolve_env_vars( $_value, [], $_r );
			}
		}
		return $ctn;
	}
}
