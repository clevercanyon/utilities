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
namespace Clever_Canyon\Utilities\I7e;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Stream interface.
 *
 * @since 2021-12-15
 */
interface Stream {
	/**
	 * Opens stream.
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
	public function stream_open( string $path, string $mode, int $options, /* string|null */ ?string &$opened_path = null ) : bool;

	/**
	 * Advisory stream locking.
	 *
	 * @since 2022-01-29
	 *
	 * @param int $operation Lock type.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.stream-lock.php
	 */
	public function stream_lock( int $operation ) : bool;

	/**
	 * Closes stream.
	 *
	 * @since 2022-01-29
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.stream-close.php
	 */
	public function stream_close() : void;

	/**
	 * Reads from stream.
	 *
	 * @param int $bytes Bytes.
	 *
	 * @return string|false Data; else `false` on failure.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.stream-read.php
	 */
	public function stream_read( int $bytes ); /* : string|false */

	/**
	 * Gets underlying resource.
	 *
	 * @since        2022-01-29
	 *
	 * @param int $cast_as Cast directive.
	 *
	 * @return resource|false Resource on success.
	 *
	 * @see          https://www.php.net/manual/en/streamwrapper.stream-cast.php
	 *
	 * @noinspection PhpMissingReturnTypeInspection
	 */
	public function stream_cast( int $cast_as ); /* : resource|false */

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
	public function stream_write( string $data ) : int;

	/**
	 * Truncates stream.
	 *
	 * @since 2022-01-29
	 *
	 * @param int $bytes New size in bytes.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.stream-truncate.php
	 */
	public function stream_truncate( int $bytes ) : bool;

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
	public function stream_metadata( string $path, int $option, /* mixed */ $value ) : bool;

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
	public function stream_set_option( int $option, int $arg1, int $arg2 ) : bool;

	/**
	 * Flushes buffered data to storage.
	 *
	 * @since 2022-01-29
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.stream-flush.php
	 */
	public function stream_flush() : bool;

	/**
	 * Gets stream information.
	 *
	 * @return array|false Info ({@see stat()}); else `false` on failure.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.stream-stat.php
	 */
	public function stream_stat(); /* : array|false */

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
	public function url_stat( string $path, int $flags ); /* : array|false */

	/**
	 * Gets stream byte position.
	 *
	 * @return int Current stream byte position.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.stream-tell.php
	 */
	public function stream_tell() : int;

	/**
	 * Tests for end-of-file on a file pointer.
	 *
	 * @return bool True if read/write position is at the end of the stream.
	 *
	 * @see https://www.php.net/manual/en/streamwrapper.stream-eof.php
	 */
	public function stream_eof() : bool;

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
	public function stream_seek( int $offset, int $whence = SEEK_SET ) : bool;

	/**
	 * Opens directory.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $path    Path.
	 * @param int    $options Options.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.dir-opendir.php
	 */
	public function dir_opendir( string $path, int $options ) : bool;

	/**
	 * Reads directory.
	 *
	 * @since 2022-01-29
	 *
	 * @return string Next filename; else ``.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.dir-readdir.php
	 */
	public function dir_readdir() : string;

	/**
	 * Rewinds directory.
	 *
	 * @since 2022-01-29
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.dir-rewinddir.php
	 */
	public function dir_rewinddir() : bool;

	/**
	 * Closes directory.
	 *
	 * @since 2022-01-29
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.dir-closedir.php
	 */
	public function dir_closedir() : bool;

	/**
	 * Makes directory.
	 *
	 * In order for the appropriate error message to be returned, this method
	 * should *not* be defined if the wrapper does not support creating directories.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $path    Path.
	 * @param int    $mode    Mode.
	 * @param int    $options Options.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.mkdir.php
	 *
	 * public function mkdir( string $path, int $mode, int $options ) : bool;
	 */

	/**
	 * Removes directory.
	 *
	 * In order for the appropriate error message to be returned, this method
	 * should *not* be defined if the wrapper does not support removing directories.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $path    Path.
	 * @param int    $options Options.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.rmdir.php
	 *
	 * public function rmdir( string $path, int $options ) : bool;
	 */

	/**
	 * Renames a filesystem path.
	 *
	 * In order for the appropriate error message to be returned, this method
	 * should *not* be defined if the wrapper does not support renaming filesystem paths.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $from_path From path.
	 * @param string $to_path   To path.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.rename.php
	 *
	 * public function rename( string $from_path, string $to_path ) : bool;
	 */

	/**
	 * Removes a filesystem path.
	 *
	 * In order for the appropriate error message to be returned, this method
	 * should *not* be defined if the wrapper does not support removing filesystem paths.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $path Path.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.unlink.php
	 *
	 * public function unlink( string $path ) : bool;
	 */

	/**
	 * Destructor.
	 *
	 * @since 2022-01-29
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.destruct.php
	 */
	public function __destruct();
}
