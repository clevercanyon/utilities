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
 * Lint configuration.
 *
 * @since        2021-12-25
 *
 * @noinspection PhpComposerExtensionStubsInspection
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\A6t\Database\Magic;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\Database
 */
trait Constructable_Members {
	/**
	 * Constructor.
	 *
	 * @since        2021-12-15
	 *
	 * @param array $config Configuration.
	 *
	 * @throws U\Fatal_Exception On missing extension|class.
	 * @throws \PDOException On any & all MySQL database exceptions.
	 *
	 * @noinspection PhpMultipleClassDeclarationsInspection
	 */
	public function __construct( array $config = [] ) {
		parent::__construct();

		// Check Memcached extension.

		static $can_use_extension; // Remember.
		$can_use_extension ??= U\Env::can_use_extension( 'pdo' );

		if ( ! $can_use_extension ) {
			throw new U\Fatal_Exception( 'Missing PHP `pdo` extension.' );
		}
		// Database type validation.

		if ( $this->type && 'mysql' !== $this->type ) {
			throw new U\Fatal_Exception( 'Unsupported PDO type: `' . $this->type . '`.' );
		}
		$this->type = 'mysql'; // Only `mysql` is supported at this time.

		// Establish configuration options.

		$default_config_options = [
			'host' => 'localhost',
			'port' => '3306',

			'database' => '',
			'username' => 'root',
			'password' => '',

			'charset' => 'utf8mb4',
			'collate' => 'utf8mb4_unicode_ci',

			'ssl_enable' => false,
			'ssl_verify' => true,

			'ssl_ca_file'  => '',
			'ssl_key_file' => '',
			'ssl_crt_file' => '',
			'ssl_cipher'   => '',

			'connection_options' => [],
			'connection_id_salt' => '',
		];
		if ( ! $config ) { // Only if no configuration has been given.
			if ( U\Env::static_var( 'DATABASE_HOST' ) ) {
				$default_config_options = [
					'host' => U\Env::static_var( 'DATABASE_HOST' ) ?: $default_config_options[ 'host' ],
					'port' => U\Env::static_var( 'DATABASE_PORT' ) ?: $default_config_options[ 'port' ],

					'database' => U\Env::static_var( 'DATABASE_NAME' ) ?: $default_config_options[ 'name' ],
					'username' => U\Env::static_var( 'DATABASE_USERNAME' ) ?: $default_config_options[ 'username' ],
					'password' => U\Env::static_var( 'DATABASE_PASSWORD' ) ?: $default_config_options[ 'password' ],

					'charset' => U\Env::static_var( 'DATABASE_CHARSET' ) ?: $default_config_options[ 'charset' ],
					'collate' => U\Env::static_var( 'DATABASE_COLLATE' ) ?: $default_config_options[ 'collate' ],

					'ssl_enable' => u\if_bool( U\Env::static_var( 'DATABASE_SSL_ENABLE' ), $default_config_options[ 'ssl_enable' ] ),
					'ssl_verify' => u\if_bool( U\Env::static_var( 'DATABASE_SSL_VERIFY' ), $default_config_options[ 'ssl_verify' ] ),

					'ssl_ca_file'  => U\Env::static_var( 'DATABASE_SSL_CA_FILE' ) ?: $default_config_options[ 'ssl_ca_file' ],
					'ssl_key_file' => U\Env::static_var( 'DATABASE_SSL_KEY_FILE' ) ?: $default_config_options[ 'ssl_key_file' ],
					'ssl_crt_file' => U\Env::static_var( 'DATABASE_SSL_CRT_FILE' ) ?: $default_config_options[ 'ssl_crt_file' ],
					'ssl_cipher'   => U\Env::static_var( 'DATABASE_SSL_CIPHER' ) ?: $default_config_options[ 'ssl_cipher' ],

					'connection_options' => U\Env::static_var( 'DATABASE_CONNECTION_OPTIONS' ) ?: $default_config_options[ 'connection_options' ],
					'connection_id_salt' => U\Env::static_var( 'DATABASE_CONNECTION_ID_SALT' ) ?: $default_config_options[ 'connection_id_salt' ],
				];
			} elseif ( U\Env::var( 'WORDPRESS_DB_HOST' ) ) {
				$default_config_options = [
					'host' => U\Env::var( 'WORDPRESS_DB_HOST' ) ?: $default_config_options[ 'host' ],
					'port' => U\Env::var( 'WORDPRESS_DB_PORT' ) ?: $default_config_options[ 'port' ],

					'database' => U\Env::var( 'WORDPRESS_DB_NAME' ) ?: $default_config_options[ 'name' ],
					'username' => U\Env::var( 'WORDPRESS_DB_USER' ) ?: $default_config_options[ 'username' ],
					'password' => U\Env::var( 'WORDPRESS_DB_PASSWORD' ) ?: $default_config_options[ 'password' ],

					'charset' => U\Env::var( 'WORDPRESS_DB_CHARSET' ) ?: $default_config_options[ 'charset' ],
					'collate' => U\Env::var( 'WORDPRESS_DB_COLLATE' ) ?: $default_config_options[ 'collate' ],

					'ssl_enable' => u\if_bool( U\Env::var( 'WORDPRESS_DB_SSL_ENABLE' ), $default_config_options[ 'ssl_enable' ] ),
					'ssl_verify' => u\if_bool( U\Env::var( 'WORDPRESS_DB_SSL_VERIFY' ), $default_config_options[ 'ssl_verify' ] ),

					'ssl_ca_file'  => U\Env::var( 'WORDPRESS_DB_SSL_CA_FILE' ) ?: $default_config_options[ 'ssl_ca_file' ],
					'ssl_key_file' => U\Env::var( 'WORDPRESS_DB_SSL_KEY_FILE' ) ?: $default_config_options[ 'ssl_key_file' ],
					'ssl_crt_file' => U\Env::var( 'WORDPRESS_DB_SSL_CRT_FILE' ) ?: $default_config_options[ 'ssl_crt_file' ],
					'ssl_cipher'   => U\Env::var( 'WORDPRESS_DB_SSL_CIPHER' ) ?: $default_config_options[ 'ssl_cipher' ],

					'connection_options' => U\Env::var( 'WORDPRESS_DB_CONNECTION_OPTIONS' ) ?: $default_config_options[ 'connection_options' ],
					'connection_id_salt' => U\Env::var( 'WORDPRESS_DB_CONNECTION_ID_SALT' ) ?: $default_config_options[ 'connection_id_salt' ],
				];
			} elseif ( defined( 'DB_HOST' ) ) {
				$default_config_options = [
					'host' => U\Env::const( 'DB_HOST' ) ?: $default_config_options[ 'host' ],
					'port' => U\Env::const( 'DB_PORT' ) ?: $default_config_options[ 'port' ],

					'database' => U\Env::const( 'DB_NAME' ) ?: $default_config_options[ 'name' ],
					'username' => U\Env::const( 'DB_USER' ) ?: $default_config_options[ 'username' ],
					'password' => U\Env::const( 'DB_PASSWORD' ) ?: $default_config_options[ 'password' ],

					'charset' => U\Env::const( 'DB_CHARSET' ) ?: $default_config_options[ 'charset' ],
					'collate' => U\Env::const( 'DB_COLLATE' ) ?: $default_config_options[ 'collate' ],

					'ssl_enable' => u\if_bool( U\Env::const( 'DB_SSL_ENABLE' ), $default_config_options[ 'ssl_enable' ] ),
					'ssl_verify' => u\if_bool( U\Env::const( 'DB_SSL_VERIFY' ), $default_config_options[ 'ssl_verify' ] ),

					'ssl_ca_file'  => U\Env::const( 'DB_SSL_CA_FILE' ) ?: $default_config_options[ 'ssl_ca_file' ],
					'ssl_key_file' => U\Env::const( 'DB_SSL_KEY_FILE' ) ?: $default_config_options[ 'ssl_key_file' ],
					'ssl_crt_file' => U\Env::const( 'DB_SSL_CRT_FILE' ) ?: $default_config_options[ 'ssl_crt_file' ],
					'ssl_cipher'   => U\Env::const( 'DB_SSL_CIPHER' ) ?: $default_config_options[ 'ssl_cipher' ],

					'connection_options' => U\Env::const( 'DB_CONNECTION_OPTIONS' ) ?: $default_config_options[ 'connection_options' ],
					'connection_id_salt' => U\Env::const( 'DB_CONNECTION_ID_SALT' ) ?: $default_config_options[ 'connection_id_salt' ],
				];
			}
		}
		if ( false !== mb_strpos( $default_config_options[ 'host' ], ':' ) ) {
			[ $default_config_options[ 'host' ], $default_config_options[ 'port' ] ]
				= explode( ':', $default_config_options[ 'host' ], 2 );
		}
		$this->config = (object) ( $config + $default_config_options );

		// Establish connection options.

		$default_connection_options = [
			// Use pesistent connections;                                  {@see https://o5p.me/EPhSUM}.
			\PDO::ATTR_PERSISTENT => null,                                 // `true`|Persistent ID — enforced below.
			\PDO::ATTR_TIMEOUT    => 3,                                    // Default is `2`; bumping just slightly.

			\PDO::ATTR_AUTOCOMMIT       => true,                           // {@see https://o5p.me/OEQKqc}.
			\PDO::ATTR_EMULATE_PREPARES => false,                          // {@see https://o5p.me/WIQVCo}.

			\PDO::ATTR_CASE               => \PDO::CASE_NATURAL,           // {@see https://o5p.me/FeWe8y}.
			\PDO::ATTR_ORACLE_NULLS       => \PDO::NULL_NATURAL,           // {@see https://o5p.me/JnENTo}.
			\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_OBJ,              // {@see https://o5p.me/rb6IlH}.

			\PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,                    // {@see https://o5p.me/buyWtS}.
			\PDO::ATTR_ERRMODE                  => \PDO::ERRMODE_EXCEPTION, // {@see https://o5p.me/UBxYXc}.
		];
		if ( $this->config->charset ) {
			$default_connection_options[ \PDO::MYSQL_ATTR_INIT_COMMAND ] = "SET NAMES '" . $this->config->charset . "'";

			if ( $this->config->collate ) {
				$default_connection_options[ \PDO::MYSQL_ATTR_INIT_COMMAND ] .= " COLLATE '" . $this->config->collate . "'";
			}
		}
		if ( $this->config->ssl_enable
			&& $this->config->ssl_ca_file
			&& $this->config->ssl_key_file
			&& $this->config->ssl_crt_file
			&& $this->config->ssl_cipher
		) {
			$default_connection_options[ \PDO::MYSQL_ATTR_SSL_CA ]   = $this->config->ssl_ca_file;
			$default_connection_options[ \PDO::MYSQL_ATTR_SSL_KEY ]  = $this->config->ssl_key_file;
			$default_connection_options[ \PDO::MYSQL_ATTR_SSL_CERT ] = $this->config->ssl_crt_file;

			$default_connection_options[ \PDO::MYSQL_ATTR_SSL_CIPHER ]             = $this->config->ssl_cipher;
			$default_connection_options[ \PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT ] = $this->config->ssl_verify;
		}
		/**
		 * A possibly-persistent connection ID is a 32-byte {@see U\Crypto::x_sha()} of (6) considerations:
		 *
		 *   1. Current system's hostname so there are unique connection IDs when running a server cluster.
		 *      Assuming each server in a cluster has a different hostname, which is a recommended best practice.
		 *
		 *   2. The current server API; i.e., {@see U\Env::server_api()} to ensure dynamic adjustments can be made to
		 *      connection settings depending on the server API vs. inadvertently reusing one from a different server API.
		 *
		 *   3. Clever Canyon's namespace crux via {@see U\Pkg::namespace_crux()}; identifying this library.
		 *   4. Clever Canyon's data context based on {@see U\Pkg::data_context()}; e.g., `wps`, `web`, `uid`, etc.
		 *
		 *   5. A `connection_id_salt` passed in `$config`; else static env variable `DATABASE_CONNECTION_ID_SALT`.
		 *      This allows new instances of this class to be given very different connection IDs if desirable.
		 *
		 *   6. Connection ID version, which is subject to change when there are substantive code modifications.
		 *      Taken from {@see U\Database::$connection_id_version}. Please update when there are substantive code changes.
		 */
		$this->connection_id = U\Env::sys_name();
		$this->connection_id .= '\\' . U\Env::server_api();
		$this->connection_id .= '\\' . U\Pkg::namespace_crux();
		$this->connection_id .= '\\' . U\Pkg::data_context();
		$this->connection_id .= '\\' . $this->config->connection_id_salt;
		$this->connection_id .= '\\' . $this::$connection_id_version;
		$this->connection_id = U\Crypto::x_sha( $this->connection_id, 32 );

		$default_connection_options[ \PDO::ATTR_PERSISTENT ] = $this->connection_id; // Default to persistent ID.
		$this->config->connection_options                    = $this->config->connection_options + $default_connection_options;

		$this->pdo = new \PDO(
			$this->type .
			':host=' . $this->config->host .
			';port=' . $this->config->port,
			$this->config->username,
			$this->config->password,
			$this->config->connection_options
		);
		// Maybe select database.

		if ( $this->config->database ) {
			$this->pdo->exec( 'use `' . $this->config->database . '`' );
		}
	}
}
