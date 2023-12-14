/**
 * Brand utilities.
 */

import '#@initialize.ts';

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
    pkgName?: string;
    baseURL?: string;
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
    tꓺadmin = 'admin',
    tꓺassets = 'assets',
    tꓺbrands = 'brands',
    tꓺcity = 'city',
    tꓺclevercanyon = 'clevercanyon',
    tꓺCleverCanyon = 'CleverCanyon',
    tꓺClever𑂱Canyon = 'Clever Canyon',
    tꓺcolor = 'color',
    tꓺംcom = '.com',
    tꓺcompany = 'company',
    tꓺcontact = 'contact',
    tꓺcontacts = 'contacts',
    tꓺcorp = 'corp',
    tꓺcountry = 'country',
    tꓺdescription = 'description',
    tꓺemail = 'email',
    tꓺfacebook = 'facebook',
    tꓺfgColor = 'fgColor',
    tꓺfounder = 'founder',
    tꓺfoundingDate = 'foundingDate',
    tꓺംgdn = '.gdn',
    tꓺgithub = 'github',
    tꓺheadingColor = 'headingColor',
    tꓺheight = 'height',
    tꓺhop = 'hop',
    tꓺHop = 'Hop',
    tꓺHopംgdn = tꓺHop + tꓺംgdn,
    tꓺhostname = 'hostname',
    tꓺmxHostname = 'mxHostname',
    tꓺhttpsꓽⳇⳇ = 'https://',
    tꓺicon = 'icon',
    tꓺംio = '.io',
    tꓺinfo = 'info',
    tꓺisDark = 'isDark',
    tꓺkeybase = 'keybase',
    tꓺlegalName = 'legalName',
    tꓺletterFirst = 'letterFirst',
    tꓺlineColor = 'lineColor',
    tꓺlinkColor = 'linkColor',
    tꓺlinkedin = 'linkedin',
    tꓺlogo = 'logo',
    tꓺlogoᱼonᱼdarkᱼbg = tꓺlogo + '-on-dark-bg',
    tꓺlogoᱼonᱼlightᱼbg = tꓺlogo + '-on-light-bg',
    tꓺn7m = 'n7m',
    tꓺname = 'name',
    tꓺnamespace = 'namespace',
    tꓺnpm = 'npm',
    tꓺnpmjs = tꓺnpm + 'js',
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
    tꓺsecurity = 'security',
    tꓺslogan = 'slogan',
    tꓺslug = 'slug',
    tꓺslugPrefix = 'slugPrefix',
    tꓺsocialProfiles = 'socialProfiles',
    tꓺstate = 'state',
    tꓺstreet = 'street',
    tꓺsupport = 'support',
    tꓺsvg = 'svg',
    tꓺംsvg = '.' + tꓺsvg,
    tꓺteam = 'team',
    tꓺterms = 'terms',
    tꓺtheme = 'theme',
    tꓺtwitter = 'twitter',
    tꓺtype = 'type',
    tꓺurl = 'url',
    tꓺvar = 'var',
    tꓺvarPrefix = 'varPrefix',
    tꓺwidth = 'width',
    tꓺwwwം = 'www.',
    tꓺzip = 'zip',
    //
    tꓺclevercanyonംcom = tꓺclevercanyon + tꓺംcom,
    tꓺමclevercanyonംcom = '@' + tꓺclevercanyonംcom,
    tꓺhttpsꓽⳇⳇclevercanyonംcom = tꓺhttpsꓽⳇⳇ + tꓺclevercanyonംcom,
    tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ = tꓺhttpsꓽⳇⳇclevercanyonംcom + '/',
    //
    tꓺhopംgdn = tꓺhop + tꓺംgdn,
    tꓺමhopംgdn = '@' + tꓺhopംgdn,
    tꓺhttpsꓽⳇⳇhopംgdn = tꓺhttpsꓽⳇⳇ + tꓺhopംgdn,
    tꓺhttpsꓽⳇⳇhopംgdnⳇ = tꓺhttpsꓽⳇⳇhopംgdn + '/',
    //
    tꓺමclevercanyon = '@' + tꓺclevercanyon,
    tꓺමclevercanyonⳇclevercanyonംcom = tꓺමclevercanyon + '/' + tꓺclevercanyonംcom,
    tꓺමclevercanyonⳇhopംgdn = tꓺමclevercanyon + '/' + tꓺhopംgdn,
    //
    tꓺhttpsꓽⳇⳇcdnംclevercanyonംcomⳇassetsⳇbrands = tꓺhttpsꓽⳇⳇ + 'cdn.' + tꓺclevercanyonംcom + '/' + tꓺassets + '/' + tꓺbrands,
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
        throw Error('rcqcXjar'); // Brand `' + pkgName + '` exists already.
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
        throw Error('NC4Pnsxq'); // Missing brand: `' + pkgName + '`.
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

        [tꓺhostname]: tꓺclevercanyonംcom,
        [tꓺmxHostname]: tꓺclevercanyonംcom,
        [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ,

        [tꓺslug]: tꓺclevercanyon,
        [tꓺvar]: tꓺclevercanyon,

        [tꓺslugPrefix]: tꓺclevercanyon + '-',
        [tꓺvarPrefix]: tꓺclevercanyon + '_',

        [tꓺslogan]: 'Cleverly crafted digital brands.',
        [tꓺdescription]: 'We’re transforming ideas into digital realities.',

        [tꓺtheme]: {
            [tꓺisDark]: true,
            [tꓺcolor]: '#09090b',
            [tꓺfgColor]: '#f0f0f0',
            [tꓺlinkColor]: '#f99980',
            [tꓺlineColor]: '#17171c',
            [tꓺheadingColor]: '#ffffff',
        },
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
            [tꓺterms]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺterms,
            [tꓺprivacy]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺprivacy,
        },
        [tꓺcontacts]: {
            [tꓺadmin]: {
                [tꓺemail]: tꓺadmin + tꓺමclevercanyonംcom,
                [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺcontact,
            },
            [tꓺinfo]: {
                [tꓺemail]: tꓺinfo + tꓺමclevercanyonംcom,
                [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺcontact,
            },
            [tꓺsupport]: {
                [tꓺemail]: tꓺsupport + tꓺමclevercanyonംcom,
                [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺcontact,
            },
            [tꓺsecurity]: {
                [tꓺemail]: tꓺsecurity + tꓺමclevercanyonംcom,
                [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺcontact,
            },
            [tꓺprivacy]: {
                [tꓺemail]: tꓺprivacy + tꓺමclevercanyonംcom,
                [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺcontact,
            },
        },
        [tꓺsocialProfiles]: {
            [tꓺtwitter]: tꓺhttpsꓽⳇⳇ + tꓺtwitter + tꓺംcom + '/' + tꓺclevercanyon,
            [tꓺlinkedin]: tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺlinkedin + tꓺംcom + '/' + tꓺcompany + '/' + tꓺclevercanyon,
            [tꓺfacebook]: tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺfacebook + tꓺംcom + '/' + tꓺclevercanyon,
            [tꓺkeybase]: tꓺhttpsꓽⳇⳇ + tꓺkeybase + tꓺംio + '/' + tꓺteam + '/' + tꓺclevercanyon,
            [tꓺgithub]: tꓺhttpsꓽⳇⳇ + tꓺgithub + tꓺംcom + '/' + tꓺclevercanyon,
            [tꓺnpm]: tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺnpmjs + tꓺംcom + '/' + tꓺorg + '/' + tꓺclevercanyon,
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

            [tꓺhostname]: tꓺhopംgdn,
            [tꓺmxHostname]: tꓺhopംgdn,
            [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ,

            [tꓺslug]: tꓺhop,
            [tꓺvar]: tꓺhop,

            [tꓺslugPrefix]: tꓺhop + '-',
            [tꓺvarPrefix]: tꓺhop + '_',

            [tꓺslogan]: 'Masters of the digital divide.',
            [tꓺdescription]: 'Great things, built on great technology.',

            [tꓺtheme]: {
                ...rawProps[tꓺමclevercanyonⳇclevercanyonംcom][tꓺtheme],
                [tꓺlinkColor]: '#80aff9',
            },
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
            [tꓺcontacts]: {
                [tꓺadmin]: {
                    [tꓺemail]: tꓺadmin + tꓺමhopംgdn,
                    [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ + tꓺcontact,
                },
                [tꓺinfo]: {
                    [tꓺemail]: tꓺinfo + tꓺමhopംgdn,
                    [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ + tꓺcontact,
                },
                [tꓺsupport]: {
                    [tꓺemail]: tꓺsupport + tꓺමhopംgdn,
                    [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ + tꓺcontact,
                },
                [tꓺsecurity]: {
                    [tꓺemail]: tꓺsecurity + tꓺමhopംgdn,
                    [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ + tꓺcontact,
                },
                [tꓺprivacy]: {
                    [tꓺemail]: tꓺprivacy + tꓺමhopംgdn,
                    [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ + tꓺcontact,
                },
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
export const addApp = (options?: AddAppOptions): $type.Brand => {
    /**
     * Parses options.
     */
    const opts = $obj.defaults({}, options || {}, {
        pkgName: '', // Default below is {@see $app.pkgName()}.
        baseURL: '', // Default below is {@see $app.baseURL()}.
        props: undefined, // i.e., Any other raw brand props.
    }) as Required<AddAppOptions>;

    /**
     * Defines critical variables.
     */
    const pkgName = opts.pkgName || $app.pkgName(),
        baseURL = $url.parse(opts.baseURL || $app.baseURL()),
        props = opts.props || $app.brandProps(),
        org = get(props.org || tꓺමclevercanyonⳇhopംgdn);

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
    const relPathToURLString = (relPath: string): string => {
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
                [tꓺorg]: org[tꓺpkgName],
                [tꓺtype]: props[tꓺtype] || 'site',

                [tꓺn7m]: pkgSlugAsN7m,
                [tꓺname]: pkgSlugAsName,

                [tꓺpkgName]: pkgName,
                [tꓺnamespace]: pkgSlugAsNamespace,

                [tꓺhostname]: baseURL[tꓺhostname],
                [tꓺurl]: baseURL.toString(),

                [tꓺslug]: pkgSlug,
                [tꓺvar]: pkgSlugAsVar,

                [tꓺslugPrefix]: pkgSlug + '-',
                [tꓺvarPrefix]: pkgSlugAsVar + '_',

                [tꓺicon]: {
                    [tꓺsvg]: relPathToURLString(tꓺⳇassetsⳇicon + tꓺംsvg),
                    [tꓺpng]: relPathToURLString(tꓺⳇassetsⳇicon + tꓺംpng),
                },
                [tꓺlogo]: {
                    [tꓺonDarkBg]: {
                        [tꓺsvg]: relPathToURLString(tꓺⳇassetsⳇlogoᱼonᱼdarkᱼbg + tꓺംsvg),
                        [tꓺpng]: relPathToURLString(tꓺⳇassetsⳇlogoᱼonᱼdarkᱼbg + tꓺംpng),
                    },
                    [tꓺonLightBg]: {
                        [tꓺsvg]: relPathToURLString(tꓺⳇassetsⳇlogoᱼonᱼlightᱼbg + tꓺംsvg),
                        [tꓺpng]: relPathToURLString(tꓺⳇassetsⳇlogoᱼonᱼlightᱼbg + tꓺംpng),
                    },
                },
                [tꓺogImage]: {
                    [tꓺsvg]: relPathToURLString(tꓺⳇassetsⳇogᱼimage + tꓺംsvg),
                    [tꓺpng]: relPathToURLString(tꓺⳇassetsⳇogᱼimage + tꓺംpng),
                },
            },
            props,
        ) as unknown as $type.BrandRawProps,
    );
};
