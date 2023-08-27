/**
 * Preact API.
 */

import * as $preact from '../../preact.js';
import { render as preactꓺrender } from 'preact';

import { pkgName as $appꓺpkgName } from '../../app.js';
import { get as $envꓺget, isWeb as $envꓺisWeb } from '../../env.js';
import { parse as $urlꓺparse, tryParse as $urlꓺtryParse } from '../../url.js';
import { getClass as $fetcherꓺgetClass } from '../../resources/classes/fetcher.js';
import { rTrim as $strꓺrTrim, obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import { hydrate as preactꓺisoꓺhydrate, prerender as preactꓺisoꓺprerender } from '@clevercanyon/preact-iso.fork';

import type * as $type from '../../type.js';
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
	request: Request | $type.cfw.Request;
	appManifest: { 'index.html': { css: string[]; file: string } };
	App: $preact.Component<$preact.Props<RouterProps>>;
};
export type HydrativelyRenderSPAOptions = {
	App: $preact.Component<$preact.Props<RouterProps>>;
};

/**
 * Exports preact ISO utilities.
 */
export { Location, ErrorBoundary, Router, Route, useLocation, useRoute, lazy } from '@clevercanyon/preact-iso.fork';
export type { LocationProps, LocationContext, RouterProps, RouteProps, RouteContext } from '@clevercanyon/preact-iso.fork/router';

/**
 * Replaces native fetch and returns fetcher instance.
 *
 * @returns {@see $fetcherꓺInterface} Instance.
 */
export const replaceNativeFetch = (): $fetcherꓺInterface => {
	if (!fetcher) {
		const Fetcher = $fetcherꓺgetClass();

		fetcher = new Fetcher({
			autoReplaceNativeFetch: true,
			globalObp: $strꓺobpPartSafe($appꓺpkgName) + '.preactISOFetcher',
		});
	}
	return fetcher; // Fetcher class instance.
};

/**
 * Prerenders SPA component on server-side.
 *
 * @param   opts Prerender SPA options; {@see PrerenderSPAOptions}.
 *
 * @returns      Prerendered SPA component.
 *
 * @note Server-side use only.
 */
export const prerenderSPA = async (opts: PrerenderSPAOptions): Promise<string> => {
	if ($envꓺisWeb()) throw new Error('Is web.');

	const url = $urlꓺtryParse(opts.request.url);
	if (!url) throw new Error('Invalid request URL.');

	const appBaseURL = $urlꓺtryParse(String($envꓺget('@top', 'APP_BASE_URL', '')));
	if (!appBaseURL) throw new Error('Missing or invalid `APP_BASE_URL` environment variable.');
	const appBaseURLStr = $strꓺrTrim(appBaseURL.toString(), '/');

	const mainStyleBundle = $urlꓺparse(appBaseURLStr + '/' + opts.appManifest['index.html'].css[0]);
	const mainScriptBundle = $urlꓺparse(appBaseURLStr + '/' + opts.appManifest['index.html'].file);

	const $preactꓺisoꓺfetcher = replaceNativeFetch();
	const doctypeHTMLMarkup =
		'<!DOCTYPE html>' +
		((
			await preactꓺisoꓺprerender(opts.App, {
				props: {
					url, // Must be an absolute full URL.
					html: { head: { mainStyleBundle, mainScriptBundle } },
					fetcher: $preactꓺisoꓺfetcher, // Preact ISO fetcher.
				},
			})
		).html || ''); // HTML5 markup.
	$preactꓺisoꓺfetcher.restoreNativeFetch();

	return doctypeHTMLMarkup;
};

/**
 * Hydratively renders SPA component on client-side.
 *
 * @param opts Hydrative render SPA options; {@see HydrativelyRenderSPAOptions}.
 *
 * @note Client-side use only.
 */
export const hydrativelyRenderSPA = (opts: HydrativelyRenderSPAOptions): void => {
	if (!$envꓺisWeb()) throw new Error('Not web.');

	if (document.querySelector('html[data-preact-iso]')) {
		replaceNativeFetch(), preactꓺisoꓺhydrate(opts.App, document);
	} else {
		replaceNativeFetch(), preactꓺrender(opts.App, document);
	}
};
