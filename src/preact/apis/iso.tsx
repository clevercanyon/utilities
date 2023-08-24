/**
 * Preact API.
 */

import * as $preact from '../../preact.js';
import { get as $envꓺget } from '../../env.js';
import { pkgName as $appꓺpkgName } from '../../app.js';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import { getClass as $fetcherꓺgetClass } from '../../resources/classes/fetcher.js';
import { hydrate as preactꓺisoꓺhydrate, prerender as preactꓺisoꓺprerender } from '@clevercanyon/preact-iso.fork';

import type * as cfw from '@cloudflare/workers-types/experimental';
import type { Props as RouterProps } from '../components/router.js';
import type { Interface as $fetcherꓺInterface } from '../../resources/classes/fetcher.js';

/**
 * Contains fetcher.
 */
let fetcher: $fetcherꓺInterface | undefined;

/**
 * Defines types.
 */
export type { $fetcherꓺInterface as Fetcher };

export type PrerenderSPAOptions = {
	request: Request | cfw.Request;
	appManifest: { 'index.html': { css: string[]; file: string } };
	App: $preact.Component<$preact.Props<RouterProps>>;
};
export type HydrateSPAOptions = {
	App: $preact.Component<$preact.Props<RouterProps>>;
};

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

/**
 * Prerenders SPA component on server-side.
 *
 * @param   opts Prerender options.
 *
 * @returns      Prerendered SPA component.
 *
 * @note Server-side use only.
 */
export const prerenderSPA = async (opts: PrerenderSPAOptions): Promise<string> => {
	const url = opts.request.url; // From HTTP request data.
	const appBaseURL = $envꓺget('@top', 'APP_BASE_URL', '') as string;

	// Gathered from build manifest provided by Vite.
	const mainStyleBundle = appBaseURL + '/' + opts.appManifest['index.html'].css[0];
	const mainScriptBundle = appBaseURL + '/' + opts.appManifest['index.html'].file;

	const $preactꓺisoꓺfetcher = replaceNativeFetch();
	const doctypeHTMLMarkup =
		'<!DOCTYPE html>' +
		(
			await preactꓺisoꓺprerender(opts.App, {
				props: {
					url, // Must be an absolute full URL.
					html: { head: { mainStyleBundle, mainScriptBundle } },
					fetcher: $preactꓺisoꓺfetcher, // Preact ISO fetcher.
				},
			})
		).html; // HTML5 markup.
	$preactꓺisoꓺfetcher.restoreNativeFetch();

	return doctypeHTMLMarkup;
};

/**
 * Hydrates SPA component on client-side.
 *
 * @param opts Hydration options.
 *
 * @note Client-side use only.
 */
export const hydrateSPA = (opts: HydrateSPAOptions): void => {
	replaceNativeFetch(), preactꓺisoꓺhydrate(opts.App, document);
};
