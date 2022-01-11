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
namespace Clever_Canyon\Utilities\OOP\Traits\I7e_CLI_Tool\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

/**
 * File-specific.
 *
 * @since 2021-12-15
 */
use GetOpt\{GetOpt as Parser, Option, Operand, Command};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   I7e_CLI_Tool
 */
trait Routing_Members {
	/**
	 * Routes request.
	 *
	 * @since 2021-12-15
	 */
	protected function route_request() : void {
		// Parse CLI args.
		try {
			$this->parser->process( $this->args_to_parse );
			// Defaults internally to `$_SERVER['argv']`.
			// See: <http://getopt-php.github.io/getopt-php/options.html>
			// See: <https://git.io/JMFLE>.

		} catch ( \Throwable $throwable ) {
			$this->maybe_process_help_request();
			$this->maybe_process_version_request();

			U\CLI::error( $throwable->getMessage() );
			U\CLI::exit_status( 1 );
		}
		// Maybe handle help/version requests.

		if ( $this->maybe_process_help_request() || $this->maybe_process_version_request() ) {
			return; // Nothing more to do here.
		}
		// Handle CLI commands parsed from CLI args above.

		try {
			$command                 = $this->parser->getCommand();
			$command_name            = $command ? $command->getName() : '';
			$process_command_request = $command ? $command->getHandler() : null;

			if ( ! $command || ! is_callable( $process_command_request ) ) {
				U\CLI::error( 'Please specify a valid command to run. You gave `' . ( $command_name ?: '?' ) . '`, which is not available.' );
				U\CLI::output( $this->parser->getHelpText(), 'blue' );
				U\CLI::exit_status( 1 );
			}
			try {
				$process_command_request();

			} catch ( \Throwable $throwable ) {
				U\CLI::error( $throwable->getMessage() );
				U\CLI::exit_status( 1 );
			}
		} catch ( \Throwable $throwable ) {
			U\CLI::error( 'Unexpected error running `' . ( ! empty( $command_name ) ? $command_name : '?' ) . '` command. Please try again.' );
			U\CLI::exit_status( 1 );
		}
	}
}
