/**
 * Test suite.
 */

import { $env } from '../../index.js';
import { describe, test, expect } from 'vitest';

describe('$env', async () => {
	test('.isWeb()', async () => {
		expect($env.isWeb()).toBe(false);
	});
	test('.isWebViaJSDOM()', async () => {
		expect($env.isWebViaJSDOM()).toBe(false);
	});
	test('.isNode()', async () => {
		expect($env.isNode()).toBe(true);
	});
	test('.isCFW()', async () => {
		expect($env.isCFW()).toBe(true);
	});
	test('.isCFWViaMiniflare()', async () => {
		expect($env.isCFWViaMiniflare()).toBe(true);
	});
	test('.isWorker()', async () => {
		expect($env.isWorker()).toBe(false);
	});
	test('.isServiceWorker()', async () => {
		expect($env.isServiceWorker()).toBe(false);
	});
});
