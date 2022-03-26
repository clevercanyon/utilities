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
namespace Clever_Canyon\Utilities\Traits\Crypto\Utilities;

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
 * @see   U\Crypto
 */
trait UUID_V4_Members {
	/**
	 * Version 4 UUID.
	 *
	 * @since 2021-12-15
	 *
	 * @param bool $optimize Remove dashes? Default is `true`.
	 *
	 * @return string Version 4 UUID (32 bytes optimized, 36 unoptimized).
	 *
	 * phpcs:disable WordPress.WP.AlternativeFunctions.rand_mt_rand
	 */
	public static function uuid_v4( bool $optimize = true ) : string {
		try { // Catch issues with {@see random_int()}.
			$uuid_v4 = sprintf(
				'%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
				random_int( 0, 0xffff ),
				random_int( 0, 0xffff ),
				random_int( 0, 0xffff ),
				random_int( 0, 0x0fff ) | 0x4000,
				random_int( 0, 0x3fff ) | 0x8000,
				random_int( 0, 0xffff ),
				random_int( 0, 0xffff ),
				random_int( 0, 0xffff )
			);
		} catch ( \Throwable $throwable ) {
			if ( U\Env::is_wordpress() ) {
				$uuid_v4 = wp_generate_uuid4();
			} else {
				$uuid_v4 = sprintf(
					'%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
					mt_rand( 0, 0xffff ),
					mt_rand( 0, 0xffff ),
					mt_rand( 0, 0xffff ),
					mt_rand( 0, 0x0fff ) | 0x4000,
					mt_rand( 0, 0x3fff ) | 0x8000,
					mt_rand( 0, 0xffff ),
					mt_rand( 0, 0xffff ),
					mt_rand( 0, 0xffff )
				);
			}
		}
		return $optimize ? str_replace( '-', '', $uuid_v4 ) : $uuid_v4;
	}
}
