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
namespace Clever_Canyon\Utilities\Traits\Offsets\Utilities;

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
trait Utility_Members {
	/**
	 * Access to offsets.
	 *
	 * @since 2021-12-28
	 *
	 * @return array Offsets, by value.
	 */
	final public function offsets() : array {
		return $this->offsets;
	}

	/**
	 * Computes offset key.
	 *
	 * @since 2022-01-15
	 *
	 * @param mixed $offset Raw offset key.
	 *
	 * @throws U\Fatal_Exception On unexpected condition.
	 * @return string|int Computed offset key, based on data type.
	 */
	final public function offset_key( /* mixed */ $offset ) /* : string|int */ {
		if ( is_string( $offset ) || is_int( $offset ) ) {
			return $offset; // Standard key.
		}
		if ( is_null( $offset ) || is_scalar( $offset ) ) {
			return (string) $offset;
		}
		if ( is_array( $offset ) ) {
			return '#' . "\0" . 'array:' . "\0" . U\Arr::hash( $offset );
		}
		if ( is_object( $offset ) ) {
			return '#' . "\0" . 'object:' . "\0" . spl_object_id( $offset );
		}
		if ( is_resource( $offset ) ) { // {@see get_resource_id()} is PHP 8+ only.
			return '#' . "\0" . 'resource:' . "\0" . ( function_exists( 'get_resource_id' ) ? get_resource_id( $offset ) : (string) $offset );
		}
		throw new U\Fatal_Exception( 'Unexpected offset type: `' . gettype( $offset ) . '`.' );
	}
}
