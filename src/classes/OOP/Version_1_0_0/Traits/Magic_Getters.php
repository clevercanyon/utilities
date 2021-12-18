<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
namespace Clever_Canyon\Utilities\OOP\Version_1_0_0\Traits;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Exception;

/**
 * Magic getters.
 *
 * @since 1.0.0
 */
trait Magic_Getters {
	/**
	 * Checks properties.
	 *
	 * @since 1.0.0
	 *
	 * @param string $prop Property.
	 *
	 * @return bool True if property exists.
	 */
	public function __isset( string $prop ) : bool {
		return property_exists( $this, $prop );
	}

	/**
	 * Gets properties.
	 *
	 * @since 1.0.0
	 *
	 * @param string $prop Property.
	 *
	 * @return mixed Property value.
	 */
	public function __get( string $prop ) /* : mixed */ {
		if ( property_exists( $this, $prop ) ) {
			return $this->{$prop};
		}
	}
}
