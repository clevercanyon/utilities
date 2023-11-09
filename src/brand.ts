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
    let tꓺclevercanyon = 'clevercanyon';
    let tꓺhop = 'hop';

    /**
     * Defines pkg names.
     */
    let tꓺමclevercanyon = '@' + tꓺclevercanyon;
    let tꓺමclevercanyonⳇclevercanyonꓺcom = tꓺමclevercanyon + '/' + tꓺclevercanyon + '.com';
    let tꓺමclevercanyonⳇhopꓺgdn = tꓺමclevercanyon + '/' + tꓺhop + '.gdn';

    /**
     * Defines URLs.
     */
    let tꓺhttpsꓽⳇⳇ = 'https://';
    let tꓺhttpsꓽⳇⳇclevercanyonꓺcom = tꓺhttpsꓽⳇⳇ + tꓺclevercanyon + '.com';
    let tꓺhttpsꓽⳇⳇhopꓺgdn = tꓺhttpsꓽⳇⳇ + tꓺhop + '.gdn';

    /**
     * Defines CDN URLs.
     */
    let tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrands = tꓺhttpsꓽⳇⳇ + 'cdn.' + tꓺclevercanyon + '.com/assets/brands';
    let tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇclevercanyon = tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrands + '/' + tꓺclevercanyon;
    let tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇhop = tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrands + '/' + tꓺhop;

    /**
     * Defines image names.
     */
    let tꓺicon = 'icon';
    let tꓺlogoᱼonᱼlightᱼbgs = 'logo-on-light-bgs';
    let tꓺogᱼimage = 'og-image';
    let tꓺpng = '.png', tꓺsvg = '.svg'; // prettier-ignore

    /**
     * Defines image dimensions.
     */
    type typeꓺoꓺwidthꓺheight = { width: number; height: number };
    let tꓺwidth = 'width', tꓺheight = 'height'; // prettier-ignore
    let oꓺwidthꓺheightꓺ1060x1200 = { [tꓺwidth]: 1060, [tꓺheight]: 120 } as typeꓺoꓺwidthꓺheight;
    let oꓺwidthꓺheightꓺ1200x1200 = { [tꓺwidth]: 1200, [tꓺheight]: 1200 } as typeꓺoꓺwidthꓺheight;
    let oꓺwidthꓺheightꓺ1024x1024 = { [tꓺwidth]: 1024, [tꓺheight]: 1024 } as typeꓺoꓺwidthꓺheight;
    let oꓺwidthꓺheightꓺ2400x1260 = { [tꓺwidth]: 2400, [tꓺheight]: 1260 } as typeꓺoꓺwidthꓺheight;

    /**
     * Clever Canyon, LLC.
     */
    rawProps[tꓺමclevercanyonⳇclevercanyonꓺcom] = {
        org: tꓺමclevercanyonⳇclevercanyonꓺcom,
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
            website: tꓺhttpsꓽⳇⳇ + 'jaswrks.com/',
            description: 'Engineering Manager, Consultant, Staff Engineer',
            image: {
                url: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇclevercanyon + '/founder' + tꓺpng,
                ...oꓺwidthꓺheightꓺ1200x1200,
            },
        },
        foundingDate: '2023-10-03',
        numberOfEmployees: 10,

        n7m: 'c10n',
        name: 'Clever Canyon',

        pkgName: tꓺමclevercanyonⳇclevercanyonꓺcom,
        namespace: 'CleverCanyon',

        hostname: tꓺclevercanyon + '.com',
        url: tꓺhttpsꓽⳇⳇclevercanyonꓺcom + '/',

        slug: tꓺclevercanyon,
        var: tꓺclevercanyon,

        slugPrefix: tꓺclevercanyon + '-',
        varPrefix: tꓺclevercanyon + '_',

        slogan: 'Cleverly crafted digital brands.',
        description: 'We’re transforming ideas into digital realities.',

        icon: {
            png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺicon + tꓺpng,
            svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺicon + tꓺsvg,
            ...oꓺwidthꓺheightꓺ1024x1024,
        },
        logo: {
            png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼlightᱼbgs + tꓺpng,
            svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼlightᱼbgs + tꓺsvg,
            ...oꓺwidthꓺheightꓺ1060x1200,
        },
        ogImage: {
            png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺogᱼimage + tꓺpng,
            svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺogᱼimage + tꓺsvg,
            ...oꓺwidthꓺheightꓺ2400x1260,
        },
        policies: {
            terms: tꓺhttpsꓽⳇⳇclevercanyonꓺcom + '/terms',
            privacy: tꓺhttpsꓽⳇⳇclevercanyonꓺcom + '/privacy',
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
    rawProps[tꓺමclevercanyonⳇhopꓺgdn] = $obj.mergeDeep(rawProps[tꓺමclevercanyonⳇclevercanyonꓺcom], {
        $set: {
            org: tꓺමclevercanyonⳇclevercanyonꓺcom,
            type: 'org', // Organization.

            n7m: 'h1p',
            name: 'Hop.gdn',

            pkgName: tꓺමclevercanyonⳇhopꓺgdn,
            namespace: 'Hop',

            hostname: tꓺhop + '.gdn',
            url: tꓺhttpsꓽⳇⳇhopꓺgdn + '/',

            slug: tꓺhop,
            var: tꓺhop,

            slugPrefix: tꓺhop + '-',
            varPrefix: tꓺhop + '_',

            slogan: 'Masters of the digital divide.',
            description: 'Great things, built on great technology.',

            icon: {
                png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇhop + '/' + tꓺicon + tꓺpng,
                svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇhop + '/' + tꓺicon + tꓺsvg,
                ...oꓺwidthꓺheightꓺ1024x1024,
            },
            logo: {
                png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼlightᱼbgs + tꓺpng,
                svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼlightᱼbgs + tꓺsvg,
                ...oꓺwidthꓺheightꓺ1060x1200,
            },
            ogImage: {
                png: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇhop + '/' + tꓺogᱼimage + tꓺpng,
                svg: tꓺhttpsꓽⳇⳇcdnꓺclevercanyonꓺcomⳇassetsⳇbrandsⳇhop + '/' + tꓺogᱼimage + tꓺsvg,
                ...oꓺwidthꓺheightꓺ2400x1260,
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
    let tꓺⳇassetsⳇlogo = tꓺⳇassets + '/logo';
    let tꓺⳇassetsⳇogᱼimage = tꓺⳇassets + '/og-image';
    let tꓺpng = '.png', tꓺsvg = '.svg'; // prettier-ignore

    /**
     * Defines package data.
     */
    let pkgSlug = $app.pkgSlug(pkgName);
    let pkgSlugAsN7m = $str.numeronym(pkgSlug);
    let pkgSlugAsName = $str.titleCase(pkgSlug);
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
                    png: relPathToURL(tꓺⳇassetsⳇicon + tꓺpng),
                    svg: relPathToURL(tꓺⳇassetsⳇicon + tꓺsvg),
                },
                logo: {
                    png: relPathToURL(tꓺⳇassetsⳇlogo + tꓺpng),
                    svg: relPathToURL(tꓺⳇassetsⳇlogo + tꓺsvg),
                },
                ogImage: {
                    png: relPathToURL(tꓺⳇassetsⳇogᱼimage + tꓺpng),
                    svg: relPathToURL(tꓺⳇassetsⳇogᱼimage + tꓺsvg),
                },
            },
            opts.props,
        ) as unknown as $type.BrandRawProps,
    );
};
