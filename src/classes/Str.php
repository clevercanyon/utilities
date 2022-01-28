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
	 * UTF-8 byte-order marker.
	 *
	 * @since 2021-12-15
	 */
	public const UTF8_BOM = "\xEF\xBB\xBF";

	/**
	 * Serialize (no WP) prefix.
	 *
	 * @since 2021-12-15
	 */
	public const SERIALIZE_NO_WP_PREFIX = '[|{:s!wp:}|]';

	/**
	 * Serialize signature separator.
	 *
	 * @since 2021-12-15
	 */
	public const SERIALIZE_SIGNATURE_SEPARATOR = '[|{:sSs:}|]';

	/**
	 * Serialize signature key.
	 *
	 * @since 2021-12-15
	 */
	public const SERIALIZE_SIGNATURE_KEY = 'rnrttmPHHt4bwferoTKTrKhzN2XTPzrrWK6gvpqALDisGtWhiwtmPPoFGGs3sELs';
}
