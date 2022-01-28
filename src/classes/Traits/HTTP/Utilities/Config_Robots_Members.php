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
namespace Clever_Canyon\Utilities\Traits\HTTP\Utilities;

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
 * @see   U\HTTP
 */
trait Config_Robots_Members {
	/**
	 * Disables robots w/ WordPress compat.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if robots disabled successfully.
	 *
	 * @see   https://o5p.me/R99lRZ Google article about `robots.txt` and `x-robots-tag` header.
	 */
	public static function disable_robots() : bool {
		return U\HTTP::config_robots( [
			'none'     => true,
			'noindex'  => true,
			'nofollow' => true,
		] );
	}

	/**
	 * Configures robot directives w/ WordPress compat.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $config Configuration array (associative).
	 *                      e.g., `[ 'noindex' => true, 'follow' => true ]`.
	 *                      e.g., `[ 'max-image-preview' => 'standard' ]`.
	 *
	 * @return bool True if robot directives configured successfully.
	 *
	 * @see   https://o5p.me/F62KS1 WordPress source code for `wp_robots` filter.
	 * @see   https://o5p.me/R99lRZ Google article about `robots.txt` and `x-robots-tag` header.
	 */
	public static function config_robots( array $config ) : bool {
		$directives = []; // Initialize.

		foreach ( $config as $_directive => $_value ) {
			if ( ! is_string( $_directive ) ) {
				continue; // Invalid.
			}
			if ( is_string( $_value ) ) {
				$directives[] = $_directive . ':' . $_value;

			} elseif ( $_value ) {
				$directives[] = $_directive;
			}
		}
		if ( U\Env::is_wordpress() ) {
			$set_headers = null; // Initialize.

			if ( ! headers_sent() ) {
				$set_headers = true;
				header( 'x-robots-tag: ' . implode( ', ', $directives ) );
			}
			$added_filter = add_filter(
				'wp_robots', // {@see https://o5p.me/oFOH8v}
				fn( array $wp_robots ) => array_merge( $wp_robots, $config ),
				12 // Hook priority.
			);
			return $set_headers && $added_filter
				&& U\Env::static_var( 'HTTP_ROBOTS', $directives );
		} else {
			$set_headers = null; // Initialize.

			if ( ! headers_sent() ) {
				$set_headers = true;
				header( 'x-robots-tag: ' . implode( ', ', $directives ) );
			}
			return $set_headers && U\Env::static_var( 'HTTP_ROBOTS', $directives );
		}
	}
}
