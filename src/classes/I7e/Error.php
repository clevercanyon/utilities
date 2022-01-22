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
namespace Clever_Canyon\Utilities\I7e;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Error interface.
 *
 * @since 2021-12-15
 *
 * @note  This is a slightly modified clone of {@see \WP_Error}.
 *        It has the same interface as WordPress errors. Last confirmed: 2021-12-15.
 */
interface Error {
	/**
	 * Checks if instance contains errors.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if instance contains errors.
	 */
	public function has_errors() : bool;

	/**
	 * Retrieves all error codes.
	 *
	 * @since 2021-12-15
	 *
	 * @return array All error codes, else empty array.
	 */
	public function get_error_codes() : array;

	/**
	 * Retrieves first error code available.
	 *
	 * @since 2021-12-15
	 *
	 * @return string|int First error code available, else empty string.
	 */
	public function get_error_code(); /* : string|int */

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
	public function get_error_messages( /* string|int */ $code = '' ) : array;

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
	public function get_error_message( /* string|int */ $code = '' ) : string;

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
	public function get_error_data( /* string|int */ $code = '' ); /* : mixed */

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
	public function get_all_error_data( /* string|int */ $code = '' ) : array;

	/**
	 * Adds an error or appends an additional error message to an existing error.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code    Error code.
	 * @param string     $message Error message.
	 * @param mixed      $data    Optional. Error data.
	 */
	public function add( /* string|int */ $code, string $message, /* mixed */ $data = '' ) : void;

	/**
	 * Adds error data to an error with the given error code.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed      $data Error data.
	 * @param string|int $code Optional. Adds error data to error `$code`.
	 *                         If no error `$code` is given, default is the first error code available.
	 */
	public function add_data( /* mixed */ $data, /* string|int */ $code = '' ) : void;

	/**
	 * Removes the specified error.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|int $code Error code.
	 */
	public function remove( /* string|int */ $code ) : void;

	/**
	 * Merges errors from another error instance into this error instance.
	 *
	 * @since 2021-12-15
	 *
	 * @param U\I7e\Error $error Error instance to merge into this instance.
	 */
	public function merge_from( U\I7e\Error $error ) : void;

	/**
	 * Exports errors in this error instance to another error instance.
	 *
	 * @since 2021-12-15
	 *
	 * @param U\I7e\Error $error Error instance to export errors into.
	 */
	public function export_to( U\I7e\Error $error ) : void;

	/**
	 * Checks if a value is an error.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $value  Value to check.
	 * @param bool  $strict Default is `false`, which checks for compatible error variants.
	 *                      The default behavior (i.e., not strict) is to consider {@see \WP_Error} an error also.
	 *                      If `true`, error must be an instance of {@see U\I7e\Error}, without exception.
	 *
	 * @return bool True if it's an error.
	 */
	public static function is( /* mixed */ $value, bool $strict = false ) : bool;
}
