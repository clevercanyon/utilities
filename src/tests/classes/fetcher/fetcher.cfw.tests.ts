/**
 * Test suite.
 */
/* eslint-disable @typescript-eslint/unbound-method -- safe to ignore. */

import { describe, test, expect, vi } from 'vitest';
import { getClass as $fetcherꓺgetClass } from '../../../resources/classes/fetcher.js';

describe('Fetcher tests', async () => {
	const Fetcher = $fetcherꓺgetClass();

	test('$fetcher.fetch()', async () => {
		// Mocks `globalThis.fetch()`.

		const globalFetchMock = vi.fn(async () => new Response('x'));
		const expectedHeaders = [['content-type', 'text/plain;charset=utf-8']];
		vi.stubGlobal('fetch', globalFetchMock);

		expect(globalFetchMock).toHaveBeenCalledTimes(0);
		expect(vi.isMockFunction(globalThis.fetch)).toBe(true);

		// Creates fetcher & replaces native fetch.

		const fetcher = new Fetcher({ autoReplaceNativeFetch: true });

		// Performs fetches against the mock.

		await globalThis.fetch('http://a');
		await globalThis.fetch('http://b');
		await globalThis.fetch('http://c');
		await globalThis.fetch('http://a');

		expect(fetcher.global.cache.size).toBe(3);
		expect(globalFetchMock).toHaveBeenCalledTimes(3);

		expect(fetcher.global.cache.get('5440e9cf0ce93ece9a5314ef9e638c7f47a5b483')).toStrictEqual({ body: 'x', options: { headers: expectedHeaders, status: 200 } });
		expect(fetcher.global.cache.get('f87103cdb29d41b508ea8399c8d10bb10c1e17d5')).toStrictEqual({ body: 'x', options: { headers: expectedHeaders, status: 200 } });
		expect(fetcher.global.cache.get('84009dd61f2458d24e1d63e177f85ab94310828f')).toStrictEqual({ body: 'x', options: { headers: expectedHeaders, status: 200 } });

		// Restores native fetch.

		fetcher.restoreNativeFetch();

		// Performs fetches against the mock.

		await globalThis.fetch('http://x');
		await globalThis.fetch('http://y');
		await globalThis.fetch('http://z');
		await globalThis.fetch('http://x');

		expect(fetcher.global.cache.size).toBe(3);
		expect(globalFetchMock).toHaveBeenCalledTimes(7);
	});
});
