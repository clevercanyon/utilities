/**
 * Fetcher utility class.
 */

import { $app, $class, $crypto, $env, $json, $obp, $str, type $type } from '../../index.ts';

let Defined: Constructor | undefined; // Cache.

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

    public replaceNativeFetch(): void;
    public restoreNativeFetch(): void;
    public globalToScriptCode(): string;

    public fetch(...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']>;
}
export type Global = $type.Object<{
    cache: { [x: string]: GlobalCacheEntry };
    nativeFetch: (...args: Parameters<$type.fetch>) => ReturnType<$type.fetch>;
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
 * Fetcher class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
    if (Defined) return Defined;

    Defined = class extends $class.getUtility() implements Class {
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
         * @param props Props or {@see Interface} instance.
         */
        public constructor(props?: C9rProps | Class) {
            super(); // Parent constructor.

            props = props || {}; // Force object value.
            const isClone = props instanceof (Defined as Constructor);

            this.globalObp = props.globalObp || $str.obpPartSafe($app.pkgName) + '.fetcher';
            this.global = $obp.get(globalThis, this.globalObp, {}) as Global; // Default is `{}`.

            this.global.cache = this.global.cache || {}; // Initializes cache when unavailable.
            this.global.nativeFetch = globalThis.fetch as Global['nativeFetch']; // Stores a reference to current native fetch.
            this.global.pseudoFetch = async (...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']> => this.fetch(...args);

            this.autoReplaceNativeFetch = isClone ? false : props.autoReplaceNativeFetch || false;

            if (this.autoReplaceNativeFetch) {
                this.replaceNativeFetch();
            }
        }

        /**
         * Replaces native fetch.
         */
        public replaceNativeFetch(): void {
            // Stores a reference to current native fetch.
            this.global.nativeFetch = globalThis.fetch as Global['nativeFetch'];

            // Replaces native fetch.
            globalThis.fetch = this.global.pseudoFetch as typeof fetch;
        }

        /**
         * Restores native fetch.
         */
        public restoreNativeFetch(): void {
            // Restores native fetch.
            globalThis.fetch = this.global.nativeFetch as typeof fetch;

            // Resets cache.
            this.global.cache = {};
        }

        /**
         * Converts global into embeddable script code.
         *
         * @returns Global as embeddable script code; i.e., for SSR.
         */
        public globalToScriptCode(): string {
            const globalObpScriptCode = $obp.toScriptCode(this.globalObp);

            let scriptCode = globalObpScriptCode.init; // Initialize.
            scriptCode += ' ' + globalObpScriptCode.set + '.cache = ' + $json.stringify(this.global.cache) + ';';

            return scriptCode;
        }

        /**
         * Used to wrap native {@see fetch()} in JS.
         *
         * @param   args Same as {@see fetch()} native function.
         *
         * @returns      Same as {@see fetch()} native function.
         */
        public async fetch(...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']> {
            const hash = await $crypto.sha1($json.stringify(args));

            if (Object.hasOwn(this.global.cache, hash)) {
                const globalCacheEntry = this.global.cache[hash];
                return new Response(globalCacheEntry.body, globalCacheEntry.options);
            }
            if ($env.isWeb() /* No cache writes client-side, so no await either. */) {
                return this.global.nativeFetch(...args);
            }
            const response = await this.global.nativeFetch(...args);

            const contentType = (response.headers.get('content-type') || '').toLowerCase();
            const contentMIMEType = contentType.split(';')[0]; // Removes a possible `; charset=utf-8`, for example.
            const allowedMIMETypes = ['text/plain', 'application/json', 'application/ld+json', 'image/svg+xml', 'application/xml', 'text/xml'];

            if (!allowedMIMETypes.includes(contentMIMEType)) {
                return response; // Don't cache MIME types not in list above.
            }
            const globalCacheEntry: GlobalCacheEntry = {
                body: await response.text(), // Body as plain text.
                options: { status: response.status, headers: { 'content-type': contentType } },
            };
            this.global.cache[hash] = globalCacheEntry;
            return new Response(globalCacheEntry.body, globalCacheEntry.options);
        }
    };
    return Object.defineProperty(Defined, 'name', {
        ...Object.getOwnPropertyDescriptor(Defined, 'name'),
        value: 'Fetcher',
    });
};
