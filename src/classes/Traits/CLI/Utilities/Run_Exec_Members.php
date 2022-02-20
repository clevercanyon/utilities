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
trait Run_Exec_Members {
	/**
	 * Tries to run a shell command; displaying output as it runs.
	 *
	 * @param array       $args         {@see U\CLI::run()} for details.
	 * @param string|null $dir          {@see U\CLI::run()} for details.
	 * @param bool        $check_status {@see U\CLI::run()} for details.
	 *
	 * @return int Status code; {@see U\CLI::run()} for details.
	 */
	public static function try_run(
		array $args,
		/* string|null */ ?string $dir = null,
		bool $check_status = true
	) : int {
		return U\CLI::run( $args, $dir, $check_status, false );
	}

	/**
	 * Runs a shell command; displaying output as it runs.
	 *
	 * @param array       $args             Command arguments (unquoted/unescaped).
	 * @param string|null $dir              Current working directory. Defaults to `null` value.
	 * @param bool        $check_status     Check status and throw exception on failure? Defaults to `true`.
	 * @param bool        $throw_on_failure Throw exectpion on failure? Default is `true`.
	 *
	 * @return int Status code.
	 *
	 * @throws U\Fatal_Exception If environment is lacking CLI functions.
	 *                           On non-zero exit status code or other issue.
	 *                           * Does not throw exceptions if `$throw_on_failure` is `false`.
	 */
	public static function run(
		array $args,
		/* string|null */ ?string $dir = null,
		bool $check_status = true,
		bool $throw_on_failure = true
	) : int {
		if ( ! U\Env::can_use_function( 'escapeshellarg', 'passthru' ) ) {
			if ( $throw_on_failure ) {
				throw new U\Fatal_Exception(
					'Unable to use PHP’s `escapeshellarg()` and/or `passthru()` functions.' .
					' Have one or both of these PHP functions been disabled by your hosting company?'
				);
			}         // Else; not throwing.
			return 1; // Indicate run failure.
		}
		$cmd             = U\CLI::prepare_cmd( $args, $dir );
		U\CLI::$last_cmd = $cmd; // Records last CMD string.

		passthru( $cmd, $status );

		if ( $check_status && 0 !== $status ) {
			if ( $throw_on_failure ) {
				throw new U\Fatal_Exception(
					'Unexpected non-zero status `' . $status . '` when running `' . $cmd . '`.'
				);
			} // Else; not throwing.
		}
		return $status;
	}

	/**
	 * Tries to execute a shell command; returns object.
	 *
	 * @since         2021-12-15
	 *
	 * @param array       $args         {@see U\CLI::exec()} for details.
	 * @param string|null $dir          {@see U\CLI::exec()} for details.
	 * @param bool        $check_status {@see U\CLI::exec()} for details.
	 * @param string|null $stdin        {@see U\CLI::exec()} for details.
	 *
	 * @return object Object with properties `{}->status|stdout|stderr`.
	 */
	public static function try_exec(
		array $args,
		/* string|null */ ?string $dir = null,
		bool $check_status = true,
		/* string|null */ ?string $stdin = null
	) : object {
		return U\CLI::exec( $args, $dir, $check_status, false, $stdin );
	}

	/**
	 * Executes a shell command; returns object.
	 *
	 * @since         2021-12-15
	 *
	 * @param array       $args             Command arguments (unquoted/unescaped).
	 * @param string|null $dir              Current working directory. Defaults to `null` value.
	 * @param bool        $check_status     Check status and throw exception on failure? Defaults to `true`.
	 * @param bool        $throw_on_failure Throw exectpion on failure? Default is `true`.
	 * @param string|null $stdin            Stdin to send to command. Defaults to `null` value.
	 *
	 * @return object Object with properties `{}->status|stdout|stderr`.
	 *
	 * @throws U\Fatal_Exception If environment is lacking CLI functions.
	 *                           On non-zero exit status code or other issue.
	 *                           * Does not throw exceptions if `$throw_on_failure` is `false`.
	 *
	 * @future-review Review Windows changes in PHP 8+; {@see https://o5p.me/rUnbCC}.
	 * @future-review Output redirection is also supported, which could be implemented in the future.
	 *                {@see https://o5p.me/YJvL3s} for further details.
	 */
	public static function exec(
		array $args,
		/* string|null */ ?string $dir = null,
		bool $check_status = true,
		bool $throw_on_failure = true,
		/* string|null */ ?string $stdin = null
	) : object {
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
		if ( ! U\Env::can_use_function( 'escapeshellarg', 'proc_open', 'proc_get_status', 'proc_close' ) ) {
			if ( $throw_on_failure ) {
				throw new U\Fatal_Exception(
					'Unable to use PHP’s `escapeshellarg()`, `proc_open()`, `proc_get_status()`, and/or `proc_close()` functions.' .
					' Have one or more of these PHP functions been disabled by your hosting company?'
				);
			}
			return $response;
		}
		$cmd_no_dir      = U\CLI::prepare_cmd( $args );
		$cmd             = null === $dir ? $cmd_no_dir : U\CLI::prepare_cmd( $args, $dir );
		U\CLI::$last_cmd = $cmd; // Record last CMD string.

		if ( U\Env::is_windows() ) {
			$process = proc_open( $cmd_no_dir, $config, $pipes, $dir, [], [ 'bypass_shell' => true ] );
		} else {
			$process = proc_open( $cmd_no_dir, $config, $pipes, $dir, [], [] );
		}
		if ( ! is_resource( $process ) ) {
			if ( $throw_on_failure ) {
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
			if ( $throw_on_failure ) {
				throw new U\Fatal_Exception(
					'Unexpected non-zero status `' . $response->status . '` when running `' . $cmd . '`.' .
					' ' . ( $response->stderr ?: $response->stdout )
				);
			}                       // Else; not throwing.
			$response->stdout = ''; // Ensure empty on failure.
		}
		return $response;
	}

	/**
	 * Executes a shell command; returns object.
	 *
	 * @since         2021-12-15
	 *
	 * @param array       $args             Command arguments (unquoted/unescaped).
	 * @param string|null $dir              Current working directory. Defaults to `null` value.
	 * @param bool        $check_status     Check status and throw exception on failure? Defaults to `true`.
	 * @param bool        $throw_on_failure Throw exectpion on failure? Default is `true`.
	 *
	 * @return object Object with properties `{}->status|stdout|stderr`.
	 *
	 * @throws U\Fatal_Exception If environment is lacking CLI functions.
	 *                           On non-zero exit status code or other issue.
	 *                           * Does not throw exceptions if `$throw_on_failure` is `false`.
	 */
	public static function tty(
		array $args,
		/* string|null */ ?string $dir = null,
		bool $check_status = true,
		bool $throw_on_failure = true
	) : object {
		$response = (object) [
			'status' => 0,
			'stdout' => '',
			'stderr' => '',
		];
		$config   = [
			0 => [ 'tty' ], // stdin.
			1 => [ 'tty' ], // stdout.
			2 => [ 'tty' ], // stderr.
		];
		if ( ! U\Env::can_use_function( 'escapeshellarg', 'proc_open', 'proc_get_status', 'proc_close' ) ) {
			if ( $throw_on_failure ) {
				throw new U\Fatal_Exception(
					'Unable to use PHP’s `escapeshellarg()`, `proc_open()`, `proc_get_status()`, and/or `proc_close()` functions.' .
					' Have one or more of these PHP functions been disabled by your hosting company?'
				);
			}
			return $response;
		}
		$cmd_no_dir      = U\CLI::prepare_cmd( $args );
		$cmd             = null === $dir ? $cmd_no_dir : U\CLI::prepare_cmd( $args, $dir );
		U\CLI::$last_cmd = $cmd; // Record last CMD string.

		if ( U\Env::is_windows() ) {
			$process = proc_open( $cmd_no_dir, $config, $pipes, $dir, [], [ 'bypass_shell' => true ] );
		} else {
			$process = proc_open( $cmd_no_dir, $config, $pipes, $dir, [], [] );
		}
		if ( ! is_resource( $process ) ) {
			if ( $throw_on_failure ) {
				throw new U\Fatal_Exception( 'Unexpected `proc_open()` failure when running `' . $cmd . '`.' );
			}
			return $response;
		}
		$status           = proc_get_status( $process );
		$response->status = $status[ 'exitcode' ];
		proc_close( $process );

		if ( $check_status && 0 !== $response->status ) {
			if ( $throw_on_failure ) {
				throw new U\Fatal_Exception(
					'Unexpected non-zero status `' . $response->status . '` when running `' . $cmd . '`.' .
					' ' . ( $response->stderr ?: $response->stdout )
				);
			}                       // Else; not throwing.
			$response->stdout = ''; // Ensure empty on failure.
		}
		return $response;
	}
}
