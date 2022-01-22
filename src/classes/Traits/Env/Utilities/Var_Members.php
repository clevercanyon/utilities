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
	 * @see   U\Env::vars() Before modifying this function
	 * @see   U\Env::sys_temp() Before modifying.
	 */
	public static function var( string $var, array $_d = [] ) : string {
		switch ( $var ) {
			case 'USER': // Current user's username.
				$value = getenv( $var ) // POSIX: Unix/Linux, macOS.
					?: getenv( 'USERNAME' ); // Windows.
				break;

			case 'HOME': // Current user's home directory.
				// {@see https://en.wikipedia.org/wiki/Home_directory}.
				$value = getenv( $var ) // POSIX: Unix/Linux, macOS.
					?: getenv( 'USERPROFILE' ) // Windows; easier than drive+path.
						?: ( getenv( 'HOMEDRIVE' ) . getenv( 'HOMEPATH' ) ); // Windows.
				$value = U\Fs::normalize( (string) $value, [ 'cache' => [ __METHOD__, $var ] ] );
				break;

			case 'CWD': // Current working directory.
			case 'PWD': // Kinda weird POSIX-compliant name.
				// {@see https://en.wikipedia.org/wiki/Pwd} for details.
				// Preference is `CWD`, but `PWD` is standards compliant, so it's here also.
				$value = getcwd() // PHP: Unix/Linux, macOS, Windows.
					?: getenv( 'PWD' ) // POSIX: Unix/Linux, macOS.
						?: getenv( 'CD' ); // Windows.
				$value = U\Fs::normalize( (string) $value, [ 'cache' => [ __METHOD__, $var ] ] );
				break;

			case 'TMPDIR': // Temporary directory.
				// {@see https://en.wikipedia.org/wiki/TMPDIR}.
				$value = ! empty( $_d[ 'bypass:U\\Dir::sys_temp' ] ) ? '' : U\Dir::sys_temp();
				$value = $value ?: getenv( $var ) // POSIX: Unix/Linux, macOS, Windows.
					?: getenv( 'TEMP' ) ?: getenv( 'TMP' ); // Unix/Linux, macOS.
				$value = U\Fs::normalize( (string) $value, [ 'cache' => [ __METHOD__, $var ] ] );
				break;

			case 'REMOTE_ADDR': // Remote IP address.
				// {@see https://o5p.me/VfrDPz} for details.
				$value = ! empty( $_d[ 'bypass:U\\User::ip' ] ) ? '' : U\User::ip();
				$value = mb_strtolower( $value ?: getenv( $var ) );
				break;

			case 'PHP_SELF': // ↓ Normalize.
			case 'SCRIPT_NAME':
			case 'DOCUMENT_ROOT':
			case 'SCRIPT_FILENAME':
				$value = getenv( $var );
				$value = U\Fs::normalize( (string) $value, [ 'cache' => [ __METHOD__, $var ] ] );
				break;

			default: // If `$var` is not empty.
				$value = $var ? getenv( $var ) : '';
		}
		return (string) $value;
	}

	/**
	 * Gets environment variables.
	 *
	 * @since 2021-12-21
	 *
	 * @param string[] $others Any other custom environment vars. Default is `[]`.
	 *                         These will override any existing environment vars with same name.
	 *
	 * @return string[] Environment variables.
	 *
	 * @see   U\Env::var() When modifying.
	 * @see   https://en.wikipedia.org/wiki/Environment_variable
	 */
	public static function vars( array $others = [] ) : array {
		$vars = []; // Initialize.

		foreach ( [ // {@see var()} below.
			'USER',
			'HOME',
			'CWD',
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
		$vars = U\Ctn::stringify( $vars, true, 1 );

		return $vars;
	}
}
