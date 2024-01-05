/**
 * Fetcher utility class.
 */

import { $app, $class, $crypto, $env, $json, $obp, $str, type $type } from '#index.ts';

/**
 * Constructor cache.
 */
let Fetcher: Constructor;

/**
 * Defines types.
 */
export type C9rProps = {
    globalObp?: $type.ObjectPath;
};
export type Constructor = {
    new (props?: C9rProps | Class): Class;
};
export type Class = $type.Utility & ClassInterface;

declare class ClassInterface {
    public readonly globalObp: $type.ObjectPath;
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
 * Defines cachedable response content MIME types.
 */
const cacheableResponseContentMIMETypes = [
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
         * Global object; i.e., via object path.
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

            props = props || {}; // Force object value.
            this.globalObp = props.globalObp || $str.obpPartSafe($app.$pkgName) + '.fetcher';

            if ($env.isSSR()) {
                // Write to cache server-side.
                this.global = { cache: {} } as Global;
            } else {
                // Read from cache client-side.
                this.global = $obp.get(globalThis, this.globalObp, {}) as Global;
                this.global.cache = this.global.cache || {};
            }
            this.fetch = ((...args: Parameters<typeof fetch>) => this.fetcher(...args)) as $type.fetch;
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
         * Checks if request is cacheable.
         *
         * @param   requestInit Request init properties.
         *
         * @returns             True if request is cacheable.
         */
        protected isCacheableRequest(requestInit?: RequestInit): boolean {
            return (
                ['HEAD', 'GET'].includes((requestInit?.method || 'GET').toUpperCase()) &&
                !['no-store', 'no-cache', 'reload'].includes((requestInit?.cache || 'default').toLowerCase())
            );
        }

        /**
         * Wraps native {@see fetch()}.
         *
         * @param   args              {@see fetch()}.
         *
         * @returns {@see fetch()}      Same as native fetch.
         */
        protected async fetcher(...args: Parameters<typeof fetch>): ReturnType<typeof fetch> {
            if (!this.isCacheableRequest(args[1])) {
                return fetch(...args); // Uses native fetch.
            }
            const cacheKey = await $crypto.sha1($json.stringify(args));

            if (Object.hasOwn(this.global.cache, cacheKey)) {
                const globalCacheEntry = this.global.cache[cacheKey];
                return new Response(globalCacheEntry.body, globalCacheEntry.init);
            }
            if ($env.isWeb()) return fetch(...args); // No cache writes client-side.

            const response = await fetch(...args); // Uses native fetch.
            const responseContentType = (response.headers.get('content-type') || '').toLowerCase();
            const responseContentMIMEType = responseContentType.split(';')[0]; // Removes a possible `; charset=*`.

            if (!cacheableResponseContentMIMETypes.includes(responseContentMIMEType)) {
                return response; // Don't cache MIME types not in list above.
            }
            const globalCacheEntry: GlobalCacheEntry = {
                body: await response.text(),
                init: {
                    status: response.status,
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
