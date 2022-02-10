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
namespace Clever_Canyon\Utilities\Traits\A6t\CLI_Tool\Utilities;

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

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\CLI_Tool
 */
trait Getter_Members {
	/**
	 * Gets an option.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $option Option name.
	 *
	 * @return mixed Option value.
	 */
	protected function get_option( string $option ) /* : mixed */ {
		return $this->parser->getOption( $option );
	}

	/**
	 * Gets all options.
	 *
	 * @since 2021-12-15
	 *
	 * @return array All options.
	 */
	protected function get_options() : array {
		return $this->parser->getOptions();
	}

	/**
	 * Gets an operand.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $operand Operand name.
	 *
	 * @return mixed Operand value.
	 */
	protected function get_operand( string $operand ) /* : mixed */ {
		return $this->parser->getOperand( $operand );
	}

	/**
	 * Gets all operands.
	 *
	 * @since 2021-12-15
	 *
	 * @return array All operands.
	 */
	protected function get_operands() : array {
		return $this->parser->getOperands();
	}
}
