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
namespace Clever_Canyon\Utilities\OOP\Traits\I7e_Error\Magic;

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
trait Constructable_Members {
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
}
