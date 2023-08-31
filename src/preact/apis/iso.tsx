/**
 * Preact API.
 */

import * as $preact from '../../preact.js';
import type * as $type from '../../type.js';
import { render as preactꓺrender } from 'preact';
import { useHTTPStatus } from '../components/data.js';
import { pkgName as $appꓺpkgName } from '../../app.js';
import { mergeDeep as $objꓺmergeDeep } from '../../obj.js';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import { StandAlone as StandAlone404 } from '../routes/404.js';
import type { Props as RouterProps } from '../components/router.js';
import { get as $envꓺget, isWeb as $envꓺisWeb } from '../../env.js';
import { renderToString as $preactꓺssrꓺrenderToString } from './ssr.js';
import type { Interface as Fetcher } from '../../resources/classes/fetcher.js';
import { getClass as $fetcherꓺgetClass } from '../../resources/classes/fetcher.js';
import { hydrate as preactꓺisoꓺhydrate, prerender as preactꓺisoꓺprerender } from '@clevercanyon/preact-iso.fork';

/**
 * Fetcher instance.
 */
let fetcher: Fetcher | undefined;

/**
 * Defines types.
 */
export type { Fetcher };

export type PrerenderSPAOptions = {
	request: Request | $type.cfw.Request;
	appManifest: { 'index.html': { css: string[]; file: string } };
	App: $preact.Component<RouterProps>;
	props?: Omit<RouterProps, 'url' | 'fetcher'>;
};
export type PrerenderSPAReturnProps = {
	httpStatus: number;
	doctypeHTML: string;
	linkURLs: string[];
};
export type HydrativelyRenderSPAOptions = {
	App: $preact.Component<RouterProps>;
	props?: Omit<RouterProps, 'url' | 'fetcher'>;
};

/**
 * Replaces native fetch and returns fetcher instance.
 *
 * @returns {@see Fetcher} Instance.
 */
export const replaceNativeFetch = (): Fetcher => {
	if (!fetcher) {
		const $Fetcher = $fetcherꓺgetClass();

		fetcher = new $Fetcher({
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

	const prerendered = await preactꓺisoꓺprerender(App, {
		props: {
			...props, // Props given by options.
			url, // Absolute URL extracted from request.
			html: $objꓺmergeDeep({ head: { mainStyleBundle, mainScriptBundle } }, props.html),
			fetcher, // Preact ISO fetcher; {@see replaceNativeFetch()}.
		},
	});
	fetcher.restoreNativeFetch(); // Restores native fetch on prerender completion.

	const { state: httpStatus } = !prerendered.html ? { state: 404 } : useHTTPStatus();
	const doctypeHTML = '<!DOCTYPE html>' + (!prerendered.html ? $preactꓺssrꓺrenderToString(<StandAlone404 />) : prerendered.html);
	const linkURLs = [...prerendered.links]; // Converts link URLs into array.

	return { httpStatus, doctypeHTML, linkURLs };
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
		preactꓺisoꓺhydrate(<App {...{ ...props, fetcher }} />, document);
	} else {
		preactꓺrender(<App {...{ ...props, fetcher }} />, document);
	}
};
