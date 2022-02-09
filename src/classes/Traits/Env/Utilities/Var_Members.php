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
			'APPDATA',
			'CWD',
			'DOCUMENT_ROOT',
			'HOME',
			'HTTPS',
			'HTTP_CF_CONNECTING_IP',
			'HTTP_CLIENT_IP',
			'HTTP_FORWARDED',
			'HTTP_FORWARDED_FOR',
			'HTTP_HOST',
			'HTTP_VIA',
			'HTTP_X_CLUSTER_CLIENT_IP',
			'HTTP_X_FORWARDED',
			'HTTP_X_FORWARDED_FOR',
			'HTTP_X_FORWARDED_PROTO',
			'HTTP_X_REAL_IP',
			'LOCALAPPDATA',
			'PHP_SELF',
			'REMOTE_ADDR',
			'REQUEST_SCHEME',
			'SCRIPT_FILENAME',
			'SCRIPT_NAME',
			'SERVER_ADDR',
			'SERVER_ADMIN',
			'SERVER_NAME',
			'SERVER_PROTOCOL',
			'TERM',
			'TMPDIR',
			'USER',
			'USER_ID',
			'USER_LC',
			'XDG_CACHE_HOME',
			'XDG_CONFIG_HOME',
			'XDG_DATA_HOME',
			'XDG_STATE_HOME',
		] as $_name
		) {
			$vars[ $_name ] = U\Env::var( $_name );

			if ( 'CWD' === $_name ) {
				$vars[ 'PWD' ] = &$vars[ $_name ];
			}
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
	 * @param string $name Environment variable name.
	 *
	 * @return string Environment variable value; else empty string.
	 *
	 * @see   U\Env::vars() Before modifying this function.
	 * @see   U\Dir::sys_temp() Before modifying this function.
	 * @see   U\User::ip() Before modifying this function.
	 */
	public static function var( string $name ) : string {
		static $cache = []; // Memoize.

		if ( isset( $cache[ $name ] ) ) {
			return $cache[ $name ]; // Saves time.
		}
		$cache[ $name ] = null;             // Initialize.
		$value          =& $cache[ $name ]; // Cache reference.

		$_s = &$_SERVER; // phpcs:ignore.

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

					if ( ! $value && '0' !== $value ) { // CLI access.
						$value = U\CLI::try_exec( [ 'id', '--user' ] )->stdout;
					}
				} // Note that `'0'` is the `root` user.
				return $value = (string) $value; // Force string.

			case 'USER':
			case 'USER_LC':
				// Goal is to get the 'effective' user; not 'real' user.
				// i.e., `$ sudo cmd` should give us an effective `root` user.
				// Not using `$ logname` or `LOGNAME` environment variable for that reason.

				if ( 'USER_LC' === $name && isset( $cache[ 'USER' ] ) ) {
					return $value = '' === $cache[ 'USER' ] ? '' : mb_strtolower( $cache[ 'USER' ] );
				}
				if ( U\Env::is_windows() ) {
					$value = ( $_s[ 'USERNAME' ] ?? '' ) ?: getenv( 'USERNAME' )
						?: ( $_s[ 'USER' ] ?? '' ) ?: getenv( 'USER' );
				} else {
					$value = ( $_s[ 'USER' ] ?? '' ) ?: getenv( 'USER' )
						?: ( $_s[ 'USERNAME' ] ?? '' ) ?: getenv( 'USERNAME' );

					if ( ! $value && U\Env::can_use_extension( 'posix' ) && U\Env::can_use_function( 'posix_getpwuid', 'posix_geteuid' ) ) {
						/** @noinspection PhpComposerExtensionStubsInspection */ // phpcs:ignore.
						if ( $_posix = posix_getpwuid( posix_geteuid() ) ) {
							$value = $_posix[ 'name' ] ?? '';
						}
					}
				}
				if ( ! $value && U\Env::is_apache() ) {
					$value = ( $_s[ 'APACHE_RUN_USER' ] ?? '' ) ?: getenv( 'APACHE_RUN_USER' );
				}
				if ( ! $value ) { // CLI access.
					// This works on Windows also.
					$value = U\CLI::try_exec( [ 'whoami' ] )->stdout;
				}
				$value = (string) $value; // Force string.

				// On Windows we may end up with `workgroup\user`.
				// The `workgroup` is pretty much useless; {@see https://o5p.me/uQSC7B}.
				if ( $value && U\Env::is_windows() && false !== mb_strpos( $value, '\\' ) ) {
					$value = mb_substr( mb_strrchr( $value, '\\' ), 1 );
				}
				return $value = '' === $value ? '' // ↓ CaSe transform.
					: ( 'USER_LC' === $name ? mb_strtolower( $value ) : $value );

			case 'HOME':

				if ( U\Env::is_windows() ) {
					$value = ( $_s[ 'USERPROFILE' ] ?? '' ) ?: getenv( 'USERPROFILE' )
						?: ( $_s[ 'HOME' ] ?? '' ) ?: getenv( 'HOME' );

					if ( ! $value ) {
						$_homedrive = ( $_s[ 'HOMEDRIVE' ] ?? '' ) ?: getenv( 'HOMEDRIVE' );
						$_homepath  = $_homedrive ? ( ( $_s[ 'HOMEPATH' ] ?? '' ) ?: getenv( 'HOMEPATH' ) ) : '';

						if ( $_homedrive && $_homepath ) {
							$value = $_homedrive . $_homedrive;
						}
					}
				} else {
					$value = ( $_s[ 'HOME' ] ?? '' ) ?: getenv( 'HOME' );

					if ( ! $value && U\Env::can_use_extension( 'posix' ) && U\Env::can_use_function( 'posix_getpwuid', 'posix_geteuid' ) ) {
						/** @noinspection PhpComposerExtensionStubsInspection */ // phpcs:ignore.
						if ( $_posix = posix_getpwuid( posix_geteuid() ) ) {
							$value = $_posix[ 'dir' ] ?? '';
						}
					}
				}
				$value = (string) $value; // Force string.
				return $value = '' === $value ? '' : U\Fs::normalize( $value );

			case 'CWD': // Preferred approach.
			case 'PWD': // POSIX-compliant name.

				if ( U\Env::is_windows() ) {
					$value = getcwd()
						?: ( $_s[ 'PWD' ] ?? '' ) ?: getenv( 'PWD' )
							?: ( $_s[ 'CD' ] ?? '' ) ?: getenv( 'CD' );
				} else {
					$value = getcwd()
						?: ( $_s[ 'PWD' ] ?? '' ) ?: getenv( 'PWD' );
				}
				$value = (string) $value; // Force string.
				return $value = '' === $value ? '' : U\Fs::normalize( $value );

			case 'TMPDIR':

				$value = ( $_s[ 'TMPDIR' ] ?? '' ) ?: getenv( 'TMPDIR' )
					?: ( $_s[ 'TEMP' ] ?? '' ) ?: getenv( 'TEMP' )
						?: ( $_s[ 'TMP' ] ?? '' ) ?: getenv( 'TMP' );

				$value = (string) $value; // Force string.
				return $value = '' === $value ? '' : U\Fs::normalize( $value );

			// ↓ Lowercase.
			case 'TERM':
				// ↓ Lowercase.
			case 'HTTPS':
			case 'HTTP_HOST':
			case 'REQUEST_SCHEME':
			case 'HTTP_X_FORWARDED_PROTO':
				// ↓ Lowercase.
			case 'SERVER_NAME':
			case 'SERVER_ADDR':
			case 'SERVER_ADMIN':
			case 'SERVER_PROTOCOL':
				// ↓ Lowercase.
			case 'HTTP_CF_CONNECTING_IP':
			case 'HTTP_X_REAL_IP':
			case 'HTTP_CLIENT_IP':
			case 'HTTP_X_CLUSTER_CLIENT_IP':
			case 'HTTP_X_FORWARDED_FOR':
			case 'HTTP_X_FORWARDED':
			case 'HTTP_FORWARDED_FOR':
			case 'HTTP_FORWARDED':
			case 'HTTP_VIA':
			case 'REMOTE_ADDR':

				$value = ( $_s[ $name ] ?? '' ) ?: getenv( $name );
				$value = (string) $value; // Force string.
				return $value = '' === $value ? '' : mb_strtolower( $value );

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

				if ( 'DOCUMENT_ROOT' === $name ) {
					$value = ( $_s[ $name ] ?? '' ) ?: getenv( $name )
						?: U\Env::static_var( $name );
				} else {
					$value = ( $_s[ $name ] ?? '' ) ?: getenv( $name );
				}
				$value = (string) $value; // Force string.
				return $value = '' === $value ? '' : U\Fs::normalize( $value );

			default: // If we have a `$name`.

				$value = $name ? ( ( $_s[ $name ] ?? '' ) ?: getenv( $name ) ) : '';
				return $value = (string) $value; // Force string.
		}
	}
}
