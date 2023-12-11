/**
 * String utilities.
 */

import '#@initialize.ts';

import { $dom, $env, $is, $obj, $to } from '#index.ts';
import ipRegex from 'ip-regex';

const ipV4MaxLength = 15; // Max length of an IPv4 address.
const ipV6MaxLength = 45; // Max length of an IPv6 address.

let unescHTMLDiv: HTMLElement; // Initialize.
const escHTMLEntityMap: { [x: string]: string } = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const unescHTMLCharMap: { [x: string]: string } = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

// Please be cautious, this has the `g`, and therefore it has state.
const wordSplittingRegExp = /([^\p{L}\p{N}]+|(?<=\p{L})(?=\p{N})|(?<=\p{N})(?=\p{L})|(?<=[\p{Ll}\p{N}])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}\p{Ll})|(?<=[\p{L}\p{N}])(?=\p{Lu}\p{Ll}))/gu;

/**
 * Defines types.
 */
export type TrimOptions = { left?: boolean; right?: boolean };
export type ClipOptions = { maxBytes?: number; maxChars?: number; indicator?: string };
export type SplitWordOptions = { whitespaceOnly?: boolean };

export type TitleCaseOptions = { asciiOnly?: boolean; splitOnWhitespaceOnly?: boolean };
export type LowerCaseOptions = { asciiOnly?: boolean; splitOnWhitespaceOnly?: boolean };
export type UpperCaseOptions = LowerCaseOptions; // Same options as lowerCase.

export type StudlyCaseOptions = { asciiOnly?: boolean; letterFirst?: string };
export type CamelCaseOptions = { asciiOnly?: boolean; letterFirst?: string };
export type KebabCaseOptions = { asciiOnly?: boolean; letterFirst?: string };
export type SnakeCaseOptions = KebabCaseOptions; // Same options as kebabCase.

export type QuoteOptions = { type?: 'single' | 'double' };
export type UnquoteOptions = { type?: string };
export type EscHTMLOptions = { doubleEncode: boolean };

/* ---
 * Encoder/decoder.
 */

export const textEncoder: TextEncoder = new TextEncoder();
export const textDecoder: TextDecoder = new TextDecoder();

/* ---
 * Size utilities.
 */

/**
 * Gets length in bytes.
 *
 * @param   str String to consider.
 *
 * @returns     Length in bytes.
 */
export const byteLength = (str: string): number => {
    return toBytes(str).length;
};

/**
 * Gets length in characters.
 *
 * @param   str String to consider.
 *
 * @returns     Length in characters.
 */
export const charLength = (str: string): number => {
    return toChars(str).length;
};

/* ---
 * Byte utilities.
 */

/**
 * Converts a string into a byte array.
 *
 * @param   str String.
 *
 * @returns     Byte array.
 */
export const toBytes = (str: string): Uint8Array => {
    return textEncoder.encode(str);
};

/**
 * Converts a byte array into a string.
 *
 * @param   bytes Byte array.
 *
 * @returns       String.
 */
export const fromBytes = (bytes: Uint8Array): string => {
    return textDecoder.decode(bytes);
};

/* ---
 * Char utilities.
 */

/**
 * Converts a string into a characters array.
 *
 * @param   str String.
 *
 * @returns     Characters array.
 */
export const toChars = (str: string): string[] => {
    return [...str];
};

/**
 * Converts a characters array into a string.
 *
 * @param   chars Characters array.
 *
 * @returns       String.
 */
export const fromChars = (chars: string[]): string => {
    return chars.join('');
};

/* ---
 * Parse utilities.
 */

/**
 * Parses a string into a value.
 *
 * @param   str String to parse.
 *
 * @returns     Parsed output value.
 */
export const parseValue = (str: string): unknown => {
    const ewa = str.endsWith('*');
    let v: unknown = ewa ? str.slice(0, -1) : str;

    if ('null' === v) {
        v = ewa ? v : null;
    } else if ('undefined' === v) {
        v = ewa ? v : undefined;
    } else if ('true' === v) {
        v = ewa ? v : true;
    } else if ('false' === v) {
        v = ewa ? v : false;
    } else if ('NaN' === v) {
        v = ewa ? v : NaN;
    } else if ('-Infinity' === v) {
        v = ewa ? v : -Infinity;
    } else if ('Infinity' === v) {
        v = ewa ? v : Infinity;
    } else if ($is.numeric(v as string, 'integer')) {
        v = ewa ? v : parseInt(v as string, 10);
    } else if ($is.numeric(v as string, 'float')) {
        v = ewa ? v : parseFloat(v as string);
    } else {
        v = str; // No change.
    }
    return v;
};

/* ---
 * Trim utilities.
 */

/**
 * Trims whitespace, and optionally, specific characters, from a string.
 *
 * @param   str             String to trim.
 * @param   additionalChars Additional characters to trim.
 *
 *   - Whitespace is always trimmed, regardless.
 *   - //
 * @param   options         Default is `{ left: true, right: true }`.
 *
 * @returns                 Trimmed string.
 */
export const trim = (str: string, additionalChars?: string, options?: TrimOptions): string => {
    const opts = $obj.defaults({}, options || {}, { left: true, right: true }) as Required<TrimOptions>;

    let regExp: RegExp; // Initialize.

    if (additionalChars) {
        const escAdditionalChars = escRegExp(additionalChars);

        if (opts.left && !opts.right) {
            regExp = new RegExp('^[\\s' + escAdditionalChars + ']+', 'gu');
            //
        } else if (opts.right && !opts.left) {
            regExp = new RegExp('[\\s' + escAdditionalChars + ']+$', 'gu');
            //
        } else {
            regExp = new RegExp('^[\\s' + escAdditionalChars + ']+|[\\s' + escAdditionalChars + ']+$', 'gu');
        }
    } else {
        if (opts.left && !opts.right) {
            regExp = /^\s+/gu;
            //
        } else if (opts.right && !opts.left) {
            regExp = /\s+$/gu;
            //
        } else {
            regExp = /^\s+|\s+$/gu;
        }
    }
    return str.replace(regExp, '');
};

/**
 * Left-trims whitespace, and optionally, specific characters, from a string.
 *
 * @param   str             String to left-trim.
 * @param   additionalChars Additional characters to left-trim.
 *
 *   - Whitespace is always left-trimmed, regardless.
 *   - //
 * @param   options         `{ left: true, right: false }` are enforced options.
 *
 * @returns                 Left-trimmed string.
 */
export const lTrim = (str: string, additionalChars?: string, options?: TrimOptions): string => {
    return trim(str, additionalChars, { ...(options || {}), left: true, right: false });
};

/**
 * Right-trims whitespace, and optionally, specific characters, from a string.
 *
 * @param   str             String to right-trim.
 * @param   additionalChars Additional characters to right-trim.
 *
 *   - Whitespace is always right-trimmed, regardless.
 *   - //
 * @param   options         `{ left: false, right: true }` are enforced options.
 *
 * @returns                 Right-trimmed string.
 */
export const rTrim = (str: string, additionalChars?: string, options?: TrimOptions): string => {
    return trim(str, additionalChars, { ...(options || {}), left: false, right: true });
};

/* ---
 * Numeronym utilities.
 */

/**
 * Converts a string into a numeronym.
 *
 * @param   str String to numeronym.
 *
 * @returns     Numeronym of input string.
 */
export const numeronym = (str: string): string => {
    str = trim(
        asciiOnly(str)
            .toLowerCase()
            .replace(/[^a-z0-9.]+/gu, '')
            .replace(/\.+/u, '.'),
        '.',
    );
    if (str.length < 3) str += 'x'.repeat(3 - str.length);
    return str[0] + String(str.length - 2) + str[str.length - 1];
};

/* ---
 * Sanitization utilities.
 */

/**
 * Normalizes string; removing diacritical marks.
 *
 * @param   str String to modify.
 *
 * @returns     Modified string.
 */
export const deburr = (str: string): string => {
    return str.normalize('NFKD').replace(/[\p{Diacritic}]/gu, '');
};

/**
 * Deburrs string and removes non-ASCII characters.
 *
 * @param   str String to modify.
 *
 * @returns     Modified string.
 */
export const asciiOnly = (str: string): string => {
    return deburr(str)
        .replaceAll('ꓺ', '..')
        .replace(/[^\p{ASCII}]/gu, '');
};

/**
 * Replaces characters not allowed in object path parts, with unicode symbols.
 *
 * @param   str String to modify.
 *
 * @returns     Modified string.
 *
 * @see $obp.splitPath()
 */
export const obpPartSafe = (str: string): string => {
    return str
        .replace(/\[/gu, '\u{298D}') // `⦍`.
        .replace(/\]/gu, '\u{298E}') // `⦎`.
        .replace(/\./gu, '\u{1C79}') // `ᱹ`.
        .replace(/ꓺ/gu, '\u{1C79}\u{1C79}'); // `ᱹᱹ`.
};

/* ---
 * Word utilities.
 */

/**
 * Splits words intelligently, including `-`, `_`, camelCase, PascalCase, and other considerations.
 *
 * @param   str String to consider.
 *
 * @returns     Array of all words.
 */
export const splitWords = (str: string, options?: SplitWordOptions): string[] => {
    const opts = $obj.defaults({}, options || {}, { whitespaceOnly: false }) as Required<SplitWordOptions>;

    if (opts.whitespaceOnly) {
        return str.split(/\s+/u); // Whitespace only.
    }
    return str
        .split(wordSplittingRegExp)
        .map((v: string): string => v.trim())
        .filter((v: string): boolean => {
            return '' === v || /^[^\p{L}\p{N}]+$/u.test(v) ? false : true;
        });
};

/* ---
 * Clip utilities.
 */

/**
 * Clips a string to a specified length.
 *
 * @param   str String to potentially clip.
 *
 * @returns     Possibly clipped string.
 */
export const clip = (str: string, options?: ClipOptions): string => {
    const opts = $obj.defaults({}, options || {}, { maxBytes: Infinity, maxChars: Infinity, indicator: '[…]' }) as Required<ClipOptions>;

    if ($is.safeArrayKey(opts.maxBytes) && opts.maxBytes > 0 && byteLength(str) > opts.maxBytes) {
        str = fromBytes(toBytes(str).slice(0, Math.max(0, opts.maxBytes - byteLength(opts.indicator)))) + opts.indicator;
        //
    } else if ($is.safeArrayKey(opts.maxChars) && opts.maxChars > 0 && charLength(str) > opts.maxChars) {
        str = fromChars(toChars(str).slice(0, Math.max(0, opts.maxChars - charLength(opts.indicator)))) + opts.indicator;
    }
    return str;
};

/* ---
 * CaSe utilities.
 */

/**
 * Converts the first character of a string to lower case.
 *
 * @param   str String to modify.
 *
 * @returns     Modified string.
 */
export const lowerFirst = (str: string): string => {
    const arr = [...str]; // Splits characters.

    if (arr[0] /* Lowercase first character. */) {
        arr[0] = arr[0].toLowerCase();
    }
    return arr.join('');
};

/**
 * Converts the first character of a string to upper case.
 *
 * @param   str String to modify.
 *
 * @returns     Modified string.
 */
export const upperFirst = (str: string): string => {
    const arr = [...str]; // Splits characters.

    if (arr[0] /* Uppercase first character. */) {
        arr[0] = arr[0].toUpperCase();
    }
    return arr.join('');
};

/**
 * Converts the first character of a string to upper case and the remaining to lower case.
 *
 * @param   str String to modify.
 *
 * @returns     Modified string.
 */
export const capitalize = (str: string): string => {
    const arr = [...str.toLowerCase()]; // Splits characters.

    if (arr[0] /* Uppercase first character. */) {
        arr[0] = arr[0].toUpperCase();
    }
    return arr.join('');
};

/**
 * Splits a string into words, then re-joins using Title Case.
 *
 * @param   str     String to modify.
 * @param   options Options (all optional).
 *
 * @returns         Modified string.
 *
 * @someday https://o5p.me/7mS5cw ... Can this be smarter?
 *          For some added inspiration, see: <https://o5p.me/DChQQ2>.
 */
export const titleCase = (str: string, options?: TitleCaseOptions): string => {
    const opts = $obj.defaults({}, options || {}, { asciiOnly: false, splitOnWhitespaceOnly: false }) as Required<TitleCaseOptions>;
    let words = splitWords(str, { whitespaceOnly: opts.splitOnWhitespaceOnly }); // Splits words intelligently.

    if (opts.asciiOnly /* Split again. */) {
        words = splitWords(asciiOnly(words.join(' ')), { whitespaceOnly: opts.splitOnWhitespaceOnly });
    }
    for (let key = 0; key < words.length; key++) {
        words[key] = words[key]
            .split(/([\p{Pd}]+)/u)
            .map((word) => capitalize(word))
            .join('');
    }
    return words.join(' ');
};

/**
 * Splits a string into words, then re-joins using lower case.
 *
 * @param   str     String to modify.
 * @param   options Options (all optional).
 *
 * @returns         Modified string.
 */
export const lowerCase = (str: string, options?: LowerCaseOptions): string => {
    const opts = $obj.defaults({}, options || {}, { asciiOnly: false, splitOnWhitespaceOnly: false }) as Required<LowerCaseOptions>;
    let words = splitWords(str, { whitespaceOnly: opts.splitOnWhitespaceOnly }); // Splits words intelligently.

    if (opts.asciiOnly /* Split again. */) {
        words = splitWords(asciiOnly(words.join(' ')), { whitespaceOnly: opts.splitOnWhitespaceOnly });
    }
    return words.join(' ').toLowerCase();
};

/**
 * Splits a string into words, then re-joins using upper case.
 *
 * @param   str     String to modify.
 * @param   options Options (all optional).
 *
 * @returns         Modified string.
 */
export const upperCase = (str: string, options?: UpperCaseOptions): string => {
    return lowerCase(str, { ...(options || {}) } as LowerCaseOptions).toUpperCase();
};

/**
 * Splits a string into words, then re-joins using StudyCase.
 *
 * @param   str     String to modify.
 * @param   options Options (all optional).
 *
 * @returns         Modified string.
 */
export const studlyCase = (str: string, options?: StudlyCaseOptions): string => {
    const opts = $obj.defaults({}, options || {}, { asciiOnly: false, letterFirst: '' }) as Required<StudlyCaseOptions>;
    let words = splitWords(str); // Splits words intelligently.

    if (opts.asciiOnly /* Split again. */) {
        words = splitWords(asciiOnly(words.join(' ')));
    }
    for (let key = 0; key < words.length; key++) {
        words[key] = capitalize(words[key]);

        if (0 === key) {
            if (opts.letterFirst && !/^\p{L}/u.test(words[key])) {
                words[key] = opts.letterFirst + words[key];
            }
        }
    }
    return words.join('');
};

/**
 * Splits a string into words, then re-joins using camelCase.
 *
 * @param   str     String to modify.
 * @param   options Options (all optional).
 *
 * @returns         Modified string.
 */
export const camelCase = (str: string, options?: CamelCaseOptions): string => {
    const opts = $obj.defaults({}, options || {}, { asciiOnly: false, letterFirst: '' }) as Required<CamelCaseOptions>;
    let words = splitWords(str); // Splits words intelligently.

    if (opts.asciiOnly /* Split again. */) {
        words = splitWords(asciiOnly(words.join(' ')));
    }
    for (let key = 0; key < words.length; key++) {
        if (0 === key) {
            words[key] = words[key].toLowerCase();
            if (opts.letterFirst && !/^\p{L}/u.test(words[key])) {
                words[key] = opts.letterFirst + words[key];
            }
        } else {
            if (/\p{Lm}$/u.test(words[key - 1])) {
                words[key] = words[key].toLowerCase();
            } else {
                words[key] = capitalize(words[key]);
            }
        }
    }
    return words.join('');
};

/**
 * Splits a string into words, then re-joins using kebab-case.
 *
 * @param   str     String to modify.
 * @param   options Options (all optional).
 *
 * @returns         Modified string.
 */
export const kebabCase = (str: string, options?: KebabCaseOptions): string => {
    const opts = $obj.defaults({}, options || {}, { asciiOnly: false, letterFirst: '' }) as Required<KebabCaseOptions>;
    let words = splitWords(str); // Splits words intelligently.

    if (opts.asciiOnly /* Split again. */) {
        words = splitWords(asciiOnly(words.join(' ')));
    }
    for (let key = 0; key < words.length; key++) {
        words[key] = words[key].toLowerCase();

        if (0 === key) {
            if (opts.letterFirst && !/^\p{L}/u.test(words[key])) {
                words[key] = opts.letterFirst + words[key];
            }
        } else {
            if (/\p{Lm}$/u.test(words[key - 1])) {
                words[key] = words[key - 1] + words[key];
                words[key - 1] = ''; // Filtered below.
            }
        }
    }
    return words.filter((w) => '' !== w).join('-');
};

/**
 * Splits a string into words, then re-joins using snake_case.
 *
 * @param   str     String to modify.
 * @param   options Options (all optional).
 *
 * @returns         Modified string.
 */
export const snakeCase = (str: string, options?: SnakeCaseOptions): string => {
    return kebabCase(str, { ...(options || {}) } as KebabCaseOptions).replaceAll('-', '_');
};

/* ---
 * Indent utilities.
 */

/**
 * Dedents a multiline string; e.g., from template literals.
 *
 * @param   str String to modify.
 *
 * @returns     Modified, dedented string.
 *
 * @note Inspired by `tiny-dedent` package <https://o5p.me/vaonuB>.
 */
export const dedent = (str: string): string => {
    str = str.replace(/^[ \t]*\r?\n/u, ''); // Trims leading newline.

    const indent = /^[ \t]+/mu.exec(str); // Detects and trims indentations.
    if (indent) str = str.replace(new RegExp('^' + indent[0], 'gmu'), '');

    return str.replace(/\r?\n[ \t]*$/u, ''); // Trims trailing newline.
};

/* ---
 * Quote utilities.
 */

/**
 * Quotes a string literal.
 *
 * @param   str     String to quote.
 * @param   options Options (all optional).
 *
 * @returns         Quoted string literal.
 */
export const quote = (str: string, options: QuoteOptions = {}): string => {
    const opts = $obj.defaults({}, options, { type: 'single' }) as Required<QuoteOptions>;

    switch (opts.type) {
        case 'double': {
            return '"' + str.replace(/"/gu, '\\$&') + '"';
        }
        case 'single':
        default: {
            return "'" + str.replace(/'/gu, '\\$&') + "'";
        }
    }
};

/**
 * Unquotes a string literal.
 *
 * @param   str     String to unquote.
 * @param   options Options (all optional).
 *
 * @returns         Unquoted string literal.
 */
export const unquote = (str: string, options: UnquoteOptions = {}): string => {
    const opts = $obj.defaults({}, options, { type: 'auto' }) as Required<UnquoteOptions>;

    switch (opts.type) {
        case 'double': {
            if (str.startsWith('"') && str.endsWith('"')) {
                str = str.slice(1, -1).replace(/\\"/gu, '"');
            }
            return str;
        }
        case 'single': {
            if (str.startsWith("'") && str.endsWith("'")) {
                str = str.slice(1, -1).replace(/\\'/gu, "'");
            }
            return str;
        }
        case 'auto':
        default: {
            if (str.startsWith('"') && str.endsWith('"')) {
                str = str.slice(1, -1).replace(/\\"/gu, '"');
                //
            } else if (str.startsWith("'") && str.endsWith("'")) {
                str = str.slice(1, -1).replace(/\\'/gu, "'");
            }
            return str;
        }
    }
};

/* ---
 * Escape utilities.
 */

/**
 * Escapes a string for use in HTML markup.
 *
 * @param   str     String to escape.
 * @param   options Options (all optional).
 *
 * @returns         Escaped string.
 *
 * @see https://www.npmjs.com/package/html-entities
 */
export const escHTML = (str: string, options?: EscHTMLOptions): string => {
    const defaultOpts = { doubleEncode: false };
    const opts = $obj.defaults({}, options || {}, defaultOpts) as Required<EscHTMLOptions>;

    if (!opts.doubleEncode) str = unescHTML(str);
    return str.replace(/[&<>"']/gu, (char) => escHTMLEntityMap[char]);
};

/**
 * Unescapes HTML markup, back to a plain string.
 *
 * @param   str String to unescape.
 *
 * @returns     Unescaped string.
 *
 * @see https://www.npmjs.com/package/html-entities
 */
export const unescHTML = (str: string): string => {
    if ($env.isWeb()) {
        unescHTMLDiv ??= $dom.create('div');
        unescHTMLDiv.innerHTML = str;
        return unescHTMLDiv.innerText;
    }
    return str.replace(/&(?:amp|lt|gt|quot|#39);/gu, (entity) => unescHTMLCharMap[entity]);
};

/**
 * Escapes a string for use in a regular expression.
 *
 * @param   str String to escape.
 *
 * @returns     Escaped string.
 */
export const escRegExp = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
};

/**
 * Escapes a string for use in `document.querySelector()`.
 *
 * @param   str String to escape.
 *
 * @returns     Escaped string.
 */
export const escSelector = (str: string): string => {
    return str.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/gu, '\\$&');
};

/* ---
 * IP utilities.
 */

/**
 * Tests if a string is an IP address.
 *
 * @param   str String to consider.
 *
 * @returns     True if string is an IP address.
 */
export const isIP = (str: string): boolean => {
    if (str.length > ipV6MaxLength) {
        return false; // Saves time; too long.
    }
    return ipRegex({ exact: true }).test(str);
};

/**
 * Tests if a string is an IP host address.
 *
 * @param   str String to consider.
 *
 * @returns     True if string is an IP host address.
 */
export const isIPHost = (str: string): boolean => {
    return isIPv4Host(str) || isIPv6Host(str);
};

/**
 * Tests if a string is an IPv4 address.
 *
 * @param   str String to consider.
 *
 * @returns     True if string is an IPv4 address.
 */
export const isIPv4 = (str: string): boolean => {
    if (str.length > ipV4MaxLength) {
        return false; // Saves time; too long.
    }
    return ipRegex.v4({ exact: true }).test(str);
};

/**
 * Tests if a string is an IPv4 host address.
 *
 * @param   str String to consider.
 *
 * @returns     True if string is an IPv4 host address.
 */
export const isIPv4Host = (str: string): boolean => {
    if (str.length > ipV4MaxLength + 6) {
        // 6 = `:65535` (max TCP port number).
        return false; // Saves time; too long.
    }
    return isIPv4(str.replace(/:[0-9]+$/u, ''));
};

/**
 * Tests if a string is an IPv6 address.
 *
 * @param   str String to consider.
 *
 * @returns     True if string is an IPv6 address.
 */
export const isIPv6 = (str: string): boolean => {
    if (str.length > ipV6MaxLength) {
        return false; // Saves time; too long.
    }
    return ipRegex.v6({ exact: true }).test(str);
};

/**
 * Tests if a string is a bracketed IPv6 host address.
 *
 * @param   str String to consider.
 *
 * @returns     True if string is a bracketed IPv6 address.
 */
export const isIPv6Host = (str: string): boolean => {
    if (str.length > ipV6MaxLength + 1 + 1 + 6) {
        // 1 = `[`, 1 = `]`, 6 = `:65535` (max TCP port number).
        return false; // Saves time; too long.
    }
    if (!str.startsWith('[') || !/\](?::[0-9]+)?$/u.test(str)) {
        return false; // Saves time; not a host address.
    }
    return isIPv6(str.replace(/^\[|\](?::[0-9]+)?$/gu, ''));
};

/* ---
 * Matching utilities.
 */

/**
 * String matches the given regular expression test(s)?
 *
 * @param   str    String to consider.
 * @param   regExp Regular expression(s) to look for.
 *
 * @returns        True if string matches any regular expression test(s).
 */
export const test = (str: string, regExp: RegExp | RegExp[]): boolean => {
    return $to.array(regExp).some((regExp) => regExp.test(str));
};
