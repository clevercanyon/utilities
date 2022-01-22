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
trait Utility_Members {
	/**
	 * Checks if instance contains errors.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if instance contains errors.
	 */
	public function has_errors() : bool {
		return (bool) $this->errors;
	}

	/**
	 * Removes the specified error.
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
	 * Merges errors from another error instance into this error instance.
	 *
	 * @since 2021-12-15
	 *
	 * @param U\I7e\Error $error Error instance to merge into this instance.
	 */
	public function merge_from( U\I7e\Error $error ) : void {
		static::copy_errors( $error, $this );
	}

	/**
	 * Exports errors in this error instance to another error instance.
	 *
	 * @since 2021-12-15
	 *
	 * @param U\I7e\Error $error Error instance to export errors into.
	 */
	public function export_to( U\I7e\Error $error ) : void {
		static::copy_errors( $this, $error );
	}

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
	public static function is( /* mixed */ $value, bool $strict = false ) : bool {
		return $value instanceof U\I7e\Error
			|| ( U\Env::is_wordpress() && $value instanceof \WP_Error );
	}

	/**
	 * Copies errors from one error instance to another error instance.
	 *
	 * @since 2021-12-15
	 *
	 * @param U\I7e\Error $from The error to copy from.
	 * @param U\I7e\Error $to   The error to copy to.
	 */
	protected static function copy_errors( U\I7e\Error $from, U\I7e\Error $to ) : void {
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
