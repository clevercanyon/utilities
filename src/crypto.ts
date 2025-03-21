/**
 * Crypto utilities.
 */

import '#@initialize.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $env, $fn, $is, $obj, $str, $time, $to, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type UUIDV4Options = { dashes?: boolean };
export type Base64EncodeOptions = { urlSafe?: boolean };
export type Base64DecodeOptions = { urlSafe?: boolean };
export type BlobToBase64Options = { urlSafe?: boolean; type?: string };
export type Base64ToBlobOptions = { urlSafe?: boolean; type?: string };
export type RandomStringOptions = { type?: string; byteDictionary?: string };
export type HashAlgorithm = 'md5' | 'sha-1' | 'sha-256' | 'sha-384' | 'sha-512';

/**
 * Regular expression for base64 data URIs.
 *
 * @see https://regex101.com/r/wBIQa7/1
 */
const dataURIBase64PrefixRegExp = /^data:([^:=;,]+(?:\s*;[^:=;,]+=[^:=;,]+)*);base64,/iu;

// ---
// Hash utilities.

/**
 * Generates an MD5 hash.
 *
 * @param   str String to hash.
 *
 * @returns     MD5 hash. 32 hexadecimals in length.
 *
 * @requiredEnv cfw -- Only Cloudflare implements MD5 legacy compat.
 */
export const md5 = $fnꓺmemo(2, async (str: string): Promise<string> => buildHash('md5', str));

/**
 * Generates a SHA hash.
 *
 * @param   str String to hash.
 * @param   x   Length of hash; 1-128.
 *
 * @returns     SHA hash; `x` hexadecimals in length.
 */
export const sha = $fnꓺmemo(2, async (str: string, x: number): Promise<string> => {
    return (await buildHash('sha-512', str)).slice(0, $to.numberBetween(x, 1, 128));
});

/**
 * Generates an HMAC SHA hash.
 *
 * @param   str String to hash.
 * @param   x   Length of hash; 1-128.
 * @param   key Key to use when hashing.
 *
 *   - Default key is taken from `APP_HMAC_SHA_KEY`.
 *
 * @returns     HMAC SHA hash; `x` hexadecimals in length.
 */
export const hmacSHA = $fnꓺmemo(2, async (str: string, x: number, key?: string): Promise<string> => {
    return (await buildHMACHash('sha-512', str, key)).slice(0, $to.numberBetween(x, 1, 128));
});

/**
 * Generates a SHA-1 hash.
 *
 * @param   str String to hash.
 *
 * @returns     SHA-1 hash. 40 hexadecimals in length.
 */
export const sha1 = $fnꓺmemo(2, async (str: string): Promise<string> => buildHash('sha-1', str));

/**
 * Generates an HMAC SHA-1 hash.
 *
 * @param   str String to hash.
 * @param   key Key to use when hashing.
 *
 *   - Default key is taken from `APP_HMAC_SHA_KEY`.
 *
 * @returns     HMAC SHA-1 hash. 40 hexadecimals in length.
 */
export const hmacSHA1 = $fnꓺmemo(2, async (str: string, key?: string): Promise<string> => buildHMACHash('sha-1', str, key));

/**
 * Generates a SHA-256 hash.
 *
 * @param   str String to hash.
 *
 * @returns     SHA-256 hash. 64 hexadecimals in length.
 */
export const sha256 = $fnꓺmemo(2, async (str: string): Promise<string> => buildHash('sha-256', str));

/**
 * Generates an HMAC SHA-256 hash.
 *
 * @param   str String to hash.
 * @param   key Key to use when hashing.
 *
 *   - Default key is taken from `APP_HMAC_SHA_KEY`.
 *
 * @returns     HMAC SHA-256 hash. 64 hexadecimals in length.
 */
export const hmacSHA256 = $fnꓺmemo(2, async (str: string, key?: string): Promise<string> => buildHMACHash('sha-256', str, key));

/**
 * Generates a SHA-384 hash.
 *
 * @param   str String to hash.
 *
 * @returns     SHA-384 hash. 96 hexadecimals in length.
 */
export const sha384 = $fnꓺmemo(2, async (str: string): Promise<string> => buildHash('sha-384', str));

/**
 * Generates an HMAC SHA-384 hash.
 *
 * @param   str String to hash.
 * @param   key Key to use when hashing.
 *
 *   - Default key is taken from `APP_HMAC_SHA_KEY`.
 *
 * @returns     HMAC SHA-384 hash. 96 hexadecimals in length.
 */
export const hmacSHA384 = $fnꓺmemo(2, async (str: string, key?: string): Promise<string> => buildHMACHash('sha-384', str, key));

/**
 * Generates a SHA-512 hash.
 *
 * @param   str String to hash.
 *
 * @returns     SHA-512 hash. 128 hexadecimals in length.
 */
export const sha512 = $fnꓺmemo(2, async (str: string): Promise<string> => buildHash('sha-512', str));

/**
 * Generates an HMAC SHA-512 hash.
 *
 * @param   str String to hash.
 * @param   key Key to use when hashing.
 *
 *   - Default key is taken from `APP_HMAC_SHA_KEY`.
 *
 * @returns     HMAC SHA-512 hash. 128 hexadecimals in length.
 */
export const hmacSHA512 = $fnꓺmemo(2, async (str: string, key?: string): Promise<string> => buildHMACHash('sha-512', str, key));

// ---
// Base64 utilities.

/**
 * Base64-encodes a string.
 *
 * @param   str     Input string to encode.
 * @param   options All optional; {@see Base64EncodeOptions}.
 *
 * @returns         Base-64 encoded string.
 *
 * @see https://web.dev/articles/base64-encoding
 */
export const base64Encode = (str: string, options?: Base64EncodeOptions): string => {
    const opts = $obj.defaults({}, options || {}, { urlSafe: false }) as Required<Base64EncodeOptions>,
        base64 = btoa($str.textEncode(str).reduce((str, i) => (str += String.fromCodePoint(i)), ''));

    return opts.urlSafe ? base64.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '') : base64;
};

/**
 * Decodes a base64-encoded string.
 *
 * @param   str     Input base-4 string to decode.
 * @param   options All optional; {@see Base64DecodeOptions}.
 *
 * @returns         Base64-decoded string.
 *
 * @throws          When input string is not valid base-64.
 *
 * @see https://web.dev/articles/base64-encoding
 */
export const base64Decode = (base64: string, options?: Base64DecodeOptions): string => {
    const opts = $obj.defaults({}, options || {}, { urlSafe: false }) as Required<Base64DecodeOptions>;

    base64 = base64.replace(dataURIBase64PrefixRegExp, ''); // Ditch data URI prefixes.
    base64 = opts.urlSafe ? base64.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (base64.length % 4)) % 4) : base64;

    return $str.textDecode(Uint8Array.from($fn.try(() => atob(base64), '')(), (v: string): number => Number(v.codePointAt(0))));
};

/**
 * Base64-encodes a blob.
 *
 * @param   blob    Input blob to encode.
 * @param   options All optional; {@see BlobToBase64Options}.
 *
 * @returns         Base64-encoded string.
 *
 * @see https://web.dev/articles/base64-encoding
 */
export const blobToBase64 = async (blob: $type.Blob, options?: BlobToBase64Options): Promise<string> => {
    const opts = $obj.defaults({}, options || {}, { urlSafe: false, type: '' }) as Required<BlobToBase64Options>,
        base64 = btoa(new Uint8Array(await blob.arrayBuffer()).reduce((str, i) => (str += String.fromCodePoint(i)), '')),
        type = opts.type || blob.type || ''; // Prefers explicit type.

    return (
        'data:' + type + ';base64,' + // As a data URI to preserve MIME type.
        (opts.urlSafe ? base64.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '') : base64)
    ); // prettier-ignore
};

/**
 * Decodes a base64-encoded string into a blob.
 *
 * @param   str     Input base-4 string to decode.
 * @param   options All optional; {@see Base64ToBlobOptions}.
 *
 * @returns         Base64-decoded blob.
 *
 * @throws          When input string is not valid base-64.
 *
 * @see https://web.dev/articles/base64-encoding
 */
export const base64ToBlob = async (base64: string, options?: Base64ToBlobOptions): Promise<Blob> => {
    const opts = $obj.defaults({}, options || {}, { urlSafe: false, type: '' }) as Required<Base64ToBlobOptions>,
        [, dataURIType = ''] = base64.match(dataURIBase64PrefixRegExp) || [],
        type = opts.type || dataURIType || ''; // Prefers explicit type.

    base64 = base64.replace(dataURIBase64PrefixRegExp, ''); // Ditch data URI prefixes.
    base64 = opts.urlSafe ? base64.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat(base64.length % 4) : base64;

    return new Blob([Uint8Array.from($fn.try(() => atob(base64), '')(), (v: string): number => Number(v.codePointAt(0)))], { type });
};

// ---
// Email utilities.

/**
 * Produces an email verification token.
 *
 * @param   email  User email address to verify.
 * @param   userId Optional user ID; e.g., for change of address.
 *
 * @returns        Promise of email verification token; variable length.
 *
 *   - Token always expires automatically after 2 days.
 *   - Token length is variable, based on length of email address.
 */
export const emailToken = async (email: string, userId: number = 0): Promise<string> => {
    const tokenEmail = email.toLowerCase(),
        tokenUUIDV4x2 = uuidV4() + uuidV4(),
        tokenUserId = userId.toString().padStart(20, '0'),
        tokenExpireTime = $time.stamp() + $time.dayInSeconds * 2,
        tokenHash = await hmacSHA256(tokenUUIDV4x2 + tokenEmail + tokenUserId + String(tokenExpireTime));

    return base64Encode(tokenEmail, { urlSafe: true }) + tokenUUIDV4x2 + tokenUserId + tokenHash + String(tokenExpireTime);
};

/**
 * Verifies an email token.
 *
 * @param   token  Email verification token (variable length).
 * @param   userId Optional user ID; e.g., for change of address.
 *
 * @returns        Promise of verified email address; else empty string.
 */
export const emailVerify = async (token: string, userId: number = 0): Promise<string> => {
    if (!token) return ''; // Invalid token.

    const tokenHash = token.slice(-74, -10),
        tokenUserId = token.slice(-94, -74),
        tokenUUIDV4x2 = token.slice(-158, -94),
        tokenExpireTime = Number(token.slice(-10)),
        tokenEmail = base64Decode(token.slice(0, -158), { urlSafe: true }),
        tokenActualUserId = Number($str.lTrim(tokenUserId, '0') || '0');

    if ($is.safeInteger(tokenExpireTime) && tokenExpireTime > $time.stamp())
        if (safeEqual(tokenHash, await hmacSHA256(tokenUUIDV4x2 + tokenEmail + tokenUserId + String(tokenExpireTime)))) {
            if ($str.isEmail(tokenEmail) && safeEqual(String(userId), String(tokenActualUserId))) {
                return tokenEmail; // Verified user email address.
            }
        }
    return ''; // Invalid token.
};

// ---
// Authentication utilities.

/**
 * Gets authorization token name.
 *
 * @returns Authorization token name; 42 bytes.
 */
export const authTokenName = (): string => {
    return 'user_auth_' + $env.get('APP_AUTH_TOKEN_NAME_HASH', { type: 'string', require: true }).padStart(32, '0').slice(0, 32);
};

/**
 * Gets authorization token salt.
 *
 * @returns Authorization token salt; typically 64 bytes.
 */
export const authTokenSalt = (): string => {
    return $env.get('APP_AUTH_TOKEN_SECRET_SALT', { type: 'string', require: true });
};

/**
 * Produces an authorization token.
 *
 * @param   userId User ID to authenticate.
 *
 * @returns        Promise of auth token; 158 bytes.
 *
 *   - Token always expires automatically after 1 year.
 *   - Token is always 158 bytes in length.
 */
export const authToken = async (userId: number): Promise<string> => {
    const tokenName = authTokenName(),
        tokenSalt = authTokenSalt(),
        //
        tokenUUIDV4x2 = uuidV4() + uuidV4(), // 64 bytes.
        tokenUserId = userId.toString().padStart(20, '0'), // 20 bytes.
        tokenExpireTime = $time.stamp() + $time.yearInSeconds, // 10 bytes.
        tokenHash = await hmacSHA256(tokenUUIDV4x2 + tokenName + tokenSalt + tokenUserId + String(tokenExpireTime)); // 64 bytes.

    return tokenUUIDV4x2 + tokenUserId + tokenHash + String(tokenExpireTime);
};

/**
 * Verifies an authorization token.
 *
 * @param   token Authorization token (158 bytes).
 *
 * @returns       Promise of verified user ID; else `0`.
 */
export const authVerify = async (token: string): Promise<number> => {
    if (!token || 158 !== $str.byteLength(token)) {
        return 0; // Invalid token.
    }
    const tokenName = authTokenName(),
        tokenSalt = authTokenSalt(),
        //
        tokenHash = token.slice(-74, -10),
        tokenUUIDV4x2 = token.slice(0, -94),
        tokenUserId = token.slice(-94, -74),
        tokenExpireTime = Number(token.slice(-10)),
        tokenActualUserId = Number($str.lTrim(tokenUserId, '0') || '0');

    if ($is.safeInteger(tokenExpireTime) && tokenExpireTime > $time.stamp())
        if (safeEqual(tokenHash, await hmacSHA256(tokenUUIDV4x2 + tokenName + tokenSalt + tokenUserId + String(tokenExpireTime)))) {
            if ($is.safeInteger(tokenActualUserId) && tokenActualUserId > 0) {
                return tokenActualUserId; // Authenticated user ID.
            }
        }
    return 0; // Invalid token.
};

// ---
// Randomization utilities.

/**
 * Random number generator.
 *
 * @param   min Minimum value. Default is `1`. Can be set to `0` if desirable.
 * @param   max Maximum value. Default is {@see Number.MAX_SAFE_INTEGER}.
 *
 * @returns     Random number between `min` and `max` inclusive.
 */
export const randomNumber = (min: number = 1, max: number = Number.MAX_SAFE_INTEGER): number => {
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
    const opts = $obj.defaults({}, options || {}, { type: 'default', byteDictionary: '' }) as Required<RandomStringOptions>;

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
        throw Error('JqrKKDY2'); // Byte dictionary length is `<= 1`.
    }
    for (let i = 0; i < byteLength; i++) {
        str += byteDictionary.at(randomNumber(0, byteDictionary.length - 1));
    }
    return str;
};

// ---
// UUID utilities.

/**
 * Generates a v4 UUID.
 *
 * @param   options Default is `{ dashes: false }`.
 *
 * @returns         Version 4 UUID (32 bytes w/o dashes, 36 bytes with dashes).
 */
export const uuidV4 = (options?: UUIDV4Options): string => {
    const opts = $obj.defaults({}, options || {}, { dashes: false }) as Required<UUIDV4Options>;
    return opts.dashes ? crypto.randomUUID() : crypto.randomUUID().replace(/-/gu, '');
};

// ---
// CSP utilities.

/**
 * Generates an nonce for content security policies.
 *
 * @returns Nonce for content security policies; always 44 bytes in length.
 */
export const cspNonce = (): string => {
    return base64Encode(uuidV4() /* 32 bytes */); // Fixed length of 44 bytes.
};

/**
 * Returns an nonce replacement code for content security policies.
 *
 * @returns Nonce replacement code for content security policies; always 44 bytes in length.
 */
export const cspNonceReplacementCode = (): string => {
    return '{%-_{%-___________cspNonce___________-%}_-%}'; // Fixed length of 44 bytes.
};

// ---
// Comparison utilities.

/**
 * Performs a timing-safe string comparison.
 *
 * Currently, this only works in a Cloudflare environment; {@see https://o5p.me/0PgtOY}.
 *
 * @param   strA A string to compare.
 * @param   strB B string to compare.
 *
 * @returns      True if string are equal.
 *
 * @requiredEnv cfw -- Otherwise, this uses an unsafe fallback.
 */
export const safeEqual = (strA: string, strB: string): boolean => {
    if (!$env.isCFW()) return strA === strB;
    if (strA.length !== strB.length) return false;

    const a = $str.textEncode(strA),
        b = $str.textEncode(strB);

    if (a.byteLength !== b.byteLength) return false;
    return (crypto as $type.cfw.Crypto).subtle.timingSafeEqual(a, b);
};

/* ---
 * Misc utilities.
 */

/**
 * Converts an array buffer to hexadecimals.
 *
 * @param   buffer Any {@see ArrayBuffer}.
 *
 * @returns        Stringified buffer as hexadecimals.
 */
const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
        .map((bin) => bin.toString(16).padStart(2, '0'))
        .join('');
};

/**
 * Builds a hash using a specified algorithm.
 *
 * @param   algo One of: {@see HashAlgorithm}.
 *
 * @returns      Hash promise, of variable length, based on selected algorithm.
 */
const buildHash = async (algo: HashAlgorithm, str: string): Promise<string> => {
    return bufferToHex(await crypto.subtle.digest(algo, $str.textEncode(str)));
};

/**
 * Builds an HMAC keyed hash using a specified algorithm.
 *
 * @param   algo One of: {@see HashAlgorithm}.
 * @param   str  String to hash.
 * @param   key  Key to use when hashing.
 *
 *   - Default key is taken from `APP_HMAC_SHA_KEY`.
 *   - Passing `&` will use `APP_C10N_HMAC_SHA_KEY`.
 *
 * @returns      HMAC keyed hash promise, of variable length, based on selected algorithm.
 */
const buildHMACHash = async (algo: HashAlgorithm, str: string, key?: string): Promise<string> => {
    if ('&' === key) {
        key = $env.get('APP_C10N_HMAC_SHA_KEY', { type: 'string', require: true });
    } else if (!key) {
        key = $env.get('APP_HMAC_SHA_KEY', { type: 'string', require: true });
    }
    if (!key) throw Error('Fh5H2DRf');

    const encodedKey = $str.textEncode(key),
        cryptoKey = await crypto.subtle.importKey('raw', encodedKey, { name: 'hmac', hash: { name: algo } }, false, ['sign', 'verify']);

    return bufferToHex(await crypto.subtle.sign('hmac', cryptoKey, $str.textEncode(str)));
};
