/**
 * Brand utilities.
 */

import { $class, $obj } from './index.ts';

/**
 * Tracks initialization.
 */
let rawPropsInitialized = false;

/**
 * Contains a runtime cache of instances.
 */
const instances: { [x: string]: $class.Brand } = {};

/**
 * Raw props keyed by brand numeronym.
 */
const rawProps: { [x: string]: $class.BrandRawProps } = {};

/**
 * Adds a new brand at runtime.
 *
 * @param props Raw brand props; {@see $class.BrandRawProps}.
 */
export const add = (props: $class.BrandRawProps): void => {
    if (!rawPropsInitialized) initializeRawProps();

    if (Object.hasOwn(rawProps, props.n7m)) {
        throw new Error('Brand exists already.');
    }
    rawProps[props.n7m] = props;
};

/**
 * Gets a brand instance.
 *
 * @param   q Brand numeronym, slug, or var.
 *
 * @returns   Brand {@see $class.Brand}.
 */
export const get = (q: string): $class.Brand => {
    if (!rawPropsInitialized) initializeRawProps();

    q = '&' === q ? 'c10n' : q;
    if (!q) throw new Error('Missing brand query.');

    if (!rawProps[q] /* Try searching by `slug|var`. */) {
        for (const [n7m, props] of Object.entries(rawProps))
            if (q === props.slug || q === props.var) {
                if (rawProps[n7m]) return get(n7m);
            }
        throw new Error('Missing brand for query: `' + q + '`.');
    }
    const n7m = q; // n7m (numeronym).

    if (instances[n7m]) {
        return instances[n7m];
    }
    const Brand = $class.getBrand();

    if ('&' === rawProps[n7m].org || rawProps[n7m].org === n7m) {
        instances[n7m] = new Brand({ ...rawProps[n7m], org: undefined });
    } else {
        instances[n7m] = new Brand({ ...rawProps[n7m], org: get(rawProps[n7m].org) });
    }
    return instances[n7m];
};

/**
 * Initializes raw props by numeronym.
 */
const initializeRawProps = (): void => {
    if (rawPropsInitialized) return;
    rawPropsInitialized = true;

    /**
     * Clever Canyon.
     */
    rawProps.c10n = {
        org: '&',
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

        logo: {
            url: 'https://cdn.clevercanyon.com/assets/brands/c10n/logo-on-light-bgs.png',
            width: 1060,
            height: 120,
        },
        icon: {
            url: 'https://cdn.clevercanyon.com/assets/brands/c10n/icon.png',
            width: 1024,
            height: 1024,
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
     * Hop.gdn by Clever Canyon.
     */
    rawProps.h1p = $obj.mergeDeep(rawProps.c10n, {
        $set: {
            org: 'c10n',
            type: 'dba',
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

            logo: {
                url: 'https://cdn.clevercanyon.com/assets/brands/c10n/hop-gdn-logo-on-light-bgs.png',
                width: 1060,
                height: 120,
            },
        },
    }) as unknown as $class.BrandRawProps;
};
