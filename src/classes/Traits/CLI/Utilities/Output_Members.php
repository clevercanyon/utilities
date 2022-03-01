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
	 * Outputs a "\n".
	 *
	 * @since 2021-12-15
	 */
	public static function new_line() : void {
		U\CLI::stdout( '' );
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
	 * Outputs a heading.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `dynamic`.
	 */
	public static function heading( /* mixed */ $data, /* string|array */ $style = 'dynamic' ) : void {
		if ( 'dynamic' === $style ) {
			$style = U\CLI::is_on_dark_bg()
				? [ '212', 'none', 'bright' ]
				: [ '132', 'none', 'bright' ];
		}
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a log entry.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `dynamic`.
	 */
	public static function log( /* mixed */ $data, /* string|array */ $style = 'dynamic' ) : void {
		if ( 'dynamic' === $style ) {
			$style = U\CLI::is_on_dark_bg()
				? [ '255', 'none', 'dim' ]
				: [ '232', 'none', 'dim' ];
		}
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	// Colorized output inspired by Bootstrap alerts: `info|warning|danger|success`.
	// Hilite variants use a background instead, behind white text to grab extra attention.

	// Note: `info` = blue, `warning` = orange, `danger` = red, `success` = green.
	// {@see https://getbootstrap.com/docs/4.0/components/alerts/}.

	/**
	 * Outputs some info.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `dynamic`.
	 */
	public static function info( /* mixed */ $data, /* string|array */ $style = 'dynamic' ) : void {
		if ( 'dynamic' === $style ) {
			$style = U\CLI::is_on_dark_bg()
				? [ '39', 'none', 'bright' ]
				: [ '26', 'none', 'bright' ];
		}
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs some info w/ background hilite.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `dynamic`.
	 */
	public static function info_hilite( /* mixed */ $data, /* string|array */ $style = 'dynamic' ) : void {
		if ( 'dynamic' === $style ) {
			$style = [ '255', '26', 'bright' ];
		}
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a warning.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `dynamic`.
	 */
	public static function warning( /* mixed */ $data, /* string|array */ $style = 'dynamic' ) : void {
		if ( 'dynamic' === $style ) {
			$style = U\CLI::is_on_dark_bg()
				? [ '214', 'none', 'bright' ]
				: [ '130', 'none', 'bright' ];
		}
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a warning w/ background hilite.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `dynamic`.
	 */
	public static function warning_hilite( /* mixed */ $data, /* string|array */ $style = 'dynamic' ) : void {
		if ( 'dynamic' === $style ) {
			$style = [ '255', '130', 'bright' ];
		}
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a danger.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `dynamic`.
	 */
	public static function danger( /* mixed */ $data, /* string|array */ $style = 'dynamic' ) : void {
		if ( 'dynamic' === $style ) {
			$style = U\CLI::is_on_dark_bg()
				? [ '203', 'none', 'bright' ]
				: [ '124', 'none', 'bright' ];
		}
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a danger w/ background hilite.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `dynamic`.
	 */
	public static function danger_hilite( /* mixed */ $data, /* string|array */ $style = 'dynamic' ) : void {
		if ( 'dynamic' === $style ) {
			$style = [ '255', '124', 'bright' ];
		}
		U\CLI::stderr( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a success.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `dynamic`.
	 */
	public static function success( /* mixed */ $data, /* string|array */ $style = 'dynamic' ) : void {
		if ( 'dynamic' === $style ) {
			$style = U\CLI::is_on_dark_bg()
				? [ '41', 'none', 'bright' ]
				: [ '28', 'none', 'bright' ];
		}
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a success w/ background hilite.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `dynamic`.
	 */
	public static function success_hilite( /* mixed */ $data, /* string|array */ $style = 'dynamic' ) : void {
		if ( 'dynamic' === $style ) {
			$style = [ '255', '28', 'bright' ];
		}
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}
}
