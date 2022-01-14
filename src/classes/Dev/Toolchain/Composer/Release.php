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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\Dev\Toolchain\Composer;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

/**
 * Toolchain.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\Dev\Toolchain\{Tools as T};
use Clever_Canyon\Utilities\Dev\Toolchain\Composer\{Project};

/**
 * File-specific.
 *
 * @since 2021-12-15
 */
use Aws\S3\S3Client;
use Aws\Exception\AwsException;

// </editor-fold>

/**
 * Automated release process.
 *
 * @since 2021-12-15
 */
class Release extends \Clever_Canyon\Utilities\OOP\Abstracts\A6t_CLI_Tool {
	/**
	 * Project.
	 *
	 * @since 2021-12-15
	 */
	protected Project $project;

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
	protected const NAME = 'Composer/Release';

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
			'update' => [
				'callback'    => [ $this, 'update' ],
				'synopsis'    => 'Updates project dotfiles and NPM packages.',
				'description' => 'Updates project dotfiles and NPM packages. See ' . __CLASS__ . '::update()',
				'options'     => [
					'project-dir' => [
						'optional'    => true,
						'description' => 'Project directory path.',
						'validator'   => fn( $value ) => $value && is_string( $value ) && is_dir( $value )
							&& is_file( U\Dir::join( $value, '/composer.json' ) ),
						'default'     => getcwd(),
					],
				],
			],
		] );
		$this->route_request();
	}

	/**
	 * Command: `update`.
	 *
	 * @since 2021-12-15
	 */
	protected function update() : void {
		try {
			$this->project = new Project(
				$this->get_option( 'project-dir' )
			);
			$this->maybe_setup_dotfiles();
			$this->maybe_run_npm_update();

			$this->maybe_compile_distro_lib_dir();
			$this->maybe_compile_distro_lib_zip();
			$this->maybe_s3_upload_distro_lib_zip();

		} catch ( \Throwable $throwable ) {
			U\CLI::error( $throwable->getMessage() );
			U\CLI::error( $throwable->getTraceAsString() );
			U\CLI::exit_status( 1 );
		}
	}
}
