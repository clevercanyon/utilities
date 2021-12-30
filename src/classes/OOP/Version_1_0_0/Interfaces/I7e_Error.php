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
namespace Clever_Canyon\Utilities\OOP\Version_1_0_0\Interfaces;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\STC\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Exception};

// </editor-fold>

/**
 * OOP: I7e_Error.
 *
 * @since 2021-12-15
 *
 * @note  This is a slightly modified clone of {@see \WP_Error}.
 *        It has the same interface as WordPress errors. Last confirmed: 2021-12-15.
 */
interface I7e_Error {
	/**
	 * Initializes the error.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code    Error code. If `$code` is empty, the other parameters will be ignored.
	 * @param string     $message Error message. When `$code` is not empty, `$message` will be used even if it's empty.
	 * @param mixed      $data    Optional. Error data. The `$data` parameter will be used only if it is not empty.
	 *
	 * @note  Though the class is constructed with a single error code and
	 *        message, multiple codes can be added using the {@see add()} method.
	 */
	public function __construct( /* string|int */ $code = '', string $message = '', /* mixed */ $data = '' );

	/**
	 * Retrieves all error codes.
	 *
	 * @since 2021-12-15
	 *
	 * @return array List of error codes, if available.
	 */
	public function get_error_codes() : array;

	/**
	 * Retrieves the first error code available.
	 *
	 * @since 2021-12-15
	 *
	 * @return string|int Empty string, if no error codes.
	 */
	public function get_error_code(); /* : string|int */

	/**
	 * Retrieves all error messages, or the error messages for the given error code.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Optional. Retrieve messages matching `$code`, if exists.
	 *
	 * @return string[] Error strings on success, or empty array if there are none.
	 */
	public function get_error_messages( /* string|int */ $code = '' ) : array;

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
	public function get_error_message( /* string|int */ $code = '' ) : string;

	/**
	 * Retrieves the most recently added error data for an error code.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Optional. Error code.
	 *
	 * @return mixed Error data, if it exists.
	 */
	public function get_error_data( /* string|int */ $code = '' ); /* : mixed */

	/**
	 * Verifies if the instance contains errors.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool If the instance contains errors.
	 */
	public function has_errors() : bool;

	/**
	 * Adds an error or appends an additional message to an existing error.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code    Error code.
	 * @param string     $message Error message.
	 * @param mixed      $data    Optional. Error data.
	 */
	public function add( /* string|int */ $code, string $message, /* mixed */ $data = '' ) : void;

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
	public function add_data( /* mixed */ $data, /* string|int */ $code = '' ) : void;

	/**
	 * Retrieves all error data for an error code in the order in which the data was added.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Error code.
	 *
	 * @return array Array of error data, if it exists.
	 */
	public function get_all_error_data( /* string|int */ $code = '' ) : array;

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
	public function remove( /* string|int */ $code ) : void;

	/**
	 * Merges the errors in the given error object into this one.
	 *
	 * @since 2021-12-15
	 *
	 * @param I7e_Error $error Error object to merge.
	 */
	public function merge_from( I7e_Error $error ) : void;

	/**
	 * Exports the errors in this object into the given one.
	 *
	 * @since 2021-12-15
	 *
	 * @param I7e_Error $error Error object to export into.
	 */
	public function export_to( I7e_Error $error ) : void;
}
