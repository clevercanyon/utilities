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
trait Is_Hostery_Members {
	/**
	 * Is Hostery environment?
	 *
	 * @since 2021-12-18
	 *
	 * @param string|null              $prop  Check a specific Hostery environment property?
	 *                                        Default value is `null` (i.e., any Hostery environment).
	 *
	 *                                        Property descriptions:
	 *
	 *                                        * `provider`           e.g., `verpex`.
	 *                                        * `operating_system`   e.g., `cloudlinux`.
	 *                                        * `control_panel`      e.g., `cpanel`.
	 *                                        * `web_server`         e.g., `litespeed`.
	 *                                        * `environment`        e.g., `production`.
	 *
	 * @param string|U\I7e\Regexp|null $value If `$prop` is given, the value to check for. Default is `null`.
	 *                                        This can be given as a string or {@see U\I7e\Regexp}.
	 *
	 * @return bool `true` if is a Hostery environment.
	 *              If `$prop` is given, `true` if `$prop` matches `$value`.
	 *
	 * @see   `clevercanyon/wordpress-sites/wp-content/private/c24s/wp-config/defaults.php`.
	 */
	public static function is_hostery( /* string|null */ ?string $prop = null, /* string|U\I7e\Regexp|null */ $value = null ) : bool {
		assert( null === $value || is_string( $value ) || $value instanceof U\I7e\Regexp );

		static $is, $hostery; // Memoize.

		$prop  ??= '*'; // Default (any).
		$value ??= '*'; // Default (any).
		$value = '*' === $prop ? '*' : $value;

		$is_regexp_value = '*' !== $value && $value instanceof U\I7e\Regexp;
		$value_key       = $is_regexp_value ? get_class( $value ) . ':' . $value->__toString() : $value;

		if ( isset( $is[ $prop ][ $value_key ] ) ) {
			return $is[ $prop ][ $value_key ]; // Saves time.
		}
		$is          ??= []; // Initialize.
		$is[ $prop ] ??= []; // Initialize.

		if ( null === $hostery ) {
			$hostery = U\Env::var( 'HOSTERY' );
			$hostery = $hostery ? U\Str::json_decode( $hostery ) : null;
			$hostery = $hostery && is_object( $hostery ) ? $hostery : (object) [];
		}
		if ( '*' === $prop ) {
			return $is[ $prop ][ $value_key ] = ! U\Obj::empty( $hostery );
		}
		if ( $is_regexp_value ) {
			return $is[ $prop ][ $value_key ] = isset( $hostery->{$prop} ) && $value->test( $hostery->{$prop} );
		}
		return $is[ $prop ][ $value_key ] = isset( $hostery->{$prop} ) && $hostery->{$prop} === $value;
	}
}
