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
				'optional'     => true,
				'arg_required' => true,
				'description'  => 'Project directory path.',
				'validator'    => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, 'dir' ) )
					&& is_file( U\Dir::join( $abs_path, '/composer.json' ) ),
				'default'      => $this->locate_nearest_project_dir(),
			],
			'variant'     => [
				'optional'     => true,
				'arg_required' => true,
				'description'  => 'Composition variant. One of: `ci` (that’s it for now).',
				'validator'    => fn( $value ) => in_array( $value, [ 'ci' ], true ),
			],
			'php-version' => [
				'optional'     => true,
				'arg_required' => true,
				'description'  => 'PHP version (MAJOR.MINOR) matching one of: <https://hub.docker.com/repository/docker/jaswrks/wp-docker>.',
				'validator'    => fn( $value ) => is_string( $value ) && U\Version::is( $value, false ),
				'default'      => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION,
			],
		];
		$this->add_commands( [
			'up'      => [
				'callback'    => [ $this, 'up' ],
				'synopsis'    => 'Runs `docker compose up`.',
				'description' => 'Runs `docker compose up`. See ' . __CLASS__ . '::up()',
				'options'     => array_merge( $common_options, [
					'wp-multisite-type'       => [
						'optional'     => true,
						'arg_required' => true,
						'description'  => 'Multisite type. One of: `subdomains` or `subdirectories`.',
						'validator'    => fn( $value ) => in_array( $value, [ 'subdomains', 'subdirectories' ], true ),
					],
					'wp-install-plugin'       => [
						'optional'     => true,
						'arg_required' => true,
						'multiple'     => true,
						'description'  => 'Plugin slug, relative plugin zip file path, or plugin zip file URL.',
						'validator'    => fn( $value ) => $value && is_string( $value ),
					],
					'wp-install-theme'        => [
						'optional'     => true,
						'arg_required' => true,
						'description'  => 'Theme slug, relative theme zip file path, or theme zip file URL.',
						'validator'    => fn( $value ) => $value && is_string( $value ),
					],
					'wp-installed-theme-slug' => [
						'optional'     => true,
						'arg_required' => true,
						'description'  => 'From `wp-install-theme`; the installed theme’s slug — for activation.' .
							' This is a required argument when `wp-install-theme` is passed. It’s necessary for multisite compat.',
						'validator'    => fn( $value ) => is_string( $value ) && U\Str::is_slug( $value ),
					],
					'install-kitchen-sink'    => [
						'optional'     => true,
						'arg_required' => null,
						'description'  => 'Install everything (more than necessary); including the kitchen sink.' .
							' This adds a lot more overhead, but with many utilities. See: `./dev/.libs/docker/wp/entry.bash` for details.',
					],
				] ),
			],
			'exec'    => [
				'callback'    => [ $this, 'exec' ],
				'synopsis'    => 'Runs `docker exec [container] [CMD]`.',
				'description' => 'Runs `docker exec [container] [CMD]`. See ' . __CLASS__ . '::exec()',
				'options'     => array_merge( $common_options, [
					'cmd-args'    => [
						'short'        => 'c',
						'required'     => true,
						'arg_required' => true,
						'description'  => 'Command and any arguments; e.g., `/etc/init.d/apache2 reload`.',
						'validator'    => fn( $value ) => $value && is_string( $value ),
					],
					'user'        => [
						'short'        => 'u',
						'optional'     => true,
						'arg_required' => true,
						'description'  => 'User to exec as; e.g., `root`, `www-data`.',
						'validator'    => fn( $value ) => is_string( $value ) && ( U\Str::is_slug( $value ) || U\Str::is_var( $value ) ),
					],
					'prepare-cmd' => [
						'optional'     => true,
						'arg_required' => null,
						'description'  => 'Prepares a `CMD: [CMD]` to run and returns that CMD.',
					],
				] ),
				'operands'    => [
					'container-short-alias' => [
						'optional'    => true,
						'description' => 'Container short alias; e.g., `sql`, `mem`, `hog`, `php`, `pma`, `nxp`, `nxc`.',
						'validator'   => fn( $value ) => is_string( $value ) && U\Str::is_slug( $value ),
						'default'     => 'php',
					],
				],
			],
			'shell'   => [
				'callback'    => [ $this, 'shell' ],
				'synopsis'    => 'Runs `docker exec -it [container] bash --login`.',
				'description' => 'Runs `docker exec -it [container] bash --login`. See ' . __CLASS__ . '::shell()',
				'options'     => array_merge( $common_options, [
					'user'        => [
						'short'        => 'u',
						'optional'     => true,
						'arg_required' => true,
						'description'  => 'User to log in as; e.g., `root`, `www-data`.',
						'validator'    => fn( $value ) => is_string( $value ) && ( U\Str::is_slug( $value ) || U\Str::is_var( $value ) ),
					],
					'prepare-cmd' => [
						'optional'     => true,
						'arg_required' => null,
						'description'  => 'Prepares a `CMD: [CMD]` to run and returns that CMD.',
					],
				] ),
				'operands'    => [
					'container-short-alias' => [
						'optional'    => true,
						'description' => 'Container short alias; e.g., `sql`, `mem`, `hog`, `php`, `pma`, `nxp`, `nxc`.',
						'validator'   => fn( $value ) => is_string( $value ) && U\Str::is_slug( $value ),
						'default'     => 'php',
					],
				],
			],
			'psysh'   => [
				'callback'    => [ $this, 'psysh' ],
				'synopsis'    => 'Runs `docker exec -it [container] bash -c \'psysh\'`.',
				'description' => 'Runs `docker exec -it [container] bash -c \'psysh\'`. See ' . __CLASS__ . '::psysh()',
				'options'     => array_merge( $common_options, [
					'user'        => [
						'short'        => 'u',
						'optional'     => true,
						'arg_required' => true,
						'description'  => 'User to log in as; e.g., `root`, `www-data`.',
						'validator'    => fn( $value ) => is_string( $value ) && ( U\Str::is_slug( $value ) || U\Str::is_var( $value ) ),
						'default'      => 'www-data',
					],
					'prepare-cmd' => [
						'optional'     => true,
						'arg_required' => null,
						'description'  => 'Prepares a `CMD: [CMD]` to run and returns that CMD.',
					],
				] ),
			],
			'wp-cli'  => [
				'callback'    => [ $this, 'wp_cli' ],
				'synopsis'    => 'Runs `docker exec -it [container] bash -c \'wp shell\'`.',
				'description' => 'Runs `docker exec -it [container] bash -c \'wp shell\'`. See ' . __CLASS__ . '::wp_cli()',
				'options'     => array_merge( $common_options, [
					'user'        => [
						'short'        => 'u',
						'optional'     => true,
						'arg_required' => true,
						'description'  => 'User to log in as; e.g., `root`, `www-data`.',
						'validator'    => fn( $value ) => is_string( $value ) && ( U\Str::is_slug( $value ) || U\Str::is_var( $value ) ),
						'default'      => 'www-data',
					],
					'prepare-cmd' => [
						'optional'     => true,
						'arg_required' => null,
						'description'  => 'Prepares a `CMD: [CMD]` to run and returns that CMD.',
					],
				] ),
			],
			'info'    => [
				'callback'    => [ $this, 'info' ],
				'synopsis'    => 'Displays helpful service info.',
				'description' => 'Displays helpful service info. See ' . __CLASS__ . '::info()',
				'options'     => $common_options,
			],
			'status'  => [
				'callback'    => [ $this, 'status' ],
				'synopsis'    => 'Runs `docker compose ps --all`.',
				'description' => 'Runs `docker compose ps --all`. See ' . __CLASS__ . '::status()',
				'options'     => $common_options,
			],
			'logs'    => [
				'callback'    => [ $this, 'logs' ],
				'synopsis'    => 'Runs `docker logs [container] --follow`.',
				'description' => 'Runs `docker logs [container] --follow`. See ' . __CLASS__ . '::logs()',
				'options'     => $common_options,
				'operands'    => [
					'container-short-alias' => [
						'optional'    => true,
						'description' => 'Container short alias; e.g., `sql`, `mem`, `hog`, `php`, `pma`, `nxp`, `nxc`.',
						'validator'   => fn( $value ) => is_string( $value ) && U\Str::is_slug( $value ),
						'default'     => 'php',
					],
				],
			],
			'inspect' => [
				'callback'    => [ $this, 'inspect' ],
				'synopsis'    => 'Runs `docker inspect [container]`.',
				'description' => 'Runs `docker inspect [container]`. See ' . __CLASS__ . '::inspect()',
				'options'     => array_merge( $common_options, [
					'format' => [
						'short'        => 'f',
						'optional'     => true,
						'arg_required' => true,
						'description'  => 'Format string.',
						'validator'    => fn( $value ) => $value && is_string( $value ),
					],
				] ),
				'operands'    => [
					'container-short-alias' => [
						'optional'    => true,
						'description' => 'Container short alias; e.g., `sql`, `mem`, `hog`, `php`, `pma`, `nxp`, `nxc`.',
						'validator'   => fn( $value ) => is_string( $value ) && U\Str::is_slug( $value ),
						'default'     => 'php',
					],
				],
			],
			'pause'   => [
				'callback'    => [ $this, 'pause' ],
				'synopsis'    => 'Runs `docker compose pause`.',
				'description' => 'Runs `docker compose pause`. See ' . __CLASS__ . '::pause()',
				'options'     => $common_options,
			],
			'unpause' => [
				'callback'    => [ $this, 'unpause' ],
				'synopsis'    => 'Runs `docker compose unpause`.',
				'description' => 'Runs `docker compose unpause`. See ' . __CLASS__ . '::unpause()',
				'options'     => $common_options,
			],
			'down'    => [
				'callback'    => [ $this, 'down' ],
				'synopsis'    => 'Runs `docker compose down --volumes`.',
				'description' => 'Runs `docker compose down --volumes`. See ' . __CLASS__ . '::down()',
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

			$this->maybe_update_env_file();
			$this->maybe_update_symlinks_file();

			U\CLI::run( [
				'::env_vars' => $this->prepare_cmd_env_var_args(),
				[ 'docker', 'compose', $this->prepare_yml_file_args() ],
				[ 'up', '--detach' ],
			], $this->project->dir );

			$this->maybe_update_etc_hosts_file();
			$this->maybe_print_container_info();

			U\CLI::success( '[' . __METHOD__ . '()]: `docker compose up` complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `exec`.
	 *
	 * @since 2021-12-15
	 */
	protected function exec() : void {
		try {
			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			$user        = $this->get_option( 'user' );
			$cmd_args    = $this->get_option( 'cmd-args' );
			$short_alias = $this->get_operand( 'container-short-alias' );

			$user_args      = []; // Initialize.
			$work_dir_args  = []; // Initialize.
			$container_args = [ $this->project->slug . '-' . $short_alias ];

			if ( 'php' === $short_alias && ! $user ) {
				$user_args = [ '--user', 'www-data' ];
			}
			if ( 'php' === $short_alias ) {
				$work_dir_args = [ '--workdir', '/var/www/html' ];
			}
			$cmd_args = [
				[ 'docker', 'exec' ],
				[ $user_args, $work_dir_args, $container_args ],
				[ $cmd_args ? [ 'bash', '-c', $cmd_args ] : [] ],
			];
			if ( $this->get_option( 'prepare-cmd' ) ) {
				exit( 'CMD:' . U\CLI::prepare_cmd( $cmd_args, $this->project->dir ) ); // phpcs:ignore.
			} else {
				U\CLI::exit_status( U\CLI::run( $cmd_args, $this->project->dir, false ) );
			}
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `shell`.
	 *
	 * @since 2021-12-15
	 */
	protected function shell() : void {
		try {
			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			$user        = $this->get_option( 'user' );
			$short_alias = $this->get_operand( 'container-short-alias' );

			$user_args      = []; // Initialize.
			$work_dir_args  = []; // Initialize.
			$shell_args     = [ 'bash', '--login' ];
			$container_args = [ $this->project->slug . '-' . $short_alias ];

			if ( 'php' === $short_alias && ! $user ) {
				$user_args = [ '--user', 'www-data' ];
			}
			if ( 'php' === $short_alias ) {
				$work_dir_args = [ '--workdir', '/var/www/html' ];
			}
			if ( 'hog' === $short_alias ) {
				$shell_args = [ 'ash' ];
			}
			$cmd_args = [
				[ 'docker', 'exec' ],
				[ '--interactive', '--tty' ],
				[ $user_args, $work_dir_args, $container_args, $shell_args ],
			];
			if ( $this->get_option( 'prepare-cmd' ) ) {
				exit( 'CMD:' . U\CLI::prepare_cmd( $cmd_args, $this->project->dir ) ); // phpcs:ignore.
			} else {
				U\CLI::run( $cmd_args, $this->project->dir, false );
			}
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `psysh`.
	 *
	 * @since 2021-12-15
	 */
	protected function psysh() : void {
		try {
			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			$cmd_args = [
				[ 'docker', 'exec' ],
				[ '--interactive', '--tty' ],
				[ '--user', $this->get_option( 'user' ) ],
				[ '--workdir', '/var/www/html' ],
				[ $this->project->slug . '-php' ],
				[ 'bash', '-c', 'psysh' ],
			];
			if ( $this->get_option( 'prepare-cmd' ) ) {
				exit( 'CMD:' . U\CLI::prepare_cmd( $cmd_args, $this->project->dir ) ); // phpcs:ignore.
			} else {
				U\CLI::run( $cmd_args, $this->project->dir, false );
			}
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `wp-cli`.
	 *
	 * @since 2021-12-15
	 */
	protected function wp_cli() : void {
		try {
			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			$cmd_args = [
				[ 'docker', 'exec' ],
				[ '--interactive', '--tty' ],
				[ '--user', $this->get_option( 'user' ) ],
				[ '--workdir', '/var/www/html' ],
				[ $this->project->slug . '-php' ],
				[ 'bash', '-c', 'wp shell' ],
			];
			if ( $this->get_option( 'prepare-cmd' ) ) {
				exit( 'CMD:' . U\CLI::prepare_cmd( $cmd_args, $this->project->dir ) ); // phpcs:ignore.
			} else {
				U\CLI::run( $cmd_args, $this->project->dir, false );
			}
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `info`.
	 *
	 * @since        2021-12-15
	 */
	protected function info() : void {
		try {
			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			$this->maybe_print_container_info();

		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `status`.
	 *
	 * @since        2021-12-15
	 */
	protected function status() : void {
		try {
			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			U\CLI::run( [
				'::env_vars' => $this->prepare_cmd_env_var_args(),
				[ 'docker', 'compose', $this->prepare_yml_file_args() ],
				[ 'ps', '--all', '--format', 'pretty' ],
			], $this->project->dir, false );

		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `logs`.
	 *
	 * @since        2021-12-15
	 */
	protected function logs() : void {
		try {
			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			$short_alias = $this->get_operand( 'container-short-alias' );

			U\CLI::run( [
				[ 'docker', 'logs', '--follow' ],
				[ $this->project->slug . '-' . $short_alias ],
			], $this->project->dir, false );

		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `inspect`.
	 *
	 * @since        2021-12-15
	 */
	protected function inspect() : void {
		try {
			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			$format      = $this->get_option( 'format' );
			$short_alias = $this->get_operand( 'container-short-alias' );

			U\CLI::run( [
				[ 'docker', 'inspect' ],
				[ $this->project->slug . '-' . $short_alias ],
				( $format ? [ '--format', $format ] : [] ),
			], $this->project->dir, false );

		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `pause`.
	 *
	 * @since 2021-12-15
	 */
	protected function pause() : void {
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: `docker compose pause` ...' );

			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			U\CLI::run( [
				'::env_vars' => $this->prepare_cmd_env_var_args(),
				[ 'docker', 'compose', $this->prepare_yml_file_args() ],
				[ 'pause' ],
			], $this->project->dir, false );

			U\CLI::success( '[' . __METHOD__ . '()]: `docker compose pause` complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `unpause`.
	 *
	 * @since 2021-12-15
	 */
	protected function unpause() : void {
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: `docker compose unpause` ...' );

			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			U\CLI::run( [
				'::env_vars' => $this->prepare_cmd_env_var_args(),
				[ 'docker', 'compose', $this->prepare_yml_file_args() ],
				[ 'unpause' ],
			], $this->project->dir, false );

			U\CLI::success( '[' . __METHOD__ . '()]: `docker compose unpause` complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
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

			if ( ! $this->network_exists() ) {
				U\CLI::log( 'WP Docker is down.' );
				U\CLI::exit_status( 1 );
			}
			$this->maybe_update_env_file();
			$this->maybe_update_symlinks_file();
			$this->maybe_update_etc_hosts_file();

			U\CLI::run( [
				'::env_vars' => $this->prepare_cmd_env_var_args(),
				[ 'docker', 'compose', $this->prepare_yml_file_args() ],
				[ 'down', '--volumes' ],
			], $this->project->dir );

			U\CLI::success( '[' . __METHOD__ . '()]: `docker compose down` complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
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
		if ( ! in_array( $this->command_name(), [ 'up', 'info' ], true ) ) {
			return; // Not applicable.
		}
		if ( 'ci' === $this->get_option( 'variant' ) ) {
			return; // Not applicable.
		}
		$php_version = $this->get_option( 'php-version' );

		$sql_container_ip   = $this->get_container_ip( 'sql' );
		$sql_container_fqdn = $this->get_container_fqdn( 'sql' );

		$pma_container_ip   = $this->get_container_ip( 'pma' );
		$pma_container_fqdn = $this->get_container_fqdn( 'pma' );

		$mem_container_ip   = $this->get_container_ip( 'mem' );
		$mem_container_fqdn = $this->get_container_fqdn( 'mem' );

		$hog_container_ip           = $this->get_container_ip( 'hog' );
		$hog_container_fqdn         = $this->get_container_fqdn( 'hog' );
		$hog_container_fqdn_no_port = $this->get_container_fqdn( 'hog', false );

		$php_container_ip   = $this->get_container_ip( 'php' );
		$php_container_fqdn = $this->get_container_fqdn( 'php' );

		$nxp_container_ip   = $this->get_container_ip( 'nxp' );
		$nxp_container_fqdn = $this->get_container_fqdn( 'nxp' );

		$user_pass = U\Env::var( 'USER' ) ?: 'wordpress';

		U\CLI::output( 'MySQL Database Server' );
		U\CLI::log( 'IP Address           : ' . $sql_container_ip );
		U\CLI::log( 'MySQL (MariaDB)      : ' . $sql_container_fqdn );
		U\CLI::log( 'Database             : wordpress' );
		U\CLI::log( 'Username             : wordpress' );
		U\CLI::log( 'Password             : wordpress' );

		U\CLI::new_line();

		U\CLI::output( 'PhpMyAdmin (PMA) Server' );
		U\CLI::log( 'IP Address           : ' . $pma_container_ip );
		U\CLI::log( 'FQDN                 : https://' . $pma_container_fqdn );
		U\CLI::log( 'Username             : wordpress' );
		U\CLI::log( 'Password             : wordpress' );

		U\CLI::new_line();

		U\CLI::output( 'Memcached Server' );
		U\CLI::log( 'IP Address           : ' . $mem_container_ip );
		U\CLI::log( 'FQDN:                : ' . $mem_container_fqdn );

		U\CLI::new_line();

		U\CLI::output( 'MailHog SMTP Server' );
		U\CLI::log( 'IP Address           : ' . $hog_container_ip );
		U\CLI::log( 'FQDN (SMTP)          : ' . $hog_container_fqdn );
		U\CLI::log( 'FQDN (Webmail)       : https://' . $hog_container_fqdn_no_port );

		U\CLI::new_line();

		U\CLI::output( 'Apache/PHPv' . $php_version . '/WordPress Server' );
		U\CLI::log( 'IP Address           : ' . $php_container_ip );
		U\CLI::log( 'FQDN                 : ' . $php_container_fqdn );
		U\CLI::log( 'Shell Access         : $ ./.wp-docker shell 🐳' );
		U\CLI::log( 'Psysh Access         : $ ./.wp-docker psysh' );
		U\CLI::log( 'WP-CLI Access        : $ ./.wp-docker cli' );
		if ( in_array( $this->project->layout, [ 'wp-website', 'wp-network' ], true ) ) {
			U\CLI::log( 'Project In Container : /wp-docker/host/project|/var/www/html' );
		} else {
			U\CLI::log( 'Project In Container : /wp-docker/host/project' );
		}
		U\CLI::new_line();

		U\CLI::output( 'Nginx Proxy w/ HTTP & HTTPs Servers' );
		U\CLI::log( 'IP Address           : ' . $nxp_container_ip );
		U\CLI::log( 'Wildcard SSL         : *.' . $nxp_container_fqdn );
		U\CLI::log( 'HTTP                 : http://' . $nxp_container_fqdn );
		U\CLI::log( 'HTTPS                : https://' . $nxp_container_fqdn . ' 🌎' );
		if ( ! in_array( $this->project->layout, [ 'wp-website', 'wp-network' ], true ) ) {
			U\CLI::log( 'PHP Info             : https://' . $nxp_container_fqdn . '/info.php' );
		}
		U\CLI::new_line();

		U\CLI::output( 'WordPress Admin' );
		U\CLI::log( 'Username/Password    : ' . $user_pass . '/' . $user_pass );
		U\CLI::log( 'WP Admin             : https://' . $nxp_container_fqdn . '/wp-admin/ ⚙️' );
	}

	/**
	 * Updates environment variables file (maybe).
	 *
	 * This file should reflect the most recent `up` command configuration.
	 * This file should be deleted when a project comes `down`.
	 *
	 * @since 2022-02-16
	 *
	 * @see   https://docs.docker.com/compose/env-file/
	 */
	protected function maybe_update_env_file() : void {
		if ( ! in_array( $this->command_name(), [ 'up', 'down' ], true ) ) {
			return; // Not applicable.
		}
		$command_name = $this->command_name();
		$env_file     = U\Dir::join( $this->project->dir, 'dev/.libs/docker/wp/.env' );

		switch ( $command_name ) {
			case 'down':
				U\Fs::delete( $env_file, false );
				break;

			case 'up':
				if ( ! is_file( $env_file ) ) {
					U\File::make( $env_file );
				}
				U\File::write( $env_file, $this->prepare_cmd_env_var_lines() );
				break;
		}
	}

	/**
	 * Updates symlinks file (maybe).
	 *
	 * This file should be created on `up` command.
	 * This file should be deleted when a project comes `down`.
	 *
	 * Reason for this is because symlinks don't work inside a container.
	 * It makes sense. For symlinks to work, we have to mount them explicitly.
	 *
	 * @since 2022-02-16
	 */
	protected function maybe_update_symlinks_file() : void {
		if ( ! in_array( $this->command_name(), [ 'up', 'down' ], true ) ) {
			return; // Not applicable.
		}
		$command_name  = $this->command_name();
		$symlinks_file = U\Dir::join( $this->project->dir, 'dev/.libs/docker/wp/.compose~sym.yml' );

		$vendor_org_dir_basename = U\Brand::get( 'c10n', 'slug' );
		$vendor_org_dir          = U\Dir::join( $this->project->dir, '/vendor/' . $vendor_org_dir_basename );

		switch ( $command_name ) {
			case 'down':
				U\Fs::delete( $symlinks_file, false );
				break;

			case 'up': // *Space* indents.
				$symlinks_file_contents = <<<'ooo'
					version  : '3.9'  # {@see https://o5p.me/TtD60s}.
					services :
					    php  :
					        volumes : # Must bind mount symlinks explicitly. 
					ooo;
				$have_symlinks          = false; // Initialize.

				foreach ( glob( $vendor_org_dir . '/*', GLOB_ONLYDIR ) as $_dir ) {
					if ( '.' !== $_dir && '..' !== $_dir && is_dir( $_dir ) && is_link( $_dir ) ) {
						$symlinks_file_contents = rtrim( $symlinks_file_contents, "\n" ) . "\n";
						$symlinks_file_contents .= str_repeat( '    ', 3 ) . // 4-space indent x 3.
							'- ' . "'" . '../../../../vendor/' . $vendor_org_dir_basename . '/' . basename( $_dir ) .
							':/wp-docker/host/project/vendor/' . $vendor_org_dir_basename . '/' . basename( $_dir ) . ':ro' . "'";
						$have_symlinks          = true;
					}
				}
				if ( $have_symlinks ) {
					if ( ! is_file( $symlinks_file ) ) {
						U\File::make( $symlinks_file );
					}
					U\File::write( $symlinks_file, $symlinks_file_contents );
				} else {
					U\Fs::delete( $symlinks_file, false ); // Not necessary.
				}
				break;
		}
	}

	/**
	 * Updates `/etc/hosts` file (maybe; macOS only).
	 *
	 * This triggers a dialoge on macOS, asking for password.
	 * This way it's possible to update the `/etc/hosts` file.
	 *
	 * @since        2022-02-16
	 *
	 * @noinspection PhpUnusedLocalVariableInspection
	 */
	protected function maybe_update_etc_hosts_file() : void {
		if ( ! U\Env::is_mac() ) {
			return; // Only compatible with macOS.
		}
		if ( 'ci' === $this->get_option( 'variant' ) ) {
			return; // Not applicable.
		}
		if ( ! in_array( $this->command_name(), [ 'up', 'down' ], true ) ) {
			return; // Not applicable.
		}
		if ( ! $this->network_exists() ) {
			return; // Not applicable.
		}
		$command_name = $this->command_name();

		$etc_hosts_file          = '/etc/hosts';
		$etc_hosts_file_contents = U\File::read( $etc_hosts_file );
		$etc_hosts_file_contents = U\Str::normalize_eols( $etc_hosts_file_contents );

		$new_etc_hosts_file_contents = '';    // Initialize.
		$etc_hosts_needs_cleanup     = false; // Initialize.

		$sql_docker_ip = $this->get_container_ip( 'sql' );
		$mem_docker_ip = $this->get_container_ip( 'mem' );
		$hog_docker_ip = $this->get_container_ip( 'hog' );
		$php_docker_ip = $this->get_container_ip( 'php' );
		$pma_docker_ip = $this->get_container_ip( 'pma' );
		$nxp_docker_ip = $this->get_container_ip( 'nxp' );
		$nxc_docker_ip = $this->get_container_ip( 'nxc' );

		$fqdns = [
			$sql_docker_fqdn = $this->get_container_fqdn( 'sql', false ),
			$mem_docker_fqdn = $this->get_container_fqdn( 'mem', false ),
			$hog_docker_fqdn = $this->get_container_fqdn( 'hog', false ),
			$php_docker_fqdn = $this->get_container_fqdn( 'php', false ),
			$pma_docker_fqdn = $this->get_container_fqdn( 'pma', false ),
			$nxp_docker_fqdn = $this->get_container_fqdn( 'nxp', false ),
			$nxc_docker_fqdn = $this->get_container_fqdn( 'nxc', false ),
		];
		foreach ( explode( "\n", $etc_hosts_file_contents ) as $_line ) {
			$_line  = trim( $_line );
			$_parts = preg_split( '/\s+/u', $_line, -1, PREG_SPLIT_NO_EMPTY );

			if ( '' !== $_line && '#' !== $_line[ 0 ] && count( $_parts ) === 2
				&& in_array( mb_strtolower( $_parts[ 1 ] ), $fqdns, true )
			) {
				$etc_hosts_needs_cleanup     = true;
				$new_etc_hosts_file_contents .= ''; // Remove.
			} else {
				$new_etc_hosts_file_contents .= $_line . "\n";
			}
		}
		if ( ! $etc_hosts_needs_cleanup && 'down' === $command_name ) {
			return; // Nothing to clean up; we can stop here.
		}
		if ( 'up' === $command_name ) {
			$new_etc_hosts_file_contents .= $sql_docker_ip . ' ' . $sql_docker_fqdn . "\n";
			$new_etc_hosts_file_contents .= $mem_docker_ip . ' ' . $mem_docker_fqdn . "\n";
			$new_etc_hosts_file_contents .= $nxp_docker_ip . ' ' . $hog_docker_fqdn . "\n";
			$new_etc_hosts_file_contents .= $php_docker_ip . ' ' . $php_docker_fqdn . "\n";
			$new_etc_hosts_file_contents .= $nxp_docker_ip . ' ' . $pma_docker_fqdn . "\n";
			$new_etc_hosts_file_contents .= $nxp_docker_ip . ' ' . $nxp_docker_fqdn . "\n";
			$new_etc_hosts_file_contents .= $nxc_docker_ip . ' ' . $nxc_docker_fqdn . "\n";
		}
		$new_etc_hosts_file_contents = trim( $new_etc_hosts_file_contents ) . "\n";

		$temp_file = U\File::make_temp();
		U\File::write( $temp_file, $new_etc_hosts_file_contents );

		if ( $devs_update_etc_hosts_cmd = $this->project->dev_json_prop( '&.local.dns.commands.update_etc_hosts' ) ) {
			U\CLI::exec( [ $devs_update_etc_hosts_cmd, $temp_file ], $this->project->dir );

		} elseif ( is_executable( '/usr/local/bin/update-etc-hosts' ) ) {
			// {@see https://gist.github.com/jaswrks/dea734437938042eab52da5e04abfecf}.
			U\CLI::exec( [ '/usr/local/bin/update-etc-hosts', $temp_file ], $this->project->dir );

		} elseif ( is_writable( $etc_hosts_file ) ) {
			U\File::write( $etc_hosts_file, $new_etc_hosts_file_contents );

		} else {
			U\CLI::exec( [
				[ 'osascript', '-e' ],
				[
					'do shell script "' .
					'sudo /bin/mv -f \"' . $temp_file . '\" /etc/hosts &&' .
					' sudo /usr/bin/dscacheutil -flushcache &&' .
					' sudo /usr/bin/killall -HUP mDNSResponder' .
					'"' .
					( 'up' === $command_name
						? ' with prompt "Add `' . $nxp_docker_ip . ' ' . $nxp_docker_fqdn . '` to /etc/hosts file."'
						: ' with prompt "Remove `' . $nxp_docker_ip . ' ' . $nxp_docker_fqdn . '` from /etc/hosts file."'
					) .
					' with administrator privileges',
				],
			], $this->project->dir );
		}
	}

	/**
	 * Checks if network exists.
	 *
	 * @since 2022-02-16
	 *
	 * @return bool True if network exists.
	 */
	protected function network_exists() : bool {
		$command_name = $this->command_name();
		$exists       = &$this->ins_cache( [ __FUNCTION__, $command_name ] );

		if ( null !== $exists ) {
			return $exists; // Saves time.
		}
		try {
			return $exists = (bool) U\CLI::exec( [
				[ 'docker', 'inspect' ],
				[ '--format', '{{.Name}}' ],
				[ $this->project->slug . '-network' ],
			], $this->project->dir )->stdout;

		} catch ( \Throwable $throwable ) {
			return $exists = false;
		}
	}

	/**
	 * Gets container IP address.
	 *
	 * @since 2022-02-16
	 *
	 * @param string $short_alias Container short alias.
	 *                            e.g., `sql`, `mem`, `hog`, `php`, `pma`, `nxp`, `nxc`.
	 *
	 * @return string Container's IP address.
	 *                Always normalized as lowercase.
	 */
	protected function get_container_ip( string $short_alias ) : string {
		$command_name = $this->command_name();
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
	 * Gets container FQDN; i.e., `hostname.domainname[:port]`.
	 *
	 * @since 2022-02-16
	 *
	 * @param string      $short_alias Container short alias.
	 *                                 e.g., `sql`, `mem`, `hog`, `php`, `pma`, `nxp`, `nxc`.
	 *
	 * @param bool|string $with_port   With port number? Default is `true`.
	 *
	 *                                 * No port is returned for services that have no exposed ports.
	 *                                 * Port is only included if it's not a default 80|443 HTTP port known by browsers.
	 *                                   - e.g., `my-project.wp:80|443` is *always* returned as `my-project.wp`.
	 *                                   - You'll get `my-project-sql.wp:3306` if `$with_port` is `true`.
	 *                                   - You'll get `my-project-mem.wp:11211` if `$with_port` is `true`.
	 *                                   - You'll get `my-project-hog.wp:8025` if `$with_port` is `true`.
	 *
	 *                                 * In some cases it is helpful to request a specific port by a slug.
	 *                                   e.g., In the case of a service exposing multiple ports. The only slugs
	 *                                   currently accepted are: `mysqlx`, `webmail`.
	 *
	 *                                   * `mysqlx` is a port opened by the MySQL container.
	 *                                     We are currently using MariaDB, which doesn't open this port.
	 *                                     Leaving support for it here, but it's never an open port at this time.
	 *
	 * @return string Container FQDN; i.e., `hostname.domainname[:port]`.
	 *                Always normalized as lowercase.
	 */
	protected function get_container_fqdn( string $short_alias, /* bool|string */ $with_port = true ) : string {
		$command_name = $this->command_name();
		$fqdn         = &$this->ins_cache( [ __FUNCTION__, $short_alias, $with_port, $command_name ] );

		if ( null !== $fqdn ) {
			return $fqdn; // Saves time.
		}
		$fqdn = U\CLI::exec( [
			[ 'docker', 'inspect' ],
			[ '--format', '{{.Config.Hostname}}.{{.Config.Domainname}}' ],
			[ $this->project->slug . '-' . $short_alias ],
		], $this->project->dir )->stdout;

		if ( 'sql' === $short_alias && $fqdn && $with_port ) {
			$fqdn .= 'mysqlx' === $with_port ? ':33060' : ':3306'; // e.g., `my-project-sql.wp:3306`.

		} elseif ( 'mem' === $short_alias && $fqdn && $with_port ) {
			$fqdn .= ':11211'; // e.g., `my-project-mem.wp:11211`.

		} elseif ( 'hog' === $short_alias && $fqdn && $with_port ) {
			$fqdn .= 'webmail' === $with_port ? ':8025' : ':1025'; // e.g., `my-project-hog.wp:8025`.
		}
		return $fqdn = mb_strtolower( $fqdn );
	}

	/**
	 * Prepares CMD environment variable lines.
	 *
	 * @since 2022-02-16
	 *
	 * @return string All of the CMD environment variable lines.
	 */
	protected function prepare_cmd_env_var_lines() : string {
		$env_var_lines = []; // Initialize.

		foreach ( $this->prepare_cmd_env_vars() as $_env_var => $_value ) {
			$env_var_lines[] = $_env_var . '=' . $_value;
		}
		return implode( "\n", $env_var_lines );
	}

	/**
	 * Prepares CMD environment variable args.
	 *
	 * @since 2022-02-16
	 *
	 * @return array All of the CMD environment variable args.
	 */
	protected function prepare_cmd_env_var_args() : array {
		$env_var_args = []; // Initialize.

		foreach ( $this->prepare_cmd_env_vars() as $_env_var => $_value ) {
			$env_var_args[] = $_env_var . '=' . U\Str::esc_shell_arg( $_value );
		}
		return $env_var_args;
	}

	/**
	 * Prepares CMD environment variables.
	 *
	 * @since 2022-02-16
	 *
	 * @return array All of the CMD environment variables.
	 */
	protected function prepare_cmd_env_vars() : array {
		$env_vars[ 'COMPOSE_PROJECT_NAME' ]             = $this->project->slug;
		$env_vars[ 'WP_DOCKER_COMPOSE_PROJECT_SLUG' ]   = $this->project->slug;
		$env_vars[ 'WP_DOCKER_COMPOSE_PROJECT_TYPE' ]   = $this->project->type;
		$env_vars[ 'WP_DOCKER_COMPOSE_PROJECT_LAYOUT' ] = $this->project->layout;
		$env_vars[ 'WP_DOCKER_COMPOSE_PHP_VERSION' ]    = $this->get_option( 'php-version' );

		if ( 'up' === $this->command_name() ) {
			$env_vars[ 'WP_DOCKER_WORDPRESS_MULTISITE_TYPE' ]       = $this->get_option( 'wp-multisite-type' ) ?: '';
			$env_vars[ 'WP_DOCKER_WORDPRESS_INSTALL_PLUGINS' ]      = implode( ',', $this->get_option( 'wp-install-plugin' ) ?: [] );
			$env_vars[ 'WP_DOCKER_WORDPRESS_INSTALL_THEME' ]        = $this->get_option( 'wp-install-theme' ) ?: '';
			$env_vars[ 'WP_DOCKER_WORDPRESS_INSTALLED_THEME_SLUG' ] = $this->get_option( 'wp-installed-theme-slug' ) ?: '';
			$env_vars[ 'WP_DOCKER_INSTALL_KITCHEN_SINK' ]           = $this->get_option( 'install-kitchen-sink' ) ? '1' : '';
		}
		return $env_vars;
	}

	/**
	 * Prepares YAML file arguments.
	 *
	 * @since 2022-02-16
	 *
	 * @return array All of the prepared YAML file arguments.
	 */
	protected function prepare_yml_file_args() : array {
		$dir      = U\Dir::join( $this->project->dir, '/dev/.libs/docker/wp' );
		$av_file  = U\Dir::join( $dir, '/compose~av.yml' );   // Adjusts volumes.
		$sym_file = U\Dir::join( $dir, '/.compose~sym.yml' ); // Symlinks.

		if ( 'ci' === $this->get_option( 'variant' ) ) {
			return [
				[ '--file', U\Dir::join( $dir, '/compose.yml' ) ],
				( in_array( $this->project->layout, [ 'wp-website', 'wp-network' ], true ) ? [ '--file', $av_file ] : [] ),
				( is_file( $sym_file ) ? [ '--file', $sym_file ] : [] ),
				[ '--file', U\Dir::join( $dir, '/compose~ci.yml' ) ],
				[ '--file', U\Dir::join( $dir, '/compose~prj.yml' ) ],
			];
		} else {
			return [
				[ '--file', U\Dir::join( $dir, '/compose.yml' ) ],
				( in_array( $this->project->layout, [ 'wp-website', 'wp-network' ], true ) ? [ '--file', $av_file ] : [] ),
				( is_file( $sym_file ) ? [ '--file', $sym_file ] : [] ),
				[ '--file', U\Dir::join( $dir, '/compose~prj.yml' ) ],
			];
		}
	}
}
