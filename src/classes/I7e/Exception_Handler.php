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
namespace Clever_Canyon\Utilities\I7e;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Exception handler interface.
 *
 * @since 2021-12-15
 */
interface Exception_Handler extends U\I7e\Stc_Base {
	/**
	 * Loads exception handler.
	 *
	 * Sets error handler.
	 * Sets shutdown handler.
	 * Sets exception handler.
	 *
	 * @since 2022-03-03
	 */
	public static function load() : void;

	/**
	 * Shutdown handler.
	 *
	 * @since 2022-03-03
	 *
	 * @throws \ErrorException Converts errors to exceptions.
	 *                         Only on errors that we're reporting.
	 *
	 * @see   U\A6t\Exception_Handler::on_error()
	 */
	public static function on_shutdown() : void;

	/**
	 * Error handler.
	 *
	 * @since 2022-03-03
	 *
	 * @param int    $type    Type; e.g., `E_ERROR`.
	 * @param string $message Textual error message.
	 * @param string $file    File error occurred in.
	 * @param int    $line    Line number error occured on.
	 *
	 * @return bool `false` when choosing not to handle the error.
	 *
	 * @throws \ErrorException Converts errors to exceptions.
	 *                         Only on errors that we're reporting.
	 *
	 * @see   U\A6t\Exception_Handler::on_exception()
	 */
	public static function on_error( int $type, string $message, string $file, int $line ) : bool;

	/**
	 * Exception handler.
	 *
	 * There is no way to stop the exception here.
	 * The only purpose of this function is to handle gracefully.
	 *
	 * @since 2022-03-03
	 *
	 * @param \Throwable $throwable Throwable.
	 */
	public static function on_exception( \Throwable $throwable ) : void;
}
