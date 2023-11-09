/**
 * Brand utilities.
 */

import './resources/init.ts';

import { $app, $class, $obj, $str, $url, type $type } from './index.ts';

/**
 * Tracks initialization.
 */
let rawPropsInitialized = false;

/**
 * Contains a cache of instances.
 */
const instances: { [x: string]: $type.Brand } = {};

/**
 * Raw props keyed by package name.
 */
const rawProps: { [x: string]: $type.BrandRawProps } = {};

/**
 * Defines types.
 */
export type AddAppOptions = {
    org: $type.BrandRawProps['org'];
    type: $type.BrandRawProps['type'];
    pkgName: string;
    baseURL: string;
    props?: Partial<$type.BrandRawProps>;
};

/**
 * Adds a new brand at runtime.
 *
 * @param   pkgName The brand’s package name.
 * @param   props   Raw brand props; {@see $type.BrandRawProps}.
 *
 * @returns         Brand instance {@see $type.Brand}.
 */
export const add = (pkgName: string, props: $type.BrandRawProps): $type.Brand => {
    if (!rawPropsInitialized) initializeRawProps();

    if (Object.hasOwn(rawProps, pkgName)) {
        throw new Error(); // Brand `' + pkgName + '` exists already.
    }
    rawProps[pkgName] = props;

    return get(pkgName);
};

/**
 * Removes a brand at runtime.
 *
 * @param pkgName The brand’s package name.
 */
export const remove = (pkgName: string): void => {
    if (!rawPropsInitialized) initializeRawProps();

    if (Object.hasOwn(rawProps, pkgName)) {
        delete rawProps[pkgName];
    }
};

/**
 * Gets a brand instance.
 *
 * @param   pkgName Brand package name.
 *
 * @returns         Brand instance {@see $type.Brand}.
 */
export const get = (pkgName: string): $type.Brand => {
    if (!rawPropsInitialized) initializeRawProps();

    pkgName = '&' === pkgName ? '@clevercanyon/clevercanyon.com' : pkgName;
    // `&` is a self-referential Clever Canyon brand alias.

    if (!pkgName || !rawProps[pkgName]) {
        throw new Error(); // Missing brand: `' + pkgName + '`.
    }
    if (instances[pkgName]) {
        return instances[pkgName];
    }
    const Brand = $class.getBrand(); // Brand class.

    if (rawProps[pkgName].org === pkgName) {
        // In this case we have to first instantiate the `org` itself, because the `org` reference is cyclic.
        // It is therefore handled by the class constructor, which interprets `undefined` as a self-referential `org`.
        instances[pkgName] = new Brand({ ...rawProps[pkgName], org: undefined });
    } else {
        // Otherwise, we simply acquire the `org` brand before instantiating.
        instances[pkgName] = new Brand({ ...rawProps[pkgName], org: get(rawProps[pkgName].org) });
    }
    return instances[pkgName];
};

/**
 * Initializes raw props.
 *
 * Why are there so many fragmented variables used here? The intention is to optimize for minification. i.e., By using
 * as many variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome.
 * Also using `let` instead of `const` to shave off another few bytes. Remember, variable names can be minified, so the
 * length of variable names is not an issue. They can be verbose to improve readability.
 */
const initializeRawProps = (): void => {
    if (rawPropsInitialized) return;
    rawPropsInitialized = true;

    /**
     * Defines names.
     */
    let clevercanyon = 'clevercanyon';
    let hop = 'hop';

    /**
     * Defines pkg names.
     */
    let pkgNameOrg = '@' + clevercanyon;
    let pkgNameCleverCanyon = pkgNameOrg + '/' + clevercanyon + '.com';
    let pkgNameHop = pkgNameOrg + '/' + hop + '.gdn';

    /**
     * Defines URLs.
     */
    let urlHTTPS = 'https://';
    let urlCleverCanyon = urlHTTPS + clevercanyon + '.com';
    let urlHop = urlHTTPS + hop + '.gdn';

    /**
     * Defines CDN URLs.
     */
    let cdnURL = urlHTTPS + 'cdn.' + clevercanyon + '.com/assets/brands';
    let cdnURLCleverCanyon = cdnURL + '/' + clevercanyon;
    let cdnURLHop = cdnURL + '/' + hop;

    /**
     * Defines image names.
     */
    let imgNameIcon = 'icon';
    let imgNameLogoOnLightBgs = 'logo-on-light-bgs';
    let imgNameOGImage = 'og-image';

    /**
     * Defines image extensions.
     */
    let imageExtPNG = '.png';
    let imageExtSVG = '.svg';

    /**
     * Defines image dimensions.
     */
    type imageDimensions = { width: number; height: number };
    let imageDimensionsWidth = 'width', imageDimensionsHeight = 'height'; // prettier-ignore
    let imageDimensions1060x1200 = { [imageDimensionsWidth]: 1060, [imageDimensionsHeight]: 120 } as imageDimensions;
    let imageDimensions1200x1200 = { [imageDimensionsWidth]: 1200, [imageDimensionsHeight]: 1200 } as imageDimensions;
    let imageDimensions1024x1024 = { [imageDimensionsWidth]: 1024, [imageDimensionsHeight]: 1024 } as imageDimensions;
    let imageDimensions2400x1260 = { [imageDimensionsWidth]: 2400, [imageDimensionsHeight]: 1260 } as imageDimensions;

    /**
     * Clever Canyon, LLC.
     */
    rawProps[pkgNameCleverCanyon] = {
        org: pkgNameCleverCanyon,
        type: 'corp', // Corporation.

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
            website: urlHTTPS + 'jaswrks.com/',
            description: 'Engineering Manager, Consultant, Staff Engineer',
            image: {
                url: cdnURLCleverCanyon + '/founder' + imageExtPNG,
                ...imageDimensions1200x1200,
            },
        },
        foundingDate: '2023-10-03',
        numberOfEmployees: 10,

        n7m: 'c10n',
        name: 'Clever Canyon',

        pkgName: pkgNameCleverCanyon,
        namespace: 'CleverCanyon',

        hostname: clevercanyon + '.com',
        url: urlCleverCanyon + '/',

        slug: clevercanyon,
        var: clevercanyon,

        slugPrefix: clevercanyon + '-',
        varPrefix: clevercanyon + '_',

        slogan: 'Cleverly crafted digital brands.',
        description: 'We’re transforming ideas into digital realities.',

        icon: {
            png: cdnURLCleverCanyon + '/' + imgNameIcon + imageExtPNG,
            svg: cdnURLCleverCanyon + '/' + imgNameIcon + imageExtSVG,
            ...imageDimensions1024x1024,
        },
        logo: {
            png: cdnURLCleverCanyon + '/' + imgNameLogoOnLightBgs + imageExtPNG,
            svg: cdnURLCleverCanyon + '/' + imgNameLogoOnLightBgs + imageExtSVG,
            ...imageDimensions1060x1200,
        },
        ogImage: {
            png: cdnURLCleverCanyon + '/' + imgNameOGImage + imageExtPNG,
            svg: cdnURLCleverCanyon + '/' + imgNameOGImage + imageExtSVG,
            ...imageDimensions2400x1260,
        },
        policies: {
            terms: urlCleverCanyon + '/terms',
            privacy: urlCleverCanyon + '/privacy',
        },
        socialProfiles: {
            twitter: urlHTTPS + 'twitter.com/' + clevercanyon,
            linkedin: urlHTTPS + 'www.linkedin.com/company/' + clevercanyon,
            facebook: urlHTTPS + 'www.facebook.com/' + clevercanyon,
            github: urlHTTPS + 'github.com/' + clevercanyon,
            npm: urlHTTPS + 'www.npmjs.com/org/' + clevercanyon,
        },
    };

    /**
     * Clever Canyon, LLC (dba: Hop.gdn).
     */
    rawProps[pkgNameHop] = $obj.mergeDeep(rawProps[pkgNameCleverCanyon], {
        $set: {
            org: pkgNameCleverCanyon,
            type: 'org', // Organization.

            n7m: 'h1p',
            name: 'Hop.gdn',

            pkgName: pkgNameHop,
            namespace: 'Hop',

            hostname: hop + '.gdn',
            url: urlHop + '/',

            slug: hop,
            var: hop,

            slugPrefix: hop + '-',
            varPrefix: hop + '_',

            slogan: 'Masters of the digital divide.',
            description: 'Great things, built on great technology.',

            icon: {
                png: cdnURLHop + '/' + imgNameIcon + imageExtPNG,
                svg: cdnURLHop + '/' + imgNameIcon + imageExtSVG,
                ...imageDimensions1024x1024,
            },
            logo: {
                png: cdnURLHop + '/' + imgNameLogoOnLightBgs + imageExtPNG,
                svg: cdnURLHop + '/' + imgNameLogoOnLightBgs + imageExtSVG,
                ...imageDimensions1060x1200,
            },
            ogImage: {
                png: cdnURLHop + '/' + imgNameOGImage + imageExtPNG,
                svg: cdnURLHop + '/' + imgNameOGImage + imageExtSVG,
                ...imageDimensions2400x1260,
            },
        },
    }) as unknown as $type.BrandRawProps;
};

/**
 * Adds app as a brand, at runtime.
 *
 * Why are there so many fragmented variables used here? The intention is to optimize for minification. i.e., By using
 * as many variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome.
 * Also using `let` instead of `const` to shave off another few bytes. Remember, variable names can be minified, so the
 * length of variable names is not an issue. They can be verbose to improve readability.
 *
 * @param   options Required; {@see AddAppOptions}.
 *
 * @returns         Brand instance {@see $type.Brand}.
 */
export const addApp = (options: AddAppOptions): $type.Brand => {
    /**
     * Acquires options, org.
     */
    let opts = $obj.defaults({}, options || {}, { props: {} }) as Required<AddAppOptions>;
    let { pkgName, baseURL } = opts; // Extracted from options and reused below.
    let org = get(opts.org); // Expands org slug into org brand instance.

    /**
     * Defines option names.
     */
    let optNameASCIIOnly = 'asciiOnly';
    let optNameLetterFirst = 'letterFirst';

    /**
     * Defines package data.
     */
    let pkgSlug = $app.pkgSlug(pkgName);
    let pkgSlugAsN7m = $str.numeronym(pkgSlug);
    let pkgSlugAsName = $str.titleCase(pkgSlug);
    let pkgSlugAsNamespace = $str.studlyCase(pkgSlug, { [optNameASCIIOnly]: true, [optNameLetterFirst]: 'X' });
    let pkgSlugAsVar = $str.snakeCase(pkgSlug, { [optNameASCIIOnly]: true, [optNameLetterFirst]: 'x' });

    /**
     * Defines asset paths.
     */
    let assetsRelPath = './assets';
    let assetsRelPathIcon = assetsRelPath + '/icon';
    let assetsRelPathLogo = assetsRelPath + '/logo';
    let assetsRelPathOGImage = assetsRelPath + '/og-image';

    /**
     * Defines asset extensions.
     */
    let assetExtPNG = '.png';
    let assetExtSVG = '.svg';

    /**
     * Defines relative path to URL to string.
     */
    let relPathToURLString = (relPath: string): string => {
        return new URL(relPath, baseURL).toString();
    };

    /**
     * Adds runtime brand data.
     */
    return add(
        pkgName,
        $obj.mergeDeep(
            org.rawProps(),
            {
                org: opts.org,
                type: opts.type,

                n7m: pkgSlugAsN7m,
                name: pkgSlugAsName,

                pkgName,
                namespace: pkgSlugAsNamespace,

                hostname: $url.parse(baseURL).hostname,
                url: baseURL, // We simply use base URL.

                slug: pkgSlug,
                var: pkgSlugAsVar,

                slugPrefix: pkgSlug + '-',
                varPrefix: pkgSlugAsVar + '_',

                icon: {
                    png: relPathToURLString(assetsRelPathIcon + assetExtPNG),
                    svg: relPathToURLString(assetsRelPathIcon + assetExtSVG),
                },
                logo: {
                    png: relPathToURLString(assetsRelPathLogo + assetExtPNG),
                    svg: relPathToURLString(assetsRelPathLogo + assetExtSVG),
                },
                ogImage: {
                    png: relPathToURLString(assetsRelPathOGImage + assetExtPNG),
                    svg: relPathToURLString(assetsRelPathOGImage + assetExtSVG),
                },
            },
            opts.props,
        ) as unknown as $type.BrandRawProps,
    );
};
