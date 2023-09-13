/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $env } from '../../index.ts';

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
		expect($env.isCFW()).toBe(false);
	});
	test('.isCFWViaMiniflare()', async () => {
		expect($env.isCFWViaMiniflare()).toBe(false);
	});
	test('.isWorker()', async () => {
		expect($env.isWorker()).toBe(false);
	});
	test('.isServiceWorker()', async () => {
		expect($env.isServiceWorker()).toBe(false);
	});
});
