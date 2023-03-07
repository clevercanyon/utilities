/**
 * Test suite.
 */

import { $time } from '../index.js';
import { describe, beforeEach, test, expect } from 'vitest';

describe('$time tests', async () => {
	let date = new Date();

	beforeEach(async () => {
		date = new Date();
	});
	test('$time.utc()', async () => {
		expect($time.utc('2023-01-01')).toBe('1672531200');
		expect($time.utc('2023-01-01T00:00:00')).toBe('1672531200');
		expect($time.utc('2023-01-01T00:00:00Z')).toBe('1672531200');
		expect($time.utc('2023-01-01T00:00:00', 'sqlDateTime')).toBe('2023-01-01 00:00:00');
		expect($time.utc('2023-01-01T00:00:00', 'iso8601')).toBe('2023-01-01T00:00:00.000Z');
	});
	test('$time.local()', async () => {
		expect($time.local('2023-01-01')).toBe('1672531200');
		expect($time.local('2023-01-01T00:00:00')).toBe('1672531200');
		expect($time.local('2023-01-01T00:00:00Z')).toBe('1672531200');
		expect($time.local('2023-01-01T00:00:00', 'dateTime')).toBe('1/1/2023 12:00 AM EST');
		expect($time.local('2023-01-01T00:00:00', 'verbose')).toBe('ddd, MMM Do, YYYY h:mm A z');
	});
	test('$time.from()', async () => {
		expect($time.from('2023-01-01').format('X')).toBe('1672531200');
		expect($time.from('2023-01-01T00:00:00').format('X')).toBe('1672531200');
		expect($time.from('2023-01-01 00:00:00').format('X')).toBe('1672531200');

		expect($time.from(1672531200).toISOString()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.from(1672531200 * 1000).toISOString()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.from(1672531200000).toISOString()).toBe('2023-01-01T00:00:00.000Z');

		expect($time.from(date).toDate()).toStrictEqual(date);
		expect($time.from(date).toISOString()).toBe(date.toISOString());
		expect($time.from(date).toJSON()).toBe(date.toISOString());

		expect($time.from(new Date('2023-01-01T00:00:00')).toISOString()).toBe('2023-01-01T05:00:00.000Z');
		expect($time.from(new Date('2023-01-01T00:00:00Z')).toISOString()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.from(new Date('2023-01-01T00:00:00.000Z')).toISOString()).toBe('2023-01-01T00:00:00.000Z');

		expect($time.from($time.from(1672531200)).toISOString()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.from($time.from('2023-01-01T00:00:00')).toISOString()).toBe('2023-01-01T05:00:00.000Z');
		expect($time.from($time.from('2023-01-01T00:00:00Z')).toISOString()).toBe('2023-01-01T00:00:00.000Z');
		expect($time.from($time.from('2023-01-01T00:00:00.000Z')).toISOString()).toBe('2023-01-01T00:00:00.000Z');
	});
});
