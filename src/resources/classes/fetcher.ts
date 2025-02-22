/**
 * Fetcher utility class.
 */

import { $app, $class, $env, $http, $json, $mime, $obp, $str, type $type } from '#index.ts';

/**
 * Constructor cache.
 */
let Fetcher: Constructor;

/**
 * Defines types.
 */
export type C9rProps = {
    globalObp?: $type.ObjectPath;
    cfw?: $type.$cfw.RequestContextData;
};
export type Constructor = {
    new (props?: C9rProps | Class): Class;
};
export type Class = $type.Utility & ClassInterface;

declare class ClassInterface {
    public readonly globalObp: $type.ObjectPath;
    public readonly cfw: $type.$cfw.RequestContextData | undefined;

    public readonly global: Global;
    public readonly fetch: $type.fetch;

    public constructor(props?: C9rProps | Class);
    public globalToScriptCode(): string;
}
export type Global = $type.Object<{
    cache: { [x: string]: GlobalCacheEntry };
}>;
export type GlobalCacheEntry = {
    body: string;
    init: {
        status: number;
        statusText: string;
        headers: { [x: string]: string };
    };
};

/**
 * Defines tokens.
 *
 * Why are there so many crazy variables used here? The intention is to optimize for minification. i.e., By using as
 * many variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome.
 * Remember, variable names can be minified, so the length of variable names is not an issue.
 */
const tꓺapplicationⳇ = 'application/',
    tꓺimageⳇ = 'image/',
    tꓺjson = 'json',
    tꓺplain = 'plain',
    tꓺsvg = 'svg',
    tꓺtextⳇ = 'text/',
    tꓺxml = 'xml';

/**
 * Defines cachedable response types.
 */
const cacheableResponseTypes = [
    tꓺtextⳇ + tꓺplain,
    tꓺapplicationⳇ + tꓺjson,
    tꓺapplicationⳇ + 'ld+' + tꓺjson,
    tꓺimageⳇ + tꓺsvg + '+' + tꓺxml,
    tꓺapplicationⳇ + tꓺxml,
    tꓺtextⳇ + tꓺxml,
];

/**
 * Fetcher class factory.
 *
 * @returns Class constructor.
 */
export const getClass = (): Constructor => {
    if (Fetcher) return Fetcher;

    Fetcher = class extends $class.getUtility() implements Class {
        /**
         * Global object path.
         */
        public readonly globalObp: $type.ObjectPath;

        /**
         * Cloudflare worker request context data.
         */
        public readonly cfw: $type.$cfw.RequestContextData | undefined;

        /**
         * Global via `globalObp`.
         */
        public readonly global: Global;

        /**
         * Public fetch interface.
         */
        public readonly fetch: $type.fetch;

        /**
         * Object constructor.
         *
         * @param props Props or instance.
         */
        public constructor(props?: C9rProps | Class) {
            super(); // Parent constructor.
            props = props || {}; // Object value.

            this.globalObp = props.globalObp || $str.obpPartSafe($app.$pkgName) + '.fetcher';
            this.cfw = props.cfw; // Cloudflare worker request context data.

            if ($env.isSSR()) {
                // Write to cache server-side.
                this.global = { cache: {} } as Global;
            } else {
                // Read from cache client-side.
                this.global = $obp.get(globalThis, this.globalObp, {}) as Global;
                this.global.cache = this.global.cache || {};
            }
            this.fetch = ((...args: Parameters<$type.fetch>) => this.fetcher(...args)) as $type.fetch;
        }

        /**
         * Converts global into embeddable script code.
         *
         * @returns Global as embeddable script code; i.e., for SSR.
         */
        public globalToScriptCode(): string {
            const globalObpScriptCode = $obp.toScriptCode(this.globalObp);

            let scriptCode = globalObpScriptCode.init; // Initialize.
            scriptCode += ' ' + globalObpScriptCode.set + ' = ' + $json.stringify({ cache: this.global.cache }) + ';';

            return scriptCode;
        }

        /**
         * Wraps global native {@see fetch()}.
         *
         * @param   args Same as global native {@see fetch()}.
         *
         * @returns      Same as global native {@see fetch()}. However, this will only return a `content-type` header
         *   when a request is either read from, or written to, a cache entry. In such a case, we discard all other
         *   headers. Otherwise, for requests not read from or written to a cache entry, this returns all headers.
         */
        protected async fetcher(...args: Parameters<$type.fetch>): Promise<Awaited<ReturnType<$type.fetch>>> {
            const request = new Request(...(args as [RequestInfo | URL, RequestInit | undefined])),
                fetch = (this.cfw ? this.cfw.fetch : globalThis.fetch) as typeof globalThis.fetch;

            if (!$http.requestTypeIsCacheable(request)) return fetch(request);

            const cacheKey = await $http.requestHash(request);

            if (Object.hasOwn(this.global.cache, cacheKey)) {
                const globalCacheEntry = this.global.cache[cacheKey];
                return new Response(globalCacheEntry.body, globalCacheEntry.init);
            }
            if ($env.isWeb()) return fetch(request); // No cache writes client-side.

            const response = await fetch(request),
                responseContentType = response.headers.get('content-type') || '',
                responseCleanContentType = $mime.typeClean(responseContentType);

            if (!cacheableResponseTypes.includes(responseCleanContentType)) {
                return response; // Don't cache types not in list above.
            }
            const globalCacheEntry: GlobalCacheEntry = {
                body: await response.text(),
                init: {
                    status: response.status,
                    statusText: response.statusText,
                    headers: { 'content-type': responseContentType },
                },
            };
            this.global.cache[cacheKey] = globalCacheEntry;
            return new Response(globalCacheEntry.body, globalCacheEntry.init);
        }
    };
    return Object.defineProperty(Fetcher, 'name', {
        ...Object.getOwnPropertyDescriptor(Fetcher, 'name'),
        value: 'Fetcher',
    });
};
