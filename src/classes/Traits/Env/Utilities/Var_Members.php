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
	 * SECURITY: Please keep in mind that environment variables may contain sensitive information.
	 * A server's environment variables should not be passed and/or exposed either directly or indirectly to a user.
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
	 */
	public static function vars( array $others = [] ) : array {
		$vars = []; // Initialize.

		foreach ( [
			'USER_ID',
			'USER',
			'USER_LC',

			'HOME',
			'CWD',
			'PWD',
			'TMPDIR',

			'TERM',
			'HTTPS',
			'HTTP_HOST',
			'REQUEST_SCHEME',
			'HTTP_X_FORWARDED_SSL',
			'HTTP_X_FORWARDED_PROTO',
			'SERVER_NAME',
			'SERVER_ADMIN',
			'SERVER_PROTOCOL',

			'SERVER_ADDR',
			'HTTP_CF_CONNECTING_IP',
			'HTTP_TRUE_CLIENT_IP',
			'HTTP_CLIENT_IP',
			'HTTP_X_REAL_IP',
			'HTTP_X_CLUSTER_CLIENT_IP',
			'HTTP_X_FORWARDED_FOR',
			'HTTP_VIA',
			'REMOTE_ADDR',

			'APPDATA',
			'LOCALAPPDATA',
			'XDG_CACHE_HOME',
			'XDG_CONFIG_HOME',
			'XDG_DATA_HOME',
			'XDG_STATE_HOME',
			'PHP_SELF',
			'SCRIPT_NAME',
			'SCRIPT_FILENAME',
			'DOCUMENT_ROOT',
		] as $_name
		) {
			$vars[ $_name ] = U\Env::var( $_name );
		}
		$vars += $_SERVER + getenv(); // `$_SERVER` precedence.
		$vars = $others + $vars;      // Others get precedence.
		$vars = U\Bundle::stringify( $vars, true, 1 );

		return $vars;
	}

	/**
	 * Gets environment variable, by name.
	 *
	 * Note the absence of {@see U\Fs::realize()}.
	 * Callers should handle path realization on their own.
	 *
	 * SECURITY: Please keep in mind that environment variables may contain sensitive information.
	 * A server's environment variables should not be passed and/or exposed either directly or indirectly to a user.
	 *
	 * @since 2021-12-21
	 *
	 * @param string $name         Environment variable name.
	 * @param bool   $update_cache Update cache? Default is `false`.
	 *
	 * @return string Environment variable value; else empty string.
	 *
	 * @see   U\Env::vars() Before modifying this function.
	 * @see   U\Dir::sys_temp() Before modifying this function.
	 * @see   U\User::ip() Before modifying this function.
	 *
	 * @see   `clevercanyon/wordpress-sites/wp-content/private/c24s/wp-config/defaults.php`.
	 */
	public static function var( string $name, bool $update_cache = false ) : string {
		static $cache = []; // Memoize.

		if ( ! $update_cache && isset( $cache[ $name ] ) ) {
			return $cache[ $name ]; // Saves time.
		}
		$cache[ $name ] = '';               // Initialize.
		$value          =& $cache[ $name ]; // Cache reference.

		switch ( $name ) {
			case 'USER_ID':
				// Goal is to get the 'effective' user; not 'real' user.
				// i.e., `$ sudo cmd` should give us an effective `0` (root) user.

				if ( U\Env::is_windows() ) {
					// On Windows we're looking for the RID (relative) in SID.
					// {@see https://en.wikipedia.org/wiki/Security_Identifier}.
					// {@see https://www.windows-commandline.com/get-sid-of-user/}.

					if ( $whoami = U\CLI::try_exec( [ 'whoami', '/user', '/fo', 'list' ] )->stdout ) {
						preg_match( '/^SID\:\h*[a-z0-9\-]+-([0-9]+)\h*$/uim', $whoami, $_m );
						$value = $_m[ 1 ] ?? ''; // Relative ID (RID).
					} else {
						$value = ''; // Not possible.
					}
				} else {
					if ( U\Env::can_use_extension( 'posix' ) && U\Env::can_use_function( 'posix_geteuid' ) ) {
						/** @noinspection PhpComposerExtensionStubsInspection */ // phpcs:ignore.
						$value = (string) posix_geteuid();
					}
					// It's also possible to acquire this by writing to a temporary file.
					// However, for something so foundational as the current UID, FS writes
					// are just too expensive to run on every single request.
					// ~ Not implementing for that reason.

					if ( '' === $value ) { // CLI access.
						$value = U\CLI::try_exec( [ 'id', '--user' ] )->stdout;
					}
				}
				return $value; // Note that `0` is the `root` user.

			case 'USER':
			case 'USER_LC':
				// Goal is to get the 'effective' user. Not the 'real' user.
				// i.e., `$ sudo cmd` should give us an effective `root` user.
				// Not using `$ logname` or `LOGNAME` environment variable for that reason.

				if ( 'USER_LC' === $name && isset( $cache[ 'USER' ] ) ) {
					return $value = '' === $cache[ 'USER' ] ? '' : mb_strtolower( $cache[ 'USER' ] );
				}
				if ( U\Env::is_windows() ) {
					$value = U\Env::var_helper( 'USERNAME', 'USER' );
				} else {
					$value = U\Env::var_helper( 'USER', 'USERNAME' );

					if ( '' === $value && U\Env::can_use_extension( 'posix' ) && U\Env::can_use_function( 'posix_getpwuid', 'posix_geteuid' ) ) {
						/** @noinspection PhpComposerExtensionStubsInspection */ // phpcs:ignore.
						if ( $_posix = posix_getpwuid( posix_geteuid() ) ) {
							$value = (string) ( $_posix[ 'name' ] ?? '' );
						}
					}
				}
				if ( '' === $value && U\Env::is_apache() ) {
					$value = U\Env::var_helper( 'APACHE_RUN_USER' );
				}
				if ( '' === $value ) { // Works on Windows also.
					$value = U\CLI::try_exec( [ 'whoami' ] )->stdout;
				}
				// On Windows we may end up with `workgroup\user`.
				// The `workgroup` is pretty much useless; {@see https://o5p.me/uQSC7B}.
				if ( '' !== $value && U\Env::is_windows() && false !== mb_strpos( $value, '\\' ) ) {
					$value = mb_substr( mb_strrchr( $value, '\\' ), 1 );
				}
				return $value = '' === $value ? '' // ↓ CaSe transform.
					: ( 'USER_LC' === $name ? mb_strtolower( $value ) : $value );

			case 'HOME':

				if ( U\Env::is_windows() ) {
					$value = U\Env::var_helper( 'USERPROFILE', 'HOME' );

					if ( '' === $value ) {
						$_homedrive = U\Env::var_helper( 'HOMEDRIVE' );
						$_homepath  = $_homedrive ? U\Env::var_helper( 'HOMEPATH' ) : '';

						if ( '' !== $_homedrive && '' !== $_homepath ) {
							$value = $_homedrive . $_homepath;
						}
					}
				} else {
					$value = U\Env::var_helper( 'HOME' );

					if ( '' === $value && U\Env::can_use_extension( 'posix' ) && U\Env::can_use_function( 'posix_getpwuid', 'posix_geteuid' ) ) {
						/** @noinspection PhpComposerExtensionStubsInspection */ // phpcs:ignore.
						if ( $_posix = posix_getpwuid( posix_geteuid() ) ) {
							$value = (string) ( $_posix[ 'dir' ] ?? '' );
						}
					}
				}
				return $value = '' === $value ? '' : U\Fs::normalize( $value );

			case 'CWD': // Preferred approach.
			case 'PWD': // POSIX-compliant name.

				if ( U\Env::is_windows() ) {
					if ( '' === ( $value = getcwd() ) ) {
						$value = U\Env::var_helper( 'PWD', 'CD' );
					}
				} else {
					if ( '' === ( $value = getcwd() ) ) {
						$value = U\Env::var_helper( 'PWD' );
					}
				}
				return $value = '' === $value ? '' : U\Fs::normalize( $value );

			case 'TMPDIR':

				$value = U\Env::var_helper( 'TMPDIR', 'TEMP', 'TMP' );
				return $value = '' === $value ? '' : U\Fs::normalize( $value );

			// ↓ Lowercase.
			case 'TERM':
				// ↓ Lowercase.
			case 'HTTPS':
			case 'HTTP_HOST':
			case 'REQUEST_SCHEME':
			case 'HTTP_X_FORWARDED_SSL':
			case 'HTTP_X_FORWARDED_PROTO':
				// ↓ Lowercase.
			case 'SERVER_NAME':
			case 'SERVER_ADMIN':
			case 'SERVER_PROTOCOL':

				$value = U\Env::var_helper( $name );
				return $value = '' === $value ? '' : mb_strtolower( $value );

			// ↓ IP normalize.
			case 'SERVER_ADDR':
				// ↓ IP normalize.
			case 'HTTP_CF_CONNECTING_IP':
			case 'HTTP_TRUE_CLIENT_IP':
			case 'HTTP_CLIENT_IP':
			case 'HTTP_X_REAL_IP':
			case 'HTTP_X_CLUSTER_CLIENT_IP':
			case 'HTTP_X_FORWARDED_FOR':
			case 'HTTP_VIA':
			case 'REMOTE_ADDR':

				// Note: Some of these are lists of comma-delimited IPs.
				// The normalization accounts for these being in delimited lists.

				$value = U\Env::var_helper( $name );
				return $value = '' === $value ? '' : U\IP::normalize( $value );

			// ↓ Normalize.
			case 'APPDATA':
			case 'LOCALAPPDATA':
				// ↓ Normalize.
			case 'XDG_CACHE_HOME':
			case 'XDG_CONFIG_HOME':
			case 'XDG_DATA_HOME':
			case 'XDG_STATE_HOME':
				// ↓ Normalize.
			case 'PHP_SELF':       // Not WP-CLI friendly.
			case 'SCRIPT_NAME':    // Not WP-CLI friendly.
			case 'SCRIPT_FILENAME':// Not WP-CLI friendly.
			case 'DOCUMENT_ROOT':  // Not WP-CLI friendly.

				$value = U\Env::var_helper( $name );

				if ( '' === $value && 'DOCUMENT_ROOT' === $name ) {
					$value = (string) U\Env::static_var( 'C10N_' . $name );
				}
				return $value = '' === $value ? '' : U\Fs::normalize( $value );

			default: // If we have a `$name`.
				return $value = '' !== $name ? U\Env::var_helper( $name ) : '';
		}
	}

	/**
	 * Helps get environment variable.
	 *
	 * @since 2022-03-22
	 *
	 * @param string ...$names List of names to scan.
	 *
	 * @return string First non-zero-length scalar value as a string; else empty string.
	 *
	 * @see   `clevercanyon/wordpress-sites/wp-content/private/c24s/wp-config/defaults.php`.
	 */
	protected static function var_helper( string ...$names ) : string {
		foreach ( $names as $_name ) {
			if ( isset( $_SERVER[ $_name ] ) && '' !== $_SERVER[ $_name ] && is_scalar( $_SERVER[ $_name ] ) ) {
				return (string) $_SERVER[ $_name ]; // phpcs:ignore.
			}
			if ( false !== ( $_value = getenv( $_name ) ) && '' !== $_value && is_scalar( $_value ) ) {
				return (string) $_value;
			}
		}
		return '';
	}
}
