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
namespace Clever_Canyon\Utilities\Traits\Dir\Utilities;

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
 * @see   U\Dir
 */
trait Private_Members {
	/**
	 * Gets|makes private directory structure.
	 *
	 * Private directory components.
	 *
	 * `.c10n`       : A short, hidden, private base container.
	 *                 This directory will keep six very important files high up in the structure.
	 *
	 *                   1.,2.,3. `.c10n/index.{php,htm,html}` are specifically created to
	 *                      prevent directory auto-indexing across all known web server software.
	 *
	 *                   4. `.c10n/.htaccess` file that denies public access on Apache/LiteSpeed servers.
	 *                   5. `.c10n/web.config` XML file that denies public access on Windows IIS servers.
	 *
	 *                   6. `.c10n/.*.salt.php` file containing a salt that's used to calculate `$x_sha_hmac`.
	 *
	 * `$x_sha_hmac` : Salted package namespace crux in the form of a 32-byte {@see U\Crypto::x_sha_hmac()}.
	 *                 This structure considers there are many different packages creating private directories.
	 *                 A separate subdirectory is created for each package namespace crux. A `$salt` is used when
	 *                 building the HMAC hash, and therefore the only way to know the name of this directory is
	 *                 to gain PHP read access to the `.c10n/.*.salt.php` file.
	 *
	 *                   * A 16-byte `$x_sha_hmac` is used on Windows due to `MAX_PATH` of just 256 bytes.
	 *                     {@see U\Str::to_fsc()} method comments for further details regarding Windows `MAX_PATH`.
	 *
	 * `$context`    : Specific package data context based on {@see U\Pkg::data_context()}; e.g., `wps`, `web`, `uid`, etc.
	 *
	 * `$basename`   : Specific purpose; e.g., `tmp`, `cache`, `data`, etc. Keep in mind, the parent `.c10n/$x_sha_hmac/$context`
	 *                 can potentially be reused by other directory generators. It's important for there to be a specific purpose
	 *                 attached to each, and for each of those to use a different `$basename`.
	 *
	 * @since 2022-01-30
	 *
	 * @param string      $base_dir Base directory in which private structure lives.
	 *
	 * @param string|null $nsc_fqn  Namespace crux or FQN. Default is this package's `__NAMESPACE__`.
	 *                              Pass a `__NAMESPACE__`, `__CLASS__`, `::class`, `__TRAIT__`, `__METHOD__`,
	 *                              or `__FUNCTION__` (outside of a class). Or anything else that is a FQN.
	 *
	 * @param string      $basename Desired subdirectory basename.
	 *                              e.g., `temp`, `cache`, `config`, `data`, `state`.
	 *
	 * @return string Absolute directory path to `$basename`; else empty string.
	 *
	 * @throws U\Fatal_Exception When salt file exists, but salt file is not readable.
	 * @throws U\Fatal_Exception When directory exists, but it's no longer readable & writable.
	 */
	public static function private( string $base_dir, /*string|null */ ?string $nsc_fqn, string $basename ) : string {
		// Get namespace crux from `$nsc_fqn`.
		$namespace_crux = U\Pkg::namespace_crux( $nsc_fqn );

		// Early validation of `$base_dir` & `$basename`.
		// Note: The `$base_dir` must exist already.

		if ( ! $base_dir || ! $basename ) {
			return ''; // Not possible.
		}
		$base_dir = U\Fs::normalize( $base_dir );

		// Check for an already-cached response.

		$cache_key_parts = [ __FUNCTION__, $base_dir, $namespace_crux, $basename ];
		$cache           = &static::cls_cache( $cache_key_parts );

		if ( null !== $cache ) {
			return $cache; // Saves time.
		}
		// Continue validating `$base_dir`.
		// The `$base_dir` must exist already.

		if ( ! is_dir( $base_dir ) ) {
			return $cache = ''; // Not possible.
		}
		// Validate `/.c10n` directory.

		$c10n_dir = U\Dir::join( $base_dir, '/.c10n' );

		if ( ! is_dir( $c10n_dir ) ) {
			return $cache = U\Dir::maybe_create_private( $base_dir, $nsc_fqn, $basename );
		}
		// Acquire salt for calculation of `$x_sha_hmac`.

		if ( U\Env::is_wordpress() ) {
			$salt = wp_salt( 'c10n-dir-private' );
		} else {
			$salt      = ''; // Initialize.
			$salt_file = glob( U\Dir::join( $c10n_dir, '/.*.salt.php' ) );
			$salt_file = $salt_file ? $salt_file[ 0 ] : '';

			if ( ! $salt_file || ! is_file( $salt_file ) ) {
				return $cache = U\Dir::maybe_create_private( $base_dir, $nsc_fqn, $basename );
			}
			try { // Catch errors.
				if ( is_readable( $salt_file ) ) {
					$salt = include $salt_file;
				}
			} catch ( \Throwable $throwable ) {
				$salt = ''; // Failure.
			}
		}
		if ( ! $salt ) { // We should have a `$salt` now.
			throw new U\Fatal_Exception(
				'Unable to read `' . U\Dir::join( $c10n_dir, '/.*.salt.php' ) . '` file.' .
				' Have filesystem permissions changed?'
			);
		}
		// Formulate directory path and return.

		$x_sha_hmac_bytes = U\Env::is_windows() ? 16 : 32; // Shorter on Windows.
		$x_sha_hmac       = U\Crypto::x_sha_hmac( $namespace_crux, $salt, $x_sha_hmac_bytes );
		$context          = U\Pkg::data_context( 'fsc' ); // e.g., `web~foo.example.com`.

		$dir = U\Dir::join( $c10n_dir, '/' . $x_sha_hmac . '/' . $context . '/' . $basename );

		if ( ! is_dir( $dir ) ) { // Try creating it now.
			return $cache = U\Dir::maybe_create_private( $base_dir, $nsc_fqn, $basename );

		} elseif ( ! is_readable( $dir ) || ! is_writable( $dir ) ) {
			// Unrecoverable error; requires manual intervention.
			throw new U\Fatal_Exception(
				'The `' . $c10n_dir . '/` ... `' . $context . '/' . $basename . '` directory is no longer readable & writable.' .
				' Have filesystem permissions changed?'
			);
		}
		return $cache = $dir;
	}

	/**
	 * Gets|makes private directory structure.
	 *
	 * @since 2022-01-30
	 *
	 * @param string      $base_dir Base directory in which private structure lives.
	 *
	 * @param string|null $nsc_fqn  Namespace crux or FQN. Default is this package's `__NAMESPACE__`.
	 *                              Pass a `__NAMESPACE__`, `__CLASS__`, `::class`, `__TRAIT__`, `__METHOD__`,
	 *                              or `__FUNCTION__` (outside of a class). Or anything else that is a FQN.
	 *
	 * @param string      $basename Desired subdirectory basename.
	 *                              e.g., `temp`, `cache`, `config`, `data`, `state`.
	 *
	 * @return string Absolute directory path to `$basename` on success; else empty string.
	 *
	 * @throws U\Fatal_Exception When salt file exists, but salt file is not readable.
	 * @throws U\Fatal_Exception When directory exists, but it's no longer readable & writable.
	 * @throws U\Fatal_Exception On failure to create, read, or write any path that should be readable & writable.
	 */
	protected static function maybe_create_private( string $base_dir, /*string|null */ ?string $nsc_fqn, string $basename ) : string {
		// Get namespace crux from `$nsc_fqn`.
		$namespace_crux = U\Pkg::namespace_crux( $nsc_fqn );

		// Early validation of `$base_dir` & `$basename`.
		// Note: The `$base_dir` must exist already.

		if ( ! $base_dir || ! $basename ) {
			return ''; // Not possible.
		}
		// Maybe create `/.c10n` directory.

		$c10n_dir = U\Dir::join( $base_dir, '/.c10n' );

		if ( ! is_dir( $c10n_dir ) && ! U\Dir::make( $c10n_dir, [], false, false ) ) {
			return ''; // Failure; e.g., permissions issue.
		}
		// Maybe create `/.c10n/index.{php,htm,html}` files.

		$index_php_file  = U\Dir::join( $c10n_dir, '/index.php' );
		$index_htm_file  = U\Dir::join( $c10n_dir, '/index.htm' );
		$index_html_file = U\Dir::join( $c10n_dir, '/index.html' );

		foreach ( [ $index_php_file, $index_htm_file, $index_html_file ] as $_index_file ) {
			if ( ! is_file( $_index_file )
				&& ( ! U\File::make( $_index_file, [ null, 0644 ], false, false )
					|| ! U\File::write( $_index_file, 'Silence is golden.', false ) )
			) {
				U\Fs::delete( $_index_file ); // Fresh start next time.
				throw new U\Fatal_Exception(
					'Failed to create|write `' . $_index_file . '` file.' .
					' Have filesystem permissions changed?'
				);
			}
		}
		// Maybe create `.c10n/.htaccess` file.

		$htaccess_file = U\Dir::join( $c10n_dir, '/.htaccess' );

		if ( ! is_file( $htaccess_file ) ) {
			if ( ! U\File::make( $htaccess_file, [ null, 0644 ], false, false ) ) {
				U\Fs::delete( $htaccess_file ); // Fresh start next time.
				throw new U\Fatal_Exception(
					'Failed to create `' . $htaccess_file . '` file.' .
					' Have filesystem permissions changed?'
				);
			}
			/**
			 * Modern Apache & LiteSpeed w/ older Apache fallbacks.
			 * - Confirmed all modules are working with Apache v2.4.46 on 2022-02-02.
			 * - Confirmed all modules are working with LiteSpeed v6.0.8 on 2022-02-02.
			 */
			// This regexp has been thoroughly tested and works well at replacing `.htaccess` contents.
			// `/#\h*\<(' . U\Str::esc_reg( $htaccess_marker ) . ')(?:\h*\:{2}[^<>]*)?\>.*?\<\/\\1\>\s*/us`.

			$htaccess_marker        = U\Pkg::namespace_crux( $nsc_fqn, 'x_sha' );
			$htaccess_file_contents = <<<ooo
				# <$htaccess_marker::deny-public-access>
				<IfModule authz_core_module>
					Require all denied
				</IfModule>
				<IfModule !authz_core_module>
					<IfModule mod_authz_host.c>
						Order Deny,Allow
						Deny from all
					</IfModule>
				</IfModule>
				<IfModule rewrite_module>
					RewriteEngine on
					RewriteRule .* - [F,L]
				</IfModule>
				<IfModule !rewrite_module>
					<IfModule mod_rewrite.c>
						RewriteEngine on
						RewriteRule .* - [F,L]
					</IfModule>
				</IfModule>
				# </$htaccess_marker>
				ooo;
			if ( ! U\File::write( $htaccess_file, $htaccess_file_contents, false ) ) {
				U\Fs::delete( $htaccess_file ); // Fresh start next time.
				throw new U\Fatal_Exception(
					'Failed to write `' . $htaccess_file . '` file.' .
					' Have filesystem permissions changed?'
				);
			}
		}
		// Maybe create `.c10n/web.config` file.

		$web_config_file = U\Dir::join( $c10n_dir, '/web.config' );

		if ( ! is_file( $web_config_file ) ) {
			if ( ! U\File::make( $web_config_file, [ null, 0644 ], false, false ) ) {
				U\Fs::delete( $web_config_file ); // Fresh start next time.
				throw new U\Fatal_Exception(
					'Failed to create `' . $web_config_file . '` file.' .
					' Have filesystem permissions changed?'
				);
			}
			/**
			 * Modern Windows IIS web servers. Only works on IIS7?
			 * - Not confirmed working yet. Looking for best ways to test this.
			 *
			 * @todo IIS testing.
			 */
			$web_config_marker        = U\Pkg::namespace_crux( $nsc_fqn, 'x_sha' );
			$web_config_file_contents = <<<ooo
				<?xml version="1.0" encoding="utf-8" ?>
				<!-- $web_config_marker::deny-public-access -->
				<configuration>
					<system.web>
						<authorization>
							<deny users="*"/>
						</authorization>
					</system.web>
				</configuration>
				<!-- /$web_config_marker -->
				ooo;
			if ( ! U\File::write( $web_config_file, $web_config_file_contents, false ) ) {
				U\Fs::delete( $web_config_file ); // Fresh start next time.
				throw new U\Fatal_Exception(
					'Failed to write `' . $web_config_file . '` file.' .
					' Have filesystem permissions changed?'
				);
			}
		}
		// Maybe create `.c10n/.*.salt.php` file.

		if ( U\Env::is_wordpress() ) {
			$salt = wp_salt( 'c10n-dir-private' );
		} else {
			$salt      = ''; // Initialize.
			$salt_file = glob( U\Dir::join( $c10n_dir, '/.*.salt.php' ) );
			$salt_file = $salt_file ? $salt_file[ 0 ] : '';

			if ( is_file( $salt_file ) ) {
				try { // Catch errors.
					if ( is_readable( $salt_file ) ) {
						$salt = include $salt_file;
					}
				} catch ( \Throwable $throwable ) {
					$salt = ''; // Failure.
				}
			} else {
				$file_salt = U\Crypto::keygen( U\Env::is_windows() ? 32 : 64, false, true, true, true, false, false, false );
				$salt_file = U\Dir::join( $c10n_dir, '/.' . $file_salt . '.salt.php' );

				if ( U\File::make( $salt_file, [], false, false ) ) {
					$salt                     = U\Crypto::keygen( 128 );
					$salt_file_contents_value = var_export( $salt, true );
					$salt_file_contents       = <<<ooo
						<?php return $salt_file_contents_value;
						ooo;
					if ( ! U\File::write( $salt_file, $salt_file_contents, false ) ) {
						U\Fs::delete( $salt_file ); // Fresh start next time.
						$salt = '';                 // Failure.
					}
				} else {                        // Fresh start next time.
					U\Fs::delete( $salt_file ); // Exception below.
				}
			}
		}
		if ( ! $salt ) { // We should have a `$salt` now.
			throw new U\Fatal_Exception(
				'Unable to read|generate `' . U\Dir::join( $c10n_dir, '/.*.salt.php' ) . '` file.' .
				' Have filesystem permissions changed?'
			);
		}
		// Formulate directory path and return.

		$x_sha_hmac_bytes = U\Env::is_windows() ? 16 : 32; // Shorter on Windows.
		$x_sha_hmac       = U\Crypto::x_sha_hmac( $namespace_crux, $salt, $x_sha_hmac_bytes );
		$context          = U\Pkg::data_context( 'fsc' ); // e.g., `web~foo.example.com`.

		$dir = U\Dir::join( $c10n_dir, '/' . $x_sha_hmac . '/' . $context . '/' . $basename );

		if ( ! is_dir( $dir ) && ! U\Dir::make( $dir, [], true, false ) ) {
			U\Fs::delete( $dir ); // Fresh start next time.
			throw new U\Fatal_Exception(
				'Failed to create `' . $c10n_dir . '/` ... `' . $context . '/' . $basename . '`.' .
				' Have filesystem permissions changed?'
			);
		} elseif ( ! is_readable( $dir ) || ! is_writable( $dir ) ) {
			// Unrecoverable error; requires manual intervention.
			throw new U\Fatal_Exception(
				'The `' . $c10n_dir . '/` ... `' . $context . '/' . $basename . '` directory is no longer readable & writable.' .
				' Have filesystem permissions changed?'
			);
		}
		return $dir;
	}
}
