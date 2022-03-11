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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * String utilities.
 *
 * @since 2021-12-15
 */
final class Str extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Str\Members;

	/**
	 * Chars removed by {@see trim()}.
	 *
	 * @since 2021-12-15
	 *
	 * @var string Whitespace.
	 */
	public const TRIM_CHARS = " \n\r\t\v\x00";

	/**
	 * UTF-8 byte-order marker.
	 *
	 * @since 2021-12-15
	 *
	 * @var string `ï»¿`
	 */
	public const UTF8_BOM = "\u{0000EF}\u{0000BB}\u{0000BF}";

	/**
	 * Serialized marker.
	 *
	 * @since 2021-12-15
	 *
	 * @var string `§Ð¦`
	 */
	public const SERIALIZED_MARKER = "\u{0000A7}\u{0000D0}\u{0000A6}";

	/**
	 * Serialized signature separator.
	 *
	 * @since 2021-12-15
	 *
	 * @var string `¦¤«§»¤¦`
	 */
	public const SERIALIZED_SIGNATURE_SEPARATOR = "\u{0000A6}\u{0000A4}\u{0000AB}\u{0000A7}\u{0000BB}\u{0000A4}\u{0000A6}";
}
