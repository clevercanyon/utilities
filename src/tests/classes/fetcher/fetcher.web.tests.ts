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

		expect(fetcher.global.cache.size).toBe(0);
		expect(globalFetchMock).toHaveBeenCalledTimes(4);

		// Restores native fetch.

		fetcher.restoreNativeFetch();

		// Performs fetches against the mock.

		await globalThis.fetch('http://x');
		await globalThis.fetch('http://y');
		await globalThis.fetch('http://z');
		await globalThis.fetch('http://x');

		expect(fetcher.global.cache.size).toBe(0);
		expect(globalFetchMock).toHaveBeenCalledTimes(8);
	});
});
