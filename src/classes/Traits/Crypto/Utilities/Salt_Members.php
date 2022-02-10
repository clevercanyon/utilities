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
trait Salt_Members {
	/**
	 * Crypto salt generator.
	 *
	 * @since 2022-01-05
	 *
	 * @param string|null $type Salt type (as a slug).
	 *                          Default is `default`.
	 *
	 * @return string Salt; always 128 bytes in length.
	 *
	 * @throws U\Fatal_Exception On invalid salt `$type`.
	 * @throws U\Fatal_Exception On unexpected salt size in bytes.
	 */
	public static function salt( /* string|null */ ?string $type = null ) : string {
		$type = $type ?: 'default';
		static $salt = []; // Memoize.

		if ( isset( $salt[ $type ] ) ) {
			return $salt[ $type ]; // Saves time.
		}
		if ( 'default' !== $type && ! U\Str::is_slug( $type ) ) {
			throw new U\Fatal_Exception( 'Invalid salt type: `' . $type . '`. Not a valid slug.' );
		}
		$salt[ $type ] = U\Env::static_var( 'CRYPTO_SALT_' . mb_strtoupper( U\Str::to_var( $type ) ) );

		if ( ! $salt[ $type ] ) {
			if ( U\Env::is_wordpress() ) {
				$salt[ $type ] = wp_salt( 'c10n-' . $type );

				if ( $salt[ $type ] && strlen( $salt[ $type ] ) < 128 ) {
					$salt[ $type ] = mb_substr( $salt[ $type ] . U\Crypto::x_sha( $salt[ $type ], 128 ), 0, 128 );
				}
			} else {
				$sys_data_dir = U\Dir::sys_data();
				$salt_file    = U\Dir::join( $sys_data_dir, '/crypto/salts/' . U\Str::to_fsc( $type ) . '.salt' );

				if ( is_file( $salt_file ) ) {
					$salt[ $type ] = U\File::read( $salt_file );
				} else {
					U\File::make( $salt_file );
					$salt[ $type ] = U\Crypto::keygen( 128 );
					U\File::write( $salt_file, $salt[ $type ] );
				}
			}
		}
		if ( ! $salt[ $type ] || strlen( $salt[ $type ] ) !== 128 ) {
			throw new U\Fatal_Exception(
				'Unexpected `' . $type . '` salt size in bytes.' .
				' Expecting 128 bytes. Got `' . strlen( $salt[ $type ] ) . '` bytes.'
			);
		}
		return $salt[ $type ];
	}
}
