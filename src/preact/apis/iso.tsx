/**
 * Preact API.
 */

import * as $preact from '../../preact.js';
import type * as $type from '../../type.js';
import { render as preactꓺrender } from 'preact';
import { pkgName as $appꓺpkgName } from '../../app.js';
import { mergeDeep as $objꓺmergeDeep } from '../../obj.js';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import { get as $envꓺget, isWeb as $envꓺisWeb } from '../../env.js';
import { renderToString as $preactꓺapisꓺssrꓺrenderToString } from './ssr.js';
import { StandAlone as $preactꓺroutesꓺ404ꓺStandAlone } from '../routes/404.js';
import { useHTTP as $preactꓺcomponentsꓺdataꓺuseHTTP } from '../components/data.js';
import type { HTTPState as $preactꓺcomponentsꓺdataꓺHTTPState } from '../components/data.js';
import type { Props as $preactꓺcomponentsꓺrouterꓺRouterProps } from '../components/router.js';
import { getFetcher as $classꓺgetFetcher, FetcherInterface as $classꓺFetcherInterface } from '../../class.js';
import { hydrate as $preactISOꓺhydrate, prerender as $preactISOꓺprerender } from '@clevercanyon/preact-iso.fork';

/**
 * Defines types.
 */
export type { $classꓺFetcherInterface as Fetcher };

export type PrerenderSPAOptions = {
	request: Request | $type.cf.Request;
	appManifest: { 'index.html': { css: string[]; file: string } };
	App: $preact.Component<$preactꓺcomponentsꓺrouterꓺRouterProps>;
	props?: Omit<$preactꓺcomponentsꓺrouterꓺRouterProps, 'url' | 'fetcher'>;
};
export type PrerenderSPAReturnProps = {
	httpState: $preactꓺcomponentsꓺdataꓺHTTPState;
	doctypeHTML: string;
	linkURLs: string[];
};
export type HydrativelyRenderSPAOptions = {
	App: $preact.Component<$preactꓺcomponentsꓺrouterꓺRouterProps>;
	props?: Omit<$preactꓺcomponentsꓺrouterꓺRouterProps, 'url' | 'fetcher'>;
};

/**
 * Fetcher instance.
 */
let fetcher: $classꓺFetcherInterface | undefined;

/**
 * Replaces native fetch and returns fetcher instance.
 *
 * @returns {@see $classꓺFetcherInterface} Instance.
 */
export const replaceNativeFetch = (): $classꓺFetcherInterface => {
	if (!fetcher) {
		const Fetcher = $classꓺgetFetcher();

		fetcher = new Fetcher({
			autoReplaceNativeFetch: true,
			globalObp: $strꓺobpPartSafe($appꓺpkgName) + '.preactISOFetcher',
		});
	}
	return fetcher; // Fetcher class instance.
};
export { replaceNativeFetch as getFetcher }; // Exports friendly alias.

/**
 * Prerenders SPA component on server-side.
 *
 * @param   opts Options; {@see PrerenderSPAOptions}.
 *
 * @returns      Prerendered SPA object properties; {@see PrerenderSPAReturnProps}.
 *
 * @note Server-side use only.
 */
export const prerenderSPA = async (opts: PrerenderSPAOptions): Promise<PrerenderSPAReturnProps> => {
	if ($envꓺisWeb()) throw new Error('Is web.');

	const { request, appManifest, App, props = {} } = opts;
	const { url } = request; // Extracts absolute URL from request.
	const appBasePath = String($envꓺget('@top', 'APP_BASE_PATH', ''));

	if (!appManifest['index.html']?.css?.[0]) {
		throw new Error('Missing `appManifest[index.html].css[0]`.');
	}
	if (!appManifest['index.html']?.file) {
		throw new Error('Missing `appManifest[index.html].file`.');
	}
	const mainStyleBundle = appBasePath + '/' + appManifest['index.html'].css[0];
	const mainScriptBundle = appBasePath + '/' + appManifest['index.html'].file;

	const fetcher = replaceNativeFetch(); // Replaces native fetch.

	const prerendered = await $preactISOꓺprerender(App, {
		props: {
			...props, // Props given by options.
			url, // Absolute URL extracted from request.
			fetcher, // Preact ISO fetcher; {@see replaceNativeFetch()}.
			head: $objꓺmergeDeep({ mainStyleBundle, mainScriptBundle }, props.head),
		},
	});
	fetcher.restoreNativeFetch(); // Restores native fetch on prerender completion.

	const { state: httpState } = !prerendered.html ? { state: { status: 404 } } : $preactꓺcomponentsꓺdataꓺuseHTTP();
	const doctypeHTML = '<!DOCTYPE html>' + (!prerendered.html ? $preactꓺapisꓺssrꓺrenderToString(<$preactꓺroutesꓺ404ꓺStandAlone />) : prerendered.html);
	const linkURLs = [...prerendered.links]; // Converts link URLs into array.

	return { httpState, doctypeHTML, linkURLs };
};

/**
 * Hydratively renders SPA component on client-side.
 *
 * @param opts Options; {@see HydrativelyRenderSPAOptions}.
 *
 * @note Client-side use only.
 */
export const hydrativelyRenderSPA = (opts: HydrativelyRenderSPAOptions): void => {
	if (!$envꓺisWeb()) throw new Error('Not web.');

	const { App, props = {} } = opts; // Extracts as local variables.
	const fetcher = replaceNativeFetch(); // Replaces native fetch.

	if (document.querySelector('html[data-preact-iso]')) {
		$preactISOꓺhydrate(<App {...{ ...props, fetcher }} />, document);
	} else {
		preactꓺrender(<App {...{ ...props, fetcher }} />, document);
	}
};
