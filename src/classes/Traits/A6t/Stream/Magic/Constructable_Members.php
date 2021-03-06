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
namespace Clever_Canyon\Utilities\Traits\A6t\Stream\Magic;

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
 * @see   U\I7e\Stream
 */
trait Constructable_Members {
	/**
	 * Constructor.
	 *
	 * @see          U\A6t\Stream::stream_open()
	 * @see          https://www.php.net/manual/en/streamwrapper.construct.php
	 * @noinspection PhpMultipleClassDeclarationsInspection
	 */
	public function __construct() {
		parent::__construct();

		$this->wrapper      = static::wrapper();
		$this->wrapper_name = static::wrapper_name();

		$this->content  = ''; // Set by {@see U\A6t\Stream::stream_open()}.
		$this->bytes    = 0;  // Set by {@see U\A6t\Stream::stream_open()}.
		$this->byte_pos = 0;  // Updated by read, write, and position members.
	}
}
