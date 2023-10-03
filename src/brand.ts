/**
 * Brand utilities.
 */

import { $class, $obj } from './index.ts';

/**
 * Tracks initialization.
 */
let rawPropsInitialized = false;

/**
 * Contains a cache of instances.
 */
const instances: { [x: string]: $class.Brand } = {};

/**
 * Raw props keyed by brand slug.
 */
const rawProps: { [x: string]: $class.BrandRawProps } = {};

/**
 * Adds a new brand at runtime.
 *
 * @param props Raw brand props; {@see $class.BrandRawProps}.
 */
export const add = (props: $class.BrandRawProps): void => {
    if (!rawPropsInitialized) initializeRawProps();

    if (Object.hasOwn(rawProps, props.slug)) {
        throw new Error('Brand slug exists already.');
    }
    rawProps[props.slug] = props;
};

/**
 * Gets a brand instance.
 *
 * @param   slug Brand slug.
 *
 * @returns      Brand {@see $class.Brand}.
 */
export const get = (slug: string): $class.Brand => {
    if (!rawPropsInitialized) initializeRawProps();

    slug = '&' === slug ? 'clevercanyon' : slug;
    // `&` is a self-referential `clevercanyon` alias.

    if (!slug || !rawProps[slug]) {
        throw new Error('Missing brand: `' + slug + '`.');
    }
    if (instances[slug]) {
        return instances[slug];
    }
    const Brand = $class.getBrand(); // Brand class.

    if (rawProps[slug].org === slug) {
        // In this case we have to first instantiate the `org` itself, because the `org` reference is cyclic.
        // It is therefore handled by the class constructor, which interprets `undefined` as a self-referential `org`.
        instances[slug] = new Brand({ ...rawProps[slug], org: undefined });
    } else {
        // Otherwise, we simply acquire the `org` brand before instantiating.
        instances[slug] = new Brand({ ...rawProps[slug], org: get(rawProps[slug].org) });
    }
    return instances[slug];
};

/**
 * Initializes raw props.
 */
const initializeRawProps = (): void => {
    if (rawPropsInitialized) return;
    rawPropsInitialized = true;

    /**
     * Clever Canyon, LLC.
     */
    rawProps.clevercanyon = {
        org: 'clevercanyon',
        type: 'corp',
        legalName: 'Clever Canyon, LLC',
        address: {
            street: '9 N River Rd #660',
            city: 'Auburn',
            state: 'ME',
            zip: '04210',
            country: 'US',
        },
        founder: {
            name: 'Jason Caldwell',
            description: 'Engineering Manager, Consultant, Staff Engineer',
            image: {
                url: 'https://cdn.clevercanyon.com/assets/brands/c10n/founder.png',
                width: 1200,
                height: 1200,
            },
        },
        foundingDate: '2023-10-03',
        numberOfEmployees: 10,

        n7m: 'c10n',
        name: 'Clever Canyon',

        namespace: 'CleverCanyon',
        domain: 'clevercanyon.com',

        slug: 'clevercanyon',
        var: 'clevercanyon',

        slugPrefix: 'clevercanyon-',
        varPrefix: 'clevercanyon_',

        slogan: 'Cleverly crafted digital brands.',
        description: 'We’re transforming ideas into digital realities.',

        icon: {
            png: 'https://cdn.clevercanyon.com/assets/brands/c10n/icon.png',
            svg: 'https://cdn.clevercanyon.com/assets/brands/c10n/icon.svg',
            width: 1024,
            height: 1024,
        },
        logo: {
            png: 'https://cdn.clevercanyon.com/assets/brands/c10n/logo-on-light-bgs.png',
            svg: 'https://cdn.clevercanyon.com/assets/brands/c10n/logo-on-light-bgs.svg',
            width: 1060,
            height: 120,
        },
        ogImage: {
            png: 'https://cdn.clevercanyon.com/assets/brands/c10n/og-image.png',
            svg: 'https://cdn.clevercanyon.com/assets/brands/c10n/og-image.svg',
            width: 2400,
            height: 1260,
        },
        socialProfiles: {
            twitter: 'https://twitter.com/clevercanyon',
            linkedin: 'https://www.linkedin.com/company/clevercanyon',
            facebook: 'https://www.facebook.com/clevercanyon',
            github: 'https://github.com/clevercanyon',
            npm: 'https://www.npmjs.com/org/clevercanyon',
        },
        google: {
            analytics: {
                ga4GtagId: 'G-Y5BS7MMHMD',
            },
        },
    };

    /**
     * Clever Canyon, LLC (dba: Hop.gdn).
     */
    rawProps.hop = $obj.mergeDeep(rawProps.clevercanyon, {
        $set: {
            org: 'clevercanyon',
            type: 'dba', // Doing business as.
            legalName: 'Clever Canyon, LLC (dba: Hop.gdn)',

            n7m: 'h1p',
            name: 'Hop.gdn',

            namespace: 'Hop',
            domain: 'hop.gdn',

            slug: 'hop',
            var: 'hop',

            slugPrefix: 'hop-',
            varPrefix: 'hop_',

            slogan: 'Masters of the digital divide.',
            description: 'Great things, built on great technology.',

            icon: {
                png: 'https://cdn.clevercanyon.com/assets/brands/h1p/icon.png',
                svg: 'https://cdn.clevercanyon.com/assets/brands/h1p/icon.svg',
                width: 1024,
                height: 1024,
            },
            logo: {
                png: 'https://cdn.clevercanyon.com/assets/brands/h1p/logo-on-light-bgs.png',
                svg: 'https://cdn.clevercanyon.com/assets/brands/h1p/logo-on-light-bgs.svg',
                width: 1060,
                height: 120,
            },
            ogImage: {
                png: 'https://cdn.clevercanyon.com/assets/brands/h1p/og-image.png',
                svg: 'https://cdn.clevercanyon.com/assets/brands/h1p/og-image.svg',
                width: 2400,
                height: 1260,
            },
        },
    }) as unknown as $class.BrandRawProps;
};
