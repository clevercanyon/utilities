/**
 * Preact API.
 */

import { getClass as $fetcherꓺgetClass } from '../../resources/classes/fetcher.js';
import type { Interface as $fetcherꓺInterface } from '../../resources/classes/fetcher.js';

let fetcherInitialized: boolean = false; // Once only.
let fetcher: $fetcherꓺInterface; // Fetcher class instance.

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
 * Initializes {@see $fetcherꓺInterface} instance.
 */
export const initializeFetcher = (): void => {
	if (fetcherInitialized) return;
	fetcherInitialized = true;

	const Class = $fetcherꓺgetClass();
	fetcher = new Class({ autoReplaceNativeFetch: true });
};

/**
 * Replaces native fetch and returns fetcher instance.
 *
 * @returns {@see $fetcherꓺInterface} Instance.
 */
export const replaceNativeFetch = (): $fetcherꓺInterface => {
	if (!fetcherInitialized) initializeFetcher();
	return fetcher; // Fetcher class instance.
};
