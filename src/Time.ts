/**
 * Time utilities.
 */

import type * as $type from './type.js';
import { symbols as $toꓺsymbols } from './to.js';
import { hasOwn as $objꓺhasOwn } from './obj.js';
import { time as $isꓺtime, date as $isꓺdate, string as $isꓺstring, numeric as $isꓺnumeric } from './is.js';

import d3s from 'dayjs';
import d3sUTC from 'dayjs/plugin/utc.js';
import d3sTimezone from 'dayjs/plugin/timezone.js';
import d3sAdvancedFormat from 'dayjs/plugin/advancedFormat.js';
import d3sCustomParseFormat from 'dayjs/plugin/customParseFormat.js';
import d3sRelativeTime from 'dayjs/plugin/relativeTime.js';
import d3sToObject from 'dayjs/plugin/toObject.js';

const appPkgName = $$__APP_PKG_NAME__$$;

d3s.extend(d3sUTC);
d3s.extend(d3sTimezone);
d3s.extend(d3sAdvancedFormat);
d3s.extend(d3sCustomParseFormat);
d3s.extend(d3sRelativeTime);
d3s.extend(d3sToObject);

d3s.extend((unusedꓺopts: unknown, D3s: typeof $type.Time | $type.Object): void => {
	Object.defineProperty(D3s.prototype, $toꓺsymbols.appPkgName, {
		get: function (this: $type.Time): ReturnType<$type.ToAppPkgNameFn> {
			return appPkgName; // {@see $a6t.Base.constructor()}.
		},
	});
	Object.defineProperty(D3s.prototype, $toꓺsymbols.tag, {
		get: function (this: $type.Time): ReturnType<$type.ToTagFn> {
			return appPkgName + '/Time'; // {@see $obj.tag()}.
		},
	});
	Object.defineProperty(D3s.prototype, $toꓺsymbols.plain, {
		value: function (this: $type.Time): ReturnType<$type.ToPlainSymbolFn> {
			return this.toObject(); // See: <https://o5p.me/eBrkwP>.
		},
	});
	Object.defineProperty(D3s.prototype, $toꓺsymbols.clone, {
		value: function (this: $type.Time): ReturnType<$type.ToCloneSymbolFn> {
			return this.clone(); // See: <https://o5p.me/uCRV4x>.
		},
	});
});

/**
 * Defines types.
 */
export type From = number | string | Date | $type.Time;

/**
 * Predefined UTC patterns.
 */
export const utcPatterns: { [x: string]: RegExp } = {
	iso8601: /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/iu, // JSON ISO-8601; e.g., `2023-02-21T13:16:32.000Z`.
	rfc7231: /^[a-z]{3}, [0-9]{2} [a-z]{3} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} GMT$/iu, // HTTP RFC-7231; e.g., `Tue, 21 Feb 2023 13:16:32 GMT`.
	sqlDateTime: /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/u, // SQL; e.g., `2023-02-21 13:16:32`.
	sqlDate: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/u, // SQL; e.g., `2023-02-21`.
};

/**
 * Predefined UTC formats.
 */
export const utcFormats: { [x: string]: string } = {
	iso8601: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]', // JSON ISO-8601; e.g., `2023-02-21T13:16:32.000Z`.
	rfc7231: 'ddd, DD MMM YYYY HH:mm:ss [GMT]', // HTTP RFC-7231; e.g., `Tue, 21 Feb 2023 13:16:32 GMT`.
	sqlDateTime: 'YYYY-MM-DD HH:mm:ss', // SQL; e.g., `2023-02-21 13:16:32`.
	sqlDate: 'YYYY-MM-DD', // SQL; e.g., `2023-02-21`.
};

/**
 * Predefined TZ formats.
 */
export const tzFormats: { [x: string]: string } = {
	date: 'M/D/YYYY', // Date; e.g., `2/21/2023`.
	time: 'h:mm A z', // Time; e.g., `1:16 PM UTC`.
	dateTime: 'M/D/YYYY h:mm A z', // Date & Time; e.g., `2/21/2023 1:16 PM UTC`.
	verbose: 'ddd, MMM Do, YYYY h:mm A z', // Verbose; e.g., `Tue, Feb 21st, 2023 1:16 PM UTC`.
};

/**
 * Gets a formatted time in UTC timezone.
 *
 * @param   fromTime {@see from()} for all parseable input formats.
 * @param   format   Output format. Default is `X` (timestamp in seconds).
 *
 *   - A predefined TZ format key can be given; {@see tzFormats}.
 *   - A predefined UTC format key can be given; {@see utcFormats}.
 *   - Or, you can use any of [these format chars](https://o5p.me/d1oWaE).
 *
 * @returns          Formatted time in UTC timezone.
 *
 * @note See <https://o5p.me/d1oWaE> for supported format specifiers.
 */
export const utc = (fromTime: From = 'now', format: string = 'X'): string => {
	const utcTime = from(fromTime, 'utc');

	return String(
		$objꓺhasOwn(utcFormats, format) ? utcTime.format(utcFormats[format])
		: $objꓺhasOwn(tzFormats, format) ? utcTime.format(tzFormats[format])
		: utcTime.format(format)
	); // prettier-ignore
};

/**
 * Gets a formatted time in local timezone.
 *
 * @param   fromTime {@see from()} for all parseable input formats.
 * @param   format   Output format. Default is `X` (timestamp in seconds).
 *
 *   - A predefined TZ format key can be given; {@see tzFormats}.
 *   - Or, you can use any of [these format chars](https://o5p.me/d1oWaE).
 *
 * @returns          Formatted time in local timezone.
 *
 * @note See <https://o5p.me/d1oWaE> for supported format specifiers.
 * @note The use of `X`, `x` will always return a UTC timestamp, even in local mode.
 */
export const local = (fromTime: From = 'now', format: string = 'X'): string => {
	const localTime = from(fromTime, 'local');

	return String(
		$objꓺhasOwn(tzFormats, format)
			? localTime.format(tzFormats[format])
			: localTime.format(format)
	); // prettier-ignore
};

/**
 * Gets a new time instance in requested timezone.
 *
 * @param   from                 Time. Default is `now` (current time).
 *
 *   - Pass an integer (number or string) in seconds or milliseconds, which is interpreted as a UTC timestamp.
 *   - Pass an ISO-8601 string that uses the `Z` (UTC) timezone specifier, or another ISO-8601 variant in any timezone.
 *   - Pass an RFC-7231 string that uses `GMT` timezone specifier. Note that RFC-7231 times are always in GMT by convention.
 *   - Pass an SQL date or datetime, which is interpreted as a UTC date/time. All SQL strings must be given in UTC time.
 *   - Pass a {@see Date} or {@see $type.Time} instance, from which the timezone will be inferred automatically.
 *
 * @param   toTZ                 Timezone to convert to. Default is `utc`.
 *
 *   - Can be `utc`, `local`, or a TZ database code; e.g., `America/New_York`.
 *   - See: https://o5p.me/mVQqsS for the full list of all TZ database codes.
 *
 * @returns {@see $type.Time}      Time instance in requested timezone.
 *
 * @note See <https://o5p.me/zKJbtG> for API docs.
 * @note See <https://o5p.me/d1oWaE> for supported format specifiers.
 * @note See <https://o5p.me/mVQqsS> for the full list of all TZ database codes.
 */
export const from = (from: From = 'now', toTZ: string = 'utc'): $type.Time => {
	let time: $type.Time | undefined; // Initialize.

	if ('now' === from) {
		time = d3s(); // Default.
		//
	} else if ($isꓺnumeric(from, 'integer')) {
		from = Number(from); // Cast as number.

		if (from.toString().length <= 10) {
			time = d3s.unix(from); // Unix timestamp.
		} else {
			time = d3s(from); // Timestamp in milliseconds.
		}
	} else if ($isꓺstring(from)) {
		if (utcPatterns.iso8601.test(from)) {
			time = d3s.utc(from, utcFormats.iso8601, true);
			//
		} else if (utcPatterns.rfc7231.test(from)) {
			time = d3s.utc(from, utcFormats.rfc7231, true);
			//
		} else if (utcPatterns.sqlDateTime.test(from)) {
			time = d3s.utc(from, utcFormats.sqlDateTime, true);
			//
		} else if (utcPatterns.sqlDate.test(from)) {
			time = d3s.utc(from, utcFormats.sqlDate, true);
			//
		} /* Uses a more flexible ISO parser. */ else {
			time = d3s(from); // <https://o5p.me/OFajhP>.
		}
	} else if ($isꓺdate(from) || $isꓺtime(from)) {
		time = d3s(from); // Date or time instance.
	}
	if (!time || !time.isValid()) {
		throw new Error('Unable to parse time from: `' + String(from) + '`.');
	}
	return 'local' === toTZ ? time.tz(d3s.tz.guess() || 'utc') : time.tz(toTZ || 'utc');
};

/**
 * Seconds.
 */
export const secondInSeconds = 1; // For the sake of being thorough.
export const secondInMilliseconds = secondInSeconds * 1000; // One thousandth of a second. JavaScript favors milliseconds.
export const secondInMicroseconds = secondInMilliseconds * 1000; // One millionth of a second, or one thousandth of a millisecond.

/**
 * Minutes.
 */
export const minuteInSeconds = secondInSeconds * 60;
export const minuteInMilliseconds = minuteInSeconds * secondInMilliseconds;
export const minuteInMicroseconds = minuteInSeconds * secondInMicroseconds;

/**
 * Hours.
 */
export const hourInSeconds = minuteInSeconds * 60;
export const hourInMilliseconds = hourInSeconds * secondInMilliseconds;
export const hourInMicroseconds = hourInSeconds * secondInMicroseconds;

/**
 * Days.
 */
export const dayInSeconds = hourInSeconds * 24;
export const dayInMilliseconds = dayInSeconds * secondInMilliseconds;
export const dayInMicroseconds = dayInSeconds * secondInMicroseconds;

/**
 * Weeks.
 */
export const weekInSeconds = dayInSeconds * 7;
export const weekInMilliseconds = weekInSeconds * secondInMilliseconds;
export const weekInMicroseconds = weekInSeconds * secondInMicroseconds;

/**
 * Months.
 */
export const monthInSeconds = dayInSeconds * 30;
export const monthInMilliseconds = monthInSeconds * secondInMilliseconds;
export const monthInMicroseconds = monthInSeconds * secondInMicroseconds;

/**
 * Years.
 */
export const yearInSeconds = dayInSeconds * 365;
export const yearInMilliseconds = yearInSeconds * secondInMilliseconds;
export const yearInMicroseconds = yearInSeconds * secondInMicroseconds;
