/**
 * Utility class.
 */

import cryptoHex from 'crypto-js/enc-hex';
import cryptoHMACSHA1 from 'crypto-js/hmac-sha1';
import cryptoHMACSHA256 from 'crypto-js/hmac-sha256';
import cryptoMD5 from 'crypto-js/md5';
import cryptoSHA1 from 'crypto-js/sha1';
import cryptoSHA256 from 'crypto-js/sha256';

/**
 * Crypto utilities.
 */
export default class $Crypto {
	/**
	 * Generates an MD5 hash.
	 *
	 * @param str String to hash.
	 *
	 * @returns MD5. 32 hexadecimals in length.
	 */
	public static md5(str: string): string {
		return cryptoHex.stringify(cryptoMD5(str));
	}

	/**
	 * Generates a SHA-1 hash.
	 *
	 * @param str String to hash.
	 *
	 * @returns SHA-1 hash. 40 hexadecimals in length.
	 */
	public static sha1(str: string): string {
		return cryptoHex.stringify(cryptoSHA1(str));
	}

	/**
	 * Generates an HMAC SHA-1 hash.
	 *
	 * @param str  String to hash.
	 * @param salt Salt to use in hash.
	 *
	 * @returns HMAC SHA-1 hash. 64 hexadecimals in length.
	 */
	public static hmacSha1(str: string, salt: string): string {
		return cryptoHex.stringify(cryptoHMACSHA1(str, salt));
	}

	/**
	 * Generates a SHA-256 hash.
	 *
	 * @param str String to hash.
	 *
	 * @returns SHA-256 hash. 64 hexadecimals in length.
	 */
	public static sha256(str: string): string {
		return cryptoHex.stringify(cryptoSHA256(str));
	}

	/**
	 * Generates an HMAC SHA-256 hash.
	 *
	 * @param str  String to hash.
	 * @param salt Salt to use in hash.
	 *
	 * @returns HMAC SHA-256 hash. 64 hexadecimals in length.
	 */
	public static hmacSha256(str: string, salt: string): string {
		return cryptoHex.stringify(cryptoHMACSHA256(str, salt));
	}

	/**
	 * Generates a v4 UUID.
	 *
	 * @param optimize Optimize? Default is `true`.
	 *
	 * @returns Version 4 UUID (32 bytes optimized, 36 unoptimized).
	 */
	public static uuidV4(optimize: boolean = true): string {
		return optimize ? crypto.randomUUID().replace(/-/gu, '') : crypto.randomUUID();
	}
}