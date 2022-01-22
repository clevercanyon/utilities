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
namespace Clever_Canyon\Utilities\Traits\Dir\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Utility members.
 *
 * @since 2021-12-15
 *
 * @see   U\Dir
 */
trait Iterator_Members {
	/**
	 * Gets a recursive directory iterator.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $path            Directory to iterate.
	 *
	 * @param string|null $regexp          Regular expression to use as a filter.
	 *                                     Default is everything except `.gitignore` items.
	 *                                     Depends on use of {@see U\Fs::gitignore_regexp_lookahead()}.
	 *
	 *                                     You can pass a complete regular expression, which must begin with `/`.
	 *                                     Or, pass a regular expression fragment, which is anything that doesn't begin with `/`.
	 *                                     Fragments are auto-expanded into `U\Fs::gitignore_regexp_lookahead( 'negative', [fragment] )`.
	 *
	 * @param bool        $follow_symlinks Default is `false`.
	 *
	 * @throws U\Exception If either of the input parameters are empty.
	 * @throws U\Exception If `$path` is not a readable/iterable directory.
	 * @throws U\Exception On failure to construct iterator.
	 *
	 * @return \Generator|\RecursiveDirectoryIterator[] Recursive directory iterator.
	 *
	 * @see   U\Fs::gitignore_regexp_lookahead() — please review carefully.
	 * @see   https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php
	 */
	public static function iterator( string $path, /* string|null */ ?string $regexp = null, bool $follow_symlinks = false ) : \Generator {
		if ( isset( $regexp ) && '' !== $regexp && '/' !== $regexp[ 0 ] ) {
			$regexp = U\Fs::gitignore_regexp_lookahead( 'negative', $regexp );
		}
		$regexp ??= U\Fs::gitignore_regexp_lookahead( 'negative' );

		if ( ! $path || ! $regexp ) {
			throw new U\Exception( 'Missing required parameters.' );
		}
		if ( ! is_dir( $path ) || ! is_readable( $path ) ) {
			throw new U\Exception( 'Not a readable/iterable directory.' );
		}
		try {
			if ( $follow_symlinks ) {
				$flags = \FilesystemIterator::KEY_AS_PATHNAME
					| \FilesystemIterator::CURRENT_AS_SELF
					| \FilesystemIterator::SKIP_DOTS
					| \FilesystemIterator::UNIX_PATHS
					| \FilesystemIterator::FOLLOW_SYMLINKS;
			} else {
				$flags = \FilesystemIterator::KEY_AS_PATHNAME
					| \FilesystemIterator::CURRENT_AS_SELF
					| \FilesystemIterator::SKIP_DOTS
					| \FilesystemIterator::UNIX_PATHS;
			}
			$iterator          = new \RecursiveDirectoryIterator( $path, $flags );
			$iterator_iterator = new \RecursiveIteratorIterator( $iterator, \RecursiveIteratorIterator::CHILD_FIRST );

			foreach ( $iterator_iterator as $_iterator ) {
				if ( preg_match( $regexp, $_iterator->getSubPathname() ) ) {
					yield $_iterator; // `\RecursiveDirectoryIterator` instance.
				}
			}
		} catch ( \Throwable $throwable ) {
			throw new U\Exception( $throwable->getMessage() );
		}
	}
}
