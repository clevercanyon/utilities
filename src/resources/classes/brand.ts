/**
 * Brand utility class.
 */

import { keyAndSymbolEntries as $objꓺkeyAndSymbolEntries } from '../../obj.ts';
import type { Interface as $classꓺUtilityInterface } from './utility.ts';
import { getClass as $classꓺgetUtility } from './utility.ts';

let Class: Constructor | undefined; // Class definition cache.

/**
 * Defines types.
 */
type BaseProps = {
    readonly n7m: string;

    readonly name: string;
    readonly namespace: string;

    readonly slug: string;
    readonly var: string;

    readonly slugPrefix: string;
    readonly varPrefix: string;

    readonly rootDomain: string;

    readonly aws: {
        readonly s3: {
            readonly bucket: string;
            readonly cdnDomain: string;
        };
    };
    readonly google: {
        readonly analytics: {
            readonly ga4GtagId: string;
        };
    };
    readonly cloudflare: {
        readonly accountId: string;
        readonly zoneId: string;
    };
};
export type RawProps = BaseProps & {
    readonly org: string;
};
export type C9rProps = BaseProps & {
    readonly org?: Interface | undefined;
};
export type Constructor = {
    new (props: C9rProps | Interface): Interface;
};
export declare class Interface extends $classꓺUtilityInterface {
    public readonly org: Interface;
    public readonly n7m: string;

    public readonly name: string;
    public readonly namespace: string;

    public readonly slug: string;
    public readonly var: string;

    public readonly slugPrefix: string;
    public readonly varPrefix: string;

    public readonly rootDomain: string;

    public readonly aws: {
        readonly s3: {
            readonly bucket: string;
            readonly cdnDomain: string;
        };
    };
    public readonly google: {
        readonly analytics: {
            readonly ga4GtagId: string;
        };
    };
    public readonly cloudflare: {
        readonly accountId: string;
        readonly zoneId: string;
    };
    public constructor(props: C9rProps | Interface);
}

/**
 * Brand class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
    if (Class) return Class;

    Class = class extends $classꓺgetUtility() implements Interface {
        /**
         * Org brand object.
         */
        public readonly org!: Interface;

        /**
         * N7M; e.g., `m5d`.
         */
        public readonly n7m!: string;

        /**
         * Name; e.g., `My Brand`.
         */
        public readonly name!: string;

        /**
         * Namespace; e.g., `My_Brand`.
         */
        public readonly namespace!: string;

        /**
         * Slug; e.g., `my-brand`.
         */
        public readonly slug!: string;

        /**
         * Var; e.g., `my_brand`.
         */
        public readonly var!: string;

        /**
         * Slug prefix; e.g., `my-brand-`.
         */
        public readonly slugPrefix!: string;

        /**
         * Var prefix; e.g., `my_brand_`.
         */
        public readonly varPrefix!: string;

        /**
         * Root domain; e.g., `my-brand.com`.
         */
        public readonly rootDomain!: string;

        /**
         * AWS properties.
         */
        public readonly aws!: {
            readonly s3: {
                readonly bucket: string;
                readonly cdnDomain: string;
            };
        };

        /**
         * Google properties.
         */
        public readonly google!: {
            readonly analytics: {
                readonly ga4GtagId: string;
            };
        };

        /**
         * Cloudflare properties.
         */
        public readonly cloudflare!: {
            readonly accountId: string;
            readonly zoneId: string;
        };

        /**
         * Object constructor.
         *
         * @param props Props or {@see Interface} instance.
         */
        public constructor(props: C9rProps | Interface) {
            super(); // Parent constructor.

            // const isClone = props instanceof (Class as Constructor);

            for (const [key, value] of $objꓺkeyAndSymbolEntries(props)) {
                this[key] = value; // Property assignments.
            }
            if (!(this.org instanceof (Class as Constructor))) {
                this.org = this; // Circular.
            }
        }
    };
    return Object.defineProperty(Class, 'name', {
        ...Object.getOwnPropertyDescriptor(Class, 'name'),
        value: 'Brand',
    });
};
