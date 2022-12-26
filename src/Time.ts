/**
 * Utility class.
 */

import phpꓺdate from 'locutus/php/datetime/date';
import phpꓺgmDate from 'locutus/php/datetime/gmdate';
import phpꓺstrToTime from 'locutus/php/datetime/strtotime';

/**
 * Gets current time (UTC timezone).
 *
 * @param   format Optional format. Default is `U` (timestamp).
 * @param   str    Optional string to convert to time. Default is `now`.
 *
 * @returns        Current time (UTC timezone).
 */
export function utc(format: string = 'U', str: string = 'now'): string {
	return phpꓺgmDate(format, phpꓺstrToTime(str)) as string;
}

/**
 * Gets current time (local timezone).
 *
 * @param   format Optional format. Default is `U` (timestamp).
 * @param   str    Optional string to convert to time. Default is `now`.
 *
 * @returns        Current time (local timezone).
 */
export function local(format: string = 'U', str: string = 'now'): string {
	return phpꓺdate(format, phpꓺstrToTime(str)) as string;
}
