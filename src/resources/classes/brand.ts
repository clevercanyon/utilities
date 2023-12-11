/**
 * Brand utility class.
 */

import { $class, $obj, $symbol, type $type } from '#index.ts';

/**
 * Constructor cache.
 */
let Brand: Constructor;

/**
 * Defines types.
 */
export type Type = 'corp' | 'org' | 'site';

export type RawProps = Omit<ClassInterfaceProps, 'org'> & {
    readonly org: string;
};
export type C9rProps = Omit<ClassInterfaceProps, 'org'> & {
    readonly org?: Class | undefined;
};
export type Constructor = {
    new (props: C9rProps | Class): Class;
};
export type Class = $type.Utility & ClassInterface;

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
    public readonly founder: $type.Person;
    public readonly foundingDate: string;
    public readonly numberOfEmployees: number;

    public readonly n7m: string;
    public readonly name: string;

    public readonly pkgName: string;
    public readonly namespace: string;

    public readonly hostname: string;
    public readonly mxHostname: string;
    public readonly url: string;

    public readonly slug: string;
    public readonly var: string;

    public readonly slugPrefix: string;
    public readonly varPrefix: string;

    public readonly slogan: string;
    public readonly description: string;

    public readonly theme: {
        readonly isDark: boolean;
        readonly color: string;
        readonly fgColor: string;
        readonly linkColor: string;
        readonly lineColor: string;
        readonly headingColor: string;
    };
    public readonly icon: {
        readonly svg: string;
        readonly png: string;
        readonly width: number;
        readonly height: number;
    };
    public readonly logo: {
        onDarkBg: {
            readonly svg: string;
            readonly png: string;
        };
        onLightBg: {
            readonly svg: string;
            readonly png: string;
        };
        readonly width: number;
        readonly height: number;
    };
    public readonly ogImage: {
        readonly svg: string;
        readonly png: string;
        readonly width: number;
        readonly height: number;
    };
    public readonly policies: {
        readonly terms: string;
        readonly privacy: string;
    };
    public readonly contacts: {
        readonly admin: {
            readonly email: string;
            readonly url: string;
        };
        readonly security: {
            readonly email: string;
            readonly url: string;
        };
        readonly privacy: {
            readonly email: string;
            readonly url: string;
        };
        readonly support: {
            readonly email: string;
            readonly url: string;
        };
    };
    public readonly socialProfiles: {
        readonly [x: string]: string;
    };
    public constructor(props: C9rProps | Class);
    public rawProps(): RawProps;
}
type ClassInterfaceProps = Omit<ClassInterface, 'constructor' | 'rawProps'>;

/**
 * Brand class factory.
 *
 * @returns Class constructor.
 */
export const getClass = (): Constructor => {
    if (Brand) return Brand;

    Brand = class extends $class.getUtility() implements Class {
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
         * Brand founder; i.e., a Person.
         */
        public readonly founder!: $type.Person;

        /**
         * Founding date; e.g., `2023-10-03`.
         */
        public readonly foundingDate!: string;

        /**
         * Number of employees; e.g., `10`.
         */
        public readonly numberOfEmployees!: number;

        /**
         * Numeronym; e.g., `My Brand` = `m5d`.
         */
        public readonly n7m!: string;

        /**
         * Name; e.g., `My Brand`.
         */
        public readonly name!: string;

        /**
         * Pkg name; e.g., `@org/my-brand`.
         */
        public readonly pkgName!: string;

        /**
         * Namespace; e.g., `MyBrand`.
         */
        public readonly namespace!: string;

        /**
         * Hostname; e.g., `my-brand.com`.
         */
        public readonly hostname!: string;

        /**
         * MX hostname; e.g., `mail.my-brand.com`.
         */
        public readonly mxHostname!: string;

        /**
         * URL; e.g., `https://my-brand.com/`.
         */
        public readonly url!: string;

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
         * Slogan; e.g., `We rock.`.
         */
        public readonly slogan!: string;

        /**
         * Description; e.g., `We’re the people that rock.`.
         */
        public readonly description!: string;

        /**
         * Theme, with colors, etc.
         */
        public readonly theme!: {
            readonly isDark: boolean;
            readonly color: string;
            readonly fgColor: string;
            readonly linkColor: string;
            readonly lineColor: string;
            readonly headingColor: string;
        };

        /**
         * Icon, with dimensions.
         */
        public readonly icon!: {
            readonly svg: string;
            readonly png: string;
            readonly width: number;
            readonly height: number;
        };

        /**
         * Logo, with dimensions.
         */
        public readonly logo!: {
            onDarkBg: {
                readonly svg: string;
                readonly png: string;
            };
            onLightBg: {
                readonly svg: string;
                readonly png: string;
            };
            readonly width: number;
            readonly height: number;
        };

        /**
         * OG image, with dimensions.
         */
        public readonly ogImage!: {
            readonly svg: string;
            readonly png: string;
            readonly width: number;
            readonly height: number;
        };

        /**
         * Policies; terms/privacy.
         */
        public readonly policies!: {
            readonly terms: string;
            readonly privacy: string;
        };

        /**
         * Contacts; admin, security, etc.
         */
        public readonly contacts!: {
            readonly admin: {
                readonly email: string;
                readonly url: string;
            };
            readonly security: {
                readonly email: string;
                readonly url: string;
            };
            readonly privacy: {
                readonly email: string;
                readonly url: string;
            };
            readonly support: {
                readonly email: string;
                readonly url: string;
            };
        };

        /**
         * Social profile URLs.
         */
        public readonly socialProfiles!: {
            readonly [x: string]: string;
        };

        /**
         * Object constructor.
         *
         * @param props Props or instance.
         */
        public constructor(props: C9rProps | Class) {
            super(); // Parent constructor.

            for (const [key, value] of $obj.keyAndSymbolEntries(props)) {
                this[key] = value; // Property assignments.
            }
            if (!(this.org instanceof Brand)) {
                this.org = this; // Circular.
            }
        }

        /**
         * {@see $json.stringify()} helper.
         *
         * @returns What value to derive a JSON value from.
         */
        public [$symbol.objToJSON](): ReturnType<$type.ObjToJSONSymbolFn> {
            return this.rawProps();
        }

        /**
         * Produces raw props.
         *
         * @returns Object {@see RawProps}.
         */
        public rawProps(): RawProps {
            return { ...this, org: this.org.slug };
        }
    };
    return Object.defineProperty(Brand, 'name', {
        ...Object.getOwnPropertyDescriptor(Brand, 'name'),
        value: 'Brand',
    });
};
