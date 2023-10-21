/**
 * Preact API.
 */

import { $app, $class, $env, $is, $obj, $obp, $path, $preact, $str, $to, $url, type $type } from '../../../index.ts';
import { defaultGlobalObp, type GlobalState } from '../../../preact/components/data.tsx';
import { type Props as RootProps } from '../../../preact/components/root.tsx';
import { default as prerender } from './iso/prerender.tsx';

/**
 * Defines types.
 */
export type Fetcher = $type.Fetcher;

export type PrerenderSPAOptions = {
    request: $type.Request;
    appManifest: AppManifest;
    App: $preact.AnyComponent<RootProps>;
    props?: RootProps;
};
export type PrerenderSPAReturnProps = {
    httpState: GlobalState['http'];
    docType: string;
    html: string;
};
export type HydrativelyRenderSPAOptions = {
    App: $preact.AnyComponent<RootProps>;
    props?: RootProps;
};
export type AppManifest = { [x: $type.ObjectKey]: $type.Object };

/**
 * Fetcher instance.
 */
let fetcher: $type.Fetcher | undefined;

/**
 * Replaces native fetch and returns fetcher.
 *
 * @returns {@see $type.Fetcher} Instance.
 */
export const replaceNativeFetch = (): $type.Fetcher => {
    if (!fetcher) {
        const Fetcher = $class.getFetcher();
        fetcher = new Fetcher({ globalObp: $str.obpPartSafe($app.pkgName) + '.preactISOFetcher' });
    }
    fetcher.replaceNativeFetch();
    return fetcher; // {@see $type.Fetcher}.
};

/**
 * Prerenders SPA component on server-side.
 *
 * @param   options Options; {@see PrerenderSPAOptions}.
 *
 * @returns         Prerendered SPA object properties; {@see PrerenderSPAReturnProps}.
 *
 * @note Server-side use only, with an exception for automated testing.
 * @note Prerendering on web is technically doable, but we discourage use outside testing.
 */
export const prerenderSPA = async (options: PrerenderSPAOptions): Promise<PrerenderSPAReturnProps> => {
    if ($env.isWeb() && !$env.isTest()) {
        throw $env.errServerSideOnly;
    }
    const { request, appManifest, App, props = {} } = options;

    const url = props.url || request.url;
    const baseURL = props.baseURL || $url.appBase();

    const globalObp = props.globalObp || defaultGlobalObp();
    const fetcher = props.fetcher || replaceNativeFetch();

    let appManifestStyleBundleSubpath: string = ''; // Style bundle.
    let appManifestScriptBundleSubpath: string = ''; // Script bundle.

    for (const htmlExt of $path.canonicalExtVariants('html')) {
        const htmlEntry = appManifest['index.' + htmlExt]; // Possibly undefined.
        if ($is.array(htmlEntry?.css) && $is.string(htmlEntry?.css?.[0]) && $is.string(htmlEntry?.file)) {
            appManifestStyleBundleSubpath = $str.lTrim((htmlEntry.css as string[])[0], './');
            appManifestScriptBundleSubpath = $str.lTrim(htmlEntry.file, './');
            break; // We can stop here.
        }
    } // Now let’s confirm we found the bundle files.
    if (!appManifestStyleBundleSubpath) throw new Error('Missing `appManifest[index.html].css[0]`.');
    if (!appManifestScriptBundleSubpath) throw new Error('Missing `appManifest[index.html].file`.');

    const mainStyleBundle = './' + appManifestStyleBundleSubpath;
    const mainScriptBundle = './' + appManifestScriptBundleSubpath;

    const appProps = {
        ...props, // Option props.

        // `<Location>` props.
        url, // Absolute URL extracted from request.
        baseURL, // Base URL from app environment vars.

        // `<Data>` props.
        globalObp, // Global object path.
        fetcher, // Preact ISO fetcher; {@see replaceNativeFetch()}.
        head: $obj.mergeDeep({ mainStyleBundle, mainScriptBundle }, props.head),
    };
    const prerenderedData = await prerender(App, { props: appProps });
    fetcher.restoreNativeFetch(); // Restore to avoid conflicts.

    let html = prerenderedData.html; // Prerendered HTML markup.
    let httpState = $obp.get(globalThis, globalObp + '.http') as GlobalState['http'];

    if (!html /* 404 error when render is empty. */) {
        httpState = { ...httpState, status: 404 };
        $obp.set(globalThis, globalObp + '.http', httpState);

        const Error404StandAlone = (await import('../../../preact/components/404.tsx')).StandAlone;
        html = $preact.ssr.renderToString(<Error404StandAlone class='default-prerender' />);
    }
    return { httpState, docType: '<!doctype html>', html };
};

/**
 * Hydratively renders SPA component on client-side.
 *
 * @param options Options; {@see HydrativelyRenderSPAOptions}.
 *
 * @note This is strictly for client-side use only. No exceptions.
 *       Local testing using jsDOM is fine, since that `$env.isWeb()`.
 */
export const hydrativelyRenderSPA = (options: HydrativelyRenderSPAOptions): void => {
    if (!$env.isWeb() /* Web browser required; uses DOM. */) {
        throw $env.errClientSideOnly; // Not possible.
    }
    const { App, props = {} } = options;
    const doc: Document = document; // Shorter alias.

    /**
     * This creates a virtual document node, because we need to be able to replace the existing `<html>` node when
     * location state changes. Without a virtual document node, `insertBefore()` will crash, because there can only be a
     * single child node in our actual `document`. Inspired by root fragment; {@see https://o5p.me/aMHdC2}.
     *
     * Also, using a virtual node obviates the need to remove other child nodes in the document, such as the doctype
     * node, or comment nodes. Preact explicitly references `firstChild`; {@see https://o5p.me/8d6YM5}. Without a
     * virtual document node, we’d have to remove doctype/comment nodes, such that `firstChild` would be correct,
     * otherwise Preact will crash. Removing doctype is not ideal, so this is much better.
     *
     * @note We only need to supply the properties/methods that Preact needs.
     *       According to the author, this is more than adequate; {@see https://o5p.me/eCCIoa}.
     */
    const virtualDoc = (() => {
        const vDoc = {
            parentNode: null,
            parentElement: null,
            nodeType: Node.DOCUMENT_NODE,

            firstChild: null as HTMLHtmlElement | null,
            lastChild: null as HTMLHtmlElement | null,
            childNodes: [] as HTMLHtmlElement[],

            nextSibling: null, // No siblings.
            previousSibling: null, // No siblings.

            ᨀhtml(): HTMLHtmlElement | null {
                return doc.querySelector('html');
            },
            ᨀupdateProps(): true {
                this.firstChild = this.ᨀhtml();
                this.lastChild = this.firstChild;
                this.childNodes = $to.array(this.firstChild);
                return true; // Always; no exceptions.
            },
            ᨀreplaceOrAppendChild(child: HTMLHtmlElement): true {
                if (this.firstChild /* <html> */) {
                    doc.replaceChild(child, this.firstChild);
                } else doc.appendChild(child);
                return this.ᨀupdateProps();
            },
            appendChild(child: HTMLHtmlElement): HTMLHtmlElement {
                return this.ᨀreplaceOrAppendChild(child) && child;
            },
            insertBefore(newNode: HTMLHtmlElement): HTMLHtmlElement {
                return this.ᨀreplaceOrAppendChild(newNode) && newNode;
            },
            replaceChild(newChild: HTMLHtmlElement, oldChild: HTMLHtmlElement): HTMLHtmlElement {
                return this.ᨀreplaceOrAppendChild(newChild) && oldChild;
            },
            removeChild(child: HTMLHtmlElement): HTMLHtmlElement {
                return doc.removeChild(child) && this.ᨀupdateProps() && child;
            },
        };
        vDoc.ᨀupdateProps(); // Initialize.

        // Note: `__k` is `_children` in Preact bundle.
        // {@see https://o5p.me/1mZOFk} map in mangle.json.
        return ((doc as unknown as $type.Object).__k = vDoc);
    })() as unknown as Document;

    /**
     * Hydrates when applicable; else renders.
     */
    if (doc.querySelector('html.preact') /* Our preact HTML component rendered the HTML tag? */) {
        $preact.hydrate(<App {...props} />, virtualDoc);
    } else {
        $preact.render(<App {...props} />, virtualDoc);
    }

    /**
     * Regarding `<App>` props from server-side prerender.
     *
     * `<Location>` props.
     *
     * - `url`: It’s either already in props, or auto-detected in a web browser, so no need to populate here.
     * - `baseURL`: It’s either already in props, or auto-detected in a web browser, so no need to populate here. e.g.,
     *   using `<base href>` already inserted by `<Head>` server-side.
     *
     * `<Data>` props.
     *
     * - `globalObp`: It’s either already in props, or `<Data>` will use default, so no need to populate here.
     * - `fetcher`: It’s either already in props, or `<Data>` will use default, so no need to populate here.
     * - `head`: What isn’t already in props will already be in global script code; e.g., `mainStyleBundle`,
     *   `mainScriptBundle`, so no need to populate here.
     */
};
