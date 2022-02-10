<?php
/**
 * Clever Canyon™ {@see https://clevercanyon.com}
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
namespace Clever_Canyon\Utilities\Traits\A6t\Exception\Utilities;

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
 * @see   U\I7e\Exception
 */
trait Getter_Members {
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
	public function get_previous() /* : \Throwable|null */ : ?\Throwable {
		return $this->getPrevious();
	}
}
