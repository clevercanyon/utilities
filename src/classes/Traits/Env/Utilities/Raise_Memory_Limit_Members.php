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
namespace Clever_Canyon\Utilities\Traits\Env\Utilities;

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
 * @see   U\Env
 */
trait Raise_Memory_Limit_Members {
	/**
	 * Raises memory limit.
	 *
	 * @since 2022-01-02
	 *
	 * @param string $context Default is `admin`. Set to any arbitrary value.
	 *                        The special value of `admin` is assigned to `256M` in WordPress, and filtered by plugins.
	 *                        The special value of `admin` is assigned to `512M` outside of WordPress.
	 *
	 * @param string $limit   Either `-1` (no limit) or an abbreviated byte notation following PHP's shorthand syntax.
	 *                        {@see https://www.php.net/manual/en/faq.using.php#faq.using.shorthandbytes}.
	 *
	 *                        This will be ignored in a WordPress environment in favor of `$context` only.
	 *                        For specific limits in WordPress there are filters.
	 *                        {@see wp_raise_memory_limit()} for details.
	 *
	 * @return bool A value of `false` is returned on error, `true` otherwise.
	 */
	public static function raise_memory_limit( string $context = 'admin', string $limit = '' ) : bool {
		if ( U\Env::is_wordpress() ) {
			return false !== wp_raise_memory_limit( $context );
		} else {
			if ( false === U\Env::is_ini_setting_changeable( 'memory_limit' ) ) {
				return false; // Not possible.
			}
			$current_limit       = (string) ini_get( 'memory_limit' );
			$current_limit_bytes = '-1' === $current_limit ? -1 : U\File::abbr_bytes( $current_limit );

			switch ( $context ) {
				default:
					$context_limit       = '512M';
					$context_limit_bytes = U\File::abbr_bytes( $context_limit );
			}
			$requested_limit       = '' !== $limit ? $limit : '';
			$requested_limit_bytes = '' === $requested_limit ? 0
				: ( '-1' === $requested_limit ? -1 : U\File::abbr_bytes( $requested_limit ) );

			if ( -1 === $context_limit_bytes || -1 === $requested_limit_bytes ) {
				$new_limit       = '-1'; // Infinite.
				$new_limit_bytes = -1;   // Infinite.
			} else {
				$new_limit_bytes = max( $context_limit_bytes, $requested_limit_bytes );
				$new_limit       = U\File::ini_bytes_abbr( $new_limit_bytes );
			}
			if ( -1 === $new_limit_bytes && -1 !== $current_limit_bytes ) {
				return false !== ini_set( 'memory_limit', $new_limit ); // phpcs:ignore.

			} elseif ( $new_limit_bytes > $current_limit_bytes ) {
				return false !== ini_set( 'memory_limit', $new_limit ); // phpcs:ignore.
			}
			return true;
		}
	}
}
