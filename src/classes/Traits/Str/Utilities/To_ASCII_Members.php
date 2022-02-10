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
namespace Clever_Canyon\Utilities\Traits\Str\Utilities;

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
 * @see   U\Str
 */
trait To_ASCII_Members {
	/**
	 * Converts to ASCII-range equivalents (`intl` extension required).
	 *
	 * From the docs on `Any-Latin; Latin-ASCII`. Here are the relevant details:
	 * `Latin-ASCII` converts non-ASCII-range punctuation, symbols, and letters to an approximate ASCII-range equiv.
	 * For example: © → ‘(C)’, Æ → AE. When combined with `Any-Latin` you get a transform that converts as
	 * much as possible to an ASCII-range representation; i.e., `Any-Latin; Latin-ASCII`.
	 *
	 * @since        2022-01-08
	 *
	 * @param string $str Input string.
	 *
	 * @return string|false ASCII-range string, else `false` on failure.
	 *
	 * @throws U\Fatal_Exception If missing `intl` extension.
	 *
	 * @see          https://www.php.net/manual/en/transliterator.transliterate.php
	 * @see          https://unicode-org.github.io/icu/userguide/transforms/general/
	 */
	public static function to_ascii_er( string $str ) /* : string|false */ {
		static $can_use_extension; // Remember.
		$can_use_extension ??= U\Env::can_use_extension( 'intl' );

		if ( ! $can_use_extension ) {
			throw new U\Fatal_Exception( 'Missing PHP `intl` extension.' );
		}
		/** @noinspection PhpComposerExtensionStubsInspection */ // phpcs:ignore.
		return transliterator_transliterate( 'Any-Latin; Latin-ASCII', $str );
	}
}
