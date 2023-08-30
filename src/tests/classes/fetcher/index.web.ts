/**
 * Test suite.
 */
/* eslint-disable @typescript-eslint/unbound-method -- safe to ignore. */

import { describe, test, expect, vi } from 'vitest';
import { getClass as $fetcherꓺgetClass } from '../../../resources/classes/fetcher.js';

describe('Fetcher', async () => {
	const Fetcher = $fetcherꓺgetClass();

	test('.fetch()', async () => {
		// Mocks `globalThis.fetch()`.

		const globalFetchMock = vi.fn(async () => new Response('x'));
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

		expect(fetcher.global.cache.size).toBe(0);
		expect(globalFetchMock).toHaveBeenCalledTimes(4);

		// Restores native fetch.

		fetcher.restoreNativeFetch();

		// Performs fetches against the mock.

		await globalThis.fetch('http://x.tld/');
		await globalThis.fetch('http://y.tld/');
		await globalThis.fetch('http://z.tld/');
		await globalThis.fetch('http://x.tld/');

		expect(fetcher.global.cache.size).toBe(0);
		expect(globalFetchMock).toHaveBeenCalledTimes(8);
	});
});
