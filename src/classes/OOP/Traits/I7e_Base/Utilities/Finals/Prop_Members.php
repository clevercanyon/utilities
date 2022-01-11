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
namespace Clever_Canyon\Utilities\OOP\Traits\I7e_Base\Utilities\Finals;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   I7e_Base
 */
trait Prop_Members {
	/**
	 * Provides access to all properties, by value.
	 *
	 * @since 2021-12-27
	 *
	 * @param string $filter Optional filter. Default is `` indicating all props.
	 *                       `` returns all props and `public` returns only public props.
	 *
	 * @return array All accessible non-static props w/ the requested visibility.
	 *               Plus `offsets` if class is an instance of {@see A6t_Offsets}.
	 */
	final public function props( string $filter = '' ) : array {
		switch ( $filter ) {
			case 'public':
				$props = U\Obj::props( $this );
				break; // Done here.

			default: // All properties.
				$props = get_object_vars( $this );

				if ( $this instanceof A6t_Offsets ) {
					$props[ U\Arr::maybe_prefix_key( 'offsets', $props ) ] = $this->offsets();
				}
				unset( $props[ 'oop_cache' ] ); // Never export cache.
		}
		return $props;
	}
}
