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
use GetOpt\{GetOpt as Parser, Command, Option, Operand};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\CLI_Tool
 */
trait Utility_Members {
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
	 * Locates nearest project directory to CLI script file.
	 *
	 * The trick here is to start from the current CLI script file path (as it was called),
	 * convert that path, which is likely relative, to an absolute path. Then look up the directory tree
	 * in search of a project directory; i.e., containing `/composer.json` and `vendor/autoload.php`.
	 *
	 * Additionally, this skips over project directories that are symlinks,
	 * as those are considered inner dependencies; i.e., not top-level project directories.
	 * To clarify further. Symlinks are bypassed because we use them locally for development.
	 * e.g., `[project-dir]/vendor/clevercanyon/[project-dir-symlink]/composer.json`.
	 *
	 * @since 2022-01-16
	 *
	 * @return string Nearest project directory to CLI script file.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\CLI::locate_nearest_project_dir()
	 */
	protected function locate_nearest_project_dir() : string {
		// `$argv[ 0 ]` is likely relative.
		// Resolve here; w/o resolving symlinks.

		global $argv;
		$path = $argv[ 0 ];

		$script_file = U\Fs::abs( $path );
		$script_dir  = U\Dir::name( $script_file );

		// Confirm that we are starting from a good location.
		// If either of these are false we have a serious problem.

		if ( ! is_file( $script_file ) ) {
			throw new U\Fatal_Exception( 'Failed to acquire absolute path to script file: `' . $script_file . '`.' );
		}
		if ( ! is_dir( $script_dir ) ) {
			throw new U\Fatal_Exception( 'Failed to acquire absolute path to script directory: `' . $script_dir . '`.' );
		}
		// Look for nearest project directory that's not a symlink.
		// Symlinks are bypassed because we use them locally for development.
		// e.g., `[project-dir]/vendor/clevercanyon/[project-dir-symlink]/composer.json`.

		for ( $_i = 0; $_i <= 25; $_i++ ) {
			$_project_dir           = $_i
				? U\Dir::name( $script_dir, $_i ) : $script_dir;
			$_project_file          = U\Dir::join( $_project_dir, '/composer.json' );
			$_project_autoload_file = U\Dir::join( $_project_dir, '/vendor/autoload.php' );

			if ( ! is_link( $_project_dir ) && is_file( $_project_file ) && is_file( $_project_autoload_file ) ) {
				$_real_project_dir = U\Fs::realize( $_project_dir );

				if ( ! $_real_project_dir || ! is_dir( $_real_project_dir ) ) {
					throw new U\Fatal_Exception( 'Failed to acquire real project directory.' );
				}
				return $_real_project_dir;
			}
		}
		// Trigger error on any failure.

		throw new U\Fatal_Exception( 'Failed to acquire project directory.' );
	}
}
