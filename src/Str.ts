/**
 * Utility class.
 */

import { isMatch as $mmꓺisMatch } from './mm.js';
import type { Options as $mmꓺOptions } from './mm.js';

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
 * Escapes regexp dynamics.
 *
 * @param   str String to escape.
 *
 * @returns     Escaped string.
 */
export function escRegExp(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
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
 * Escapes a string for use in HTML.
 *
 * @param   str String to escape.
 *
 * @returns     Escaped string.
 */
export function escHtml(str: string): string {
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
