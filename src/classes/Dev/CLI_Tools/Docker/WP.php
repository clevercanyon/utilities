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
namespace Clever_Canyon\Utilities\Dev\CLI_Tools\Docker;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Docker WP.
 *
 * @since 2021-12-15
 */
final class WP extends U\A6t\CLI_Tool {
	/**
	 * Project.
	 *
	 * @since 2021-12-15
	 */
	protected U\Dev\Project $project;

	/**
	 * Version.
	 *
	 * @since 2021-12-15
	 */
	protected const VERSION = '1.0.0';

	/**
	 * Tool name.
	 *
	 * @since 2021-12-15
	 */
	protected const NAME = 'Docker/WP';

	/**
	 * Constructor.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|array|null $args_to_parse Optional custom args to parse instead of `$_SERVER['argv']`.
	 *                                         If not given, defaults internally to `$_SERVER['argv']`.
	 */
	public function __construct( /* string|array|null */ $args_to_parse = null ) {
		parent::__construct( $args_to_parse );

		$common_options = [
			'project-dir' => [
				'required'    => true,
				'description' => 'Project directory path.',
				'validator'   => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, 'dir' ) )
					&& is_file( U\Dir::join( $abs_path, '/composer.json' ) ),
			],
			'variant'     => [
				'optional'    => true,
				'description' => 'Composition variant. One of: `ci` (that’s it for now).',
				'validator'   => fn( $value ) => in_array( $value, [ 'ci' ], true ),
			],
			'php-version' => [
				'optional'    => true,
				'description' => 'PHP version (MAJOR.MINOR) matching an Apache container tag: <https://hub.docker.com/_/wordpress>.',
				'validator'   => fn( $value ) => is_string( $value ) && U\Str::is_version( $value ),
				'default'     => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION,
			],
		];
		$this->add_commands( [
			'up'   => [
				'callback'    => [ $this, 'up' ],
				'synopsis'    => 'Runs `docker compose up`.',
				'description' => 'Runs `docker compose up`. See ' . __CLASS__ . '::up()',
				'options'     => array_merge( $common_options, [
					'wp-multisite-type'       => [
						'optional'    => true,
						'description' => 'Multisite type. One of: `subdomains` or `subdirectories`.',
						'validator'   => fn( $value ) => in_array( $value, [ 'subdomains', 'subdirectories' ], true ),
					],
					'wp-install-plugin'       => [
						'optional'    => true,
						'multiple'    => true,
						'description' => 'Plugin slug, relative plugin zip file path, or plugin zip file URL.',
						'validator'   => fn( $value ) => $value && is_string( $value ),
					],
					'wp-install-theme'        => [
						'optional'    => true,
						'description' => 'Theme slug, relative theme zip file path, or theme zip file URL.',
						'validator'   => fn( $value ) => $value && is_string( $value ),
					],
					'wp-installed-theme-slug' => [
						'optional'    => true,
						'description' => 'From `wp-install-theme`; the installed theme’s slug — for activation.' .
							' This is a required argument when `wp-install-theme` is passed. It’s necessary for multisite compat.',
						'validator'   => fn( $value ) => is_string( $value ) && U\Str::is_slug( $value ),
					],
				] ),
			],
			'bash' => [
				'callback'    => [ $this, 'bash' ],
				'synopsis'    => 'Runs `docker exec -it [container] bash`.',
				'description' => 'Runs `docker exec -it [container] bash`. See ' . __CLASS__ . '::bash()',
				'options'     => array_merge( $common_options, [
					'user' => [
						'optional'    => true,
						'description' => 'User to log in as; e.g., `root`, `www-data`.',
						'validator'   => fn( $value ) => is_string( $value ) && ( U\Str::is_slug( $value ) || U\Str::is_var( $value ) ),
						'default'     => 'www-data',
					],
				] ),
				'operands'    => [
					'container-short-alias' => [
						'optional'    => true,
						'description' => 'Container short alias; e.g., `db`, `wp`, `pma`.',
						'validator'   => fn( $value ) => is_string( $value ) && U\Str::is_slug( $value ),
						'default'     => 'wp',
					],
				],
			],
			'down' => [
				'callback'    => [ $this, 'down' ],
				'synopsis'    => 'Runs `docker compose down`.',
				'description' => 'Runs `docker compose down`. See ' . __CLASS__ . '::down()',
				'options'     => $common_options,
			],
		] );
		$this->route_request();
	}

	/**
	 * Command: `up`.
	 *
	 * @since 2021-12-15
	 */
	protected function up() : void {
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: `docker compose up` ...' );

			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			U\CLI::run( [
				$this->prepare_env_var_args(),
				[ 'docker', 'compose', $this->prepare_yml_file_args() ],
				[ 'up', '--detach' ],
			], $this->project->dir );

			$this->maybe_update_etc_hosts_file();
			$this->maybe_print_container_info();

			U\CLI::done( '[' . __METHOD__ . '()]: `docker compose up` complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::error( $throwable->getMessage() );
			U\CLI::error( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `bash`.
	 *
	 * @since 2021-12-15
	 */
	protected function bash() : void {
		try {
			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			U\CLI::run( [
				[ 'docker', 'exec' ],
				[ '--interactive', '--tty' ],
				[ '--user', $this->get_option( 'user' ) ],
				[ '--workdir', '/var/www/html' ],
				[ $this->project->slug . '-' . $this->get_operand( 'container-short-alias' ) ],
				[ 'bash', '-l' ],
			], $this->project->dir, true, true, '&' );

		} catch ( \Throwable $throwable ) {
			U\CLI::error( $throwable->getMessage() );
			U\CLI::error( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `down`.
	 *
	 * @since 2021-12-15
	 */
	protected function down() : void {
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: `docker compose down` ...' );

			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			U\CLI::run( [
				$this->prepare_env_var_args(),
				[ 'docker', 'compose', $this->prepare_yml_file_args() ],
				[ 'down', '--volumes' ],
			], $this->project->dir );

			$this->maybe_update_etc_hosts_file();
			$this->maybe_print_container_info();

			U\CLI::done( '[' . __METHOD__ . '()]: `docker compose down` complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::error( $throwable->getMessage() );
			U\CLI::error( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Prints container info (maybe).
	 *
	 * @since 2022-02-16
	 */
	protected function maybe_print_container_info() : void {
		if ( ! U\Env::is_mac() ) {
			return; // Not applicable.
		}
		if ( 'up' !== $this->get_command_name() ) {
			return; // Not applicable.
		}
		if ( 'ci' === $this->get_option( 'variant' ) ) {
			return; // Not applicable.
		}
		U\CLI::heading( 'MySQL Database' );
		U\CLI::log( 'IP Address: ' . $this->get_container_ip( 'db' ) );
		U\CLI::log( 'Host      : ' . $this->get_container_ip( 'db' ) );
		U\CLI::output( 'PMA       : http://' . $this->get_container_host( 'pma' ) );

		U\CLI::heading( 'Apache/PHPv' . $this->get_option( 'php-version' ) . '/WordPress' );
		U\CLI::log( 'IP Address: ' . $this->get_container_ip( 'wp' ) );
		U\CLI::log( 'Host      : ' . $this->get_container_ip( 'wp' ) );
		U\CLI::output( 'URL       : http://' . $this->get_container_host( 'wp' ) );
	}

	/**
	 * Updates `/etc/hosts` file (maybe; macOS only).
	 *
	 * This triggers a dialoge on macOS, asking for sudo password.
	 * This way it's possible to update the `/etc/hosts` file.
	 *
	 * @since 2022-02-16
	 */
	protected function maybe_update_etc_hosts_file() : void {
		if ( ! U\Env::is_mac() ) {
			return; // Only compatible with macOS.
		}
		if ( 'ci' === $this->get_option( 'variant' ) ) {
			return; // Not applicable.
		}
		$command_name = $this->get_command_name();

		$etc_hosts_file          = '/etc/hosts';
		$etc_hosts_file_contents = U\File::read( $etc_hosts_file );
		$etc_hosts_file_contents = U\Str::normalize_eols( $etc_hosts_file_contents );

		$new_etc_hosts_file_contents = '';    // Initialize.
		$etc_hosts_needs_cleanup     = false; // Initialize.

		$db_docker_ip  = $this->get_container_ip( 'db' );
		$wp_docker_ip  = $this->get_container_ip( 'wp' );
		$pma_docker_ip = $this->get_container_ip( 'pma' );

		$db_docker_host  = $this->get_container_host( 'db', false );
		$wp_docker_host  = $this->get_container_host( 'wp', false );
		$pma_docker_host = $this->get_container_host( 'pma', false );

		foreach ( explode( "\n", $etc_hosts_file_contents ) as $_line ) {
			$_line  = trim( $_line );
			$_parts = preg_split( '/\s+/u', $_line, -1, PREG_SPLIT_NO_EMPTY );

			if ( '' === $_line || '#' === $_line[ 0 ] || count( $_parts ) !== 2 ) {
				$new_etc_hosts_file_contents .= $_line . "\n";

			} elseif ( in_array( mb_strtolower( $_parts[ 0 ] ), [ $db_docker_ip, $wp_docker_ip, $pma_docker_ip ], true )
				&& in_array( mb_strtolower( $_parts[ 1 ] ), [ $db_docker_host, $wp_docker_host, $pma_docker_host ], true )
			) {
				$etc_hosts_needs_cleanup     = true;
				$new_etc_hosts_file_contents .= ''; // Remove.
			}
		}
		if ( ! $etc_hosts_needs_cleanup && 'down' === $command_name ) {
			return; // Nothing to clean up; we can stop here.
		}
		if ( 'up' === $command_name ) {
			$new_etc_hosts_file_contents .= $db_docker_ip . ' ' . $db_docker_host . "\n";
			$new_etc_hosts_file_contents .= $wp_docker_ip . ' ' . $wp_docker_host . "\n";
			$new_etc_hosts_file_contents .= $pma_docker_ip . ' ' . $pma_docker_host . "\n";
		}
		$new_etc_hosts_file_contents = trim( $new_etc_hosts_file_contents ) . "\n";

		$temp_file = U\File::make_temp();
		U\File::write( $temp_file, $new_etc_hosts_file_contents );

		U\CLI::exec( [
			[ 'osascript', '-e', 'do shell script' ],
			[
				' "sudo mv -f \"' . $temp_file . '\" /etc/hosts' .
				' && sudo dscacheutil -flushcache && killall -HUP mDNSResponder"' .

				( 'up' === $command_name
					? ' with prompt "Add `' . $wp_docker_ip . ' ' . $wp_docker_host . '` to /etc/hosts file."'
					: ' with prompt "Remove `' . $wp_docker_ip . ' ' . $wp_docker_host . '` from /etc/hosts file."'
				) .
				' with administrator privileges',
			],
		], $this->project->dir );
	}

	/**
	 * Gets container IP address.
	 *
	 * @since 2022-02-16
	 *
	 * @param string $short_alias Container short alias.
	 *                            e.g., `db`, `wp`, `pma`.
	 *
	 * @return string Container's IP address.
	 *                Always normalized as lowercase.
	 */
	protected function get_container_ip( string $short_alias ) : string {
		$command_name = $this->get_command_name();
		$ip           = &$this->ins_cache( [ __FUNCTION__, $short_alias, $command_name ] );

		if ( null !== $ip ) {
			return $ip; // Saves time.
		}
		$ip = U\CLI::exec( [
			[ 'docker', 'inspect' ],
			[ '--format', '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ],
			[ $this->project->slug . '-' . $short_alias ],
		], $this->project->dir )->stdout;

		return $ip = U\IP::normalize( $ip );
	}

	/**
	 * Gets container host; i.e., `hostname.domainname[:port]`.
	 *
	 * @since 2022-02-16
	 *
	 * @param string $short_alias Container short alias.
	 *                            e.g., `db`, `wp`, `pma`.
	 *
	 * @param bool   $with_port   With port number? Default is `true`.
	 *                            Port is only included if it's a non-standard HTTP port#.
	 *                            - e.g., `my-project.dkr:80` is *always* returned as `my-project.dkr`.
	 *                            - e.g., You'll get `my-project-db.dkr:3306` if `$with_port` is `true`.
	 *
	 * @return string Container host; i.e., `hostname.domainname[:port]`.
	 *                Always normalized as lowercase.
	 */
	protected function get_container_host( string $short_alias, bool $with_port = true ) : string {
		$command_name = $this->get_command_name();
		$host         = &$this->ins_cache( [ __FUNCTION__, $short_alias, $with_port, $command_name ] );

		if ( null !== $host ) {
			return $host; // Saves time.
		}
		if ( 'ci' === $this->get_option( 'variant' ) ) {
			$host = 'localhost'; // See `.wp-docker.sh`.
		} else {
			$host = U\CLI::exec( [
				[ 'docker', 'inspect' ],
				[ '--format', '{{.Config.Hostname}}.{{.Config.Domainname}}' ],
				[ $this->project->slug . '-' . $short_alias ],
			], $this->project->dir )->stdout;
		}
		if ( 'db' === $short_alias && $host && $with_port ) {
			$host .= ':3306'; // e.g., `my-project-db.dkr:3306`.
		}
		return $host = mb_strtolower( $host );
	}

	/**
	 * Prepares environment variable args.
	 *
	 * @since 2022-02-16
	 *
	 * @return array All of the CMD environment variable args.
	 */
	protected function prepare_env_var_args() : array {
		$args = [ 'COMPOSE_PROJECT_NAME=' . $this->project->slug ];

		$args[] = 'X_COMPOSE_PROJECT_SLUG=' . $this->project->slug;
		$args[] = 'X_COMPOSE_PROJECT_TYPE=' . $this->project->type;
		$args[] = 'X_COMPOSE_PROJECT_LAYOUT=' . $this->project->layout;
		$args[] = 'X_COMPOSE_PHP_VERSION=' . $this->get_option( 'php-version' );

		if ( 'up' === $this->get_command_name() ) {
			$args[] = 'X_WORDPRESS_MULTISITE_TYPE=' . $this->get_option( 'wp-multisite-type' );
			$args[] = 'X_WORDPRESS_INSTALL_PLUGINS=' . implode( ',', $this->get_option( 'wp-install-plugin' ) );
			$args[] = 'X_WORDPRESS_INSTALL_THEME=' . $this->get_option( 'wp-install-theme' );
			$args[] = 'X_WORDPRESS_INSTALLED_THEME_SLUG=' . $this->get_option( 'wp-installed-theme-slug' );
		}
		return $args;
	}

	/**
	 * Prepares YAML file arguments.
	 *
	 * @since 2022-02-16
	 *
	 * @return array All of the prepared YAML file arguments.
	 */
	protected function prepare_yml_file_args() : array {
		if ( 'ci' === $this->get_option( 'variant' ) ) {
			return [
				[ '--file', './.wp-docker.yml' ],
				[ '--file', './.wp-docker.ci.yml' ],
				[ '--file', './.wp-docker.prj.yml' ],
			];
		} else {
			return [
				[ '--file', './.wp-docker.yml' ],
				[ '--file', './.wp-docker.prj.yml' ],
			];
		}
	}
}
