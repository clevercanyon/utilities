/**
 * Test suite.
 */

import { $is, $symbol } from '../../index.js';
import { describe, test, expect } from 'vitest';

describe('$symbol', async () => {
	test('.objAppPkgName', async () => {
		expect($is.symbol($symbol.objAppPkgName)).toBe(true);
	});
	test('.objTag', async () => {
		expect($is.symbol($symbol.objTag)).toBe(true);
	});
	test('.objStringTag', async () => {
		expect($is.symbol($symbol.objStringTag)).toBe(true);
	});
	test('.objToJSON', async () => {
		expect($is.string($symbol.objToJSON)).toBe(true);
	});
	test('.objToPlain', async () => {
		expect($is.symbol($symbol.objToPlain)).toBe(true);
	});
	test('.objToClone', async () => {
		expect($is.symbol($symbol.objToClone)).toBe(true);
	});
});
