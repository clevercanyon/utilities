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
export type RandomStringOptions = { type?: string; byteDictionary?: string };

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

/**
 * Random number generator.
 *
 * @param   min Minimum value.
 * @param   max Maximum value.
 *
 * @returns     Random number between `min` and `max` inclusive.
 */
export const randomNumber = (min: number = 0, max: number = 2147483647): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Random string generator.
 *
 * Default dictionary, assuming `{ type: 'default' }`, is 66 bytes.
 *
 *     23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ!@#%^&*+-=_?
 *
 *     66^32 (32 bytes) = 16803739386732805588924132780810339299166149216244183597056 possibilities.
 *     66^24 (24 bytes) = 46671789498503428939167356055479642316865536 possibilities.
 *     66^12 (12 bytes) = 6831675453247426400256 possibilities.
 *     66^8 (8 bytes) = 360040606269696 possibilities.
 *
 * Alphabetic dictionary, assuming `{ type: 'alphabetic' }`, is 46 bytes.
 *
 *     abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ
 *
 *     46^32 (32 bytes) = 161529040680870074100680119806799048214504294859145216 possibilities.
 *     46^24 (24 bytes) = 8057270801734336909035597580036898553856 possibilities.
 *     46^12 (12 bytes) = 89762301673555234816 possibilities.
 *     46^8 (8 bytes) = 20047612231936 possibilities.
 *
 * CaSed alphabetic dictionary, assuming `{ type: '(lower|upper)-alphabetic' }`, is 23 bytes.
 *
 *     abcdefghjkmnpqrstuvwxyz or ABCDEFGHJKMNPQRSTUVWXYZ
 *
 *     23^32 (32 bytes) = 37608910510519071039902074217516707306379521 possibilities.
 *     23^24 (24 bytes) = 480250763996501976790165756943041 possibilities.
 *     23^12 (12 bytes) = 21914624432020321 possibilities.
 *     23^8 (8 bytes) = 78310985281 possibilities.
 *
 * Alphanumeric dictionary, assuming `{ type: 'alphanumeric' }`, is 54 bytes.
 *
 *     23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ
 *
 *     54^32 (32 bytes) = 27327525884414205519790497974303154461449992065060438016 possibilities.
 *     54^24 (24 bytes) = 377963825299746235969115118367001548947456 possibilities.
 *     54^12 (12 bytes) = 614787626176508399616 possibilities.
 *     54^8 (8 bytes) = 72301961339136 possibilities.
 *
 * CaSed alphanumeric dictionary, assuming `{ type: '(lower|upper)-alphanumeric' }`, is 31 bytes.
 *
 *     23456789abcdefghjkmnpqrstuvwxyz or 23456789ABCDEFGHJKMNPQRSTUVWXYZ
 *
 *     31^32 (32 bytes) = 529144398052420314716929933900838757437386767361 possibilities.
 *     31^24 (24 bytes) = 620412660965527688188300451573157121 possibilities.
 *     31^12 (12 bytes) = 787662783788549761 possibilities.
 *     31^8 (8 bytes) = 852891037441 possibilities.
 *
 * Numeric dictionary, assuming `{ type: 'numeric' }`, is 8 bytes.
 *
 *     23456789
 *
 *     8^32 (32 bytes) = 79228162514264337593543950336 possibilities.
 *     8^24 (24 bytes) = 4722366482869645213696 possibilities.
 *     8^12 (12 bytes) = 68719476736 possibilities.
 *     8^8 (8 bytes) = 16777216 possibilities.
 *
 * URL-safe dictionary, assuming `{ type: 'url-safe' }`, is 56 bytes.
 *
 *     23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ-_
 *
 *     56^32 (32 bytes) = 87501775260248338795649138639242377629452267851964481536 possibilities.
 *     56^24 (24 bytes) = 904716785818481122446300007835278136836096 possibilities.
 *     56^12 (12 bytes) = 951166013805414055936 possibilities.
 *     56^8 (8 bytes) = 96717311574016 possibilities.
 *
 * Full dictionary is 94 bytes, assuming `{ type: 'cryptic' }`.
 *
 *     0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*+-=_()[]{}<>|\/?.,;:'"
 *
 *     94^32 (32 bytes) = 1380674536088650126365233338290905239051505147118049339937652736 possibilities.
 *     94^24 (24 bytes) = 226500146052898041878222437726567560344026218496 possibilities.
 *     94^12 (12 bytes) = 475920314814253376475136 possibilities.
 *     94^8 (8 bytes) = 6095689385410816 possibilities.
 *
 * If you pass `{ byteDictionary: '...' }`, please be sure to calculate permutations and assess whether or not the
 * possibility of collisions is acceptible for your use case. Also, please take note that when passing `{
 * byteDictionary: '...' }`, the `{ type: '' }` option will be ignored in favor of your dictionary.
 *
 * @param   byteLength Byte length. Default is `32`.
 *
 * @returns            Random string at requested byte length.
 *
 * @throws             If options exclude everything there is nothing to randomize.
 */
export const randomString = (byteLength: number = 32, options?: RandomStringOptions): string => {
	let str = '', // Initializes.
		byteDictionary = ''; // Determined below.

	byteLength = Math.max(0, byteLength); // Cannot be shorter than zero bytes.
	const opts = $objꓺdefaults({}, options || {}, { type: 'default', byteDictionary: '' }) as Required<RandomStringOptions>;

	if (opts.byteDictionary) {
		byteDictionary = opts.byteDictionary; // Established by options.
	} else {
		const byteGroups: { [x: string]: string } = {
			numbers: '0123456789',
			lowerLetters: 'abcdefghijklmnopqrstuvwxyz',
			upperLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			symbols: '`~!@#$%^&*+-=_()[]{}<>|\\/?.,;:\'"',
		};
		const byteExclusionGroups: { [x: string]: RegExp } = {
			similar: /[iIlL|1oO0]/gu,
			ambiguous: /[$`~()[\]{}<>\\/.,;:'"]/gu,
			urlUnsafe: /[^a-zA-Z0-9.~_-]/gu,
		};
		switch (opts.type) {
			case 'alphabetic': {
				byteDictionary += byteGroups.lowerLetters;
				byteDictionary += byteGroups.upperLetters;
				break;
			}
			case 'lower-alphabetic': {
				byteDictionary += byteGroups.lowerLetters;
				break;
			}
			case 'upper-alphabetic': {
				byteDictionary += byteGroups.upperLetters;
				break;
			}
			case 'alphanumeric': {
				byteDictionary += byteGroups.numbers;
				byteDictionary += byteGroups.lowerLetters;
				byteDictionary += byteGroups.upperLetters;
				break;
			}
			case 'lower-alphanumeric': {
				byteDictionary += byteGroups.numbers;
				byteDictionary += byteGroups.lowerLetters;
				break;
			}
			case 'upper-alphanumeric': {
				byteDictionary += byteGroups.numbers;
				byteDictionary += byteGroups.upperLetters;
				break;
			}
			case 'numeric': {
				byteDictionary += byteGroups.numbers;
				break;
			}
			case 'cryptic':
			case 'url-safe':
			case 'default':
			default: {
				byteDictionary += byteGroups.numbers;
				byteDictionary += byteGroups.lowerLetters;
				byteDictionary += byteGroups.upperLetters;
				byteDictionary += byteGroups.symbols;
			}
		}
		switch (opts.type) {
			case 'cryptic': {
				break; // No exclusions.
			}
			case 'default':
			default: {
				// Unless `{ type: 'cryptic' }`, these are excluded always.
				byteDictionary = byteDictionary.replace(byteExclusionGroups.similar, '');
				byteDictionary = byteDictionary.replace(byteExclusionGroups.ambiguous, '');

				if ('url-safe' === opts.type) {
					byteDictionary = byteDictionary.replace(byteExclusionGroups.urlUnsafe, '');
				}
			}
		}
	}
	if (byteDictionary.length <= 1) {
		throw new Error('Nothing to randomize.');
	}
	for (let i = 0; i < byteLength; i++) {
		str += byteDictionary.slice(randomNumber(0, byteDictionary.length - 1), 1);
	}
	return str;
};
