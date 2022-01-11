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
trait Setter_Members {
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
}
