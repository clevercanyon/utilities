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
namespace Clever_Canyon\Utilities\Traits\Data\Utilities;

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
 * @see   U\Data
 */
trait Type_Members {
	/**
	 * Gets canonicalized data type.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $value Value to type.
	 *
	 * @return string Canonicalized data type.
	 */
	public static function type( /* mixed */ $value ) : string {
		return U\Data::canonicalize_type( gettype( $value ) );
	}

	/**
	 * Cananicalizes a data type.
	 *
	 * The goal here is to work out obscure differences between
	 * what is generally thought of as proper in the minds of developers
	 * vs. what {@see gettype()} actually returns at runtime.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $type Canonicalized data type.
	 *
	 * @return string String matching {@see U\Data::type()}.
	 *
	 * @see   https://www.php.net/manual/en/function.gettype.php
	 */
	public static function canonicalize_type( string $type ) : string {
		switch ( $type ) {
			case 'boolean':
				return 'bool';

			case 'integer':
				return 'int';

			case 'double':
				return 'float';

			case 'NULL':
				return 'null';

			case 'unknown type':
				return 'unknown';

			default:
				return $type;
		}
	}
}
