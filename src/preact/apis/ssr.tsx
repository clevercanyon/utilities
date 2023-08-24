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
export type PrerenderAppToStringOptions = {
	request: Request | cfw.Request;
	appManifest: { 'index.html': { css: string[]; file: string } };
	App: $preact.Component<$preact.Props<RouterProps>>;
};

/**
 * Exports render-to-string utility.
 */
export { default as renderToString } from 'preact-render-to-string';

/**
 * Prerenders app component on server-side, to a string.
 *
 * @param   opts Prerender options.
 *
 * @returns      Prerendered app component, as a string.
 */
export const prerenderAppToString = async (opts: PrerenderAppToStringOptions): Promise<string> => {
	// Defines current absolute full URL.
	const url = opts.request?.url || '';

	// Locates app's base URL, for use below.
	const appBaseURL = $envꓺget('@top', 'APP_BASE_URL', '') as string;

	// Defines main style bundle as absolute full URL.
	let mainStyleBundle = (opts.appManifest['index.html']?.css || [])[0] || '';
	mainStyleBundle = mainStyleBundle ? appBaseURL + '/' + mainStyleBundle : '';

	// Defines main script bundle as absolute full URL.
	let mainScriptBundle = opts.appManifest['index.html']?.file || '';
	mainScriptBundle = mainScriptBundle ? appBaseURL + '/' + mainScriptBundle : '';

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
