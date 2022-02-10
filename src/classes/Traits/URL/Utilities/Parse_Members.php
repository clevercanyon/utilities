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
namespace Clever_Canyon\Utilities\Traits\URL\Utilities;

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
 * @see   U\URL
 */
trait Parse_Members {
	/**
	 * Wrapper for `parse_url()`.
	 *
	 * Differences between this and {@see parse_url()}:
	 *
	 *   - The second parameter `$component` can be passed as `null` instead of `-1`.
	 *   - When an array is returned, all possible keys are always present in the array.
	 *   - All values, including `port`, `false`, and `null` values, are returned as strings.
	 *   - `scheme` and `host` values are always returned in lowercase format for consistency.
	 *   - On failure, an empty `array` or `string` are returned instead of `false` or `null`.
	 *
	 * @since 2020-11-19
	 *
	 * @param string   $url       URL to parse; {@see parse_url()}.
	 *
	 * @param int|null $component {@see parse_url()}. Default is `null` (all).
	 *                            A value of `-1` is treated exactly the same as `null`.
	 *
	 *                            * Use constants: {@see PHP_URL_SCHEME}
	 *                              {@see PHP_URL_USER}, {@see PHP_URL_PASS}
	 *                              {@see PHP_URL_HOST}, {@see PHP_URL_PORT}
	 *                              {@see PHP_URL_PATH}, {@see PHP_URL_QUERY}, {@see PHP_URL_FRAGMENT}.
	 *
	 * @param bool     $strict    Strict adherenace to PHP's {@see parse_url()} return values?
	 *                            Default for this parameter is `false`. If `true`, return matches {@see parse_url()} exactly.
	 *
	 * @return array|string|false|null If no `$component`, returns an array of strings (all keys present). Empty array on failure.
	 *                                 If a `$component` is requested, returns a string. Empty string on failure.
	 *
	 *                                 * If `$strict` is `true`, then `false` and `null` are returned on failure.
	 *                                   Additionally, `int` and `null` are not converted to strings.
	 *                                   {@see parse_url()} for further details.
	 *
	 * @see   U\URL::assemble()
	 */
	public static function parse( string $url, /* int|null */ ?int $component = null, bool $strict = false ) /* : array|string|false|null */ {
		$component = -1 === $component ? null : $component; // `-1` same as `null`.
		$rtn       = parse_url( $url, $component ?? -1 );   // phpcs:ignore -- PHP 7.4+ {@see parse_url()} ok.

		if ( $strict ) {
			return $rtn; // No changes.
		}
		if ( null !== $component ) {
			if ( '' === ( $rtn = (string) $rtn ) ) {
				return ''; // Failure = empty string.
			} else {
				if ( PHP_URL_SCHEME === $component ) {
					$rtn = mb_strtolower( $rtn );
				} elseif ( PHP_URL_HOST === $component ) {
					$rtn = mb_strtolower( $rtn );
				}
				return $rtn;
			}
		} else {
			if ( false === $rtn || ! is_array( $rtn ) ) {
				return []; // Failure = empty array.

			} else { // `null` and `int` become strings.
				if ( ! empty( $rtn[ 'scheme' ] ) ) {
					$rtn[ 'scheme' ] = mb_strtolower( $rtn[ 'scheme' ] );
				}
				if ( ! empty( $rtn[ 'host' ] ) ) {
					$rtn[ 'host' ] = mb_strtolower( $rtn[ 'host' ] );
				}
				return array_map(
					'strval',
					$rtn + [
						'scheme'   => '',
						'user'     => '',
						'pass'     => '',
						'host'     => '',
						'port'     => '',
						'path'     => '',
						'query'    => '',
						'fragment' => '',
					]
				);
			}
		}
	}
}
