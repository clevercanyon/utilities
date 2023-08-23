/**
 * Preact API.
 */

import { pkgName as $appꓺpkgName } from '../../app.js';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import { getClass as $fetcherꓺgetClass } from '../../resources/classes/fetcher.js';
import type { Interface as $fetcherꓺInterface } from '../../resources/classes/fetcher.js';

/**
 * Singleton fetcher class instance.
 */
let fetcher: $fetcherꓺInterface | undefined;

/**
 * Exports fetcher type.
 */
export type { $fetcherꓺInterface as Fetcher };

/**
 * Exports preact ISO utilities.
 */
export * from '@clevercanyon/preact-iso.fork';
export type { LocationProps, LocationContext, RouterProps, RouteProps, RouteContext } from '@clevercanyon/preact-iso.fork/router';

/**
 * Replaces native fetch and returns fetcher instance.
 *
 * @returns {@see $fetcherꓺInterface} Instance.
 */
export const replaceNativeFetch = (): $fetcherꓺInterface => {
	if (!fetcher) {
		const Class = $fetcherꓺgetClass();

		fetcher = new Class({
			autoReplaceNativeFetch: true,
			globalObp: $strꓺobpPartSafe($appꓺpkgName) + '.preactFetcher',
		});
	}
	return fetcher; // Fetcher class instance.
};
