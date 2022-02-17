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
trait Prepare_CMD_Members {
	/**
	 * Prepares CMD string.
	 *
	 * @since 2022-01-09
	 *
	 * @param array       $args         Command arguments (unquoted/unescaped).
	 *                                  This array can have multiple dimensions, which will be flattened here.
	 *
	 * @param string|null $dir          Current working directory. Defaults to `null` value.
	 *
	 * @return string Escaped/quoted command string.
	 */
	public static function prepare_cmd(
		array $args,
		/* string|null */ ?string $dir = null
	) : string {
		$env_vars  = $args[ '::env_vars' ] ?? [];               // e.g., `A=B`, `C=D`, `E=F`, etc.
		$redirects = $args[ '::redirects' ] ?? [];              // e.g., `&>/dev/null`, `&>/dev/null &`.
		unset( $args[ '::env_vars' ], $args[ '::redirects' ] ); // Not actually arguments.

		$env_vars  = array_map( 'strval', U\Arr::flatten( $env_vars ) );
		$args      = array_map( 'strval', U\Arr::flatten( $args ) );
		$redirects = array_map( 'strval', U\Arr::flatten( $redirects ) );

		$cmd = ''; // Initialize.
		foreach ( $env_vars as $_env_var ) {
			$cmd .= 'export ' . $_env_var . '; ';
		}
		$cmd .= $dir ? 'cd ' . U\Str::esc_shell_arg( $dir ) . ' && ' : '';
		$cmd .= implode( ' ', array_map( [ U\Str::class, 'esc_shell_arg' ], $args ) );
		$cmd .= $redirects ? ' ' . implode( ' ', $redirects ) : '';

		return $cmd;
	}
}
