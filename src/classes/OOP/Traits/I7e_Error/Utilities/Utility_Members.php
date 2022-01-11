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
trait Utility_Members {
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
