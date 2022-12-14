/**
 * Utility class.
 */

import phpDate from 'locutus/php/datetime/date';
import phpGMDate from 'locutus/php/datetime/gmdate';
import phpStrToTime from 'locutus/php/datetime/strtotime';

/**
 * Time utilities.
 */
export default class $Time {
	/**
	 * Gets current time (UTC timezone).
	 *
	 * @param   format Optional format. Default is `U` (timestamp).
	 * @param   str    Optional string to convert to time. Default is `now`.
	 *
	 * @returns        Current time (UTC timezone).
	 */
	public static utc(format: string = 'U', str: string = 'now'): string {
		return phpGMDate(format, phpStrToTime(str)) as string;
	}

	/**
	 * Gets current time (local timezone).
	 *
	 * @param   format Optional format. Default is `U` (timestamp).
	 * @param   str    Optional string to convert to time. Default is `now`.
	 *
	 * @returns        Current time (local timezone).
	 */
	public static local(format: string = 'U', str: string = 'now'): string {
		return phpDate(format, phpStrToTime(str)) as string;
	}
}
