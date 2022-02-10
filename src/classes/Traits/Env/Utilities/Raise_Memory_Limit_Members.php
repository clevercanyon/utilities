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
	 * Memory limit, in bytes.
	 *
	 * @since 2022-02-08
	 *
	 * @return int Memory limit, in bytes.
	 *             `0` indicates a failure to read memory limit.
	 *             `-1` indicates no memory limit; i.e., system availability.
	 */
	public static function memory_limit() : int {
		$limit = (string) ini_get( 'memory_limit' );
		return '-1' === $limit ? -1 : U\File::abbr_bytes( $limit );
	}

	/**
	 * Raises memory limit.
	 *
	 * @since 2022-01-02
	 *
	 * @param string      $context Default is `admin`, which is `256M` by default.
	 *
	 *                               * WordPress supports `admin`, `image`, and arbitrary contexts.
	 *                                 Both = `256M` by default, and all contexts get filtered by plugins.
	 *                                 There is also an upper max that's dynamic. {@see WP_MAX_MEMORY_LIMIT}.
	 *
	 *                               * Outside of WordPress, you can pass any arbitrary context, but the only
	 *                                 effective contexts at this time are `admin` = `256M` and `dev` = `512M`.
	 *                                 Any context not matching one of those values will default to `admin`.
	 *
	 * @param string|null $limit   Optional specific limit desired. The new memory limit will be `max( $context, $limit )`.
	 *                             Set this to `-1` (no limit), or to an abbreviated byte notation following PHP's shorthand syntax.
	 *                             {@see https://www.php.net/manual/en/faq.using.php#faq.using.shorthandbytes}.
	 *
	 *                               * This parameter is ignored in a WordPress environment in favor of `$context` only.
	 *                                 For specific limits in WordPress there are context filters; {@see wp_raise_memory_limit()}.
	 *
	 * @return int Revised memory limit, in bytes; {@see U\Env::memory_limit()}.
	 */
	public static function raise_memory_limit( string $context = 'admin', /* string|null */ ?string $limit = null ) : int {
		if ( U\Env::is_wordpress() ) {
			wp_raise_memory_limit( $context );
			return U\Env::memory_limit();
		} else {
			if ( ! U\Env::is_ini_setting_changeable( 'memory_limit' ) ) {
				return U\Env::memory_limit();
			}
			switch ( $context ) {
				case 'dev':
					$context_limit       = '512M';
					$context_limit_bytes = U\File::abbr_bytes( $context_limit );
					break; // Stop here.

				case 'admin':
				default: // Default context.
					$context_limit       = '256M';
					$context_limit_bytes = U\File::abbr_bytes( $context_limit );
			}
			$requested_limit       = '' !== (string) $limit ? $limit : '';
			$requested_limit_bytes = '' === $requested_limit ? 0
				: ( '-1' === $requested_limit ? -1 : U\File::abbr_bytes( $requested_limit ) );

			if ( -1 === $context_limit_bytes || -1 === $requested_limit_bytes ) {
				$new_limit       = '-1'; // Infinite.
				$new_limit_bytes = -1;   // Infinite.
			} else {
				$new_limit_bytes = max( $context_limit_bytes, $requested_limit_bytes );
				$new_limit       = U\File::ini_bytes_abbr( $new_limit_bytes );
			}
			$current_limit       = (string) ini_get( 'memory_limit' );
			$current_limit_bytes = '-1' === $current_limit ? -1 : U\File::abbr_bytes( $current_limit );

			if ( ( -1 === $new_limit_bytes && -1 !== $current_limit_bytes ) || $new_limit_bytes > $current_limit_bytes ) {
				ini_set( 'memory_limit', $new_limit ); // phpcs:ignore.
			}
			return U\Env::memory_limit();
		}
	}
}
