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
namespace Clever_Canyon\Utilities\OOP\Traits\I7e_Error\Utilities;

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
 * @see   I7e_Error
 */
trait Getter_Members {
	/**
	 * Retrieves all error codes.
	 *
	 * @since 2021-12-15
	 *
	 * @return array List of error codes, if available.
	 */
	public function get_error_codes() : array {
		if ( ! $this->has_errors() ) {
			return [];
		}
		return array_keys( $this->errors );
	}

	/**
	 * Retrieves the first error code available.
	 *
	 * @since 2021-12-15
	 *
	 * @return string|int Empty string, if no error codes.
	 */
	public function get_error_code() /* string|int */ {
		$codes = $this->get_error_codes();

		return $codes ? $codes[ 0 ] : '';
	}

	/**
	 * Retrieves all error messages, or the error messages for the given error code.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Optional. Retrieve messages matching `$code`, if exists.
	 *
	 * @return string[] Error strings on success, or empty array if there are none.
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
	 * Gets a single error message.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Optional. Error `$code` to retrieve message.
	 *
	 * @return string This will get the first message available for the `$code`.
	 *                If no `$code` is given then the first code available will be used.
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
	 * Retrieves the most recently added error data for an error code.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Optional. Error code.
	 *
	 * @return mixed Error data, if it exists.
	 */
	public function get_error_data( /* string|int */ $code = '' ) /* : mixed */ {
		assert( is_string( $code ) || is_int( $code ) );

		if ( ! $code ) {
			$code = $this->get_error_code();
		}
		return $this->error_data[ $code ] ?? null;
	}

	/**
	 * Retrieves all error data for an error code in the order in which the data was added.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Error code.
	 *
	 * @return array Array of error data, if it exists.
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
