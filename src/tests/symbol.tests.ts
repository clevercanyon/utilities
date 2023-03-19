/**
 * Test suite.
 */

import { $is, $symbol } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$symbol tests', async () => {
	test('$symbol.objAppPkgName', async () => {
		expect($is.symbol($symbol.objAppPkgName)).toBe(true);
	});
	test('$symbol.objTag', async () => {
		expect($is.symbol($symbol.objTag)).toBe(true);
	});
	test('$symbol.objStringTag', async () => {
		expect($is.symbol($symbol.objStringTag)).toBe(true);
	});
	test('$symbol.objToJSON', async () => {
		expect($is.string($symbol.objToJSON)).toBe(true);
	});
	test('$symbol.objToPlain', async () => {
		expect($is.symbol($symbol.objToPlain)).toBe(true);
	});
	test('$symbol.objToClone', async () => {
		expect($is.symbol($symbol.objToClone)).toBe(true);
	});
});
