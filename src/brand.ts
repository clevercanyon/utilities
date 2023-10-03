/**
 * Brand utilities.
 */

import { $class, $obj } from './index.ts';

/**
 * Brand instances.
 */
const instances: { [x: string]: $class.Brand } = {};

/**
 * Gets raw brand props by N7M (numeronym).
 *
 * @returns Raw brand props by N7M (numeronym).
 */
const rawProps = (): { readonly [x: string]: $class.BrandRawProps } => {
    const props: { [x: string]: $class.BrandRawProps } = {};

    /**
     * Clever Canyon.
     */
    props.c10n = {
        org: '&',
        type: 'corporation',
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
        namespace: 'Clever_Canyon',
        domain: 'clevercanyon.com',

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
        slug: 'clevercanyon',
        var: 'clevercanyon',

        slugPrefix: 'clevercanyon-',
        varPrefix: 'clevercanyon_',

        aws: {
            s3: {
                bucket: 'clevercanyon',
                cdnDomain: 'cdn.clevercanyon.com',
            },
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
    props.h1p = $obj.mergeDeep(props.c10n, {
        org: 'c10n',
        type: 'dba',
        legalName: 'Hop.gdn by Clever Canyon, LLC',

        n7m: 'h1p',
        name: 'Hop.gdn',
        namespace: 'Hop',
        domain: 'hop.gdn',

        slogan: 'Masters of the digital divide.',
        description: 'Great things, built on great technology.',

        logo: {
            url: 'https://cdn.clevercanyon.com/assets/brands/c10n/hop-gdn-logo-on-light-bgs.png',
            width: 1060,
            height: 120,
        },
        icon: {
            url: 'https://cdn.clevercanyon.com/assets/brands/c10n/icon.png',
            width: 1024,
            height: 1024,
        },
        slug: 'hop',
        var: 'hop',

        slugPrefix: 'hop-',
        varPrefix: 'hop_',

        aws: {
            s3: {
                bucket: 'hop-gdn',
                cdnDomain: 'cdn.hop.gdn',
            },
        },
    }) as unknown as $class.BrandRawProps;

    return props;
};

/**
 * Gets a brand instance.
 *
 * @param   q Brand numeronym, slug, or var.
 *
 * @returns   Brand {@see $class.Brand}.
 */
export const get = (q: string): $class.Brand => {
    const raw = rawProps();

    q = '&' === q ? 'c10n' : q;
    if (!q) throw new Error('Missing brand query.');

    if (!raw[q] /* Try searching by `slug|var`. */) {
        for (const [_n7m, _raw] of Object.entries(raw))
            if (q === _raw.slug || q === _raw.var) {
                if (raw[_n7m]) return get(_n7m);
            }
        throw new Error('Missing brand for query: `' + q + '`.');
    }
    const n7m = q; // n7m (numeronym).

    if (instances[n7m]) {
        return instances[n7m];
    }
    const Brand = $class.getBrand();

    if ('&' === raw[n7m].org || raw[n7m].org === n7m) {
        instances[n7m] = new Brand({ ...raw[n7m], org: undefined });
    } else {
        instances[n7m] = new Brand({ ...raw[n7m], org: get(raw[n7m].org) });
    }
    return instances[n7m];
};
