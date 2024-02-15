/**
 * Time utilities.
 *
 * Dayjs is approximately 18kbs.
 */

import '#@initialize.ts';

import dayjs from 'dayjs'; // 7kbs.
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat.js'; // 1.07KiB.
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat.js'; // 3.66KiB.
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat.js'; // 807 bytes.
import dayjsRelativeTime from 'dayjs/plugin/relativeTime.js'; // 1.39KiB.
import dayjsTimezone from 'dayjs/plugin/timezone.js'; // 2.09KiB.
import dayjsToObject from 'dayjs/plugin/toObject.js'; // 422 bytes.
import dayjsUTC from 'dayjs/plugin/utc.js'; // 2.2KiB.

import { $app, $fn, $is, $obj, $symbol, type $type } from '#index.ts';

let initialized: boolean = false;
let i18n: Intl.ResolvedDateTimeFormatOptions;

/**
 * Defines types.
 */
declare module 'dayjs' {
    export interface Dayjs {
        clone(): dayjs.Dayjs;
        equals(time: dayjs.Dayjs): boolean;

        toStamp(): number;
        toFloatStamp(): number;
        toMilliStamp(): number;

        toYMD(): string;
        toSQL(): string;
        toISO(): string;
        toHTTP(): string;

        toProse(): string;
        toProseDate(): string;

        toI18n(options?: I18nOptions): string;
        toI18nDate(options?: I18nOptions): string;

        toNow(withoutSuffix?: boolean): string;
        to(time: dayjs.Dayjs, withoutSuffix?: boolean): string;

        fromNow(withoutSuffix?: boolean): string;
        from(time: dayjs.Dayjs, withoutSuffix?: boolean): string;
    }
}
export type ParseOptions = { locale?: string; zone?: string };
export type I18nOptions = { locale?: string; zone?: string; format?: string };
export type Parseable = null | undefined | number | string | Date | $type.Time;
type LocaleTZOptions = { locale?: string; zone?: string };

/**
 * Provides access to full library.
 *
 * @see https://day.js.org/en/
 */
export { dayjs as $ }; // i.e., Dayjs.

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

/**
 * Gets a unix timestamp.
 *
 * @param   parseable Parseable time.
 *
 *   - Default `parseable` value is `now`.
 *   - {@see parse()} for further details.
 *
 * @returns           Timestamp in whole seconds, as an integer.
 */
export const stamp = (parseable?: Parseable): number => {
    return parse(parseable).toStamp();
};

/**
 * Gets a floating point timestamp.
 *
 * @param   parseable Parseable time.
 *
 *   - Default `parseable` value is `now`.
 *   - {@see parse()} for further details.
 *
 * @returns           Timestamp in seconds, as a float, supporting fractional seconds.
 */
export const floatStamp = (parseable?: Parseable): number => {
    return parse(parseable).toFloatStamp();
};

/**
 * Gets a millisecond timestamp.
 *
 * @param   parseable Parseable time.
 *
 *   - Default `parseable` value is `now`.
 *   - {@see parse()} for further details.
 *
 * @returns           Timestamp in whole milliseconds, as an integer.
 */
export const milliStamp = (parseable?: Parseable): number => {
    return parse(parseable).toMilliStamp();
};

/**
 * Gets the current time.
 *
 * @param   options                 Options (all optional); {@see parse()}.
 *
 * @returns {@see $type.Time}         Current time instance.
 */
export const now = (options?: ParseOptions): $type.Time => parse('', options);

/**
 * Parses a time using configurable options.
 *
 * @param   parseable                 Parseable time.
 *
 *   - Default `parseable` value is `now`.
 *   - Refer to source code for parseable times.
 *   - //
 * @param   options                   Options (all optional); {@see ParseOptions}.
 *
 *   - Default locale is `en-US`. For others, see: https://o5p.me/0whu4P.
 *   - Default timezone is `utc`. For others, see: https://o5p.me/mVQqsS.
 *
 * @returns {@see $type.Time}           Time instance in requested timezone.
 *
 * @note See <https://o5p.me/19WnLy> for API docs.
 */
export const parse = (parseable?: Parseable, options?: ParseOptions): $type.Time => {
    if (!initialized) initialize(); // If not already.
    let time: $type.Time | undefined; // Initialize.

    if (!parseable || 'now' === parseable) time = dayjs();
    //
    else if ($is.date(parseable) || $is.time(parseable)) {
        time = dayjs(parseable); // Object simply cloned as-is.
        //
    } else if ($is.number(parseable) || ($is.numeric(parseable) && /^\d{10,}/u.test(parseable))) {
        parseable = Number(parseable); // Force number value.

        if ($is.float(parseable) || (parseable as number).toString().length <= 10) {
            time = dayjs.unix(parseable); // Seconds.
        } else {
            time = dayjs(parseable); // Milliseconds.
        }
    } else if ($is.string(parseable)) {
        // RFC-7231: `Tue, 21 Feb 2023 13:16:32 GMT`; {@see https://o5p.me/xGuzSc}.
        if (/^[a-z]{3}, \d{2} [a-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/iu.test(parseable)) {
            time = dayjs.utc(parseable.replace(/(?:^[a-z]{3}, | GMT$)/giu, ''), 'DD MMM YYYY HH:mm:ss', true);
            //
            // SQL-like: `2023[-02[-21[ 13[:16[:32][.000]]]]]`, `2023[02[21[ 13[16[32][000]]]]]`.
            // Dayjs can parse SQL-like dates without separators. However, without any separators,
            // we consider it a timestamp if >= 10 digits. So please, use hyphens, or at least a space.
        } else if (!/Z$/iu.test(parseable) /* {@see https://o5p.me/wv9Jfv} {@see https://o5p.me/uru3CY} */) {
            time = dayjs.utc(parseable); // UTC implied, as this format does not support a timezone specifier.
            //
        } /* Simplified ISO-8601: `2023-02-21[T13:16[:32[.000]][Z|+00:00|+0000]]`; {@see https://o5p.me/qgRkeM}. */
        // When the timezone is absent, date-only forms are interpreted as UTC and date-time forms as local time.
        // For that reason, it is strongly suggested not to use date-time forms without a timezone specifier.
        else time = dayjs(parseable); // Dayjs simply passes this on to `Date()` in native JS.
    }
    if (!time || !time.isValid()) {
        throw Error('HavduxTK'); // Unable to parse time from: `' + String(from) + '`.
    }
    return applyLocaleTZOptions(time, options);
};

/**
 * Tries to parse a time using configurable options.
 *
 * @param   parseable                 Parseable time; {@see parse()}.
 * @param   options                   Options (all optional); {@see parse()}.
 *
 * @returns {@see $type.Time}           Time instance in requested timezone, else `undefined`.
 */
export const tryParse = (parseable?: Parseable, options?: ParseOptions): $type.Time | undefined => {
    return $fn.try((): $type.Time => parse(parseable, options), undefined)();
};

// ---
// Misc utilities.

/**
 * Initializes.
 */
const initialize = (): void => {
    if (initialized) return;
    initialized = true;

    // Optimized for minification.
    const { extend: dayjsExtend } = dayjs;

    dayjsExtend(dayjsUTC);
    dayjsExtend(dayjsTimezone);

    dayjsExtend(dayjsCustomParseFormat);
    dayjsExtend(dayjsLocalizedFormat);
    dayjsExtend(dayjsAdvancedFormat);
    dayjsExtend(dayjsRelativeTime);
    dayjsExtend(dayjsToObject);

    dayjs.locale('en-US');
    dayjs.tz.setDefault('utc');
    i18n = new Intl.DateTimeFormat().resolvedOptions();

    dayjsExtend((unusedꓺ, Dayjs) => {
        // Optimized for minification.
        const { prototype } = Dayjs;

        // System object helpers.

        Object.defineProperty(prototype, $symbol.objTag, {
            get: function (this: dayjs.Dayjs): ReturnType<$type.ObjTagSymbolFn> {
                return $app.$pkgName + '/Time';
            },
        });
        (prototype as unknown as $type.Object)[$symbol.objToPlain] = //
            function (this: dayjs.Dayjs): ReturnType<$type.ObjToPlainSymbolFn> {
                return this.utc().toObject();
            };
        (prototype as unknown as $type.Object)[$symbol.objToEquals] = //
            function (this: dayjs.Dayjs): ReturnType<$type.ObjToEqualsSymbolFn> {
                return ((this as unknown as $type.Object)[$symbol.objToPlain] as $type.ObjToPlainSymbolFn)();
            };
        (prototype as unknown as $type.Object)[$symbol.objToClone] = //
            function (this: dayjs.Dayjs): ReturnType<$type.ObjToCloneSymbolFn> {
                return this.clone();
            };
        // Fixes broken `.clone()`; {@see https://o5p.me/hC9cE3}.
        // When this gets fixed, all unit tests should pass without this.

        // eslint-disable-next-line @typescript-eslint/unbound-method -- ok.
        const brokenClone = prototype.clone; // Unbound; hence `.call()` below.

        prototype.clone = function (this: dayjs.Dayjs): dayjs.Dayjs {
            const clone = brokenClone.call(this); // Broken clone.

            for (const prop of ['$y', '$M', '$D', '$W', '$H', '$m', '$s', '$ms']) {
                (clone as unknown as $type.Object)[prop] = (this as unknown as $type.Object)[prop];
            } // This copies properties over verbatim in order to fix.

            return clone as unknown as dayjs.Dayjs;
        };
        // Object equals helper.

        prototype.equals = function (this: dayjs.Dayjs, other: dayjs.Dayjs): boolean {
            return other.toISOString() === this.toISOString();
        };
        // Standard format helpers.

        prototype.toStamp = function (this: dayjs.Dayjs): number {
            return this.unix();
        };
        prototype.toFloatStamp = function (this: dayjs.Dayjs): number {
            return this.valueOf() / 1000;
        };
        prototype.toMilliStamp = function (this: dayjs.Dayjs): number {
            return this.valueOf();
        };
        prototype.toYMD = function (this: dayjs.Dayjs): string {
            return this.format('YYYY-MM-DD');
        };
        prototype.toSQL = function (this: dayjs.Dayjs): string {
            return this.format('YYYY-MM-DD HH:mm:ss');
        };
        prototype.toISO = function (this: dayjs.Dayjs): string {
            return this.toISOString();
        };
        prototype.toHTTP = function (this: dayjs.Dayjs): string {
            return this.toDate().toUTCString();
        };
        // Prose format helpers.

        prototype.toProse = function (this: dayjs.Dayjs): string {
            return this.format('lll z'); // e.g., `Jan 1, 2023 12:00 AM UTC`.
        };
        prototype.toProseDate = function (this: dayjs.Dayjs): string {
            return this.format('ll'); // e.g., `Jan 1, 2023`.
        };
        // I18n format helpers.

        prototype.toI18n = function (this: dayjs.Dayjs, options?: I18nOptions): string {
            const defaultOpts = { locale: 'i18n', zone: 'i18n', format: 'lll z' };
            const opts = $obj.defaults({}, options || {}, defaultOpts) as Required<I18nOptions>;
            return applyLocaleTZOptions(this, opts).format(opts.format);
        };
        prototype.toI18nDate = function (this: dayjs.Dayjs, options?: I18nOptions): string {
            return this.toI18n({ format: 'll', ...options }); // e.g., `Jan 1, 2023`.
        };
    });
};

/**
 * Applies locale/TZ options.
 *
 * @param   time    An existing time instance.
 * @param   options Options (all optional); {@see LocaleTZOptions}.
 *
 *   - Default locale is `en-US`. For others, see: https://o5p.me/0whu4P.
 *   - Default timezone is `utc`. For others, see: https://o5p.me/mVQqsS.
 *
 * @returns         Modified clone of time instance.
 */
const applyLocaleTZOptions = (time: $type.Time, options?: LocaleTZOptions): $type.Time => {
    const defaultOpts = { locale: 'en-US', zone: 'utc' };
    const opts = $obj.defaults({}, options || {}, defaultOpts) as Required<LocaleTZOptions>;

    if ('i18n' === opts.locale) opts.locale = i18n.locale;
    if ('en-US' === opts.locale) opts.locale = 'en';
    if ('i18n' === opts.zone) opts.zone = i18n.timeZone;

    return time.locale(opts.locale).tz(opts.zone);
};
