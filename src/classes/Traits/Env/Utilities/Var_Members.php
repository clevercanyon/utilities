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
namespace Clever_Canyon\Utilities\Traits\Env\Utilities;

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
 * @see   U\Env
 */
trait Var_Members {
	/**
	 * Gets environment variables.
	 *
	 * @since 2021-12-21
	 *
	 * @param string[] $others Any other custom environment variables. Default is `[]`.
	 *                         These will override any existing environment variables with same names.
	 *
	 * @return string[] Environment variables.
	 *
	 * @see   U\Env::var() Before modifying this function.
	 * @see   https://en.wikipedia.org/wiki/Environment_variable
	 *
	 * @note  SECURITY: Please keep in mind that environment variables may contain sensitive information.
	 *        A server's environment variables should not be passed and/or exposed either directly or indirectly to a user.
	 */
	public static function vars( array $others = [] ) : array {
		$vars = []; // Initialize.

		foreach ( [ // {@see var()} below.
			'USER',
			'HOME',
			'CWD', // Aliased as `PWD` below.
			'TMPDIR',
			'PHP_SELF',
			'SCRIPT_NAME',
			'DOCUMENT_ROOT',
			'SCRIPT_FILENAME',
		] as $_var
		) {
			$vars[ $_var ] = U\Env::var( $_var );

			if ( 'CWD' === $_var ) {
				$vars[ 'PWD' ] = &$vars[ $_var ];
			}
		}
		$vars += getenv() + $_SERVER;
		$vars = $others + $vars; // Gives `$others` precedence.
		$vars = U\Bundle::stringify( $vars, true, 1 );

		return $vars;
	}

	/**
	 * Gets environment variable.
	 *
	 * @since 2021-12-21
	 *
	 * @param string $var Variable.
	 * @param array  $_d  Internal use only — do not pass.
	 *
	 * @return string Environment variable, else empty string.
	 *
	 * @see   https://en.wikipedia.org/wiki/Environment_variable
	 *
	 * @note  Absence of {@see U\Fs::realize()} here. Callers should handle that as necessary.
	 *        One exception is `TMPDIR` via {@see U\Dir::sys_temp()}, which does use {@see U\Fs::realize()}.
	 *
	 * @see   U\Env::vars() Before modifying this function.
	 * @see   U\Env::sys_temp() Before modifying.
	 * @see   U\User::ip() Before modifying.
	 *
	 * @note  SECURITY: Please keep in mind that environment variables may contain sensitive information.
	 *        A server's environment variables should not be passed and/or exposed either directly or indirectly to a user.
	 */
	public static function var( string $var, array $_d = [] ) : string {
		$is_windows  = U\Env::is_windows();
		$fsn_d_cache = [ 'cache' => [ __METHOD__, $var ] ];

		switch ( $var ) {
			case 'USER':
				if ( $is_windows ) {
					$value = getenv( 'USERNAME' );
				} else {
					$value = getenv( 'USER' );
				}
				return (string) $value;

			case 'HOME':
				if ( $is_windows ) {
					if ( ! $value = getenv( 'USERPROFILE' ) ) {
						$_homedrive = getenv( 'HOMEDRIVE' );
						$_homepath  = $_homedrive ? getenv( 'HOMEPATH' ) : '';

						if ( $_homedrive && $_homepath ) {
							$value = $_homedrive . $_homedrive;
						}
					}
				} else {
					$value = getenv( 'HOME' );
				}
				return U\Fs::normalize( (string) $value, $fsn_d_cache );

			case 'CWD': // Preferred approach.
			case 'PWD': // Weird POSIX-compliant name.
				if ( $is_windows ) {
					$value = getcwd() ?: getenv( 'PWD' ) ?: getenv( 'CD' );
				} else {
					$value = getcwd() ?: getenv( 'PWD' );
				}
				return U\Fs::normalize( (string) $value, $fsn_d_cache );

			case 'TMPDIR':
				if ( empty( $_d[ 'bypass:U\\Dir::sys_temp' ] ) ) {
					return U\Dir::sys_temp();
				}
				$value = getenv( 'TMPDIR' ) ?: getenv( 'TEMP' ) ?: getenv( 'TMP' );
				return U\Fs::normalize( (string) $value, $fsn_d_cache );

			case 'REMOTE_ADDR':
				if ( empty( $_d[ 'bypass:U\\User::ip' ] ) ) {
					return U\User::ip(); // Handles delimitation, normalization, etc.
				}
				return (string) getenv( 'REMOTE_ADDR' ); // Possibly a delimited string of IPs.

			case 'PHP_SELF': // ↓ Normalize.
			case 'SCRIPT_NAME':
			case 'DOCUMENT_ROOT':
			case 'SCRIPT_FILENAME':
				return U\Fs::normalize( (string) getenv( $var ), $fsn_d_cache );

			default:
				return $var ? (string) getenv( $var ) : '';
		}
	}
}
