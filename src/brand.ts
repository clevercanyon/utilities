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
 * Why are there so many crazy variables used here? The intention is to optimize for minification. i.e., By using as
 * many variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome. Also
 * using `let` instead of `const` to shave off another few bytes. Remember, variable names can be minified, so the
 * length of variable names is not an issue. They are verbose to improve readability.
 */
const initializeRawProps = (): void => {
    if (rawPropsInitialized) return;
    rawPropsInitialized = true;

    /**
     * Defines names.
     */
    let tꓺClever𑂱Canyon = 'Clever Canyon';
    let tꓺclevercanyon = 'clevercanyon';
    let tꓺHopംgdn = 'Hop.gdn';
    let tꓺhop = 'hop';

    /**
     * Defines pkg names.
     */
    let tꓺමclevercanyon = '@' + tꓺclevercanyon;
    let tꓺමclevercanyonⳇclevercanyonംcom = tꓺමclevercanyon + '/' + tꓺclevercanyon + '.com';
    let tꓺමclevercanyonⳇhopംgdn = tꓺමclevercanyon + '/' + tꓺhop + '.gdn';

    /**
     * Defines URLs.
     */
    let tꓺhttpsꓽⳇⳇ = 'https://';
    let tꓺhttpsꓽⳇⳇclevercanyonംcom = tꓺhttpsꓽⳇⳇ + tꓺclevercanyon + '.com';
    let tꓺhttpsꓽⳇⳇhopംgdn = tꓺhttpsꓽⳇⳇ + tꓺhop + '.gdn';

    /**
     * Defines CDN URLs.
     */
    let tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrands = tꓺhttpsꓽⳇⳇ + 'cdn.' + tꓺclevercanyon + '.com/assets/brands';
    let tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon = tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrands + '/' + tꓺclevercanyon;
    let tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇhop = tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrands + '/' + tꓺhop;

    /**
     * Defines image names.
     */
    let tꓺicon = 'icon';
    let tꓺlogoᱼonᱼdarkᱼbg = 'logo-on-dark-bg';
    let tꓺlogoᱼonᱼlightᱼbg = 'logo-on-light-bg';
    let tꓺogᱼimage = 'og-image';
    let tꓺംpng = '.png', tꓺംsvg = '.svg'; // prettier-ignore

    /**
     * Defines image dimensions.
     */
    type typeꓺoꓺwidthꓺheight = { width: number; height: number };
    let tꓺwidth = 'width', tꓺheight = 'height'; // prettier-ignore
    let oꓺwidthHeight608x120 = { [tꓺwidth]: 608, [tꓺheight]: 120 } as typeꓺoꓺwidthꓺheight;
    let oꓺwidthHeight866x120 = { [tꓺwidth]: 866, [tꓺheight]: 120 } as typeꓺoꓺwidthꓺheight;
    let oꓺwidthHeight1200x1200 = { [tꓺwidth]: 1200, [tꓺheight]: 1200 } as typeꓺoꓺwidthꓺheight;
    let oꓺwidthHeight1024x1024 = { [tꓺwidth]: 1024, [tꓺheight]: 1024 } as typeꓺoꓺwidthꓺheight;
    let oꓺwidthHeight2400x1260 = { [tꓺwidth]: 2400, [tꓺheight]: 1260 } as typeꓺoꓺwidthꓺheight;

    /**
     * Clever Canyon, LLC.
     */
    rawProps[tꓺමclevercanyonⳇclevercanyonംcom] = {
        org: tꓺමclevercanyonⳇclevercanyonംcom,
        type: 'corp', // Corporation.

        legalName: tꓺClever𑂱Canyon + ', LLC',
        address: {
            street: '9 N River Rd #660',
            city: 'Auburn',
            state: 'ME',
            zip: '04210',
            country: 'US',
        },
        founder: {
            name: 'Jason Caldwell',
            website: tꓺhttpsꓽⳇⳇ + 'jaswrks.com/',
            description: 'Engineering Manager, Consultant, Staff Engineer',
            image: {
                url: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/founder' + tꓺംpng,
                ...oꓺwidthHeight1200x1200,
            },
        },
        foundingDate: '2023-10-03',
        numberOfEmployees: 10,

        n7m: 'c10n',
        name: tꓺClever𑂱Canyon,

        pkgName: tꓺමclevercanyonⳇclevercanyonംcom,
        namespace: 'CleverCanyon',

        hostname: tꓺclevercanyon + '.com',
        url: tꓺhttpsꓽⳇⳇclevercanyonംcom + '/',

        slug: tꓺclevercanyon,
        var: tꓺclevercanyon,

        slugPrefix: tꓺclevercanyon + '-',
        varPrefix: tꓺclevercanyon + '_',

        slogan: 'Cleverly crafted digital brands.',
        description: 'We’re transforming ideas into digital realities.',

        icon: {
            png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺicon + tꓺംpng,
            svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺicon + tꓺംsvg,
            ...oꓺwidthHeight1024x1024,
        },
        logo: {
            onDarkBg: {
                png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼdarkᱼbg + tꓺംpng,
                svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼdarkᱼbg + tꓺംsvg,
            },
            onLightBg: {
                png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼlightᱼbg + tꓺംpng,
                svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼlightᱼbg + tꓺംsvg,
            },
            ...oꓺwidthHeight866x120,
        },
        ogImage: {
            png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺogᱼimage + tꓺംpng,
            svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺogᱼimage + tꓺംsvg,
            ...oꓺwidthHeight2400x1260,
        },
        policies: {
            terms: tꓺhttpsꓽⳇⳇclevercanyonംcom + '/terms',
            privacy: tꓺhttpsꓽⳇⳇclevercanyonംcom + '/privacy',
        },
        socialProfiles: {
            twitter: tꓺhttpsꓽⳇⳇ + 'twitter.com/' + tꓺclevercanyon,
            linkedin: tꓺhttpsꓽⳇⳇ + 'www.linkedin.com/company/' + tꓺclevercanyon,
            facebook: tꓺhttpsꓽⳇⳇ + 'www.facebook.com/' + tꓺclevercanyon,
            github: tꓺhttpsꓽⳇⳇ + 'github.com/' + tꓺclevercanyon,
            npm: tꓺhttpsꓽⳇⳇ + 'www.npmjs.com/org/' + tꓺclevercanyon,
        },
    };

    /**
     * Clever Canyon, LLC (dba: Hop.gdn).
     */
    rawProps[tꓺමclevercanyonⳇhopംgdn] = $obj.mergeDeep(rawProps[tꓺමclevercanyonⳇclevercanyonംcom], {
        $set: {
            org: tꓺමclevercanyonⳇclevercanyonംcom,
            type: 'org', // Organization.

            legalName: tꓺHopംgdn,

            n7m: 'h5n',
            name: tꓺHopംgdn,

            pkgName: tꓺමclevercanyonⳇhopംgdn,
            namespace: 'Hop',

            hostname: tꓺhop + '.gdn',
            url: tꓺhttpsꓽⳇⳇhopംgdn + '/',

            slug: tꓺhop,
            var: tꓺhop,

            slugPrefix: tꓺhop + '-',
            varPrefix: tꓺhop + '_',

            slogan: 'Masters of the digital divide.',
            description: 'Great things, built on great technology.',

            icon: {
                png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺicon + tꓺംpng,
                svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺicon + tꓺംsvg,
                ...oꓺwidthHeight1024x1024,
            },
            logo: {
                onDarkBg: {
                    png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼdarkᱼbg + tꓺംpng,
                    svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼdarkᱼbg + tꓺംsvg,
                },
                onLightBg: {
                    png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼlightᱼbg + tꓺംpng,
                    svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼlightᱼbg + tꓺംsvg,
                },
                ...oꓺwidthHeight608x120,
            },
            ogImage: {
                png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺogᱼimage + tꓺംpng,
                svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺogᱼimage + tꓺംsvg,
                ...oꓺwidthHeight2400x1260,
            },
        },
    }) as unknown as $type.BrandRawProps;
};

/**
 * Adds app as a brand, at runtime.
 *
 * Why are there so many crazy variables used here? The intention is to optimize for minification. i.e., By using as
 * many variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome. Also
 * using `let` instead of `const` to shave off another few bytes. Remember, variable names can be minified, so the
 * length of variable names is not an issue. They are verbose to improve readability.
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
    let tꓺasciiOnly = 'asciiOnly';
    let tꓺletterFirst = 'letterFirst';

    /**
     * Defines asset paths.
     */
    let tꓺⳇassets = './assets';
    let tꓺⳇassetsⳇicon = tꓺⳇassets + '/icon';
    let tꓺⳇassetsⳇlogoᱼonᱼdarkᱼbg = tꓺⳇassets + '/logo-on-dark-bg';
    let tꓺⳇassetsⳇlogoᱼonᱼlightᱼbg = tꓺⳇassets + '/logo-on-light-bg';
    let tꓺⳇassetsⳇogᱼimage = tꓺⳇassets + '/og-image';
    let tꓺംpng = '.png', tꓺംsvg = '.svg'; // prettier-ignore

    /**
     * Defines package data.
     */
    let pkgSlug = $app.pkgSlug(pkgName);
    let pkgSlugAsName = $str.titleCase(pkgSlug);
    let pkgSlugAsN7m = $str.numeronym(pkgSlugAsName);
    let pkgSlugAsNamespace = $str.studlyCase(pkgSlug, { [tꓺasciiOnly]: true, [tꓺletterFirst]: 'X' });
    let pkgSlugAsVar = $str.snakeCase(pkgSlug, { [tꓺasciiOnly]: true, [tꓺletterFirst]: 'x' });

    /**
     * Defines relative path to URL string.
     */
    let relPathToURL = (relPath: string): string => {
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
                    png: relPathToURL(tꓺⳇassetsⳇicon + tꓺംpng),
                    svg: relPathToURL(tꓺⳇassetsⳇicon + tꓺംsvg),
                },
                logo: {
                    onDarkBg: {
                        png: relPathToURL(tꓺⳇassetsⳇlogoᱼonᱼdarkᱼbg + tꓺംpng),
                        svg: relPathToURL(tꓺⳇassetsⳇlogoᱼonᱼdarkᱼbg + tꓺംsvg),
                    },
                    onLightBg: {
                        png: relPathToURL(tꓺⳇassetsⳇlogoᱼonᱼlightᱼbg + tꓺംpng),
                        svg: relPathToURL(tꓺⳇassetsⳇlogoᱼonᱼlightᱼbg + tꓺംsvg),
                    },
                },
                ogImage: {
                    png: relPathToURL(tꓺⳇassetsⳇogᱼimage + tꓺംpng),
                    svg: relPathToURL(tꓺⳇassetsⳇogᱼimage + tꓺംsvg),
                },
            },
            opts.props,
        ) as unknown as $type.BrandRawProps,
    );
};
