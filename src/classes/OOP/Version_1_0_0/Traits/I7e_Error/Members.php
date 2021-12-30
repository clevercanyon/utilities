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
namespace Clever_Canyon\Utilities\OOP\Version_1_0_0\Traits\I7e_Error;

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
 * @see   I7e_Error
 */
trait Members {
	/**
	 * Stores the list of errors.
	 *
	 * @since 2021-12-15
	 */
	protected array $errors = [];

	/**
	 * Stores the most recently added data for each error code.
	 *
	 * @since 2021-12-15
	 */
	protected array $error_data = [];

	/**
	 * Stores previously added data added for error codes, oldest-to-newest by code.
	 *
	 * @since 2021-12-15
	 */
	protected array $additional_data = [];

	/**
	 * Initializes the error.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code    Error code. If `$code` is empty, the other parameters will be ignored.
	 * @param string     $message Error message. When `$code` is not empty, `$message` will be used even if it's empty.
	 * @param mixed      $data    Optional. Error data. The `$data` parameter will be used only if it is not empty.
	 *
	 * @note  This is a slightly modified clone of {@see \WP_Error}.
	 *        It remains 100% interchangeable with WordPress errors as of 2021-12-15.
	 *
	 * @note  Though the class is constructed with a single error code and
	 *        message, multiple codes can be added using the {@see add()} method.
	 */
	public function __construct( /* string|int */ $code = '', string $message = '', /* mixed */ $data = '' ) {
		assert( is_string( $code ) || is_int( $code ) );
		assert( is_string( $message ) );

		parent::__construct();

		if ( ! $code ) {
			return; // Nothing.
		}
		$this->add( $code, $message, $data );
	}

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
	 * Verifies if the instance contains errors.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool If the instance contains errors.
	 */
	public function has_errors() : bool {
		return (bool) $this->errors;
	}

	/**
	 * Adds an error or appends an additional message to an existing error.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code    Error code.
	 * @param string     $message Error message.
	 * @param mixed      $data    Optional. Error data.
	 */
	public function add( /* string|int */ $code, string $message, /* mixed */ $data = '' ) : void {
		assert( is_string( $code ) || is_int( $code ) );
		assert( is_string( $message ) );

		$this->errors[ $code ][] = $message;

		if ( $data ) {
			$this->add_data( $data, $code );
		}
	}

	/**
	 * Adds data to an error with the given code.
	 *
	 * @since 2021-12-15
	 * @since WP v5.6.0 Errors can now contain more than one item of error data.
	 *        {@see \WP_Error::$additional_data}.
	 *
	 * @param mixed      $data Error data.
	 * @param string|int $code Error code.
	 */
	public function add_data( /* mixed */ $data, /* string|int */ $code = '' ) : void {
		assert( is_string( $code ) || is_int( $code ) );

		if ( ! $code ) {
			$code = $this->get_error_code();
		}
		if ( isset( $this->error_data[ $code ] ) ) {
			$this->additional_data[ $code ][] = $this->error_data[ $code ];
		}
		$this->error_data[ $code ] = $data;
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

	/**
	 * Removes the specified error.
	 *
	 * This function removes all error messages associated with the specified
	 * error code, along with any error data for that code.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Error code.
	 */
	public function remove( /* string|int */ $code ) : void {
		assert( is_string( $code ) || is_int( $code ) );

		unset( $this->errors[ $code ] );
		unset( $this->error_data[ $code ] );
		unset( $this->additional_data[ $code ] );
	}

	/**
	 * Merges the errors in the given error object into this one.
	 *
	 * @since 2021-12-15
	 *
	 * @param I7e_Error $error Error object to merge.
	 */
	public function merge_from( I7e_Error $error ) : void {
		static::copy_errors( $error, $this );
	}

	/**
	 * Exports the errors in this object into the given one.
	 *
	 * @since 2021-12-15
	 *
	 * @param I7e_Error $error Error object to export into.
	 */
	public function export_to( I7e_Error $error ) : void {
		static::copy_errors( $this, $error );
	}

	/**
	 * Copies errors from one instance to another.
	 *
	 * @since 2021-12-15
	 *
	 * @param I7e_Error $from The error to copy from.
	 * @param I7e_Error $to   The error to copy to.
	 */
	protected static function copy_errors( I7e_Error $from, I7e_Error $to ) : void {
		foreach ( $from->get_error_codes() as $_code ) {
			foreach ( $from->get_error_messages( $_code ) as $_error_message ) {
				$to->add( $_code, $_error_message );
			}
			foreach ( $from->get_all_error_data( $_code ) as $_data ) {
				$to->add_data( $_data, $_code );
			}
		}
	}
}
