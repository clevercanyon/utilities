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
trait Write_Members {
	/**
	 * Writes to stream.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $data Data to write.
	 *
	 * @return int Bytes written.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.stream-write.php
	 */
	public function stream_write( string $data ) : int {
		$bytes = strlen( $data );

		$start_substr = substr( $this->content, 0, $this->byte_pos );
		$end_substr   = substr( $this->content, $this->byte_pos + $bytes );

		$this->content  = $start_substr . $data . $end_substr;
		$this->byte_pos += $bytes;

		return $bytes;
	}

	/**
	 * Truncates stream.
	 *
	 * @since 2022-01-29
	 *
	 * @param int $bytes New size in bytes.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.stream-truncate.php
	 */
	public function stream_truncate( int $bytes ) : bool {
		$bytes         = max( 0, $bytes );
		$this->content = substr( $this->content, 0, $bytes );

		return true;
	}

	/**
	 * Sets stream metadata.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $path   Path.
	 * @param int    $option Option.
	 * @param mixed  $value  Option value.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.stream-metadata.php
	 */
	public function stream_metadata( string $path, int $option, /* mixed */ $value ) : bool {
		return false; // Not applicable.
	}

	/**
	 * Changes stream options.
	 *
	 * @param int $option Option.
	 * @param int $arg1   Arg 1.
	 * @param int $arg2   Arg 2.
	 *
	 * @return bool Always returns `false`.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.stream-set-option.php
	 */
	public function stream_set_option( int $option, int $arg1, int $arg2 ) : bool {
		return false; // Not applicable.
	}

	/**
	 * Flushes buffered data to storage.
	 *
	 * @since 2022-01-29
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.stream-flush.php
	 */
	public function stream_flush() : bool {
		return false; // Not applicable.
	}
}
