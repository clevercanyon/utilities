/**
 * Preact API.
 */

import * as $preactꓺiso from './iso.js';
import * as $preact from '../../preact.js';
import { get as $envꓺget } from '../../env.js';

import type * as cfw from '@cloudflare/workers-types/experimental';
import type { Props as RouterProps } from '../components/router.js';

/**
 * Defines types.
 */
export type PrerenderSPAToStringOptions = {
	request: Request | cfw.Request;
	appManifest: { 'index.html': { css: string[]; file: string } };
	App: $preact.Component<$preact.Props<RouterProps>>;
};

/**
 * Exports render-to-string utility.
 */
export { default as renderToString } from 'preact-render-to-string';

/**
 * Prerenders SPA component on server-side, to a string.
 *
 * @param   opts Prerender options.
 *
 * @returns      Prerendered SPA component, as a string.
 */
export const prerenderSPAToString = async (opts: PrerenderSPAToStringOptions): Promise<string> => {
	// Defines current absolute full URL.
	const url = opts.request.url; // From HTTP request.

	// Locates app's base URL, for use below.
	const appBaseURL = $envꓺget('@top', 'APP_BASE_URL', '') as string;

	// Defines main style bundle as absolute full URL.
	const mainStyleBundle = appBaseURL + '/' + opts.appManifest['index.html'].css[0];

	// Defines main script bundle as absolute full URL.
	const mainScriptBundle = appBaseURL + '/' + opts.appManifest['index.html'].file;

	// Replaces native fetch with ISO fetcher.
	const $preactꓺisoꓺfetcher = $preactꓺiso.replaceNativeFetch();

	// Renders app component tree.
	const str =
		'<!DOCTYPE html>' +
		(
			await $preactꓺiso.prerender(opts.App, {
				props: {
					url, // Must be an absolute full URL.
					html: { head: { mainStyleBundle, mainScriptBundle } },
					fetcher: $preactꓺisoꓺfetcher, // Preact ISO fetcher.
				},
			})
		).html; // As HTML markup.

	// Restores native fetch.
	$preactꓺisoꓺfetcher.restoreNativeFetch();

	return str; // As HTML markup for response body.
};
