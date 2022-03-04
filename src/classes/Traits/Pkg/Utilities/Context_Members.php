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
namespace Clever_Canyon\Utilities\Traits\Pkg\Utilities;

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
 * @see   U\Pkg
 */
trait Context_Members {
	/**
	 * Gets package data context.
	 *
	 * @since 2022-01-27
	 *
	 * @param string|null $format Optional format. Default is `null` (raw).
	 *                            {@see U\Pkg::format_str_helper()} for further details.
	 *
	 * @return string Data context with desired formatting.
	 */
	public static function data_context( /* string|null */ ?string $format = null ) : string {
		$format  = $format ?: 'raw'; // Default is `raw`.
		$context = &static::cls_cache( [ __FUNCTION__, $format ] );

		if ( null !== $context ) {
			return $context; // Saves time.
		}
		if ( 'raw' === $format ) {
			$raw_context = &$context; // Same as the above.
		} else {
			$raw_context = &static::cls_cache( [ __FUNCTION__, 'raw' ] );
		}
		if ( null === $raw_context ) {
			if ( $_data_context = U\Env::static_var( 'C10N_DATA_CONTEXT' ) ) {
				$raw_context = 'svr~' . $_data_context;

			} elseif ( U\Env::is_wordpress() ) {
				$salt_x_sha  = wp_salt( 'c10n-default' );
				$salt_x_sha  = U\Crypto::x_sha( $salt_x_sha, 12 );
				$raw_context = 'wps~' . $salt_x_sha;

			} elseif ( U\Env::is_web() ) {
				$raw_context = 'web~' . ( U\URL::current_host() ?: 'default' );

			} elseif ( '' !== ( $_user_id = U\Env::var( 'USER_ID' ) ) ) {
				$raw_context = 'uid~' . $_user_id; // `0` = `root`.

			} else { // When unable to detect current user, use `default`.
				$raw_context = 'ulc~' . ( U\Env::var( 'USER_LC' ) ?: 'default' );
			}
		}
		if ( 'raw' === $format ) {
			return $context = $raw_context; // Skip formatting.
		}
		return $context = U\Pkg::format_str_helper( $raw_context, $format );
	}
}
