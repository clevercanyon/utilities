/**
 * Preact API.
 */

import { hydrate as $preactISOꓺhydrate, prerender as $preactISOꓺprerender } from '@clevercanyon/preact-iso.fork';
import { render as preactꓺrender } from 'preact';
import { pkgName as $appꓺpkgName } from '../../app.ts';
import type { FetcherInterface as $classꓺFetcherInterface } from '../../class.ts';
import { getFetcher as $classꓺgetFetcher } from '../../class.ts';
import { get as $envꓺget, isTest as $envꓺisTest, isWeb as $envꓺisWeb } from '../../env.ts';
import type { $type } from '../../index.ts';
import { $preact } from '../../index.ts';
import { mergeDeep as $objꓺmergeDeep } from '../../obj.ts';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.ts';
import type { HTTPState as $preactꓺcomponentsꓺdataꓺHTTPState } from '../components/data.tsx';
import { useHTTP as $preactꓺcomponentsꓺdataꓺuseHTTP } from '../components/data.tsx';
import type { RouteContextAsProps as $preactꓺcomponentsꓺrouterꓺRouteContextAsProps, Props as $preactꓺcomponentsꓺrouterꓺRouterProps } from '../components/router.tsx';
import { default as $preactꓺcomponentsꓺRouter, Route as $preactꓺcomponentsꓺrouterꓺRoute, lazyRoute as $preactꓺcomponentsꓺrouterꓺlazyRoute } from '../components/router.tsx';
import { StandAlone as $preactꓺroutesꓺ404ꓺStandAlone } from '../routes/404.tsx';
import { renderToString as $preactꓺapisꓺssrꓺrenderToString } from './ssr.tsx';

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
	docType: string;
	html: string;
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
			// autoReplaceNativeFetch: true,
			globalObp: $strꓺobpPartSafe($appꓺpkgName) + '.preactISOFetcher',
		});
	} // Replace each time, ensuring consistency.
	fetcher.replaceNativeFetch(); // Replaces native fetch.

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
 * @note Prerendering on web is technically doable, but we discourage use outside testing.
 */
export const prerenderSPA = async (opts: PrerenderSPAOptions): Promise<PrerenderSPAReturnProps> => {
	if ($envꓺisWeb() && !$envꓺisTest()) {
		throw new Error('Is web, not test.');
	}
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
	const html = !prerendered.html ? $preactꓺapisꓺssrꓺrenderToString(<$preactꓺroutesꓺ404ꓺStandAlone classes={'default-prerender'} />) : prerendered.html;
	const linkURLs = [...prerendered.links]; // Converts link URLs into array.

	return { httpState, docType: '<!DOCTYPE html>', html, linkURLs };
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

/**
 * Produces a lazy component.
 *
 * @param   asyncComponent Async component to be lazy loaded by ISO prerenderer.
 *
 * @returns                Preact component that will be lazy loaded by ISO prerenderer.
 */
export const lazyComponent = <P extends $preact.Props = $preact.Props>(asyncComponent: $preact.AsyncComponent<P>): $preact.Component<P> => {
	const higherOrder = { props: {} as P }; // Contains async component props, set by reference.
	type RouteContextAsProps = $preactꓺcomponentsꓺrouterꓺRouteContextAsProps; // Shorter type alias.

	const LazyHigherOrderComponent = $preactꓺcomponentsꓺrouterꓺlazyRoute(async (): Promise<$preact.Component<RouteContextAsProps>> => {
		const renderedAsyncComponentVNode = await asyncComponent(higherOrder.props);
		return (unusedꓺprops: RouteContextAsProps) => renderedAsyncComponentVNode;
	});
	return (props: Parameters<$preact.AsyncComponent<P>>[0]): Awaited<ReturnType<$preact.AsyncComponent<P>>> => {
		higherOrder.props = props; // Populates async component props.
		return (
			<$preactꓺcomponentsꓺRouter>
				<$preactꓺcomponentsꓺrouterꓺRoute default component={LazyHigherOrderComponent} />
			</$preactꓺcomponentsꓺRouter>
		);
	};
};
