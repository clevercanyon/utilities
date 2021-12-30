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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\OOP\Version_1_0_0\Traits\I7e_Generic;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\STC\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   I7e_Generic
 */
trait Members {
	/**
	 * STC traits.
	 *
	 * @since 2021-12-15
	 */
	use \Clever_Canyon\Utilities\STC\Version_1_0_0\Traits\I7e_Stc_Base\Magic\Callable_Members;

	/**
	 * OOP traits.
	 *
	 * @since 2021-12-15
	 */
	use \Clever_Canyon\Utilities\OOP\Version_1_0_0\Traits\I7e_Base\Magic\Readable_Members;
	use \Clever_Canyon\Utilities\OOP\Version_1_0_0\Traits\I7e_Base\Magic\Writable_Members;
	use \Clever_Canyon\Utilities\OOP\Version_1_0_0\Traits\I7e_Base\Magic\Callable_Members;

	/**
	 * Constructor.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array $props   Optional initial props. Default is `[]`.
	 * @param object|array $offsets Optional initial offsets. Default is `[]`.
	 */
	public function __construct( /* array|object */ $props = [], /* array|object */ $offsets = [] ) {
		parent::__construct( $offsets );
		assert( U\Ctn::is( $props ) );

		foreach ( $props as $_prop => $_value ) {
			if ( 'offsets' !== $_prop ) { // Reserved property.
				$this->{$_prop} = $_value;
			}
		}
	}
}
