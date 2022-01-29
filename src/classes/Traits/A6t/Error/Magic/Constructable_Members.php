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
namespace Clever_Canyon\Utilities\Traits\A6t\Error\Magic;

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
trait Constructable_Members {
	/**
	 * Initializes the error.
	 *
	 * This is a slightly modified clone of {@see \WP_Error}.
	 * It remains 100% interchangeable with WordPress errors as of 2021-12-15.
	 *
	 * Though the class is constructed with a single error code and message,
	 * multiple codes can be added using the {@see U\A6t\Error::add()} method.
	 *
	 * @since        2021-12-15
	 *
	 * @param string|int $code    Error code. If error `$code` is empty, other parameters are ignored; i.e., no error added on instantiation.
	 * @param string     $message Error message. When error `$code` is not empty, `$message` will be used even if message is empty.
	 * @param mixed      $data    Optional error data. The error `$data` parameter will be used only if it is not empty.
	 *
	 * @noinspection PhpMultipleClassDeclarationsInspection
	 */
	public function __construct( /* string|int */ $code = '', string $message = '', /* mixed */ $data = '' ) {
		assert( is_string( $code ) || is_int( $code ) );
		assert( is_string( $message ) );

		parent::__construct();

		if ( $code ) {
			$this->add( $code, $message, $data );
		}
	}
}
