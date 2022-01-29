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
namespace Clever_Canyon\Utilities\Traits\Bundle\Utilities;

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
 * @see   U\Bundle
 */
trait Stringify_Members {
	/**
	 * Stringifies a bundle.
	 *
	 * This is *not* purely a JSON-encoder (do not use it that way).
	 * For example, null, scalar, and resource values are simply converted to strings.
	 * To actually JSON-encode a bundle use {@see U\Str::json_encode()}.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array $bundle       Bundle to stringify.
	 *
	 * @param bool|null    $pretty_print Pretty print? Default is `null`.
	 *                                   {@see U\Str::stringify()} for details.
	 *
	 * @param int          $max_depth    Max depth to traverse. Default is `-1` (infinite).
	 *                                   Setting this to `-1` traverses entire bundle converting non object|array values to a string.
	 *                                   Setting this to `0` indicates the bundle itself should be converted to a string.
	 *                                   Setting this to `1` would force all props/keys to a string value.
	 *                                   Setting this to `2` would go one level deeper, etc.
	 *
	 * @param int          $_depth       Internal use only — do not pass.
	 *
	 * @return object|array|string Stringified bundle.
	 *
	 * @see   U\Str::stringify()
	 */
	public static function stringify(
		/* object|array */ $bundle,
		/* bool|null */ ?bool $pretty_print = null,
		int $max_depth = -1,
		int $_depth = 0
	) /* : object|array|string */ {
		assert( U\Bundle::is( $bundle ) );

		if ( $max_depth >= 0 && $_depth >= $max_depth ) {
			return U\Str::stringify( $bundle, $pretty_print );
		}
		foreach ( $bundle as &$_value ) {
			if ( U\Bundle::is( $_value ) ) {
				$_value = U\Bundle::stringify( $_value, $pretty_print, $max_depth, $_depth + 1 );
			} else {
				$_value = U\Str::stringify( $_value, $pretty_print );
			}
		}
		return $bundle;
	}
}
