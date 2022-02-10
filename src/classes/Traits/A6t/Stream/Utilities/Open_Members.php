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
trait Open_Members {
	/**
	 * Opens stream.
	 *
	 * Extenders should run this after running their own approach.
	 * The goal here in the base class is to handle anything that wasn't already.
	 *
	 * @param string      $path        Path.
	 * @param string      $mode        Mode.
	 * @param int         $options     Options.
	 * @param string|null $opened_path Opened path, by reference.
	 *
	 * @return bool True on success.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.stream-open.php
	 */
	public function stream_open( string $path, string $mode, int $options, /* string|null */ ?string &$opened_path = null ) : bool {
		if ( null === $opened_path && $options & STREAM_USE_PATH ) {
			$opened_path = ''; // Opened path; for callers.
		}
		return true;
	}
}
