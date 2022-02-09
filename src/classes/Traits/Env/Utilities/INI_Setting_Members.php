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
trait INI_Setting_Members {
	/**
	 * Checks if an INI setting is changeable.
	 *
	 * The reasoning for this function is that some hosts
	 * may find creative ways to disable certain INI settings.
	 * `memory_limit` being a good example; {@see https://o5p.me/UAy5Mv}.
	 *
	 * @since 2022-01-02
	 *
	 * @param string $setting INI setting to check.
	 *
	 * @return bool True if `$setting` is changeable.
	 *
	 * @see   wp_is_ini_value_changeable()
	 */
	public static function is_ini_setting_changeable( string $setting ) : bool {
		static $ini_get_all; // Memoize.

		if ( null === $ini_get_all ) {
			if ( U\Env::can_use_function( 'ini_get_all' ) ) {
				$ini_get_all = ini_get_all();
			}
			$ini_get_all = $ini_get_all ?: false;
		}
		if ( false === $ini_get_all ) {
			return U\Env::can_use_function( 'ini_set' );
		}
		return isset( $cache[ $setting ][ 'access' ] )
			&& ( INI_ALL === ( $cache[ $setting ][ 'access' ] & INI_ALL )
				|| INI_USER === ( $cache[ $setting ][ 'access' ] & INI_ALL ) )
			&& U\Env::can_use_function( 'ini_set' );
	}
}
