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
    readonly globalObp?: $type.ObjectPath;
    readonly autoReplaceNativeFetch?: boolean;
};
export type Constructor = {
    new (props?: C9rProps | Class): Class;
};
export type Class = $type.Utility & ClassInterface;

declare class ClassInterface {
    public readonly global: Global;
    public readonly globalObp: $type.ObjectPath;
    public readonly autoReplaceNativeFetch: boolean;

    public constructor(props?: C9rProps | Class);

    public replaceNativeFetch(): Class;
    public restoreNativeFetch(): void;
    public globalToScriptCode(): string;

    public fetch(...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']>;
}
export type Global = $type.Object<{
    cache: { [x: string]: GlobalCacheEntry };
    nativeFetch: (...args: Parameters<$type.fetch>) => ReturnType<$type.fetch>;
    boundNativeFetch: (...args: Parameters<$type.fetch>) => ReturnType<$type.fetch>;
    pseudoFetch: (...args: Parameters<$type.fetch>) => Promise<$type.Response>;
}>;
export type GlobalCacheEntry = {
    body: string;
    options: {
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
         * Global object.
         */
        public readonly global: Global;

        /**
         * Global object path.
         */
        public readonly globalObp: $type.ObjectPath;

        /**
         * Auto-replace native fetch?
         */
        public readonly autoReplaceNativeFetch: boolean;

        /**
         * Object constructor.
         *
         * @param props Props or instance.
         */
        public constructor(props?: C9rProps | Class) {
            super(); // Parent constructor.

            props = props || {}; // Force object value.
            const isClone = props instanceof Fetcher;

            this.globalObp = props.globalObp || $str.obpPartSafe($app.$pkgName) + '.fetcher';
            this.global = $obp.get(globalThis, this.globalObp, {}) as Global; // Default is `{}`.

            this.global.cache = this.global.cache || {};
            this.global.nativeFetch = globalThis.fetch as Global['nativeFetch'];
            this.global.boundNativeFetch = globalThis.fetch.bind(globalThis) as Global['nativeFetch'];
            this.global.pseudoFetch = async (...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']> => this.fetch(...args);

            this.autoReplaceNativeFetch = isClone ? false : props.autoReplaceNativeFetch || false;
            if (this.autoReplaceNativeFetch) this.replaceNativeFetch();
        }

        /**
         * Replaces native fetch.
         *
         * @returns Fetcher instance.
         */
        public replaceNativeFetch(): Class {
            globalThis.fetch = this.global.pseudoFetch as typeof fetch;
            return this; // Self-referential return.
        }

        /**
         * Restores native fetch.
         */
        public restoreNativeFetch(): void {
            globalThis.fetch = this.global.nativeFetch as typeof fetch;
            this.global.cache = {}; // Resets cache.
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
        protected isCacheableRequest(requestInit?: $type.RequestInit): boolean {
            return (
                ['HEAD', 'GET'].includes((requestInit?.method || 'GET').toUpperCase()) &&
                !['no-store', 'no-cache', 'reload'].includes((requestInit?.cache || 'default').toLowerCase())
            );
        }

        /**
         * Used to wrap native {@see fetch()} in JS.
         *
         * @param   args Same as {@see fetch()} native function.
         *
         * @returns      Same as {@see fetch()} native function.
         */
        public async fetch(...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']> {
            if (!this.isCacheableRequest(args[1])) {
                return this.global.boundNativeFetch(...args);
            }
            const cacheKey = await $crypto.sha1($json.stringify(args));

            if (Object.hasOwn(this.global.cache, cacheKey)) {
                const globalCacheEntry = this.global.cache[cacheKey];
                return new Response(globalCacheEntry.body, globalCacheEntry.options);
            }
            if ($env.isWeb() /* No cache writes client-side. */) {
                return this.global.boundNativeFetch(...args);
            }
            const response = await this.global.boundNativeFetch(...args);
            const responseContentType = (response.headers.get('content-type') || '').toLowerCase();
            const responseContentMIMEType = responseContentType.split(';')[0]; // Removes a possible `; charset=*`.

            if (!cacheableResponseContentMIMETypes.includes(responseContentMIMEType)) {
                return response; // Don't cache MIME types not in list above.
            }
            const globalCacheEntry: GlobalCacheEntry = {
                body: await response.text(), // Body as plain text.
                options: { status: response.status, headers: { 'content-type': responseContentType } },
            };
            this.global.cache[cacheKey] = globalCacheEntry;
            return new Response(globalCacheEntry.body, globalCacheEntry.options);
        }
    };
    return Object.defineProperty(Fetcher, 'name', {
        ...Object.getOwnPropertyDescriptor(Fetcher, 'name'),
        value: 'Fetcher',
    });
};
