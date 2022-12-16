/**
 * Utility class.
 */

import minimatch from 'minimatch';

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
	return str.replace(/[.*+?^${}()|[\]\\-]/gu, '\\$&');
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
 * String matches the given pattern?
 *
 * @param   str     String to test.
 * @param   pattern Pattern to look for.
 * @param   options Optional minimatch options.
 *
 * @returns         True if matches given pattern.
 */
export function matches(str: string, pattern: string, options: minimatch.IOptions = {}): boolean {
	return minimatch(str, pattern, { dot: true, ...options });
}
