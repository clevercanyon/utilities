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
trait Disable_Caching_Members {
	/**
	 * Disables caching w/ WordPress compat.
	 *
	 * @since        2021-12-15
	 *
	 * @return bool True if caching disabled successfully.
	 *
	 * @noinspection PhpUndefinedFunctionInspection
	 */
	public static function disable_caching() : bool {
		if ( U\Env::is_wordpress() ) {
			$set_do_not_cache_page_constant   = U\Env::maybe_define( 'DONOTCACHEPAGE', true );
			$set_do_not_cache_object_constant = U\Env::maybe_define( 'DONOTCACHEOBJECT', true );
			$set_do_not_cache_db_constant     = U\Env::maybe_define( 'DONOTCACHEDB', true );

			$defined_constants = // All set?
				$set_do_not_cache_page_constant
				&& $set_do_not_cache_object_constant
				&& $set_do_not_cache_db_constant;

			if ( $set_headers = ! headers_sent() ) {
				header_remove( 'etag' );
				header_remove( 'last-modified' );
				nocache_headers(); // Headers produced by WP.
			}
			if ( U\Env::is_apache() && U\Env::can_use_function( 'apache_setenv' ) ) {
				$apache_setenv_no_cache = apache_setenv( 'no-cache', '1' ); // phpcs:ignore.
			} else {
				$apache_setenv_no_cache = null; // Not applicable.
			}
			$set_static_var = null !== U\Env::static_var( 'HTTP_CACHE', false );

			return $defined_constants
				&& $set_headers
				&& false !== $apache_setenv_no_cache
				&& $set_static_var;
		} else {
			if ( $set_headers = ! headers_sent() ) {
				header_remove( 'etag' );
				header_remove( 'last-modified' );
				header( 'expires: Wed, 16 Jun 1976 00:00:00 GMT' );
				header( 'cache-control: no-cache, must-revalidate, max-age=0' );
			}
			if ( U\Env::is_apache() && U\Env::can_use_function( 'apache_setenv' ) ) {
				$apache_setenv_no_cache = apache_setenv( 'no-cache', '1' ); // phpcs:ignore.
			} else {
				$apache_setenv_no_cache = null; // Not applicable.
			}
			$set_static_var = null !== U\Env::static_var( 'HTTP_CACHE', false );

			return $set_headers
				&& false !== $apache_setenv_no_cache
				&& $set_static_var;
		}
	}
}
