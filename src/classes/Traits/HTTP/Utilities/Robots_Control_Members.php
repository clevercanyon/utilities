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
trait Robots_Control_Members {
	/**
	 * Disables robots.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if robots disabled successfully.
	 */
	public static function disable_robots() : bool {
		return U\HTTP::robots_control( [
			'none'     => true,
			'noindex'  => true,
			'nofollow' => true,
		] );
	}

	/**
	 * Sets `x-robots-tag` header and configures server.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $config Robots control configuration settings.
	 *
	 *                      There are *many* possibilities.
	 *                      Here are a couple of quick examples:
	 *
	 *                      e.g., `[ 'noindex' => true ]`.
	 *                      e.g., `[ 'max-image-preview' => 'standard' ]`.
	 *
	 * @return bool True if `x-robots-tag` header set, and server configured successfully.
	 *
	 * @see   https://o5p.me/F62KS1 WordPress source code for `wp_robots` filter.
	 * @see   https://o5p.me/R99lRZ Google article about `robots.txt` and `x-robots-tag` header.
	 * @see   https://o5p.me/6VHpQH Another good article by the folks at SEMrush.
	 */
	public static function robots_control( array $config ) : bool {
		if ( headers_sent() ) {
			return false; // Not possible.
		}

		$directives = []; // Initialize.

		foreach ( $config as $_directive => $_value ) {
			if ( ! is_string( $_directive ) ) {
				continue; // Invalid directive.
			}
			if ( is_string( $_value ) ) {
				$directives[] = $_directive . ':' . $_value;

			} elseif ( $_value ) {
				$directives[] = $_directive;
			}
		}

		/**
		 * Sets `x-robots-tag` header.
		 *
		 * @since 2022-04-15
		 *
		 * @return bool `true` on success.
		 */
		$set_header = function () use ( $directives ) : bool {
			if ( $directives ) {
				header( 'x-robots-tag: ' . implode( ', ', $directives ) );
			}
			return true; // Always true.
		};

		/**
		 * Configures server.
		 *
		 * @since 2022-04-15
		 *
		 * @return bool `true` on success.
		 */
		$configure_server = function () use ( $config ) : bool {
			$did_add_wp_filter = null;

			if ( U\Env::is_wordpress() ) {
				$did_add_wp_filter = add_filter(
					'wp_robots', // {@see https://o5p.me/oFOH8v}.
					fn( array $wp_robots ) => array_merge( $wp_robots, $config ),
					12 // Hook priority.
				);
			}
			return false !== $did_add_wp_filter;
		};

		$did_set_header       = $set_header();
		$did_configure_server = $configure_server();
		$did_set_static_var   = null !== U\Env::static_var( 'C10N_HTTP_ROBOTS_CONTROL', (object) $config );

		return $did_set_header
			&& $did_configure_server
			&& $did_set_static_var;
	}
}
