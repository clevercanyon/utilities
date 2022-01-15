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
namespace Clever_Canyon\Utilities\Traits\Exception\Magic;

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
 * @see   U\I7e\Exception
 */
trait Constructable_Members {
	/**
	 * Constructor.
	 *
	 * @since        2021-12-15
	 *
	 * @param string|null       $message  Optional message. Default is empty.
	 * @param string|null       $code     Optional code. Default is: `basename(file):line`.
	 * @param object|array|null $data     Optional data, which is converted to an object type.
	 *
	 * @param \Throwable|null   $previous Optional previous exception for chaining in complex applications.
	 *
	 * @noinspection PhpMultipleClassDeclarationsInspection
	 */
	public function __construct(
		/* string|null */ ?string $message = null,
		/* string|null */ ?string $code = null,
		/* object|array|null */ $data = null,
		/* \Throwable|null */ ?\Throwable $previous = null
	) {
		parent::__construct( $message ?? '', 0, $previous );

		$this->___code = $code ?? basename( $this->get_file(), '.php' ) . ':' . $this->get_line();
		$this->___data = is_object( $data ) || is_array( $data ) ? (object) $data : (object) [];
	}
}
