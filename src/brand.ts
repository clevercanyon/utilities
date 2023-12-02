/**
 * Brand utilities.
 */

import '#@init.ts';

import { $app, $class, $obj, $person, $str, $url, type $type } from '#index.ts';

/**
 * Tracks initialization.
 */
let rawPropsInitialized = false;

/**
 * Cache of instances keyed by package name.
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
 * Defines tokens.
 *
 * Why are there so many crazy variables used here? The intention is to optimize for minification. i.e., By using as
 * many variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome.
 * Remember, variable names can be minified, so the length of variable names is not an issue.
 */
const tꓺaddress = 'address',
    tꓺasciiOnly = 'asciiOnly',
    tꓺassets = 'assets',
    tꓺbrands = 'brands',
    tꓺcity = 'city',
    tꓺclevercanyon = 'clevercanyon',
    tꓺCleverCanyon = 'CleverCanyon',
    tꓺClever𑂱Canyon = 'Clever Canyon',
    tꓺംcom = '.com',
    tꓺcompany = 'company',
    tꓺcorp = 'corp',
    tꓺcountry = 'country',
    tꓺdescription = 'description',
    tꓺfacebook = 'facebook',
    tꓺfounder = 'founder',
    tꓺfoundingDate = 'foundingDate',
    tꓺംgdn = '.gdn',
    tꓺgithub = 'github',
    tꓺheight = 'height',
    tꓺhop = 'hop',
    tꓺHop = 'Hop',
    tꓺHopംgdn = tꓺHop + tꓺംgdn,
    tꓺhostname = 'hostname',
    tꓺicon = 'icon',
    tꓺlegalName = 'legalName',
    tꓺletterFirst = 'letterFirst',
    tꓺlinkedin = 'linkedin',
    tꓺlogo = 'logo',
    tꓺlogoᱼonᱼdarkᱼbg = tꓺlogo + '-on-dark-bg',
    tꓺlogoᱼonᱼlightᱼbg = tꓺlogo + '-on-light-bg',
    tꓺn7m = 'n7m',
    tꓺname = 'name',
    tꓺnamespace = 'namespace',
    tꓺnpm = 'npm',
    tꓺnumberOfEmployees = 'numberOfEmployees',
    tꓺogImage = 'ogImage',
    tꓺogᱼimage = 'og-image',
    tꓺonDarkBg = 'onDarkBg',
    tꓺonLightBg = 'onLightBg',
    tꓺorg = 'org',
    tꓺpkgName = 'pkgName',
    tꓺpng = 'png',
    tꓺംpng = '.' + tꓺpng,
    tꓺpolicies = 'policies',
    tꓺprivacy = 'privacy',
    tꓺslogan = 'slogan',
    tꓺslug = 'slug',
    tꓺslugPrefix = 'slugPrefix',
    tꓺsocialProfiles = 'socialProfiles',
    tꓺstate = 'state',
    tꓺstreet = 'street',
    tꓺsvg = 'svg',
    tꓺംsvg = '.' + tꓺsvg,
    tꓺterms = 'terms',
    tꓺtwitter = 'twitter',
    tꓺtype = 'type',
    tꓺurl = 'url',
    tꓺvar = 'var',
    tꓺvarPrefix = 'varPrefix',
    tꓺwidth = 'width',
    tꓺwwwം = 'www.',
    tꓺzip = 'zip',
    //
    tꓺමclevercanyon = '@' + tꓺclevercanyon,
    tꓺමclevercanyonⳇclevercanyonംcom = tꓺමclevercanyon + '/' + tꓺclevercanyon + tꓺംcom,
    tꓺමclevercanyonⳇhopംgdn = tꓺමclevercanyon + '/' + tꓺhop + tꓺംgdn,
    //
    tꓺhttpsꓽⳇⳇ = 'https://',
    tꓺhttpsꓽⳇⳇclevercanyonംcom = tꓺhttpsꓽⳇⳇ + tꓺclevercanyon + tꓺംcom,
    tꓺhttpsꓽⳇⳇhopംgdn = tꓺhttpsꓽⳇⳇ + tꓺhop + tꓺംgdn,
    //
    tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrands = tꓺhttpsꓽⳇⳇ + 'cdn.' + tꓺclevercanyon + tꓺംcom + '/' + tꓺassets + '/' + tꓺbrands,
    tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon = tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrands + '/' + tꓺclevercanyon,
    tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇhop = tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrands + '/' + tꓺhop,
    //
    tꓺⳇassets = './' + tꓺassets,
    tꓺⳇassetsⳇicon = tꓺⳇassets + '/' + tꓺicon,
    tꓺⳇassetsⳇlogoᱼonᱼdarkᱼbg = tꓺⳇassets + '/' + tꓺlogoᱼonᱼdarkᱼbg,
    tꓺⳇassetsⳇlogoᱼonᱼlightᱼbg = tꓺⳇassets + '/' + tꓺlogoᱼonᱼlightᱼbg,
    tꓺⳇassetsⳇogᱼimage = tꓺⳇassets + '/' + tꓺogᱼimage,
    //
    tꓺobjꓺwidthHeight608x120 = { [tꓺwidth]: 608, [tꓺheight]: 120 } as { width: number; height: number },
    tꓺobjꓺwidthHeight866x120 = { [tꓺwidth]: 866, [tꓺheight]: 120 } as { width: number; height: number },
    tꓺobjꓺwidthHeight1024x1024 = { [tꓺwidth]: 1024, [tꓺheight]: 1024 } as { width: number; height: number },
    tꓺobjꓺwidthHeight2400x1260 = { [tꓺwidth]: 2400, [tꓺheight]: 1260 } as { width: number; height: number };

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

    pkgName = '&' === pkgName ? tꓺමclevercanyonⳇclevercanyonംcom : pkgName;
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
        instances[pkgName] = new Brand({ ...rawProps[pkgName], [tꓺorg]: undefined });
    } else {
        // Otherwise, we simply acquire the `org` brand before instantiating.
        instances[pkgName] = new Brand({ ...rawProps[pkgName], [tꓺorg]: get(rawProps[pkgName].org) });
    }
    return instances[pkgName];
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
    rawProps[tꓺමclevercanyonⳇclevercanyonംcom] = {
        [tꓺorg]: tꓺමclevercanyonⳇclevercanyonംcom,
        [tꓺtype]: tꓺcorp, // Corporation.

        [tꓺlegalName]: tꓺClever𑂱Canyon + ', LLC',
        [tꓺaddress]: {
            [tꓺstreet]: '9 N River Rd #660',
            [tꓺcity]: 'Auburn',
            [tꓺstate]: 'ME',
            [tꓺzip]: '04210',
            [tꓺcountry]: 'US',
        },
        [tꓺfounder]: $person.get('&'),
        [tꓺfoundingDate]: '2023-10-03',
        [tꓺnumberOfEmployees]: 10,

        [tꓺn7m]: 'c10n',
        [tꓺname]: tꓺClever𑂱Canyon,

        [tꓺpkgName]: tꓺමclevercanyonⳇclevercanyonംcom,
        [tꓺnamespace]: tꓺCleverCanyon,

        [tꓺhostname]: tꓺclevercanyon + tꓺംcom,
        [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcom + '/',

        [tꓺslug]: tꓺclevercanyon,
        [tꓺvar]: tꓺclevercanyon,

        [tꓺslugPrefix]: tꓺclevercanyon + '-',
        [tꓺvarPrefix]: tꓺclevercanyon + '_',

        [tꓺslogan]: 'Cleverly crafted digital brands.',
        [tꓺdescription]: 'We’re transforming ideas into digital realities.',

        [tꓺicon]: {
            [tꓺsvg]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺicon + tꓺംsvg,
            [tꓺpng]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺicon + tꓺംpng,
            ...tꓺobjꓺwidthHeight1024x1024,
        },
        [tꓺlogo]: {
            [tꓺonDarkBg]: {
                [tꓺsvg]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼdarkᱼbg + tꓺംsvg,
                [tꓺpng]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼdarkᱼbg + tꓺംpng,
            },
            [tꓺonLightBg]: {
                [tꓺsvg]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼlightᱼbg + tꓺംsvg,
                [tꓺpng]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼlightᱼbg + tꓺംpng,
            },
            ...tꓺobjꓺwidthHeight866x120,
        },
        [tꓺogImage]: {
            [tꓺsvg]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺogᱼimage + tꓺംsvg,
            [tꓺpng]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺogᱼimage + tꓺംpng,
            ...tꓺobjꓺwidthHeight2400x1260,
        },
        [tꓺpolicies]: {
            [tꓺterms]: tꓺhttpsꓽⳇⳇclevercanyonംcom + '/' + tꓺterms,
            [tꓺprivacy]: tꓺhttpsꓽⳇⳇclevercanyonംcom + '/' + tꓺprivacy,
        },
        [tꓺsocialProfiles]: {
            [tꓺtwitter]: tꓺhttpsꓽⳇⳇ + tꓺtwitter + tꓺംcom + '/' + tꓺclevercanyon,
            [tꓺlinkedin]: tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺlinkedin + tꓺംcom + '/' + tꓺcompany + '/' + tꓺclevercanyon,
            [tꓺfacebook]: tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺfacebook + tꓺംcom + '/' + tꓺclevercanyon,
            [tꓺgithub]: tꓺhttpsꓽⳇⳇ + tꓺgithub + tꓺംcom + '/' + tꓺclevercanyon,
            [tꓺnpm]: tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺnpm + 'js' + tꓺംcom + '/' + tꓺorg + '/' + tꓺclevercanyon,
        },
    };

    /**
     * Clever Canyon, LLC (dba: Hop.gdn).
     */
    rawProps[tꓺමclevercanyonⳇhopംgdn] = $obj.mergeDeep(rawProps[tꓺමclevercanyonⳇclevercanyonംcom], {
        $set: {
            [tꓺorg]: tꓺමclevercanyonⳇclevercanyonംcom,
            [tꓺtype]: tꓺorg, // Organization.

            [tꓺlegalName]: tꓺHopംgdn,

            [tꓺn7m]: 'h5n',
            [tꓺname]: tꓺHopംgdn,

            [tꓺpkgName]: tꓺමclevercanyonⳇhopംgdn,
            [tꓺnamespace]: tꓺHop,

            [tꓺhostname]: tꓺhop + tꓺംgdn,
            [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdn + '/',

            [tꓺslug]: tꓺhop,
            [tꓺvar]: tꓺhop,

            [tꓺslugPrefix]: tꓺhop + '-',
            [tꓺvarPrefix]: tꓺhop + '_',

            [tꓺslogan]: 'Masters of the digital divide.',
            [tꓺdescription]: 'Great things, built on great technology.',

            [tꓺicon]: {
                [tꓺsvg]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺicon + tꓺംsvg,
                [tꓺpng]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺicon + tꓺംpng,
                ...tꓺobjꓺwidthHeight1024x1024,
            },
            [tꓺlogo]: {
                [tꓺonDarkBg]: {
                    [tꓺsvg]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼdarkᱼbg + tꓺംsvg,
                    [tꓺpng]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼdarkᱼbg + tꓺംpng,
                },
                [tꓺonLightBg]: {
                    [tꓺsvg]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼlightᱼbg + tꓺംsvg,
                    [tꓺpng]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼlightᱼbg + tꓺംpng,
                },
                ...tꓺobjꓺwidthHeight608x120,
            },
            [tꓺogImage]: {
                [tꓺsvg]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺogᱼimage + tꓺംsvg,
                [tꓺpng]: tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrandsⳇhop + '/' + tꓺogᱼimage + tꓺംpng,
                ...tꓺobjꓺwidthHeight2400x1260,
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
    const opts = $obj.defaults({}, options || {}, { props: {} }) as Required<AddAppOptions>,
        { pkgName, baseURL } = opts, // Extracted from options and reused below.
        org = get(opts.org); // Expands org slug into org brand instance.

    /**
     * Defines package data.
     */
    const pkgSlug = $app.pkgSlug(pkgName),
        pkgSlugAsName = $str.titleCase(pkgSlug),
        pkgSlugAsN7m = $str.numeronym(pkgSlugAsName),
        pkgSlugAsNamespace = $str.studlyCase(pkgSlug, { [tꓺasciiOnly]: true, [tꓺletterFirst]: 'X' }),
        pkgSlugAsVar = $str.snakeCase(pkgSlug, { [tꓺasciiOnly]: true, [tꓺletterFirst]: 'x' });

    /**
     * Defines relative path to URL string.
     */
    const relPathToURL = (relPath: string): string => {
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
                [tꓺorg]: opts.org,
                [tꓺtype]: opts.type,

                [tꓺn7m]: pkgSlugAsN7m,
                [tꓺname]: pkgSlugAsName,

                [tꓺpkgName]: pkgName,
                [tꓺnamespace]: pkgSlugAsNamespace,

                [tꓺhostname]: $url.parse(baseURL).hostname,
                [tꓺurl]: baseURL, // We simply use base URL.

                [tꓺslug]: pkgSlug,
                [tꓺvar]: pkgSlugAsVar,

                [tꓺslugPrefix]: pkgSlug + '-',
                [tꓺvarPrefix]: pkgSlugAsVar + '_',

                [tꓺicon]: {
                    [tꓺsvg]: relPathToURL(tꓺⳇassetsⳇicon + tꓺംsvg),
                    [tꓺpng]: relPathToURL(tꓺⳇassetsⳇicon + tꓺംpng),
                },
                [tꓺlogo]: {
                    [tꓺonDarkBg]: {
                        [tꓺsvg]: relPathToURL(tꓺⳇassetsⳇlogoᱼonᱼdarkᱼbg + tꓺംsvg),
                        [tꓺpng]: relPathToURL(tꓺⳇassetsⳇlogoᱼonᱼdarkᱼbg + tꓺംpng),
                    },
                    [tꓺonLightBg]: {
                        [tꓺsvg]: relPathToURL(tꓺⳇassetsⳇlogoᱼonᱼlightᱼbg + tꓺംsvg),
                        [tꓺpng]: relPathToURL(tꓺⳇassetsⳇlogoᱼonᱼlightᱼbg + tꓺംpng),
                    },
                },
                [tꓺogImage]: {
                    [tꓺsvg]: relPathToURL(tꓺⳇassetsⳇogᱼimage + tꓺംsvg),
                    [tꓺpng]: relPathToURL(tꓺⳇassetsⳇogᱼimage + tꓺംpng),
                },
            },
            opts.props,
        ) as unknown as $type.BrandRawProps,
    );
};
