/**
 * Brand utility class.
 */

import { $class, $obj } from '../../index.ts';

let Defined: Constructor | undefined; // Cache.

/**
 * Defines types.
 */
export type Type = 'corp' | 'dba' | 'site';

export type RawProps = Omit<ClassInterface, 'org'> & {
    readonly org: string;
};
export type C9rProps = Omit<ClassInterface, 'org'> & {
    readonly org?: Class | undefined;
};
export type Constructor = {
    new (props: C9rProps | Class): Class;
};
export type Class = $class.Utility & ClassInterface;

declare class ClassInterface {
    public readonly org: Class;
    public readonly type: Type;
    public readonly legalName: string;
    public readonly address: {
        readonly street: string;
        readonly city: string;
        readonly state: string;
        readonly zip: string;
        readonly country: string;
    };
    public readonly founder: {
        name: string;
        description: string;
        image: {
            url: string;
            width: number;
            height: number;
        };
    };
    public readonly foundingDate: string;
    public readonly numberOfEmployees: number;

    public readonly n7m: string;
    public readonly name: string;

    public readonly namespace: string;
    public readonly domain: string;

    public readonly slug: string;
    public readonly var: string;

    public readonly slugPrefix: string;
    public readonly varPrefix: string;

    public readonly slogan: string;
    public readonly description: string;

    public readonly logo: {
        readonly url: string;
        readonly width: number;
        readonly height: number;
    };
    public readonly icon: {
        readonly url: string;
        readonly width: number;
        readonly height: number;
    };
    public readonly socialProfiles: {
        readonly [x: string]: string;
    };
    public readonly google: {
        readonly analytics: {
            readonly ga4GtagId: string;
        };
    };
    public constructor(props: C9rProps | Class);
}

/**
 * Brand class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
    if (Defined) return Defined;

    Defined = class extends $class.getUtility() implements Class {
        /**
         * Org brand object.
         */
        public readonly org!: Class;

        /**
         * Type; {@see Type}.
         */
        public readonly type!: Type;

        /**
         * Legal name; e.g., `My Brand, Inc.`.
         */
        public readonly legalName!: string;

        /**
         * Address broken out into parts.
         */
        public readonly address!: {
            readonly street: string;
            readonly city: string;
            readonly state: string;
            readonly zip: string;
            readonly country: string;
        };

        /**
         * Brand founder; broken out into parts.
         */
        public readonly founder!: {
            name: string;
            description: string;
            image: {
                url: string;
                width: number;
                height: number;
            };
        };

        /**
         * Founding date; e.g., `2023-10-03`.
         */
        public readonly foundingDate!: string;

        /**
         * Number of employees; e.g., `10`.
         */
        public readonly numberOfEmployees!: number;

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
         * Domain; e.g., `my-brand.com`.
         */
        public readonly domain!: string;

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
         * Slogan; e.g., `My Brand rocks.`.
         */
        public readonly slogan!: string;

        /**
         * Description; e.g., `We’re the people behind My Brand.`.
         */
        public readonly description!: string;

        /**
         * Logo on light bg with dimensions.
         */
        public readonly logo!: {
            readonly url: string;
            readonly width: number;
            readonly height: number;
        };

        /**
         * Icon on light bg with dimensions.
         */
        public readonly icon!: {
            readonly url: string;
            readonly width: number;
            readonly height: number;
        };

        /**
         * Any/all social profile URLs.
         */
        public readonly socialProfiles!: {
            readonly [x: string]: string;
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
         * Object constructor.
         *
         * @param props Props or {@see Interface} instance.
         */
        public constructor(props: C9rProps | Class) {
            super(); // Parent constructor.

            // const isClone = props instanceof (Class as Constructor);

            for (const [key, value] of $obj.keyAndSymbolEntries(props)) {
                this[key] = value; // Property assignments.
            }
            if (!(this.org instanceof (Defined as Constructor))) {
                this.org = this; // Circular.
            }
        }
    };
    return Object.defineProperty(Defined, 'name', {
        ...Object.getOwnPropertyDescriptor(Defined, 'name'),
        value: 'Brand',
    });
};
