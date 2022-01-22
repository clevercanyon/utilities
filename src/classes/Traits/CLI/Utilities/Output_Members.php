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
namespace Clever_Canyon\Utilities\Traits\CLI\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Utility members.
 *
 * @since 2021-12-15
 *
 * @see   U\CLI
 */
trait Output_Members {
	/**
	 * Outputs a heading.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'magenta', 'none', 'bright' ]`.
	 */
	public static function heading( /* mixed */ $data, /* string|array */ $style = [ 'magenta', 'none', 'bright' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs something.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `none`.
	 */
	public static function output( /* mixed */ $data, /* string|array */ $style = 'none' ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a log entry.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'white', 'none', 'dim' ]`.
	 */
	public static function log( /* mixed */ $data, /* string|array */ $style = [ 'white', 'none', 'dim' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a done message.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'green' ]`.
	 */
	public static function done( /* mixed */ $data, /* string|array */ $style = [ 'green' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a notice.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'white', '26', 'bright' ]`.
	 */
	public static function notice( /* mixed */ $data, /* string|array */ $style = [ 'white', '26', 'bright' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a warning.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'white', '130', 'bright' ]`.
	 */
	public static function warning( /* mixed */ $data, /* string|array */ $style = [ 'white', '130', 'bright' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs an error.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'white', '124', 'bright' ]`.
	 */
	public static function error( /* mixed */ $data, /* string|array */ $style = [ 'white', '124', 'bright' ] ) : void {
		U\CLI::stderr( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a success.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'white', '28', 'bright' ]`.
	 */
	public static function success( /* mixed */ $data, /* string|array */ $style = [ 'white', '28', 'bright' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}
}
