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
trait Position_Members {
	/**
	 * Gets stream byte position.
	 *
	 * @return int Current stream byte position.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.stream-tell.php
	 */
	public function stream_tell() : int {
		return $this->byte_pos;
	}

	/**
	 * Tests for end-of-file on a file pointer.
	 *
	 * @return bool True if read/write position is at the end of the stream.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.stream-eof.php
	 */
	public function stream_eof() : bool {
		return $this->byte_pos >= $this->bytes;
	}

	/**
	 * Seeks to specific byte position.
	 *
	 * @param int $offset Offset bytes.
	 *
	 * @param int $whence Origin directive.
	 *                    Default is {@see SEEK_SET}.
	 *
	 * @return bool True on success; false on failure.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.stream-seek.php
	 */
	public function stream_seek( int $offset, int $whence = SEEK_SET ) : bool {
		$seeking_byte_pos = -1; // Initialize.

		switch ( $whence ) {
			case SEEK_SET:
				$seeking_byte_pos = $offset;
				break;

			case SEEK_CUR:
				$seeking_byte_pos = $this->byte_pos + $offset;
				break;

			case SEEK_END:
				$seeking_byte_pos = $this->bytes + $offset;
				break;
		}
		if ( $seeking_byte_pos >= 0 && $seeking_byte_pos < $this->bytes ) {
			$this->byte_pos = $seeking_byte_pos;
			return true;
		}
		return false;
	}
}
