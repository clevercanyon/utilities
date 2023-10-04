/**
 * Brand utilities.
 */

import { $app, $class, $obj, $str, $url } from './index.ts';

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
 * Defines types.
 */
export type AddAppOptions = {
    org: string;
    type: string;
    pkgName: string;
    baseURL: string;
    props?: Partial<$class.BrandRawProps>;
};

/**
 * Adds a new brand at runtime.
 *
 * @param   props Raw brand props; {@see $class.BrandRawProps}.
 *
 * @returns       Brand instance {@see $class.Brand}.
 */
export const add = (props: $class.BrandRawProps): $class.Brand => {
    if (!rawPropsInitialized) initializeRawProps();

    if (Object.hasOwn(rawProps, props.slug)) {
        throw new Error('Brand slug exists already.');
    }
    rawProps[props.slug] = props;

    return get(props.slug);
};

/**
 * Gets a brand instance.
 *
 * @param   slug Brand slug.
 *
 * @returns      Brand instance {@see $class.Brand}.
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
                url: 'https://cdn.clevercanyon.com/assets/brands/clevercanyon/founder.png',
                width: 1200,
                height: 1200,
            },
        },
        foundingDate: '2023-10-03',
        numberOfEmployees: 10,

        n7m: 'c10n',
        name: 'Clever Canyon',

        namespace: 'CleverCanyon',
        hostname: 'clevercanyon.com',

        slug: 'clevercanyon',
        var: 'clevercanyon',

        slugPrefix: 'clevercanyon-',
        varPrefix: 'clevercanyon_',

        slogan: 'Cleverly crafted digital brands.',
        description: 'We’re transforming ideas into digital realities.',

        icon: {
            png: 'https://cdn.clevercanyon.com/assets/brands/clevercanyon/icon.png',
            svg: 'https://cdn.clevercanyon.com/assets/brands/clevercanyon/icon.svg',
            width: 1024,
            height: 1024,
        },
        logo: {
            png: 'https://cdn.clevercanyon.com/assets/brands/clevercanyon/logo-on-light-bgs.png',
            svg: 'https://cdn.clevercanyon.com/assets/brands/clevercanyon/logo-on-light-bgs.svg',
            width: 1060,
            height: 120,
        },
        ogImage: {
            png: 'https://cdn.clevercanyon.com/assets/brands/clevercanyon/og-image.png',
            svg: 'https://cdn.clevercanyon.com/assets/brands/clevercanyon/og-image.svg',
            width: 2400,
            height: 1260,
        },
        policies: {
            terms: 'https://clevercanyon.com/terms',
            privacy: 'https://clevercanyon.com/privacy',
        },
        socialProfiles: {
            twitter: 'https://twitter.com/clevercanyon',
            linkedin: 'https://www.linkedin.com/company/clevercanyon',
            facebook: 'https://www.facebook.com/clevercanyon',
            github: 'https://github.com/clevercanyon',
            npm: 'https://www.npmjs.com/org/clevercanyon',
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
            hostname: 'hop.gdn',

            slug: 'hop',
            var: 'hop',

            slugPrefix: 'hop-',
            varPrefix: 'hop_',

            slogan: 'Masters of the digital divide.',
            description: 'Great things, built on great technology.',

            icon: {
                png: 'https://cdn.clevercanyon.com/assets/brands/hop/icon.png',
                svg: 'https://cdn.clevercanyon.com/assets/brands/hop/icon.svg',
                width: 1024,
                height: 1024,
            },
            logo: {
                png: 'https://cdn.clevercanyon.com/assets/brands/hop/logo-on-light-bgs.png',
                svg: 'https://cdn.clevercanyon.com/assets/brands/hop/logo-on-light-bgs.svg',
                width: 1060,
                height: 120,
            },
            ogImage: {
                png: 'https://cdn.clevercanyon.com/assets/brands/hop/og-image.png',
                svg: 'https://cdn.clevercanyon.com/assets/brands/hop/og-image.svg',
                width: 2400,
                height: 1260,
            },
        },
    }) as unknown as $class.BrandRawProps;
};

/**
 * Adds app as a brand, at runtime.
 *
 * @param   options Required; {@see AddAppOptions}.
 *
 * @returns         Brand instance {@see $class.Brand}.
 */
export const addApp = (options: AddAppOptions): $class.Brand => {
    const opts = $obj.defaults({}, options || {}, { props: {} }) as Required<AddAppOptions>;
    const org = get(opts.org); // Expands org slug into org brand instance.
    const baseURLHostname = $url.parse(opts.baseURL).hostname;

    const pkgSlug = $app.pkgSlug(opts.pkgName);
    const pkgSlugAsN7m = $str.numeronym(pkgSlug);
    const pkgSlugAsName = $str.titleCase(pkgSlug);
    const pkgSlugAsNamespace = $str.studlyCase(pkgSlug, { asciiOnly: true, letterFirst: 'X' });
    const pkgSlugAsVar = $str.snakeCase(pkgSlug, { asciiOnly: true, letterFirst: 'x' });

    return add(
        $obj.mergeDeep(
            org.rawProps(),
            {
                org: opts.org,
                type: opts.type,

                n7m: pkgSlugAsN7m,
                name: pkgSlugAsName,

                namespace: pkgSlugAsNamespace,
                hostname: baseURLHostname,

                slug: pkgSlug,
                var: pkgSlugAsVar,

                slugPrefix: pkgSlug + '-',
                varPrefix: pkgSlugAsVar + '_',

                icon: {
                    png: opts.baseURL + '/assets/icon.png',
                    svg: opts.baseURL + '/assets/icon.svg',
                },
                logo: {
                    png: opts.baseURL + '/assets/logo.png',
                    svg: opts.baseURL + '/assets/logo.svg',
                },
                ogImage: {
                    png: opts.baseURL + '/assets/og-image.png',
                    svg: opts.baseURL + '/assets/og-image.svg',
                },
            },
            opts.props,
        ) as unknown as $class.BrandRawProps,
    );
};
