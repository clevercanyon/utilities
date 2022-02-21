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
namespace Clever_Canyon\Utilities\Traits\A6t\Offsets\Utilities;

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
	 * Read/write access to offsets.
	 *
	 * @since 2021-12-28
	 *
	 * @param array|null $offsets New offsets? Optional. Default is `null`.
	 *                            This can be used to update current offsets array.
	 *
	 * @return array Offsets, by value.
	 */
	final public function offsets( /* array|null */ ?array $offsets = null ) : array {
		if ( null !== $offsets ) {
			$this->offsets = $offsets;
		}
		return $this->offsets;
	}

	/**
	 * Computes offset key.
	 *
	 * @since 2022-01-15
	 *
	 * @param mixed $offset Raw offset key.
	 *
	 * @return string|int Computed offset key, based on data type.
	 *
	 * @throws U\Fatal_Exception On unexpected condition.
	 */
	final public function offset_key( /* mixed */ $offset ) /* : string|int */ {
		if ( is_string( $offset ) || is_int( $offset ) ) {
			return $offset; // Standard key.
		}
		if ( null === $offset || is_scalar( $offset ) ) {
			return (string) $offset;
		}
		if ( is_array( $offset ) ) {
			return '#' . "\0" . 'a:' . "\0" . U\Arr::hash_id( $offset );
		}
		if ( is_object( $offset ) ) {
			return '#' . "\0" . 'o:' . "\0" . spl_object_id( $offset );
		}
		if ( is_resource( $offset ) ) { // {@see get_resource_id()} is PHP 8+ only.
			return '#' . "\0" . 'r:' . "\0" . ( function_exists( 'get_resource_id' ) ? get_resource_id( $offset ) : (string) $offset );
		}
		throw new U\Fatal_Exception( 'Unexpected offset type: `' . U\Data::type( $offset ) . '`.' );
	}
}
