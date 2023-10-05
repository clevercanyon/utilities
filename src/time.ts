/**
 * Time utilities.
 */

import './resources/init.ts';

import { DateTime as Time } from 'luxon';
import { $app, $class, $is, $obj, $symbol, type $type } from './index.ts';

/**
 * Defines types.
 */
export type ParseOptions = { zone?: string; locale?: string };
export type I18nOptions = { zone?: string; locale?: string; format?: string | object };
export type From = number | string | Date | $type.Time | object | [string, string];

/**
 * Enhances Time prototype.
 */
Object.defineProperty(Time.prototype, $symbol.objTag, {
    get: function (this: $type.Time): ReturnType<$class.ObjTagSymbolFn> {
        return $app.pkgName + '/Time'; // {@see $obj.tag()}.
    },
});
Object.defineProperty(Time.prototype, $symbol.objToPlain, {
    value: function (this: $type.Time): ReturnType<$class.ObjToPlainSymbolFn> {
        return this.setZone('utc').toObject(); // See: <https://o5p.me/4iEe01>.
    },
});
Object.defineProperty(Time.prototype, $symbol.objToClone, {
    value: function (this: $type.Time): ReturnType<$class.ObjToCloneSymbolFn> {
        return this.reconfigure({}); // See: <https://o5p.me/dXNmVy>.
    },
});

/**
 * Provides access to full library.
 *
 * @see https://o5p.me/piUx4o
 */
export * as $ from 'luxon'; // i.e., Luxon.

/**
 * Current user i18n options.
 */
export const currentUser = new Intl.DateTimeFormat().resolvedOptions();

/**
 * Gets a unix timestamp.
 *
 * @param   from Parseable `from` value.
 *
 *   - Default `from` value is `now`.
 *   - {@see parse()} for further details.
 *
 *
 * @returns      Timestamp in whole seconds, as an integer.
 */
export const stamp = (from: From = 'now'): number => {
    return parse(from).toUnixInteger();
};

/**
 * Gets a floating point timestamp.
 *
 * @param   from Parseable `from` value.
 *
 *   - Default `from` value is `now`.
 *   - {@see parse()} for further details.
 *
 *
 * @returns      Timestamp in seconds, as a float, supporting fractional seconds.
 */
export const floatStamp = (from: From = 'now'): number => {
    return parse(from).toSeconds();
};

/**
 * Gets a millisecond timestamp.
 *
 * @param   from Parseable `from` value.
 *
 *   - Default `from` value is `now`.
 *   - {@see parse()} for further details.
 *
 *
 * @returns      Timestamp in whole milliseconds, as an integer.
 */
export const milliStamp = (from: From = 'now'): number => {
    return parse(from).toMillis();
};

/**
 * Defines i18n date & time formats.
 *
 * @note {@see i18n()} `format` option.
 */
export const i18nFormats = {
    date: {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    },
    time: {
        hour: 'numeric',
        hourCycle: 'h12',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    },
    dateTime: {}, // Initialize only; set below.
};
i18nFormats.dateTime = { ...i18nFormats.date, ...i18nFormats.time };

/**
 * Produces an internationalized time using configurable options.
 *
 * @param   from    Parseable `from` value.
 *
 *   - Default `from` value is `now`.
 *   - {@see parse()} for further details.
 *
 * @param   options Options (all optional). Defaults are geared to current user.
 *
 *   - Default timezone is the current user’s timezone. For others, see: https://o5p.me/mVQqsS.
 *   - Default i18n locale is the current user’s locale. For others, see: https://o5p.me/qLAeRe.
 *   - Default format is {@see i18nFormats.dateTime}. For others, see: https://o5p.me/fZPB9R.
 *
 *       - Format can be given in kebab-case, pointing to an Intl config object key. See: https://o5p.me/fZPB9R.
 *       - Format can also be given as one of these config object constants. See: https://o5p.me/fZPB9R.
 *       - Format can also be given as a custom config object. See: https://o5p.me/lHJPfq.
 *
 *
 * @returns         By default, datetime in full w/ seconds, using current user’s zone/locale.
 */
export const i18n = (from: From = 'now', options?: I18nOptions): string => {
    const defaultOpts = {
        zone: currentUser.timeZone,
        locale: currentUser.locale,
        format: i18nFormats.dateTime,
    };
    const opts = $obj.defaults({}, options || {}, defaultOpts) as Required<I18nOptions>;
    const time = parse(from, $obj.pick(opts, ['zone', 'locale']) as ParseOptions);

    if ($is.string(opts.format)) {
        const T = Time as unknown as $type.Object;
        const format = opts.format.replace(/-/gu, '_').toUpperCase();

        if ($is.object(T[format])) {
            return time.toLocaleString(T[format] as object).replace(/\s+/gu, ' ');
        }
        throw new Error('Invalid format: `' + format + '`.');
    }
    return time.toLocaleString(opts.format).replace(/\s+/gu, ' ');
};

/**
 * Parses a time using configurable options.
 *
 * @param   from                    Parseable `from` value.
 *
 *   - Please refer to source code for parseable `from` values.
 *
 * @param   options                 Options (all optional).
 *
 *   - Default timezone is `utc`. For others, see: https://o5p.me/mVQqsS.
 *   - Default i18n locale is `en-US`. For others, see: https://o5p.me/qLAeRe.
 *
 *
 * @returns {@see $type.Time}         Time instance in requested timezone.
 *
 * @note See <https://o5p.me/P6D5so> for API docs.
 * @note See <https://o5p.me/FMfPko> for parseable format tokens.
 * @note See <https://o5p.me/mVQqsS> for the full list of all TZ database codes.
 */
export const parse = (from: From = 'now', options?: ParseOptions): $type.Time => {
    const defaultOpts = { zone: 'utc', locale: 'en-US' };
    const opts = $obj.defaults({}, options || {}, defaultOpts) as Required<ParseOptions>;

    opts.zone = 'local' === opts.zone ? currentUser.timeZone : opts.zone;
    opts.locale = 'local' === opts.locale ? currentUser.locale : opts.locale;

    let time: $type.Time | undefined; // Initialize.

    if ('now' === from) {
        time = Time.now();
        //
    } else if ($is.number(from) || ($is.numeric(from) && /^[0-9]{10,}/u.test(from))) {
        from = Number(from); // Force number value.

        if ($is.float(from) || (from as number).toString().length <= 10) {
            time = Time.fromSeconds(from);
        } else {
            time = Time.fromMillis(from);
        }
    } else if ($is.string(from)) {
        // HTTP: RFC-2616; e.g., `Tue, 21 Feb 2023 13:16:32 GMT` (always GMT).
        if (/^[a-z]{3}, [0-9]{2} [a-z]{3} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} GMT$/iu.test(from)) {
            time = Time.fromHTTP(from);
            //
            // SQL: e.g., `2023-02-21[ 13:16:32[.000][Z|+00:00| Z| +00:00| America/New_York]]`.
        } else if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}(?: [0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]{3})?(?:\s?Z|\s?[+-][0-9]{2}:[0-9]{2}|\s[A-Za-z0-9+\-_/]+)?)?$/u.test(from)) {
            time = Time.fromSQL(from, { zone: 'utc' });
            //
        } /* ISO-8601: e.g., `2023-W08-2`, `20230221`, `0000[00[.000]]Z`, `00:00[:00[.000]]Z`, `20230221[T1316[32[.000]][Z|+0000]]`, `2023-02-21[T13:16[:32[.000]][Z|+00:00]]`. */ else {
            time = Time.fromISO(from, { zone: 'utc' });
        }
    } else if ($is.date(from)) {
        time = Time.fromJSDate(from);
        //
    } else if ($is.time(from)) {
        time = Time.fromISO(from.toISO() || '');
        //
    } else if ($is.plainObject(from)) {
        time = Time.fromObject(from, { zone: 'utc' });
        //
    } else if ($is.array(from) && 2 === from.length) {
        time = Time.fromFormat(String(from[0]), String(from[1]), { zone: 'utc' });
    }
    if (!time || !time.isValid) {
        throw new Error('Unable to parse time from: `' + String(from) + '`.');
    }
    return time.setZone(opts.zone).setLocale(opts.locale);
};

/**
 * Seconds.
 */
export const secondInSeconds = 1;
export const secondInMilliseconds = secondInSeconds * 1000;
export const secondInMicroseconds = secondInMilliseconds * 1000;

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
