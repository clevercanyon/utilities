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
namespace Clever_Canyon\Utilities\Traits\CLI_Tool\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

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
 * @see   U\I7e\CLI_Tool
 */
trait Utility_Members {
	/**
	 * Maybe process help request.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if processed.
	 */
	protected function maybe_process_help_request() : bool {
		if ( $this->parser->getOption( 'help' ) ) {
			U\CLI::output( $this->parser->getHelpText(), 'blue' );
			return true;
		}
		return false;
	}

	/**
	 * Maybe process version request.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if processed.
	 */
	protected function maybe_process_version_request() : bool {
		if ( $this->parser->getOption( 'version' ) ) {
			U\CLI::output( sprintf( '%s: %s', $this::NAME, $this::VERSION ), 'blue' );
			return true;
		}
		return false;
	}
}
