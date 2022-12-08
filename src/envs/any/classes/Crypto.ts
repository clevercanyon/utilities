/**
 * Clever Canyon™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Imports and other headers.">

/**
 * Imports.
 *
 * @since 2022-04-25
 */
import { default as uA6tBase } from './a6t/Base';
import cryptoMd5               from 'crypto-js/md5';
import cryptoSha1              from 'crypto-js/sha1';
import cryptoSha256            from 'crypto-js/sha256';
import cryptoHmacSha1          from 'crypto-js/hmac-sha1';
import cryptoHmacSha256        from 'crypto-js/hmac-sha256';
import cryptoHex               from 'crypto-js/enc-hex';

// </editor-fold>

/**
 * Crypto utilities.
 *
 * @since 2022-04-25
 */
export default class uCrypto extends uA6tBase {
	/**
	 * Generates an MD5 hash.
	 *
	 * @param {string} str String to hash.
	 *
	 * @return {string} MD5. 32 hexadecimals in length.
	 */
	public static md5( str : string ) : string {
		return cryptoHex.stringify( cryptoMd5( str ) );
	}

	/**
	 * Generates a SHA-1 hash.
	 *
	 * @param {string} str String to hash.
	 *
	 * @return {string} SHA-1 hash. 40 hexadecimals in length.
	 */
	public static sha1( str : string ) : string {
		return cryptoHex.stringify( cryptoSha1( str ) );
	}

	/**
	 * Generates an HMAC SHA-1 hash.
	 *
	 * @param {string} str  String to hash.
	 * @param {string} salt Salt to use in hash.
	 *
	 * @return {string} HMAC SHA-1 hash. 64 hexadecimals in length.
	 */
	public static hmacSha1( str : string, salt : string ) : string {
		return cryptoHex.stringify( cryptoHmacSha1( str, salt ) );
	}

	/**
	 * Generates a SHA-256 hash.
	 *
	 * @param {string} str String to hash.
	 *
	 * @return {string} SHA-256 hash. 64 hexadecimals in length.
	 */
	public static sha256( str : string ) : string {
		return cryptoHex.stringify( cryptoSha256( str ) );
	}

	/**
	 * Generates an HMAC SHA-256 hash.
	 *
	 * @param {string} str  String to hash.
	 * @param {string} salt Salt to use in hash.
	 *
	 * @return {string} HMAC SHA-256 hash. 64 hexadecimals in length.
	 */
	public static hmacSha256( str : string, salt : string ) : string {
		return cryptoHex.stringify( cryptoHmacSha256( str, salt ) );
	}

	/**
	 * Generates a v4 UUID.
	 *
	 * @since 2022-04-25
	 *
	 * @param {boolean} [optimize=true] Optimize? Default is `true`.
	 *
	 * @returns {string} Version 4 UUID (32 bytes optimized, 36 unoptimized).
	 */
	public static uuidV4( optimize : boolean = true ) : string {
		return optimize ? crypto.randomUUID().replace( /-/ug, '' ) : crypto.randomUUID();
	}
}
