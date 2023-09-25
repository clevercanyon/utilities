/**
 * Brand utilities.
 */

import { $class } from './index.ts';

/**
 * Brand instances.
 */
const instances: { [x: string]: $class.Brand } = {};

/**
 * Raw brand props by N7M.
 */
const rawProps: { readonly [x: string]: $class.BrandRawProps } = {
    c10n: {
        org: 'c10n',
        n7m: 'c10n',
        name: 'Clever Canyon',
        namespace: 'Clever_Canyon',
        slug: 'clevercanyon',
        var: 'clevercanyon',
        slugPrefix: 'clevercanyon-',
        varPrefix: 'clevercanyon_',
        rootDomain: 'clevercanyon.com',
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
        cloudflare: {
            accountId: 'f1176464a976947aa5665d989814a4b1',
            zoneId: 'a53c8701e8dffd42e05c53010869f580',
        },
    },
    h1p: {
        org: 'c10n',
        n7m: 'h1p',
        name: 'Hop',
        namespace: 'Hop',
        slug: 'hop',
        var: 'hop',
        slugPrefix: 'hop-',
        varPrefix: 'hop_',
        rootDomain: 'hop.gdn',
        aws: {
            s3: {
                bucket: 'hop-gdn',
                cdnDomain: 'cdn.hop.gdn',
            },
        },
        google: {
            analytics: {
                ga4GtagId: 'G-Y5BS7MMHMD',
            },
        },
        cloudflare: {
            accountId: 'f1176464a976947aa5665d989814a4b1',
            zoneId: 'a53c8701e8dffd42e05c53010869f580',
        },
    },
};

/**
 * Gets a brand instance.
 *
 * @param   q Brand numeronym, slug, or var.
 *
 * @returns   Brand {@see $class.BrandClass}.
 */
export const get = (q: string): $class.Brand => {
    q = '&' === q ? 'c10n' : q; // Self-referential query.
    if (!q) throw new Error('Empty brand query.'); // Failure.

    if (!rawProps[q] /* Not an n7m. Try searching by `slug|var`. */) {
        for (const [_n7m, _rawProps] of Object.entries(rawProps)) {
            if (q === _rawProps.slug || q === _rawProps.var) {
                if (rawProps[_n7m]) return get(_n7m);
            }
        }
        throw new Error('Missing brand for query: `' + q + '`.');
    }
    const n7m = q; // n7m (numeronym).

    if (instances[n7m]) {
        return instances[n7m];
    }
    const Brand = $class.getBrand(); // Class.

    if (rawProps[n7m].org === n7m) {
        instances[n7m] = new Brand({ ...rawProps[n7m], org: undefined });
    } else {
        instances[n7m] = new Brand({ ...rawProps[n7m], org: get(rawProps[n7m].org) });
    }
    return instances[n7m]; // Brand instance.
};
