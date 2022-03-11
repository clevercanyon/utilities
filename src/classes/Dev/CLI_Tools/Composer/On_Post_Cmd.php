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
 * @since 2021-12-15
 *
 * phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Dev\CLI_Tools\Composer;

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
use Aws\S3\S3Client;
use Aws\Exception\AwsException;

// </editor-fold>

/**
 * Compiler.
 *
 * @since 2021-12-15
 */
final class On_Post_Cmd extends Operations {
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
	protected const NAME = 'Composer/On_Post_Cmd';

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

		$this->add_commands( [
			'symlink' => [
				'callback'    => [ $this, 'symlink' ],
				'synopsis'    => 'Updates project symlinks. Only in dev mode.',
				'description' => 'Updates project symlinks. Only in dev mode. See ' . __CLASS__ . '::symlink()',
				'options'     => [
					'project-dir' => [
						'required'     => true,
						'arg_required' => true,
						'description'  => 'Project directory path.',
						'validator'    => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, 'dir' ) )
							&& is_file( U\Dir::join( $abs_path, '/composer.json' ) ),
					],
				],
			],
			'install' => [
				'callback'    => [ $this, 'install' ],
				'synopsis'    => 'Syncs Composer install with other parts of the project. Only in dev mode.',
				'description' => 'Syncs Composer install with other parts of the project. Only in dev mode. See ' . __CLASS__ . '::install()',
				'options'     => [
					'project-dir' => [
						'required'     => true,
						'arg_required' => true,
						'description'  => 'Project directory path.',
						'validator'    => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, 'dir' ) )
							&& is_file( U\Dir::join( $abs_path, '/composer.json' ) ),
					],
				],
			],
			'update'  => [
				'callback'    => [ $this, 'update' ],
				'synopsis'    => 'Syncs Composer update with other parts of the project. Only in dev mode.',
				'description' => 'Syncs Composer update with other parts of the project. Only in dev mode. See ' . __CLASS__ . '::update()',
				'options'     => [
					'project-dir' => [
						'required'     => true,
						'arg_required' => true,
						'description'  => 'Project directory path.',
						'validator'    => fn( $value ) => ( $abs_path = $this->v6e_abs_path( $value, 'dir' ) )
							&& is_file( U\Dir::join( $abs_path, '/composer.json' ) ),
					],
				],
			],
		] );
		$this->route_request();
	}

	/**
	 * Command: `symlink`.
	 *
	 * @since 2021-12-15
	 */
	protected function symlink() : void {
		if ( ! U\Env::var( 'COMPOSER_DEV_MODE' ) ) {
			return; // Not applicable.
		}
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: Symlinking ...' );

			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			$this->maybe_symlink_local_repos();

			U\CLI::success( '[' . __METHOD__ . '()]: Symlinking complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `install`.
	 *
	 * @since 2021-12-15
	 */
	protected function install() : void {
		if ( ! U\Env::var( 'COMPOSER_DEV_MODE' ) ) {
			return; // Not applicable.
		}
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: Installing ...' );

			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			$this->maybe_setup_dotfiles();
			$this->maybe_run_npm_install();

			U\CLI::success( '[' . __METHOD__ . '()]: Install complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}

	/**
	 * Command: `update`.
	 *
	 * @since 2021-12-15
	 */
	protected function update() : void {
		if ( ! U\Env::var( 'COMPOSER_DEV_MODE' ) ) {
			return; // Not applicable.
		}
		try {
			U\CLI::heading( '[' . __METHOD__ . '()]: Updating ...' );

			$project_dir   = U\Fs::abs( $this->get_option( 'project-dir' ) );
			$this->project = new U\Dev\Project( $project_dir );

			$this->maybe_setup_dotfiles();
			$this->maybe_run_npm_update();
			$this->maybe_run_npx_webpack();

			U\CLI::success( '[' . __METHOD__ . '()]: Update complete ✔.' );
		} catch ( \Throwable $throwable ) {
			U\CLI::danger_hilite( $throwable->getMessage() );
			U\CLI::log( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}
}
