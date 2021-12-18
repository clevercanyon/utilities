<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
namespace Clever_Canyon\Utilities\OOPs\Version_1_0_0;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Exception;

use Clever_Canyon\Chalk\{Chalk, Style, Fg_Color, Bg_Color};

/**
 * CLI.
 *
 * @since 1.0.0
 */
class CLI extends Base {
	/**
	 * Gets standard input.
	 *
	 * @since 1.0.0
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
	 * @since 1.0.0
	 *
	 * @param mixed $data Output data.
	 */
	public static function stdout( /* mixed */ $data ) : void {
		$string = U\Str::stringify( $data );

		stream_set_blocking( STDOUT, true );
		fwrite( STDOUT, $string . "\n" );
	}

	/**
	 * Sends standard error.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $data Output data.
	 */
	public static function stderr( /* mixed */ $data ) : void {
		$string = U\Str::stringify( $data );

		stream_set_blocking( STDERR, true );
		fwrite( STDERR, $string . "\n" );
	}

	/**
	 * Outputs something.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `none`.
	 */
	public static function output( /* mixed */ $data, /* string|array */ $style = 'none' ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data ), $style ) );
	}

	/**
	 * Outputs a log entry.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'white', 'none', 'dim' ]`.
	 */
	public static function log( /* mixed */ $data, /* string|array */ $style = [ 'white', 'none', 'dim' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data ), $style ) );
	}

	/**
	 * Outputs a notice.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'black', 'blue' ]`.
	 */
	public static function notice( /* mixed */ $data, /* string|array */ $style = [ 'black', 'blue' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data ), $style ) );
	}

	/**
	 * Outputs a success.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'black', 'green' ]`.
	 */
	public static function success( /* mixed */ $data, /* string|array */ $style = [ 'black', 'green' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data ), $style ) );
	}

	/**
	 * Outputs a warning.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'black', 'yellow' ]`.
	 */
	public static function warning( /* mixed */ $data, /* string|array */ $style = [ 'black', 'yellow' ] ) : void {
		U\CLI::stdout( U\CLI::chalk( U\Str::stringify( $data ), $style ) );
	}

	/**
	 * Outputs an error.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed        $data  Output data.
	 * @param string|array $style Chalk style. Default is `[ 'white', 'red', 'bright' ]`.
	 */
	public static function error( /* mixed */ $data, /* string|array */ $style = [ 'white', 'red', 'bright' ] ) : void {
		U\CLI::stderr( U\CLI::chalk( U\Str::stringify( $data ), $style ) );
	}

	/**
	 * Exit with status code.
	 *
	 * @since 1.0.0
	 *
	 * @param int $status Status code. Default is `1`.
	 */
	public static function exit_status( int $status = 0 ) : void {
		exit( $status ); // phpcs:ignore -- output ok.
	}

	/**
	 * Chalks (styles) data.
	 *
	 * @since 1.0.0
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
		$string = U\Str::stringify( $data );

		if ( is_array( $style ) ) {
			$style = array_values( $style );
			$style = array_map( 'strval', $style );

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

		} elseif ( ! $style instanceof Style ) {
			$style = Fg_Color::code( (string) $style );
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
	 * @throws Exception                On non-zero exit status code.
	 * @return int Status code.
	 */
	public static function run( array $args, /* string|null */ ?string $dir = null, bool $check_status = true ) : int {
		$cmd = $dir ? 'cd ' . escapeshellarg( $dir ) . ' && ' : '';
		$cmd .= implode( ' ', array_map( 'escapeshellarg', $args ) );

		passthru( $cmd, $status );

		if ( $check_status && 0 !== $status ) {
			throw new Exception( 'Unexpected status: ' . $status );
		}

		return $status;
	}

	/**
	 * Executes a shell command (does not display output).
	 *
	 * @since 1.0.0
	 *
	 * @param array       $args         Command arguments (unquoted/unescaped).
	 * @param string|null $dir          Current working directory. Defaults to `null` value.
	 * @param bool        $check_status Check status and throw exception on failure? Defaults to `true`.
	 * @param string|null $stdin        Stdin to send to command. Defaults to `null` value.
	 *
	 * @throws Exception                On non-zero exit status code.
	 * @return \StdClass `[status, stdout, stderr]`.
	 */
	public static function exec( array $args, /* string|null */ ?string $dir = null, bool $check_status = true, /* string|null */ ?string $stdin = null ) : \StdClass {
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
		$cmd      = implode( ' ', array_map( 'escapeshellarg', $args ) );
		$process  = proc_open( $cmd, $config, $pipes, $dir );

		if ( ! is_resource( $process ) ) {
			if ( $check_status ) {
				throw new Exception( 'Unexpected `proc_open()` failure.' );
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
			throw new Exception( $response->stderr ?: $response->stdout );
		}

		return $response;
	}
}
