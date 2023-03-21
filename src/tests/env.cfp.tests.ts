/**
 * Test suite.
 */

import { $env } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$env tests', async () => {
	test('$env.isWeb()', async () => {
		expect($env.isWeb()).toBe(true);
	});
	test('$env.isWebViaJSDOM()', async () => {
		expect($env.isWebViaJSDOM()).toBe(true);
	});
	test('$env.isNode()', async () => {
		expect($env.isNode()).toBe(true);
	});
	test('$env.isCFW()', async () => {
		expect($env.isCFW()).toBe(false);
	});
	test('$env.isCFWViaMiniflare()', async () => {
		expect($env.isCFWViaMiniflare()).toBe(false);
	});
	test('$env.isWorker()', async () => {
		expect($env.isWorker()).toBe(false);
	});
	test('$env.isServiceWorker()', async () => {
		expect($env.isServiceWorker()).toBe(false);
	});
});
