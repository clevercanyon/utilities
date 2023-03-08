/**
 * String utilities.
 */

import { default as mm } from 'micromatch';
import type { Options as MMOptions } from 'micromatch';

import { isWeb as $envꓺisWeb } from './env.js';
import { numeric as $isꓺnumeric } from './is.js';
import { assignDefaults as $objꓺassignDefaults } from './obj.js';

let unescHTMLDiv: HTMLElement; // Initialize.
const textEncoder: TextEncoder = new TextEncoder();
const wordSplittingRegExp = /([^\p{L}\p{N}]+|(?<=\p{L})(?=\p{N})|(?<=\p{N})(?=\p{L})|(?<=[\p{Ll}\p{N}])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}\p{Ll})|(?<=[\p{L}\p{N}])(?=\p{Lu}\p{Ll}))/gu;

/**
 * Defines types.
 */
export type SplitWordOptions = { whitespaceOnly?: boolean };

export type TitleCaseOptions = { asciiOnly?: boolean; splitOnWhitespaceOnly?: boolean };
export type LowerCaseOptions = { asciiOnly?: boolean; splitOnWhitespaceOnly?: boolean };
export type UpperCaseOptions = LowerCaseOptions; // Same options as lowerCase.

export type CamelCaseOptions = { asciiOnly?: boolean; letterFirst?: string };
export type KebabCaseOptions = { asciiOnly?: boolean; letterFirst?: string };
export type SnakeCaseOptions = KebabCaseOptions; // Same options as kebabCase.

export type QuoteOptions = { type?: string };
export type UnquoteOptions = { type?: string };

/**
 * Exports micromatch utilities.
 */
export { mm as mm }; // Micromatch.
export type { MMOptions as MMOptions };

/**
 * Gets length in bytes.
 *
 * @param   str String to consider.
 *
 * @returns     Length in bytes.
 */
export const byteLength = (str: string): number => {
	return textEncoder.encode(str).length;
};

/**
 * Gets length in characters.
 *
 * @param   str String to consider.
 *
 * @returns     Length in characters.
 */
export const charLength = (str: string): number => {
	return [...str].length;
};

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
	return deburr(str).replace(/[^\p{ASCII}]/gu, '');
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

/**
 * Splits words intelligently, including `-`, `_`, camelCase, PascalCase, and other considerations.
 *
 * @param   str String to consider.
 *
 * @returns     Array of all words.
 */
export const splitWords = (str: string, options?: SplitWordOptions): string[] => {
	const opts = $objꓺassignDefaults({}, options || {}, { whitespaceOnly: false }) as Required<SplitWordOptions>;

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
 * @review https://o5p.me/7mS5cw ... Can this be smarter?
 * @review For some added inspiration, see: <https://o5p.me/DChQQ2>.
 */
export const titleCase = (str: string, options?: TitleCaseOptions): string => {
	const opts = $objꓺassignDefaults({}, options || {}, { asciiOnly: false, splitOnWhitespaceOnly: false }) as Required<TitleCaseOptions>;
	let words = splitWords(str, { whitespaceOnly: opts.splitOnWhitespaceOnly }); // Splits words intelligently.

	if (opts.asciiOnly /* Split again. */) {
		words = splitWords(asciiOnly(words.join(' ')), { whitespaceOnly: opts.splitOnWhitespaceOnly });
	}
	for (let key = 0; key < words.length; key++) {
		words[key] = words[key].split(/([\p{Pd}]+)/u).map((word) => capitalize(word)).join(''); // prettier-ignore
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
	const opts = $objꓺassignDefaults({}, options || {}, { asciiOnly: false, splitOnWhitespaceOnly: false }) as Required<LowerCaseOptions>;
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
 * Splits a string into words, then re-joins using camelCase.
 *
 * @param   str     String to modify.
 * @param   options Options (all optional).
 *
 * @returns         Modified string.
 */
export const camelCase = (str: string, options?: CamelCaseOptions): string => {
	const opts = $objꓺassignDefaults({}, options || {}, { asciiOnly: false, letterFirst: '' }) as Required<CamelCaseOptions>;
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
	const opts = $objꓺassignDefaults({}, options || {}, { asciiOnly: false, letterFirst: '' }) as Required<KebabCaseOptions>;
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
				words.splice(key - 1, 1);
			}
		}
	}
	return words.join('-');
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
	} else if ($isꓺnumeric(v as string, 'integer')) {
		v = ewa ? v : parseInt(v as string, 10);
	} else if ($isꓺnumeric(v as string, 'float')) {
		v = ewa ? v : parseFloat(v as string);
	} else {
		v = str; // No change.
	}
	return v;
};

/**
 * String matches the given pattern?
 *
 * @param   str     String to consider.
 * @param   pattern Pattern(s) to look for.
 * @param   options Micromatch options (all optional).
 *
 *   - Default options are: `{ dot: true }`.
 *   - For caSe-insensitive matching, pass `{ nocase: true }`.
 *   - For other available options, please {@see MMOptions}.
 *   - Also, consider using {@see mm} instead of this function.
 *
 * @returns         True if `str` matches any `pattern`.
 */
export const matches = (str: string, pattern: string | string[], options?: MMOptions): boolean => {
	return mm.isMatch(str, pattern, $objꓺassignDefaults({}, options || {}, { dot: true }));
};

/**
 * Quotes a string literal.
 *
 * @param   str     String to quote.
 * @param   options Options (all optional).
 *
 * @returns         Quoted string literal.
 */
export const quote = (str: string, options: QuoteOptions = {}): string => {
	const opts = $objꓺassignDefaults({}, options, { type: 'single' }) as Required<QuoteOptions>;

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
	const opts = $objꓺassignDefaults({}, options, { type: 'auto' }) as Required<UnquoteOptions>;

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

/**
 * Escapes a string for use in HTML markup.
 *
 * @param   str String to escape.
 *
 * @returns     Escaped string.
 *
 * @see https://www.npmjs.com/package/html-entities
 */
export const escHTML = (str: string): string => {
	const entityMap: { [x: string]: string } = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
	};
	return str.replace(/[&<>"']/gu, (char) => {
		return entityMap[char];
	});
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
	if ($envꓺisWeb()) {
		unescHTMLDiv ??= document.createElement('div');
		unescHTMLDiv.innerHTML = str;
		return unescHTMLDiv.innerText;
	}
	const charMap: { [x: string]: string } = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#39;': "'",
	};
	return str.replace(/&(?:amp|lt|gt|quot|#39);/gu, (entity) => {
		return charMap[entity];
	});
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
