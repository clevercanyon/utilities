/**
 * String utilities.
 */

import { isMatch as $mmꓺisMatch } from './mm.js';
import type { Options as $mmꓺOptions } from './mm.js';

/**
 * Extracts lodash utilities.
 */
export { default as camelCase } from 'lodash/camelCase.js';
export { default as capitalize } from 'lodash/capitalize.js';
export { default as deburr } from 'lodash/deburr.js';
export { default as endsWith } from 'lodash/endsWith.js';
export { default as escHtml } from 'lodash/escape.js';
export { default as escRegExp } from 'lodash/escapeRegExp.js';
export { default as kebabCase } from 'lodash/kebabCase.js';
export { default as lowerCase } from 'lodash/lowerCase.js';
export { default as lowerFirst } from 'lodash/lowerFirst.js';
export { default as pad } from 'lodash/pad.js';
export { default as padEnd } from 'lodash/padEnd.js';
export { default as padStart } from 'lodash/padStart.js';
export { default as parseInt } from 'lodash/parseInt.js';
export { default as repeat } from 'lodash/repeat.js';
export { default as replace } from 'lodash/replace.js';
export { default as snakeCase } from 'lodash/snakeCase.js';
export { default as split } from 'lodash/split.js';
export { default as startCase } from 'lodash/startCase.js';
export { default as startsWith } from 'lodash/startsWith.js';
export { default as template } from 'lodash/template.js';
export { default as toLower } from 'lodash/toLower.js';
export { default as toUpper } from 'lodash/toUpper.js';
export { default as trim } from 'lodash/trim.js';
export { default as trimEnd } from 'lodash/trimEnd.js';
export { default as trimStart } from 'lodash/trimStart.js';
export { default as truncate } from 'lodash/truncate.js';
export { default as unEscHtml } from 'lodash/unescape.js';
export { default as upperCase } from 'lodash/upperCase.js';
export { default as upperFirst } from 'lodash/upperFirst.js';
export { default as words } from 'lodash/words.js';

/**
 * Text encoder.
 */
const encoder: TextEncoder = new TextEncoder();

/**
 * Gets size in bytes.
 *
 * @param   str String.
 *
 * @returns     Size in bytes.
 */
export function bytes(str: string): number {
	return encoder.encode(str).length;
}

/**
 * Escapes an element selector.
 *
 * @param   str String to escape.
 *
 * @returns     Escaped string.
 */
export function escSelector(str: string): string {
	return str.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/gu, '\\\\$&');
}

/**
 * Parses a string into a value.
 *
 * @param   str String to parse.
 *
 * @returns     Parsed output value.
 */
export function parseValue(str: string): unknown {
	const ewa = str.endsWith('*');
	let v: unknown = ewa ? str.slice(0, -1) : str;

	if ('undefined' === v) {
		v = ewa ? v : undefined;
	} else if ('null' === v) {
		v = ewa ? v : null;
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
	} else if (/^(?:0|-?[1-9][0-9]*)$/u.test(v as string)) {
		v = ewa ? v : parseInt(v as string, 10);
	} else if (/^(?:0|-?[1-9][0-9]*)?\.[0-9]+$/u.test(v as string)) {
		v = ewa ? v : parseFloat(v as string);
	} else {
		v = str; // No change.
	}
	return v;
}

/**
 * String matches the given pattern?
 *
 * @param   str     String to test.
 * @param   pattern Pattern to look for.
 * @param   options Optional micromatch options.
 *
 * @returns         True if matches given pattern.
 */
export function matches(str: string, pattern: string, options: $mmꓺOptions = {}): boolean {
	return $mmꓺisMatch(str, pattern, { dot: true, ...options });
}
