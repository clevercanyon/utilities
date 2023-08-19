/**
 * Test suite.
 */

import { $obj, $time, $is } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$time tests', async () => {
	test('$time.stamp()', async () => {
		expect($is.integer($time.stamp())).toBe(true);
		expect($time.stamp('2023-01-01')).toBe(1672531200);
		expect($time.stamp('2023-01-01T00:00:00')).toBe(1672531200);
		expect($time.stamp('2023-01-01T00:00:00Z')).toBe(1672531200);
		expect($time.stamp('2023-01-01T00:00:00.001Z')).toBe(1672531200);
	});
	test('$time.floatStamp()', async () => {
		expect($is.number($time.floatStamp())).toBe(true);
		expect($time.floatStamp('2023-01-01')).toBe(1672531200);
		expect($time.floatStamp('2023-01-01T00:00:00')).toBe(1672531200);
		expect($time.floatStamp('2023-01-01T00:00:00Z')).toBe(1672531200);
		expect($time.floatStamp('2023-01-01T00:00:00.001Z')).toBe(1672531200.001);
	});
	test('$time.milliStamp()', async () => {
		expect($is.number($time.milliStamp())).toBe(true);
		expect($time.milliStamp('2023-01-01')).toBe(1672531200000);
		expect($time.milliStamp('2023-01-01T00:00:00')).toBe(1672531200000);
		expect($time.milliStamp('2023-01-01T00:00:00Z')).toBe(1672531200000);
		expect($time.milliStamp('2023-01-01T00:00:00.001Z')).toBe(1672531200001);
	});
	test('$time.i18n()', async () => {
		expect($is.string($time.i18n())).toBe(true);

		expect($time.i18n('2023-01-01', { zone: 'utc', locale: 'en-US' })).toBe('Sun, Jan 1, 2023, 12:00:00 AM UTC');
		expect($time.i18n('2023-01-01T00:00:00', { zone: 'utc', locale: 'en-US' })).toBe('Sun, Jan 1, 2023, 12:00:00 AM UTC');
		expect($time.i18n('2023-01-01T00:00:00Z', { zone: 'utc', locale: 'en-US' })).toBe('Sun, Jan 1, 2023, 12:00:00 AM UTC');
		expect($time.i18n('2023-01-01T00:00:00.001Z', { zone: 'utc', locale: 'en-US' })).toBe('Sun, Jan 1, 2023, 12:00:00 AM UTC');

		expect($time.i18n('2023-01-01', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.date })).toBe('Sun, Jan 1, 2023');
		expect($time.i18n('2023-01-01T00:00:00', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.date })).toBe('Sun, Jan 1, 2023');
		expect($time.i18n('2023-01-01T00:00:00Z', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.date })).toBe('Sun, Jan 1, 2023');
		expect($time.i18n('2023-01-01T00:00:00.001Z', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.date })).toBe('Sun, Jan 1, 2023');

		expect($time.i18n('2023-01-01', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.time })).toBe('12:00:00 AM UTC');
		expect($time.i18n('2023-01-01T00:00:00', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.time })).toBe('12:00:00 AM UTC');
		expect($time.i18n('2023-01-01T00:00:00Z', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.time })).toBe('12:00:00 AM UTC');
		expect($time.i18n('2023-01-01T00:00:00.001Z', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.time })).toBe('12:00:00 AM UTC');

		expect($time.i18n('2023-01-01', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.dateTime })).toBe('Sun, Jan 1, 2023, 12:00:00 AM UTC');
		expect($time.i18n('2023-01-01T00:00:00', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.dateTime })).toBe('Sun, Jan 1, 2023, 12:00:00 AM UTC');
		expect($time.i18n('2023-01-01T00:00:00Z', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.dateTime })).toBe('Sun, Jan 1, 2023, 12:00:00 AM UTC');
		expect($time.i18n('2023-01-01T00:00:00.001Z', { zone: 'utc', locale: 'en-US', format: $time.i18nFormats.dateTime })).toBe('Sun, Jan 1, 2023, 12:00:00 AM UTC');

		expect($time.i18n('2023-01-01', { zone: 'America/New_York', locale: 'en-US' })).toBe('Sat, Dec 31, 2022, 7:00:00 PM EST');
		expect($time.i18n('2023-01-01T00:00:00', { zone: 'America/New_York', locale: 'en-US' })).toBe('Sat, Dec 31, 2022, 7:00:00 PM EST');
		expect($time.i18n('2023-01-01T00:00:00Z', { zone: 'America/New_York', locale: 'en-US' })).toBe('Sat, Dec 31, 2022, 7:00:00 PM EST');
		expect($time.i18n('2023-01-01T00:00:00.001Z', { zone: 'America/New_York', locale: 'en-US' })).toBe('Sat, Dec 31, 2022, 7:00:00 PM EST');
	});
	test('$time.parse()', async () => {
		expect($is.object($time.parse())).toBe(true);
		expect($obj.tag($time.parse())).toBe('@clevercanyon/utilities/Time');

		expect($time.parse(1672531200).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(1672531200000).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(1672531200001).toISO()).toBe('2023-01-01T00:00:00.001Z');
		expect($time.parse(1672531200.0).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(1672531200.001).toISO()).toBe('2023-01-01T00:00:00.001Z');

		expect($time.parse('1672531200').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('1672531200000').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('1672531200001').toISO()).toBe('2023-01-01T00:00:00.001Z');
		expect($time.parse('1672531200.0').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('1672531200.00').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('1672531200.000').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('1672531200.001').toISO()).toBe('2023-01-01T00:00:00.001Z');

		expect($time.parse('Sun, 01 Jan 2023 00:00:00 GMT').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('Sun, 01 Jan 2023 00:00:01 GMT').toISO()).toBe('2023-01-01T00:00:01.000Z');

		expect($time.parse('2023-01-01').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00 Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00+00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00 +00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00.000Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00.000 Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00.000+00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00.000 +00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00.000 UTC').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01 00:00:00.000 America/New_York').toISO()).toBe('2023-01-01T05:00:00.000Z');

		expect($time.parse('2022-W52-7').toISO()).toBe('2023-01-01T00:00:00.000Z');

		expect($time.parse('20230101').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('20230101T0000Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('20230101T000000.001Z').toISO()).toBe('2023-01-01T00:00:00.001Z');
		expect($time.parse('20230101T000000.001Z').toISO()).toBe('2023-01-01T00:00:00.001Z');

		expect($time.parse('2023-01-01T00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01T00:00:00').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01T00:00Z').toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse('2023-01-01T00:00:00.001Z').toISO()).toBe('2023-01-01T00:00:00.001Z');

		expect($time.parse(new Date('2023-01-01T00:00:00Z')).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(new Date('2023-01-01T00:00:00.000Z')).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(new Date('2023-01-01T00:00:00.001Z')).toISO()).toBe('2023-01-01T00:00:00.001Z');

		expect($time.parse($time.parse('2023-01-01T00:00:00')).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse($time.parse('2023-01-01T00:00:00Z')).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse($time.parse('2023-01-01T00:00:00.000Z')).toISO()).toBe('2023-01-01T00:00:00.000Z');

		expect($time.parse({ day: 1, hour: 0, millisecond: 0, minute: 0, month: 1, second: 0, year: 2023 }).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse({ day: 1, hour: 0, millisecond: 1, minute: 0, month: 1, second: 0, year: 2023 }).toISO()).toBe('2023-01-01T00:00:00.001Z');

		expect($time.parse(['2023-01-01', 'yyyy-MM-dd']).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(['2023-01-01 00:00:00', 'yyyy-MM-dd HH:mm:ss']).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(['2023-01-01 00:00:00.001', 'yyyy-MM-dd HH:mm:ss.SSS']).toISO()).toBe('2023-01-01T00:00:00.001Z');
		expect($time.parse(['2023-01-01 00:00:00.000 +0', 'yyyy-MM-dd HH:mm:ss.SSS Z']).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(['2023-01-01 00:00:00.000 +0000', 'yyyy-MM-dd HH:mm:ss.SSS ZZZ']).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(['2023-01-01 00:00:00.000 +00:00', 'yyyy-MM-dd HH:mm:ss.SSS ZZ']).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(['2023-01-01 00:00:00.000 UTC', 'yyyy-MM-dd HH:mm:ss.SSS z']).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(['2023-01-01 00:00:00.000 America/New_York', 'yyyy-MM-dd HH:mm:ss.SSS z']).toISO()).toBe('2023-01-01T05:00:00.000Z');
	});
	test('$time formats', async () => {
		expect($time.parse(1672531200).toISO()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(1672531200).toJSON()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(1672531200).toHTTP()).toBe('Sun, 01 Jan 2023 00:00:00 GMT');
		expect($time.parse(1672531200).toString()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.parse(1672531200).toJSDate()).toStrictEqual(new Date(Date.parse('2023-01-01T00:00:00.000Z')));
		expect($time.parse(1672531200).toObject()).toStrictEqual({ day: 1, hour: 0, millisecond: 0, minute: 0, month: 1, second: 0, year: 2023 });

		expect($time.parse(1672531200).toFormat('yyyy-MM-dd HH:mm:ss.SSS Z')).toBe('2023-01-01 00:00:00.000 +0');
		expect($time.parse(1672531200).toFormat('yyyy-MM-dd HH:mm:ss.SSS ZZ')).toBe('2023-01-01 00:00:00.000 +00:00');
		expect($time.parse(1672531200).toFormat('yyyy-MM-dd HH:mm:ss.SSS ZZZ')).toBe('2023-01-01 00:00:00.000 +0000');
		expect($time.parse(1672531200, { zone: 'America/New_York' }).toFormat('yyyy-MM-dd HH:mm:ss.SSS ZZZZ')).toBe('2022-12-31 19:00:00.000 EST');
		expect($time.parse(1672531200, { zone: 'America/New_York' }).toFormat('yyyy-MM-dd HH:mm:ss.SSS ZZZZZ')).toBe('2022-12-31 19:00:00.000 Eastern Standard Time');
		expect($time.parse(1672531200, { zone: 'America/New_York' }).toFormat('yyyy-MM-dd HH:mm:ss.SSS z')).toBe('2022-12-31 19:00:00.000 America/New_York');
	});
});
