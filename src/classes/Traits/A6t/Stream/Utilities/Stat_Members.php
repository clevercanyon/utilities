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
trait Stat_Members {
	/**
	 * Gets stream information.
	 *
	 * @return array|false Info ({@see stat()}); else `false` on failure.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.stream-stat.php
	 */
	public function stream_stat() /* : array|false */ {
		if ( false === ( $stat = stat( __FILE__ ) ) ) {
			return false; // Not possible.
		}
		foreach ( $stat as $_key => &$_value ) {
			$_value = 0; // Not applicable.

			if ( 7 === $_key || 'size' === $_key ) {
				$_value = $this->bytes;
			}
		}
		return $stat;
	}

	/**
	 * Gets stream information.
	 *
	 * @param string $path  Path.
	 * @param int    $flags Flags.
	 *
	 * @return array|false Info ({@see stat()}); else `false` on failure.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.url-stat.php
	 */
	public function url_stat( string $path, int $flags ) /* : array|false */ {
		if ( false === ( $stat = stat( __FILE__ ) ) ) {
			return false; // Not possible.
		}
		foreach ( $stat as $_key => &$_value ) {
			$_value = 0; // Not applicable.

			if ( 7 === $_key || 'size' === $_key ) {
				$_value = $this->bytes;
			}
		}
		return $stat;
	}
}
