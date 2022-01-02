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
namespace Clever_Canyon\Utilities\OOP\Interfaces;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error};

// </editor-fold>

/**
 * OOP: I7e_Exception.
 *
 * @since 2021-12-15
 */
interface I7e_Exception extends \Throwable {
	/**
	 * Constructor.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|null       $message  Optional message. Default is empty.
	 * @param string|null       $code     Optional code. Default is: `basename(file):line`.
	 * @param object|array|null $data     Optional data, which is converted to an object type.
	 * @param \Throwable|null   $previous Optional previous exception for chaining in complex applications.
	 */
	public function __construct(
		/* string|null */ ?string $message = null,
		/* string|null */ ?string $code = null,
		/* object|array|null */ $data = null,
		/* \Throwable|null */ ?\Throwable $previous = null
	);

	/**
	 * Gets message.
	 *
	 * @since 2021-12-17
	 * @return string Message.
	 */
	public function get_message() : string;

	/**
	 * Gets code.
	 *
	 * @since 2021-12-17
	 * @return string Code.
	 */
	public function get_code() : string;

	/**
	 * Gets data.
	 *
	 * @since 2021-12-17
	 * @return object Data.
	 */
	public function get_data() : object;

	/**
	 * Gets file path.
	 *
	 * @since 2021-12-17
	 * @return string File path.
	 */
	public function get_file() : string;

	/**
	 * Gets line number.
	 *
	 * @since 2021-12-17
	 * @return int Line number.
	 */
	public function get_line() : int;

	/**
	 * Gets backtrace.
	 *
	 * @since 2021-12-17
	 * @return array Backtrace.
	 */
	public function get_backtrace() : array;

	/**
	 * Gets backtrace as string.
	 *
	 * @since 2021-12-17
	 * @return string Backtrace.
	 */
	public function get_backtrace_str() : string;

	/**
	 * Gets previous throwable.
	 *
	 * @since 2021-12-17
	 * @return \Throwable|null Previous.
	 */
	public function get_previous() /* : \Throwable|null */ : ?\Throwable;
}
