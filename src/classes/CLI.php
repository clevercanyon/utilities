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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * CLI utilities.
 *
 * @since 2021-12-15
 */
final class CLI extends U\A6t\Stc_Utilities {
	/**
	 * Last command.
	 *
	 * @since 2022-01-09
	 */
	protected static string $last_cmd = '';

	/**
	 * Output style escape map.
	 *
	 * @since 2022-01-09
	 */
	protected static array $style_es_map = [
		'none'       => '0',
		'bold'       => '1',
		'dim'        => '2',
		'underlined' => '4',
		'blink'      => '5',
		'inverted'   => '7',
		'hidden'     => '8',
	];

	/**
	 * Foreground color escape map.
	 *
	 * @since 2022-01-09
	 */
	protected static array $fg_color_es_map = [
		'none'          => '39',
		'black'         => '30',
		'red'           => '31',
		'green'         => '32',
		'yellow'        => '33',
		'blue'          => '34',
		'magenta'       => '35',
		'cyan'          => '36',
		'light-gray'    => '37',
		'dark-gray'     => '90',
		'light-red'     => '91',
		'light-green'   => '92',
		'light-yellow'  => '93',
		'light-blue'    => '94',
		'light-magenta' => '95',
		'light-cyan'    => '96',
		'white'         => '97',
	];

	/**
	 * Background color escape map.
	 *
	 * @since 2022-01-09
	 */
	protected static array $bg_color_es_map = [
		'none'          => '49',
		'black'         => '40',
		'red'           => '41',
		'green'         => '42',
		'yellow'        => '43',
		'blue'          => '44',
		'magenta'       => '45',
		'cyan'          => '46',
		'light-gray'    => '47',
		'dark-gray'     => '100',
		'light-red'     => '101',
		'light-green'   => '102',
		'light-yellow'  => '103',
		'light-blue'    => '104',
		'light-magenta' => '105',
		'light-cyan'    => '106',
		'white'         => '107',
	];

	/**
	 * Gets {@see $last_cmd} string.
	 *
	 * @since 2022-01-09
	 *
	 * @return string Last CMD string.
	 */
	public static function last_cmd() : string {
		return U\CLI::$last_cmd;
	}

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
	 * Chalks (i.e., stylizes) data.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Data to chalk (i.e., stylize).
	 *
	 * @param string|array $chalk Can be passed as a simple foreground color slug; e.g., `blue`, `green`, `red`, and others.
	 *                            Or, you can pass it as an array of slugs in this order: `[ fg, bg, style, ...style ]`.
	 *
	 *                            When passing an array, only the foreground color is required at key index `0`.
	 *                            That said, if you intend to pass a style code, you must pass a background color at key index `1`.
	 *                            If you'd like to bypass any value (e.g., background color) simply set that value to `none`.
	 *
	 * @return string Styled string.
	 */
	public static function chalk( /* mixed */ $data, /* string|array */ $chalk = 'none' ) : string {
		assert( is_string( $chalk ) || is_array( $chalk ) );

		$esc_sequences = [];
		$res_sequences = [];

		$chalk = (array) ( $chalk ?: 'none' );
		$chalk = array_values( $chalk ); // Rekey.
		assert( array_map( 'strval', $chalk ) === $chalk );

		foreach ( $chalk as $_key => $_chalk ) {
			if ( 'none' === $_chalk ) {
				continue; // No chalk.
			}
			switch ( $_key ) {
				case 0:
					$esc_sequences[] = U\CLI::fg_color_esc_seq( $_chalk );
					$res_sequences[] = U\CLI::fg_color_esc_seq( 'none' );
					break;
				case 1:
					$esc_sequences[] = U\CLI::bg_color_esc_seq( $_chalk );
					$res_sequences[] = U\CLI::bg_color_esc_seq( 'none' );
					break;
				case ( $_key >= 2 ):
				default: // Output styles.
					$esc_sequences[] = U\CLI::style_esc_seq( $_chalk );
					$res_sequences[] = U\CLI::style_esc_seq( 'none' );
					break;
			}
		}
		return implode( $esc_sequences ) . U\Str::stringify( $data, true ) . implode( array_reverse( $res_sequences ) );
	}

	/**
	 * Gets output style escape sequence.
	 *
	 * @since 2022-01-15
	 *
	 * @param string $style Output style slug.
	 *
	 * @return string Output style escape sequence.
	 */
	protected static function style_esc_seq( string $style ) : string {
		return "\033" . '[' . ( U\CLI::$style_es_map[ $style ] ?? U\CLI::$style_es_map[ 'none' ] ) . 'm';
	}

	/**
	 * Gets foreground color escape sequence.
	 *
	 * @since 2022-01-15
	 *
	 * @param string $color Foreground color slug.
	 *
	 * @return string Foreground color escape sequence.
	 */
	protected static function fg_color_esc_seq( string $color ) : string {
		return "\033" . '[' . ( U\CLI::$fg_color_es_map[ $color ] ?? U\CLI::$fg_color_es_map[ 'none' ] ) . 'm';
	}

	/**
	 * Gets background color escape sequence.
	 *
	 * @since 2022-01-15
	 *
	 * @param string $color Background color slug.
	 *
	 * @return string Background color escape sequence.
	 */
	protected static function bg_color_esc_seq( string $color ) : string {
		return "\033" . '[' . ( U\CLI::$bg_color_es_map[ $color ] ?? U\CLI::$bg_color_es_map[ 'none' ] ) . 'm';
	}

	/**
	 * Prepares CMD string.
	 *
	 * @since 2022-01-09
	 *
	 * @param array       $args Command arguments (unquoted/unescaped).
	 *                          This array can have multiple dimensions, which will be flattened here.
	 *
	 * @param string|null $dir  Current working directory. Defaults to `null` value.
	 *
	 * @return string Escaped/quoted command string.
	 */
	public static function prepare_cmd( array $args, /* string|null */ ?string $dir = null ) : string {
		$args = U\Arr::flatten( $args );
		$args = array_map( 'strval', $args );

		$cmd = $dir ? 'cd ' . U\Str::esc_shell_arg( $dir ) . ' && ' : '';
		$cmd .= implode( ' ', array_map( [ U\Str::class, 'esc_shell_arg' ], $args ) );

		return $cmd;
	}

	/**
	 * Runs a shell command (displays output).
	 *
	 * @param array       $args         Command arguments (unquoted/unescaped).
	 * @param string|null $dir          Current working directory. Defaults to `null` value.
	 * @param bool        $check_status Check status and throw exception on failure? Defaults to `true`.
	 *
	 * @throws U\Fatal_Exception If environment is lacking CLI functions.
	 *                         On non-zero exit status code or other issue.
	 *
	 * @return int Status code.
	 */
	public static function run( array $args, /* string|null */ ?string $dir = null, bool $check_status = true ) : int {
		if ( ! U\Env::can_use_function( 'escapeshellarg', 'passthru' ) ) {
			throw new U\Fatal_Exception(
				'Unable to use PHP’s `escapeshellarg()` and/or `passthru()` functions.' .
				' Have one or both of these PHP functions been disabled by your hosting company?'
			);
		}
		$cmd             = U\CLI::prepare_cmd( $args, $dir );
		U\CLI::$last_cmd = $cmd; // Records last CMD string.

		passthru( $cmd, $status );

		if ( $check_status && 0 !== $status ) {
			throw new U\Fatal_Exception(
				'Unexpected non-zero status `' . $status . '` when running `' . $cmd . '`.'
			);
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
	 * @throws U\Fatal_Exception If environment is lacking CLI functions.
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
			throw new U\Fatal_Exception(
				'Unable to use PHP’s `escapeshellarg()`, `proc_open()`, `proc_get_status()`, and/or `proc_close()` functions.' .
				' Have one or more of these PHP functions been disabled by your hosting company?'
			);
		}
		$response        = (object) [
			'status' => 0,
			'stdout' => '',
			'stderr' => '',
		];
		$config          = [
			0 => [ 'pipe', 'r' ], // stdin.
			1 => [ 'pipe', 'w' ], // stdout.
			2 => [ 'pipe', 'w' ], // stderr.
		];
		$cmd_no_dir      = U\CLI::prepare_cmd( $args );
		$cmd             = U\CLI::prepare_cmd( $args, $dir );
		U\CLI::$last_cmd = $cmd; // Record last CMD string.

		$process = proc_open( $cmd_no_dir, $config, $pipes, $dir );

		if ( ! is_resource( $process ) ) {
			if ( $check_status ) {
				throw new U\Fatal_Exception( 'Unexpected `proc_open()` failure when running `' . $cmd . '`.' );
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
			throw new U\Fatal_Exception(
				'Unexpected non-zero status `' . $response->status . '` when running `' . $cmd . '`.' .
				' ' . ( $response->stderr ?: $response->stdout )
			);
		}
		return $response;
	}
}
