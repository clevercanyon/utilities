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
 * Lint configuration.
 *
 * @since 2021-12-15
 *
 * @note  Leading underscores in this file help us guard against collisions with PHP core in the future.
 *        Using `snake_case()` method names to guard against collisions also. PHP core uses `camelCase()`.
 *
 * phpcs:disable PSR2.Classes.PropertyDeclaration.Underscore
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\OOP\Version_1_0_0;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\OOPs\{Version_1_0_0 as U};

// </editor-fold>

/**
 * Custom exception.
 *
 * @since 2021-12-15
 */
class Exception extends \Exception {
	/**
	 * Exception code.
	 *
	 * @since 2021-12-15
	 */
	protected string $___code;

	/**
	 * Exception data.
	 *
	 * @since 2021-12-15
	 */
	protected object $___data;

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
	) {
		parent::__construct( $message ?? '', 0, $previous );

		$this->___code = $code ?? basename( $this->get_file(), '.php' ) . ':' . $this->get_line();
		$this->___data = is_object( $data ) || is_array( $data ) ? (object) $data : (object) [];
	}

	/**
	 * Gets message.
	 *
	 * @since 2021-12-17
	 * @return string Message.
	 */
	public function get_message() : string {
		return $this->getMessage();
	}

	/**
	 * Gets code.
	 *
	 * @since 2021-12-17
	 * @return string Code.
	 */
	public function get_code() : string {
		return $this->___code;
	}

	/**
	 * Gets data.
	 *
	 * @since 2021-12-17
	 * @return object Data.
	 */
	public function get_data() : object {
		return $this->___data;
	}

	/**
	 * Gets file path.
	 *
	 * @since 2021-12-17
	 * @return string File path.
	 */
	public function get_file() : string {
		return $this->getFile();
	}

	/**
	 * Gets line number.
	 *
	 * @since 2021-12-17
	 * @return int Line number.
	 */
	public function get_line() : int {
		return $this->getLine();
	}

	/**
	 * Gets backtrace.
	 *
	 * @since 2021-12-17
	 * @return array Backtrace.
	 */
	public function get_backtrace() : array {
		return $this->getTrace();
	}

	/**
	 * Gets backtrace as string.
	 *
	 * @since 2021-12-17
	 * @return string Backtrace.
	 */
	public function get_backtrace_str() : string {
		return $this->getTraceAsString();
	}

	/**
	 * Gets previous exception.
	 *
	 * @since 2021-12-17
	 * @return \Throwable|null Previous.
	 */
	public function get_previous() /* : Throwable|null */ : ?\Throwable {
		return $this->getPrevious();
	}
}
