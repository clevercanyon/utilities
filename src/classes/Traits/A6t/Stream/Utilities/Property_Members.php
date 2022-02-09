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
namespace Clever_Canyon\Utilities\Traits\A6t\Stream\Utilities;

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
trait Property_Members {
	/**
	 * Context.
	 *
	 * @since 2021-12-15
	 *
	 * @var resource|null
	 *
	 * @see   https://www.php.net/manual/en/class.streamwrapper.php#streamwrapper.props
	 */
	public $context;

	/**
	 * Wrapper; e.g., `wrapper://`.
	 *
	 * @since 2021-12-15
	 */
	protected string $wrapper;

	/**
	 * Wrapper name; e.g., `wrapper`.
	 *
	 * @since 2021-12-15
	 */
	protected string $wrapper_name;

	/**
	 * Content (arbitrary data).
	 *
	 * Default approach is to read/write from this data.
	 * However, some streams may choose a different approach.
	 *
	 * @since 2021-12-15
	 *
	 * @see   U\Traits\A6t\Stream\Utilities\Open_Members
	 * @see   U\Traits\A6t\Stream\Utilities\Read_Members
	 * @see   U\Traits\A6t\Stream\Utilities\Write_Members
	 */
	protected string $content;

	/**
	 * Byte length.
	 *
	 * @since 2021-12-15
	 */
	protected int $bytes;

	/**
	 * Byte position.
	 *
	 * @since 2021-12-15
	 */
	protected int $byte_pos;
}
