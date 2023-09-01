/**
 * Test suite.
 */
/* eslint-disable @typescript-eslint/unbound-method -- safe to ignore. */

import { $app } from '../../../index.js';
import { describe, test, expect, vi } from 'vitest';
import { getClass as $fetcherꓺgetClass } from '../../../resources/classes/fetcher.js';

describe('Fetcher', async () => {
	const Fetcher = $fetcherꓺgetClass();

	test('new Fetcher()', async () => {
		expect(new Fetcher()).toBeInstanceOf(Fetcher);
	});
	test('globalThis.fetch()', async () => {
		// Mocks `globalThis.fetch()`.

		const globalFetchMock = vi.fn(async () => new Response('x'));
		vi.stubGlobal('fetch', globalFetchMock);

		expect(globalFetchMock).toHaveBeenCalledTimes(0);
		expect(vi.isMockFunction(globalThis.fetch)).toBe(true);

		// Creates fetcher & mocks its `.fetch()`.

		const fetcher = new Fetcher();
		// @ts-ignore -- `spyOn` broken types. See: <https://o5p.me/O0lghl>.
		const fetcherꓺfetchMock = vi.spyOn(fetcher, 'fetch');
		// @ts-ignore -- `spyOn` broken types. See: <https://o5p.me/O0lghl>.
		const fetcherꓺglobalPseudoFetchMock = vi.spyOn(fetcher.global, 'pseudoFetch');

		expect(globalFetchMock).toHaveBeenCalledTimes(0);
		expect(fetcherꓺfetchMock).toHaveBeenCalledTimes(0);
		expect(fetcherꓺglobalPseudoFetchMock).toHaveBeenCalledTimes(0);

		expect(vi.isMockFunction(globalThis.fetch)).toBe(true);
		expect(vi.isMockFunction(fetcher.fetch)).toBe(true);
		expect(vi.isMockFunction(fetcher.global.pseudoFetch)).toBe(true);

		// Enables fetcher; i.e., replacing native fetch.

		fetcher.replaceNativeFetch();
		await globalThis.fetch('http://x.tld/');

		expect(globalFetchMock).toHaveBeenCalledTimes(1);
		expect(fetcherꓺfetchMock).toHaveBeenCalledTimes(1);
		expect(fetcherꓺglobalPseudoFetchMock).toHaveBeenCalledTimes(1);

		expect(vi.isMockFunction(globalThis.fetch)).toBe(true);
		expect(vi.isMockFunction(fetcher.fetch)).toBe(true);
		expect(vi.isMockFunction(fetcher.global.pseudoFetch)).toBe(true);

		// Restores native fetch; i.e., reversing previous.

		fetcher.restoreNativeFetch();
		await globalThis.fetch('http://x.tld/');

		expect(globalFetchMock).toHaveBeenCalledTimes(2);
		expect(fetcherꓺfetchMock).toHaveBeenCalledTimes(1);
		expect(fetcherꓺglobalPseudoFetchMock).toHaveBeenCalledTimes(1);

		expect(vi.isMockFunction(globalThis.fetch)).toBe(true);
		expect(vi.isMockFunction(fetcher.fetch)).toBe(true);
		expect(vi.isMockFunction(fetcher.global.pseudoFetch)).toBe(true);

		// Restores `globalThis.fetch()`.

		vi.unstubAllGlobals();
		fetcherꓺfetchMock.mockRestore();
		fetcherꓺglobalPseudoFetchMock.mockRestore();

		expect(vi.isMockFunction(globalThis.fetch)).toBe(false);
		expect(vi.isMockFunction(fetcher.fetch)).toBe(false);
		expect(vi.isMockFunction(fetcher.global.pseudoFetch)).toBe(false);
	});
	test('.globalToScriptCode()', async () => {
		const fetcher1 = new Fetcher();
		expect(fetcher1.globalToScriptCode()).toBe("globalThis['"+$app.pkgName+"'] = globalThis['"+$app.pkgName+"'] || {}; globalThis['"+$app.pkgName+"']['fetcher'] = globalThis['"+$app.pkgName+"']['fetcher'] || {}; globalThis['"+$app.pkgName+"']['fetcher'].cache = {};",); // prettier-ignore

		const fetcher2 = new Fetcher({ globalObp: 'foo' });
		expect(fetcher2.globalToScriptCode()).toBe("globalThis['foo'] = globalThis['foo'] || {}; globalThis['foo'].cache = {};");

		const fetcher3 = new Fetcher({ globalObp: "foo's" });
		expect(fetcher3.globalToScriptCode()).toBe("globalThis['foo\\'s'] = globalThis['foo\\'s'] || {}; globalThis['foo\\'s'].cache = {};");

		const fetcher4 = new Fetcher({ globalObp: 'foo.fetcher' });
		expect(fetcher4.globalToScriptCode()).toBe("globalThis['foo'] = globalThis['foo'] || {}; globalThis['foo']['fetcher'] = globalThis['foo']['fetcher'] || {}; globalThis['foo']['fetcher'].cache = {};"); // prettier-ignore
	});
});