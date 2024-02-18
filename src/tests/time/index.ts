/**
 * Test suite.
 */

import { $is, $obj, $time } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$time', async () => {
    test('.stamp()', async () => {
        expect($is.integer($time.stamp())).toBe(true);
        expect($time.stamp('2023-01-01')).toBe(1672531200);
        expect($time.stamp('2023-01-01T00:00:00')).toBe(1672531200);
        expect($time.stamp('2023-01-01T00:00:00Z')).toBe(1672531200);
        expect($time.stamp('2023-01-01T00:00:00.001Z')).toBe(1672531200);
    });
    test('.floatStamp()', async () => {
        expect($is.number($time.floatStamp())).toBe(true);
        expect($time.floatStamp('2023-01-01')).toBe(1672531200);
        expect($time.floatStamp('2023-01-01T00:00:00')).toBe(1672531200);
        expect($time.floatStamp('2023-01-01T00:00:00Z')).toBe(1672531200);
        expect($time.floatStamp('2023-01-01T00:00:00.001Z')).toBe(1672531200.001);
    });
    test('.milliStamp()', async () => {
        expect($is.number($time.milliStamp())).toBe(true);
        expect($time.milliStamp('2023-01-01')).toBe(1672531200000);
        expect($time.milliStamp('2023-01-01T00:00:00')).toBe(1672531200000);
        expect($time.milliStamp('2023-01-01T00:00:00Z')).toBe(1672531200000);
        expect($time.milliStamp('2023-01-01T00:00:00.001Z')).toBe(1672531200001);
    });
    test('.parse()', async () => {
        // Validations.
        expect($is.time($time.parse())).toBe(true);
        expect($is.object($time.parse())).toBe(true);
        expect($obj.tag($time.parse())).toBe('@clevercanyon/utilities/Time');

        // Timestamps.
        expect($time.parse(1672531200).toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse(1672531200000).toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse(1672531200001).toISO()).toBe('2023-01-01T00:00:00.001Z');
        expect($time.parse(1672531200.0).toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse(1672531200.001).toISO()).toBe('2023-01-01T00:00:00.001Z');

        // Numeric string timestamps.
        expect($time.parse('1672531200').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('1672531200000').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('1672531200001').toISO()).toBe('2023-01-01T00:00:00.001Z');
        expect($time.parse('1672531200.0').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('1672531200.00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('1672531200.000').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('1672531200.001').toISO()).toBe('2023-01-01T00:00:00.001Z');

        // Native JS date objects.
        expect($time.parse(new Date('2023-01-01T00:00:00Z')).toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse(new Date('2023-01-01T00:00:00.000Z')).toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse(new Date('2023-01-01T00:00:00.001Z')).toISO()).toBe('2023-01-01T00:00:00.001Z');

        // Time objects parsed from time objects.
        expect($time.parse($time.parse('2023-01-01T00:00:00')).toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse($time.parse('2023-01-01T00:00:00Z')).toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse($time.parse('2023-01-01T00:00:00.000Z')).toISO()).toBe('2023-01-01T00:00:00.000Z');

        // HTTP RFC-7231: `[Tue, ]21 Feb 2023 13:16:32 GMT`; {@see https://o5p.me/xGuzSc}.
        expect($time.parse('01 Jan 2023 00:00:00 GMT').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('01 Jan 2023 00:00:01 GMT').toISO()).toBe('2023-01-01T00:00:01.000Z');
        expect($time.parse('Sun, 01 Jan 2023 00:00:00 GMT').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('Sun, 01 Jan 2023 00:00:01 GMT').toISO()).toBe('2023-01-01T00:00:01.000Z');

        // Email RFC-2822 & RFC-5322: `[Tue, ]21 Feb 2023 13:16:32 {TZ}`; {@see https://o5p.me/y7Lf0h}.
        expect($time.parse('Sun, 01 Jan 2023 00:00:00 EST').toISO()).toBe('2023-01-01T05:00:00.000Z');
        expect($time.parse('01 Jan 2023 00:00:01 GMT').toISO()).toBe('2023-01-01T00:00:01.000Z');
        expect($time.parse('Sun, 01 Jan 2023 00:00:00 +0000').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('Sun, 01 Jan 2023 00:00:00 +00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('01 Jan 2023 00:00:01 -0500').toISO()).toBe('2023-01-01T05:00:01.000Z');
        expect($time.parse('Sun, 01 Jan 2023 00:00:00 GMT').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('Sun, 01 Jan 2023 00:00:01 GMT').toISO()).toBe('2023-01-01T00:00:01.000Z');

        // Email RFC-822: `[Tue, ]21 Feb 23 13:16:32 {TZ}`; {@see https://o5p.me/kffMpw}.
        expect($time.parse('Sun, 01 Jan 23 00:00:00 EST').toISO()).toBe('2023-01-01T05:00:00.000Z');
        expect($time.parse('01 Jan 23 00:00:01 GMT').toISO()).toBe('2023-01-01T00:00:01.000Z');
        expect($time.parse('Sun, 01 Jan 23 00:00:00 +0000').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('Sun, 01 Jan 23 00:00:00 +00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('01 Jan 23 00:00:01 -0500').toISO()).toBe('2023-01-01T05:00:01.000Z');
        expect($time.parse('Sun, 01 Jan 23 00:00:00 GMT').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('Sun, 01 Jan 23 00:00:01 GMT').toISO()).toBe('2023-01-01T00:00:01.000Z');

        // Email RFC-850: `[Tuesday, ]21-Feb-23 13:16:32 {TZ}`; {@see https://o5p.me/R4XVA9}.
        expect($time.parse('Sunday, 01-Jan-23 00:00:00 EST').toISO()).toBe('2023-01-01T05:00:00.000Z');
        expect($time.parse('01-Jan-23 00:00:01 GMT').toISO()).toBe('2023-01-01T00:00:01.000Z');
        expect($time.parse('Sunday, 01-Jan-23 00:00:00 +0000').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('Sunday, 01-Jan-23 00:00:00 +00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('01-Jan-23 00:00:01 -0500').toISO()).toBe('2023-01-01T05:00:01.000Z');
        expect($time.parse('Sunday, 01-Jan-23 00:00:00 GMT').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('Sunday, 01-Jan-23 00:00:01 GMT').toISO()).toBe('2023-01-01T00:00:01.000Z');

        // SQL ISO-8601: `2023[-02[-21[ 13[:16[:32][.000]]]]]`, `2023[02[21[ 13[16[32][000]]]]]`.
        // Dayjs is capable of parsing SQL-like dates without separators. However, when there are no separators we will have
        // already considered it to be a timestamp; i.e., whenever it’s >= 10 digits. So please use hyphens, or at least a space.
        expect($time.parse('20230101').toISO()).toBe('2023-01-01T00:00:00.000Z'); // Less than 10 digits.
        expect($time.parse('20230101 010101').toISO()).toBe('2023-01-01T01:01:01.000Z'); // Space = non-numeric.
        expect($time.parse('20230101 010101001').toISO()).toBe('2023-01-01T01:01:01.001Z'); // Space = non-numeric.
        expect($time.parse('2023-01-01').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00+00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00 +00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000+00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 +00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');

        // JS simplified ISO-8601: `2023-02-21[T13:16[:32[.000]][Z|+00:00|+0000]]`; {@see https://o5p.me/qgRkeM}.
        // When the timezone is absent, date-only forms are interpreted as UTC and date-time forms as local time.
        // For that reason, it is strongly suggested not to use date-time forms without a timezone specifier.
        expect($time.parse('2023-01-01T00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01T00:00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01T00:00Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01T00:00:00.001Z').toISO()).toBe('2023-01-01T00:00:00.001Z');
        expect($time.parse('2023-01-01 00:00:00Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00 Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 UT').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 UTC').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 GMT').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 +0000').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 -0000').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 +00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 -0500').toISO()).toBe('2023-01-01T05:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 -05:00').toISO()).toBe('2023-01-01T05:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 +00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 -00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000 -05').toISO()).toBe('2023-01-01T05:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000+0000').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000-0000').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000+00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000-0500').toISO()).toBe('2023-01-01T05:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000-05:00').toISO()).toBe('2023-01-01T05:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000+00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000-00').toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse('2023-01-01 00:00:00.000-05').toISO()).toBe('2023-01-01T05:00:00.000Z');

        // Invalid formats that throw.
        expect(() => $time.parse('2022-W52-7').toISO()).toThrow();
        expect(() => $time.parse('20230101T0000Z').toISO()).toThrow();
        expect(() => $time.parse('20230101T000000.001Z').toISO()).toThrow();
        expect(() => $time.parse('20230101T000000.001Z').toISO()).toThrow();
        expect(() => $time.parse('2023-01-01 00:00:00.000 America/New_York').toISO()).toThrow();
    });
    test('.format(), .toSQL(), .toISO(), et al', async () => {
        expect($time.parse(1672531200).toSQL()).toBe('2023-01-01 00:00:00');
        expect($time.parse(1672531200, { zone: 'America/New_York' }).toSQL()).toBe('2022-12-31 19:00:00');

        expect($time.parse(1672531200).toString()).toBe('Sun, 01 Jan 2023 00:00:00 GMT');
        expect($time.parse(1672531200).toDate()).toStrictEqual(new Date(Date.parse('2023-01-01T00:00:00.000Z')));
        expect($time.parse(1672531200).toObject()).toStrictEqual({ date: 1, hours: 0, milliseconds: 0, minutes: 0, months: 0, seconds: 0, years: 2023 });

        expect($time.parse(1672531200).toYMD()).toBe('2023-01-01');
        expect($time.parse(1672531200).toISO()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse(1672531200).toJSON()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse(1672531200).toHTTP()).toBe('Sun, 01 Jan 2023 00:00:00 GMT');

        expect($time.parse(1672531200).toProseDate()).toBe('Jan 1, 2023');
        expect($time.parse(1672531200).toProse()).toBe('Jan 1, 2023 12:00 AM UTC');
        expect($time.parse(1672531200, { zone: 'America/Anchorage' }).toProse()).toBe('Dec 31, 2022 3:00 PM AKST');
        expect($time.parse(1672531200, { zone: 'America/Chicago' }).toProse()).toBe('Dec 31, 2022 6:00 PM CST');
        expect($time.parse(1672531200, { zone: 'America/Denver' }).toProse()).toBe('Dec 31, 2022 5:00 PM MST');
        expect($time.parse(1672531200, { zone: 'America/Los_Angeles' }).toProse()).toBe('Dec 31, 2022 4:00 PM PST');
        expect($time.parse(1672531200, { zone: 'America/New_York' }).toProse()).toBe('Dec 31, 2022 7:00 PM EST');

        expect($time.parse(1672531200).format('YYYY-MM-DD HH:mm:ss.SSS Z')).toBe('2023-01-01 00:00:00.000 +00:00');
        expect($time.parse(1672531200).format('YYYY-MM-DD HH:mm:ss.SSS ZZ')).toBe('2023-01-01 00:00:00.000 +0000');

        expect($time.parse(1672531200, { zone: 'America/New_York' }).format('YYYY-MM-DD HH:mm:ss.SSS Z')).toBe('2022-12-31 19:00:00.000 -05:00');
        expect($time.parse(1672531200, { zone: 'America/New_York' }).format('YYYY-MM-DD HH:mm:ss.SSS ZZ')).toBe('2022-12-31 19:00:00.000 -0500');

        expect($time.parse(1672531200, { zone: 'America/New_York' }).format('YYYY-MM-DD HH:mm:ss.SSS z')).toBe('2022-12-31 19:00:00.000 EST');
        expect($time.parse(1672531200, { zone: 'America/New_York' }).format('YYYY-MM-DD HH:mm:ss.SSS zzz')).toBe('2022-12-31 19:00:00.000 Eastern Standard Time');
    });
    test('.toI18n(), toI18nDate()', async () => {
        expect($time.parse('2023-01-01').toI18n({ locale: 'en-US', zone: 'utc' })).toBe('Jan 1, 2023 12:00 AM UTC');
        expect($time.parse('2023-01-01T00:00:00').toI18n({ locale: 'en-US', zone: 'utc' })).toBe('Jan 1, 2023 12:00 AM UTC');
        expect($time.parse('2023-01-01T00:00:00Z').toI18n({ locale: 'en-US', zone: 'utc' })).toBe('Jan 1, 2023 12:00 AM UTC');
        expect($time.parse('2023-01-01T00:00:00.001Z').toI18n({ locale: 'en-US', zone: 'utc' })).toBe('Jan 1, 2023 12:00 AM UTC');
        expect($time.parse('2023-01-01T00:00:00.001Z').toI18n({ locale: 'en-US', zone: 'America/New_York' })).toBe('Dec 31, 2022 7:00 PM EST');
        expect($time.parse('2023-01-01T00:00:00.001Z').toI18n({ locale: 'en-US', zone: 'Africa/Timbuktu' })).toBe('Jan 1, 2023 12:00 AM GMT');

        expect($time.parse('2023-01-01').toI18nDate({ locale: 'en-US', zone: 'utc' })).toBe('Jan 1, 2023');
        expect($time.parse('2023-01-01T00:00:00').toI18nDate({ locale: 'en-US', zone: 'utc' })).toBe('Jan 1, 2023');
        expect($time.parse('2023-01-01T00:00:00Z').toI18nDate({ locale: 'en-US', zone: 'utc' })).toBe('Jan 1, 2023');
        expect($time.parse('2023-01-01T00:00:00.001Z').toI18nDate({ locale: 'en-US', zone: 'utc' })).toBe('Jan 1, 2023');
        expect($time.parse('2023-01-01T00:00:00.001Z').toI18nDate({ locale: 'en-US', zone: 'Africa/Timbuktu' })).toBe('Jan 1, 2023');
        expect($time.parse('2023-01-01T00:00:00.001Z').toI18nDate({ locale: 'en-US', zone: 'America/New_York' })).toBe('Dec 31, 2022');
    });
    test('.toString()', async () => {
        // As evidenced, `toString()` should not be used to compare dates.
        expect($time.parse(1672531200).toString()).toBe('Sun, 01 Jan 2023 00:00:00 GMT');
        expect($time.parse(1672531200000).toString()).toBe('Sun, 01 Jan 2023 00:00:00 GMT');
        expect($time.parse(1672531200001).toString()).toBe('Sun, 01 Jan 2023 00:00:00 GMT');
        expect($time.parse(1672531200.0).toString()).toBe('Sun, 01 Jan 2023 00:00:00 GMT');
        expect($time.parse(1672531200.001).toString()).toBe('Sun, 01 Jan 2023 00:00:00 GMT');
    });
    test('.toISOString()', async () => {
        expect($time.parse(1672531200).toISOString()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse(1672531200000).toISOString()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse(1672531200001).toISOString()).toBe('2023-01-01T00:00:00.001Z');
        expect($time.parse(1672531200.0).toISOString()).toBe('2023-01-01T00:00:00.000Z');
        expect($time.parse(1672531200.001).toISOString()).toBe('2023-01-01T00:00:00.001Z');
    });
    test('.equals()', async () => {
        expect($time.parse(1672531200).equals($time.parse(1672531200))).toBe(true);
        expect($time.parse(1672531200000).equals($time.parse(1672531200000))).toBe(true);
        expect($time.parse(1672531200001).equals($time.parse(1672531200001))).toBe(true);
        expect($time.parse(1672531200.0).equals($time.parse(1672531200.0))).toBe(true);
        expect($time.parse(1672531200).equals($time.parse(1672531200.0))).toBe(true);
        expect($time.parse(1672531200.001).equals($time.parse(1672531200.001))).toBe(true);
        expect($time.parse(1672531200.001).equals($time.parse(1672531200001))).toBe(true);

        expect($time.parse(1672531200).equals($time.parse(1672531201))).toBe(false);
        expect($time.parse(1672531200000).equals($time.parse(1672531201))).toBe(false);
        expect($time.parse(1672531200001).equals($time.parse(1672531201))).toBe(false);
        expect($time.parse(1672531200.0).equals($time.parse(1672531201))).toBe(false);
        expect($time.parse(1672531200.001).equals($time.parse(1672531201))).toBe(false);
    });
});
