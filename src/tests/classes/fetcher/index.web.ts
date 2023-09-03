/**
 * Test suite.
 */
/* eslint-disable @typescript-eslint/unbound-method -- safe to ignore. */

import { $obj, $class } from '../../../index.js';
import { describe, test, expect, vi } from 'vitest';

describe('Fetcher', async () => {
	const Fetcher = $class.getFetcher();

	test('.fetch()', async () => {
		// Mocks `globalThis.fetch()`.

		const globalFetchMock = vi.fn(async () => {
			return new Response('x', {
				status: 200,
				headers: { 'content-type': 'text/plain; charset=utf-8' },
			});
		});
		vi.stubGlobal('fetch', globalFetchMock);

		expect(globalFetchMock).toHaveBeenCalledTimes(0);
		expect(vi.isMockFunction(globalThis.fetch)).toBe(true);

		// Creates fetcher & replaces native fetch.

		const fetcher = new Fetcher({ autoReplaceNativeFetch: true });

		// Performs fetches against the mock.

		await globalThis.fetch('http://a.tld/');
		await globalThis.fetch('http://b.tld/');
		await globalThis.fetch('http://c.tld/');
		await globalThis.fetch('http://a.tld/');

		expect($obj.keysAndSymbols(fetcher.global.cache).length).toBe(0);
		expect(globalFetchMock).toHaveBeenCalledTimes(4);

		// Restores native fetch.

		fetcher.restoreNativeFetch();

		// Performs fetches against the mock.

		await globalThis.fetch('http://x.tld/');
		await globalThis.fetch('http://y.tld/');
		await globalThis.fetch('http://z.tld/');
		await globalThis.fetch('http://x.tld/');

		expect($obj.keysAndSymbols(fetcher.global.cache).length).toBe(0);
		expect(globalFetchMock).toHaveBeenCalledTimes(8);
	});
});
