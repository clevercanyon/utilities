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
namespace Clever_Canyon\Utilities\Traits\Error\Utilities;

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
 * @see   U\I7e\Error
 */
trait Getter_Members {
	/**
	 * Retrieves all error codes.
	 *
	 * @since 2021-12-15
	 *
	 * @return array All error codes, else empty array.
	 */
	public function get_error_codes() : array {
		if ( ! $this->has_errors() ) {
			return [];
		}
		return array_keys( $this->errors );
	}

	/**
	 * Retrieves first error code available.
	 *
	 * @since 2021-12-15
	 *
	 * @return string|int First error code available, else empty string.
	 */
	public function get_error_code() /* string|int */ {
		$codes = $this->get_error_codes();

		return $codes ? $codes[ 0 ] : '';
	}

	/**
	 * Retrieves all error messages, or those for a given error code.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Optional. Retrieves all error messages with error `$code`.
	 *                         If no error `$code` is given, returns all error messages for all error codes.
	 *
	 * @return string[] Error strings on success, else empty array.
	 */
	public function get_error_messages( /* string|int */ $code = '' ) : array {
		assert( is_string( $code ) || is_int( $code ) );

		if ( ! $code ) {
			$all_messages = [];

			foreach ( $this->errors as $_messages ) {
				$all_messages = array_merge( $all_messages, $_messages );
			}
			return $all_messages;
		}
		return $this->errors[ $code ] ?? [];
	}

	/**
	 * Retrieves first error message available, or first error message available for a given error code.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Optional. Retrieves first error message available with error `$code`.
	 *                         If no error `$code` is given, default is the first error code available.
	 *
	 * @return string First error message available, else empty string.
	 */
	public function get_error_message( /* string|int */ $code = '' ) : string {
		assert( is_string( $code ) || is_int( $code ) );

		if ( ! $code ) {
			$code = $this->get_error_code();
		}
		$messages = $this->get_error_messages( $code );

		return $messages ? $messages[ 0 ] : '';
	}

	/**
	 * Retrieves most recently added error data for a given error code.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Optional. Retrieves most recently added error data with error `$code`.
	 *                         If no error `$code` is given, default is the first error code available.
	 *
	 * @return mixed Most recently added error data, else `null` if no error data exists.
	 */
	public function get_error_data( /* string|int */ $code = '' ) /* : mixed */ {
		assert( is_string( $code ) || is_int( $code ) );

		if ( ! $code ) {
			$code = $this->get_error_code();
		}
		return $this->error_data[ $code ] ?? null;
	}

	/**
	 * Retrieves all error data for a given error code.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Optional. Retrieves all error data with error `$code`.
	 *                         If no error `$code` is given, default is the first error code available.
	 *
	 * @return array Error data in the order it was added, else empty array.
	 */
	public function get_all_error_data( /* string|int */ $code = '' ) : array {
		assert( is_string( $code ) || is_int( $code ) );

		if ( ! $code ) {
			$code = $this->get_error_code();
		}
		$data = []; // Initialize.

		if ( isset( $this->additional_data[ $code ] ) ) {
			$data = $this->additional_data[ $code ];
		}
		if ( isset( $this->error_data[ $code ] ) ) {
			$data[] = $this->error_data[ $code ];
		}
		return $data;
	}
}
