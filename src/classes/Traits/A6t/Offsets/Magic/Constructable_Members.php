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
namespace Clever_Canyon\Utilities\Traits\A6t\Offsets\Magic;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\Offsets
 */
trait Constructable_Members {
	/**
	 * Constructor.
	 *
	 * @since        2021-12-15
	 *
	 * @param object|array $offsets Optional initial offsets. Default is `[]`.
	 *                              Offsets beginning with a `NUL` byte are not allowed in.
	 *                              {@see https://o5p.me/VZP4FM} for further details.
	 *
	 * @noinspection PhpMultipleClassDeclarationsInspection
	 */
	public function __construct( /* array|object */ $offsets = [] ) {
		assert( U\Bundle::is( $offsets ) );
		parent::__construct();

		foreach ( $offsets as $_offset => $_value ) {
			if ( ! is_string( $_offset ) || '' === $_offset || "\0" !== $_offset[ 0 ] ) {
				$this[ $this->offset_key( $_offset ) ] = $_value;
			}
		}
	}
}
