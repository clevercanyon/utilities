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
namespace Clever_Canyon\Utilities\OOP\Abstracts;

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
 * Base class for CLI tools.
 *
 * @since 2021-12-15
 */
abstract class A6t_CLI_Tool extends A6t_Base implements \Clever_Canyon\Utilities\OOP\Interfaces\I7e_CLI_Tool {
	/**
	 * Parser.
	 *
	 * @since 2021-12-15
	 */
	protected Parser $parser;

	/**
	 * Parser args.
	 *
	 * @since 2021-12-15
	 *
	 * @var string|array|null
	 */
	protected $args_to_parse; /* string|array|null */

	/**
	 * Tool name.
	 *
	 * @since 2021-12-15
	 */
	protected const NAME = 'CLI Tool';

	/**
	 * Current version.
	 *
	 * @since 2021-12-15
	 */
	protected const VERSION = '0.0.0';

	/**
	 * Constructor.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|array|null $args_to_parse Custom args to parse?
	 *                                         If not given, defaults internally to `$_SERVER['argv']`.
	 *
	 * @see   http://getopt-php.github.io/getopt-php/
	 */
	public function __construct( /* string|array|null */ $args_to_parse = null ) {
		parent::__construct();
		$this->args_to_parse = $args_to_parse;

		if ( isset( $this->args_to_parse ) && ! is_array( $this->args_to_parse ) ) {
			$this->args_to_parse = (string) $this->args_to_parse;
		}
		$this->parser = new Parser( null, [
			Parser::SETTING_STRICT_OPTIONS  => true,
			Parser::SETTING_STRICT_OPERANDS => true,
		] );
		$this->add_options( [
			'help'    => [ 'description' => 'Get help.' ],
			'version' => [ 'description' => 'Show version.' ],
		] );
	}

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
			U\CLI::error( 'Unexpected error running `' . ( $command_name ?: '?' ) . '` command. Please try again.' );
			U\CLI::exit_status( 1 );
		}
	}

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

	/**
	 * Adds commands.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $commands Command configurations.
	 *
	 * @throws Fatal_Exception On invalid arguments.
	 * @return self For easy chaining with {@see route_request()}.
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
			throw new Fatal_Exception( $exception->getMessage() );
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
	 * @throws Fatal_Exception On invalid arguments.
	 * @return self For easy chaining with {@see route_request()}.
	 */
	protected function add_options( array $options ) : self {
		try {
			$this->parser->addOptions( $this->build_options( $options ) );
			return $this; // For chaining.
		} catch ( \InvalidArgumentException $exception ) {
			throw new Fatal_Exception( $exception->getMessage() );
		}
	}

	/**
	 * Adds operands.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $operands Operand configurations.
	 *
	 * @throws Fatal_Exception On invalid arguments.
	 * @return self For easy chaining with {@see route_request()}.
	 */
	protected function add_operands( array $operands ) : self {
		try {
			$this->parser->addOperands( $this->build_operands( $operands ) );
			return $this; // For chaining.
		} catch ( \InvalidArgumentException $exception ) {
			throw new Fatal_Exception( $exception->getMessage() );
		}
	}

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

	/**
	 * Builds options.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $_options Option configurations.
	 *
	 * @return Option[] An array of option instances.
	 */
	protected function build_options( array $_options ) : array {
		foreach ( $_options as $_option => $_config ) {
			$_short       = $_config[ 'short' ] ?? null;
			$_long        = $_config[ 'long' ] ?? null;
			$_multiple    = $_config[ 'multiple' ] ?? null;
			$_required    = $_config[ 'required' ] ?? null;
			$_optional    = $_config[ 'optional' ] ?? null;
			$_description = $_config[ 'description' ] ?? null;
			$_validator   = $_config[ 'validator' ] ?? null;
			$_default     = $_config[ 'default' ] ?? null;

			if ( $_multiple ) {
				$_mode = Parser::MULTIPLE_ARGUMENT;
			} elseif ( $_required || false === $_optional ) {
				$_mode = Parser::REQUIRED_ARGUMENT;
			} elseif ( $_optional || false === $_required ) {
				$_mode = Parser::OPTIONAL_ARGUMENT;
			} else {
				$_mode = Parser::NO_ARGUMENT;
			}
			$options[ $_option ] = Option::create( $_short, $_long ?? $_option, $_mode );
			$options[ $_option ]->setDescription( $_description ?? '' );
			$options[ $_option ]->setValidation( $_validator ?? [ U\Cb::class, 'noop_true' ] );

			if ( ( $_required || false === $_optional ) && isset( $_default ) ) {
				$options[ $_option ]->setDefaultValue( $_default );
			}
		}
		return $options ?? [];
	}

	/**
	 * Builds operands.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $_operands Operand configurations.
	 *
	 * @throws \InvalidArgumentException On invalid args.
	 * @return Operand[] An array of operand instances, else empty array.
	 */
	protected function build_operands( array $_operands ) : array {
		foreach ( $_operands as $_operand => $_config ) {
			$_multiple  = $_config[ 'multiple' ] ?? null;
			$_required  = $_config[ 'required' ] ?? null;
			$_optional  = $_config[ 'optional' ] ?? null;
			$_validator = $_config[ 'validator' ] ?? null;
			$_default   = $_config[ 'default' ] ?? null;

			if ( $_multiple && ( $_required || false === $_optional ) ) {
				$_mode = Operand::MULTIPLE | Operand::REQUIRED;
			} elseif ( $_multiple ) {
				$_mode = Operand::MULTIPLE;
			} elseif ( $_required || false === $_optional ) {
				$_mode = Operand::REQUIRED;
			} else {
				$_mode = Operand::OPTIONAL;
			}
			$operands[ $_operand ] = Operand::create( $_operand, $_mode );
			$operands[ $_operand ]->setValidation( $_validator ?: [ U\Cb::class, 'noop_true' ] );

			if ( $_multiple && ! isset( $_default ) ) {
				$_default = ''; // Avoids a bug in GetOpt class.
			}
			if ( isset( $_default ) ) {
				$operands[ $_operand ]->setDefaultValue( $_default );
			}
		}
		return $operands ?? [];
	}
}
