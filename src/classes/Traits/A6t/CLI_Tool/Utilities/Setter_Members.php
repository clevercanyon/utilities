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
use GetOpt\{Command};

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
trait Setter_Members {
	/**
	 * Adds commands.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $commands Command configurations.
	 *
	 * @return self For easy chaining with {@see U\A6t\CLI_Tool::route_request()}.
	 *
	 * @throws U\Fatal_Exception On invalid arguments.
	 */
	protected function add_commands( array $commands ) : self {
		try {
			foreach ( $commands as $_command => $_config ) {
				$_callback    = $_config[ 'callback' ] ?? null;
				$_synopsis    = $_config[ 'synopsis' ] ?? null;
				$_description = $_config[ 'description' ] ?? null;
				$_options     = $_config[ 'options' ] ?? null;
				$_operands    = $_config[ 'operands' ] ?? null;

				if ( ! isset( $_callback ) ) {
					$_callback = [ $this, str_replace( '-', '_', $_command ) ];
				}
				$this->parser->addCommand(
					Command::create( $_command, $_callback )
						->setShortDescription( $_synopsis ?? '' )
						->setDescription( $_description ?? '' )
						->addOptions( $this->build_options( $_options ?? [] ) )
						->addOperands( $this->build_operands( $_operands ?? [] ) )
				);
			}
		} catch ( \InvalidArgumentException $exception ) {
			throw new U\Fatal_Exception( $exception->getMessage() );
		}
		return $this; // For chaining.
	}

	/**
	 * Adds options.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $options Option configurations.
	 *
	 * @return self For easy chaining with {@see U\A6t\CLI_Tool::route_request()}.
	 *
	 * @throws U\Fatal_Exception On invalid arguments.
	 */
	protected function add_options( array $options ) : self {
		try {
			$this->parser->addOptions( $this->build_options( $options ) );
			return $this; // For chaining.
		} catch ( \InvalidArgumentException $exception ) {
			throw new U\Fatal_Exception( $exception->getMessage() );
		}
	}

	/**
	 * Adds operands.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $operands Operand configurations.
	 *
	 * @return self For easy chaining with {@see U\A6t\CLI_Tool::route_request()}.
	 *
	 * @throws U\Fatal_Exception On invalid arguments.
	 */
	protected function add_operands( array $operands ) : self {
		try {
			$this->parser->addOperands( $this->build_operands( $operands ) );
			return $this; // For chaining.
		} catch ( \InvalidArgumentException $exception ) {
			throw new U\Fatal_Exception( $exception->getMessage() );
		}
	}
}
