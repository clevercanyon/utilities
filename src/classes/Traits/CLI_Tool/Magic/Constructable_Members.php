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
namespace Clever_Canyon\Utilities\Traits\CLI_Tool\Magic;

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
trait Constructable_Members {
	/**
	 * Constructor.
	 *
	 * @since        2021-12-15
	 *
	 * @param string|array|null $args_to_parse Custom args to parse?
	 *                                         If not given, defaults internally to `$_SERVER['argv']`.
	 *
	 * @see          http://getopt-php.github.io/getopt-php/
	 * @noinspection PhpMultipleClassDeclarationsInspection
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
}
