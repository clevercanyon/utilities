/**
 * Crypto utilities.
 */

import { svz as $moizeꓺsvz } from './moize.js';
import { defaults as $objꓺdefaults } from './obj.js';

import cryptoJSꓺmd5 from 'crypto-js/md5.js';
import cryptoJSꓺencꓺhex from 'crypto-js/enc-hex.js';

import cryptoJSꓺsha1 from 'crypto-js/sha1.js';
import cryptoJSꓺhmacSHA1 from 'crypto-js/hmac-sha1.js';

import cryptoJSꓺsha256 from 'crypto-js/sha256.js';
import cryptoJSꓺhmacSHA256 from 'crypto-js/hmac-sha256.js';

/**
 * Defines types.
 */
export type UUIDV4Options = { dashes?: boolean };

/**
 * Generates an MD5 hash.
 *
 * @param   str String to hash.
 *
 * @returns     MD5. 32 hexadecimals in length.
 */
export const md5 = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(str: string): string => {
		return cryptoJSꓺencꓺhex.stringify(cryptoJSꓺmd5(str));
	},
);

/**
 * Generates a SHA-1 hash.
 *
 * @param   str String to hash.
 *
 * @returns     SHA-1 hash. 40 hexadecimals in length.
 */
export const sha1 = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(str: string): string => {
		return cryptoJSꓺencꓺhex.stringify(cryptoJSꓺsha1(str));
	},
);

/**
 * Generates an HMAC SHA-1 hash.
 *
 * @param   str  String to hash.
 * @param   salt Salt to use in hash.
 *
 * @returns      HMAC SHA-1 hash. 64 hexadecimals in length.
 */
export const hmacSHA1 = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(str: string, salt: string): string => {
		return cryptoJSꓺencꓺhex.stringify(cryptoJSꓺhmacSHA1(str, salt));
	},
);

/**
 * Generates a SHA-256 hash.
 *
 * @param   str String to hash.
 *
 * @returns     SHA-256 hash. 64 hexadecimals in length.
 */
export const sha256 = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(str: string): string => {
		return cryptoJSꓺencꓺhex.stringify(cryptoJSꓺsha256(str));
	},
);

/**
 * Generates an HMAC SHA-256 hash.
 *
 * @param   str  String to hash.
 * @param   salt Salt to use in hash.
 *
 * @returns      HMAC SHA-256 hash. 64 hexadecimals in length.
 */
export const hmacSHA256 = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(str: string, salt: string): string => {
		return cryptoJSꓺencꓺhex.stringify(cryptoJSꓺhmacSHA256(str, salt));
	},
);

/**
 * Generates a v4 UUID.
 *
 * @param   options Default is `{ dashes: false }`.
 *
 * @returns         Version 4 UUID (32 bytes w/o dashes, 36 bytes with dashes).
 */
export const uuidV4 = (options?: UUIDV4Options): string => {
	const opts = $objꓺdefaults({}, options || {}, { dashes: false }) as Required<UUIDV4Options>;
	return opts.dashes ? crypto.randomUUID() : crypto.randomUUID().replace(/-/gu, '');
};
