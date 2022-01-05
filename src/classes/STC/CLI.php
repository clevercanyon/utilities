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
namespace Clever_Canyon\Utilities\STC;

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
use Clever_Canyon\Chalk\{Chalk, Style, Fg_Color, Bg_Color};

// </editor-fold>

/**
 * CLI utilities.
 *
 * @since 2021-12-15
 */
class CLI extends \Clever_Canyon\Utilities\STC\Abstracts\A6t_Stc_Base {
	/**
	 * Gets standard input.
	 *
	 * @since 2021-12-15
	 *
	 * @param int $lines Defaults to `0` (no limit).
	 *
	 * @return string X lines of stdin.
	 */
	public static function stdin( int $lines = 0 ) : string {
		$stdin      = '';
		$lines_read = 0;

		stream_set_blocking( STDIN, false );

		while ( false !== ( $_line = fgets( STDIN ) ) ) {
			$stdin .= $_line;
			$lines_read++;

			if ( $lines && $lines_read >= $lines ) {
				break;
			}
		}
		return trim( $stdin );
	}

	/**
	 * Sends standard output.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $data Output data.
	 */
	public static function stdout( /* mixed */ $data ) : void {
		$string = U\Str::stringify( $data, true );

		stream_set_blocking( STDOUT, true );
		fwrite( STDOUT, $string . "\n" );
	}

	/**
	 * Sends standard error.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $data Output data.
	 */
	public static function stderr( /* mixed */ $data ) : void {
		$string = U\Str::stringify( $data, true );

		stream_set_blocking( STDERR, true );
		fwrite( STDERR, $string . "\n" );
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
	 * Outputs a notice.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'black', 'blue' ]`.
	 */
	public static function notice( /* mixed */ $data, /* string|array */ $style = [ 'black', 'blue' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a success.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'black', 'green' ]`.
	 */
	public static function success( /* mixed */ $data, /* string|array */ $style = [ 'black', 'green' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs a warning.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'black', 'yellow' ]`.
	 */
	public static function warning( /* mixed */ $data, /* string|array */ $style = [ 'black', 'yellow' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Outputs an error.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'white', 'red', 'bright' ]`.
	 */
	public static function error( /* mixed */ $data, /* string|array */ $style = [ 'white', 'red', 'bright' ] ) : void {
		U\CLI::stderr( U\CLI::chalk( U\Str::stringify( $data, true ), $style ) );
	}

	/**
	 * Exit with status code.
	 *
	 * @since 2021-12-15
	 *
	 * @param int $status Status code. Default is `1`.
	 */
	public static function exit_status( int $status = 0 ) : void {
		exit( $status ); // phpcs:ignore -- output ok.
	}

	/**
	 * Chalks (styles) data.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed              $data  Data to style.
	 *
	 * @param string|array|Style $style Can be passed as a simple foreground color string; e.g., `blue`, `green`, `red`, and others.
	 *                                  Or, you can pass it as an array in this order: `[ fg, bg, style, ...style ]`.
	 *
	 *                                  When passing an array, only the foreground color is required at key index `0`.
	 *                                  That said, if you intend to pass a style code, you must pass a background color at key index `1`.
	 *                                  If you'd like to bypass any value (e.g., background color) simply set that value to `none`.
	 *
	 *                                  You can also pass an instance of {@see \Clever_Canyon\Chalk\Style} if you'd prefer.
	 *
	 * @return string Styled string.
	 */
	public static function chalk( /* mixed */ $data, /* string|array|Style */ $style = 'none' ) : string {
		assert( is_string( $style ) || is_array( $style ) || $style instanceof Style );
		$string = U\Str::stringify( $data, true );

		if ( is_string( $style ) ) {
			$style = Fg_Color::code( $style );
		}
		if ( is_array( $style ) ) {
			$style = array_values( $style );
			assert( array_map( 'strval', $style ) === $style );

			foreach ( $style as $_key => &$_style ) {
				switch ( $_key ) {
					case 0:
						$_style = Fg_Color::code( $_style );
						break;
					case 1:
						$_style = Bg_Color::code( $_style );
						break;
					case 2:
					default:
						$_style = Style::code( $_style );
						break;
				}
			}
			unset( $_style ); // Reference.
		}
		return Chalk::style( $string, $style );
	}

	/**
	 * Runs a shell command (displays output).
	 *
	 * @param array       $args         Command arguments (unquoted/unescaped).
	 * @param string|null $dir          Current working directory. Defaults to `null` value.
	 * @param bool        $check_status Check status and throw exception on failure? Defaults to `true`.
	 *
	 * @throws Fatal_Exception If environment is lacking CLI functions.
	 *                         On non-zero exit status code or other issue.
	 *
	 * @return int Status code.
	 */
	public static function run( array $args, /* string|null */ ?string $dir = null, bool $check_status = true ) : int {
		if ( ! U\Env::can_use_function( 'escapeshellarg', 'passthru' ) ) {
			throw new Fatal_Exception(
				'Unable to use PHP’s `escapeshellarg()` and/or `passthru()` functions.' .
				' Have one or both of these PHP functions been disabled by your hosting company?'
			);
		}
		$cmd = $dir ? 'cd ' . U\Str::esc_shell_arg( $dir ) . ' && ' : '';
		$cmd .= implode( ' ', array_map( [ U\Str::class, 'esc_shell_arg' ], $args ) );

		passthru( $cmd, $status );

		if ( $check_status && 0 !== $status ) {
			throw new Fatal_Exception( 'Unexpected status: ' . $status );
		}
		return $status;
	}

	/**
	 * Executes a shell command (does not display output).
	 *
	 * @since 2021-12-15
	 *
	 * @param array       $args         Command arguments (unquoted/unescaped).
	 * @param string|null $dir          Current working directory. Defaults to `null` value.
	 * @param bool        $check_status Check status and throw exception on failure? Defaults to `true`.
	 * @param string|null $stdin        Stdin to send to command. Defaults to `null` value.
	 *
	 * @throws Fatal_Exception If environment is lacking CLI functions.
	 *                         On non-zero exit status code or other issue.
	 *
	 * @return object Object with properties `{}->status|stdout|stderr`.
	 */
	public static function exec(
		array $args,
		/* string|null */ ?string $dir = null,
		bool $check_status = true,
		/* string|null */ ?string $stdin = null
	) : object {
		if ( ! U\Env::can_use_function( 'escapeshellarg', 'proc_open', 'proc_get_status', 'proc_close' ) ) {
			throw new Fatal_Exception(
				'Unable to use PHP’s `escapeshellarg()`, `proc_open()`, `proc_get_status()`, and/or `proc_close()` functions.' .
				' Have one or more of these PHP functions been disabled by your hosting company?'
			);
		}
		$response = (object) [
			'status' => 0,
			'stdout' => '',
			'stderr' => '',
		];
		$config   = [
			0 => [ 'pipe', 'r' ], // stdin.
			1 => [ 'pipe', 'w' ], // stdout.
			2 => [ 'pipe', 'w' ], // stderr.
		];
		$cmd      = implode( ' ', array_map( [ U\Str::class, 'esc_shell_arg' ], $args ) );
		$process  = proc_open( $cmd, $config, $pipes, $dir );

		if ( ! is_resource( $process ) ) {
			if ( $check_status ) {
				throw new Fatal_Exception( 'Unexpected `proc_open()` failure.' );
			}
			return $response;
		}
		if ( isset( $stdin ) ) {
			fwrite( $pipes[ 0 ], $stdin );
		}
		fclose( $pipes[ 0 ] );

		stream_set_blocking( $pipes[ 1 ], true );
		$response->stdout = trim( stream_get_contents( $pipes[ 1 ] ) );
		fclose( $pipes[ 1 ] );

		stream_set_blocking( $pipes[ 2 ], true );
		$response->stderr = trim( stream_get_contents( $pipes[ 2 ] ) );
		fclose( $pipes[ 2 ] );

		$status           = proc_get_status( $process );
		$response->status = $status[ 'exitcode' ];
		proc_close( $process );

		if ( $check_status && 0 !== $response->status ) {
			throw new Fatal_Exception( $response->stderr ?: $response->stdout );
		}
		return $response;
	}
}
