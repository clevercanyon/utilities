/**
 * Utility class.
 */

import minimatch from 'minimatch';

/**
 * String utilities.
 */
export default class $Str {
	/**
	 * Cache.
	 */
	protected static cache: { [x: string]: unknown } = {};

	/**
	 * Text encoder.
	 */
	protected static encoder: TextEncoder = new TextEncoder();

	/**
	 * Gets size in bytes.
	 *
	 * @param str String.
	 *
	 * @returns Size in bytes.
	 */
	public static bytes(str: string): number {
		return $Str.encoder.encode(str).length;
	}

	/**
	 * Escapes regexp dynamics.
	 *
	 * @param str String to escape.
	 *
	 * @returns Escaped string.
	 */
	public static escRegexp(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\-]/gu, '\\$&');
	}

	/**
	 * Escapes an element selector.
	 *
	 * @param str String to escape.
	 *
	 * @returns Escaped string.
	 */
	public static escSelector(str: string): string {
		return str.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/gu, '\\\\$&');
	}

	/**
	 * Escapes a string for use in HTML.
	 *
	 * @param str String to escape.
	 *
	 * @returns Escaped string.
	 */
	public static escHtml(str: string): string {
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
	 * @param str     String to test.
	 * @param pattern Pattern to look for.
	 *
	 * @returns True if matches given pattern.
	 */
	public static matches(str: string, pattern: string): boolean {
		return minimatch(str, pattern);
	}
}
