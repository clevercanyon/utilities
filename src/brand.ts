/**
 * Brand utilities.
 */

import '#@initialize.ts';

import { $app, $class, $obj, $profile, $str, $url, type $type } from '#index.ts';

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
    tꓺbrand = 'brand',
    tꓺbrands = tꓺbrand + 's',
    tꓺcity = 'city',
    tꓺclevercanyon = 'clevercanyon',
    tꓺCleverCanyon = 'CleverCanyon',
    tꓺClever𑂱Canyon = 'Clever Canyon',
    tꓺcolor = 'color',
    tꓺംcom = '.com',
    tꓺcompany = 'company',
    tꓺcookies = 'cookies',
    tꓺcontact = 'contact',
    tꓺcontacts = 'contacts',
    tꓺcorp = 'corp',
    tꓺcountry = 'country',
    tꓺdescription = 'description',
    tꓺdesktop = 'desktop',
    tꓺdiscord = 'discord',
    tꓺemail = 'email',
    tꓺdsar = 'dsar',
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
    tꓺiconᱼ2x = tꓺicon + '-2x',
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
    tꓺlogoᱼonᱼdarkᱼbgᱼ2x = tꓺlogoᱼonᱼdarkᱼbg + '-2x',
    tꓺlogoᱼonᱼlightᱼbg = tꓺlogo + '-on-light-bg-2x',
    tꓺlogoᱼonᱼlightᱼbgᱼ2x = tꓺlogoᱼonᱼlightᱼbg + '-2x',
    tꓺmobile = 'mobile',
    tꓺn7m = 'n7m',
    tꓺname = 'name',
    tꓺnamespace = 'namespace',
    tꓺnpm = 'npm',
    tꓺnpmjs = tꓺnpm + 'js',
    tꓺnumberOfEmployees = 'numberOfEmployees',
    tꓺogImage = 'ogImage',
    tꓺogᱼimage = 'og-image',
    tꓺogᱼimageᱼ2x = tꓺogᱼimage + '-2x',
    tꓺonDarkBg = 'onDarkBg',
    tꓺonLightBg = 'onLightBg',
    tꓺorg = 'org',
    tꓺphone = 'phone',
    tꓺpkgName = 'pkgName',
    tꓺpng = 'png',
    tꓺംpng = '.' + tꓺpng,
    tꓺpolicies = 'policies',
    tꓺprivacy = 'privacy',
    tꓺscreenshots = 'screenshots',
    tꓺsecurity = 'security',
    tꓺslogan = 'slogan',
    tꓺslug = 'slug',
    tꓺslugPrefix = 'slugPrefix',
    tꓺsocialProfiles = 'socialProfiles',
    tꓺssᱼdesktopᱼN = 'ss-' + tꓺdesktop + '-{N}',
    tꓺssᱼdesktopᱼNᱼ2x = tꓺssᱼdesktopᱼN + '-2x',
    tꓺssᱼmobileᱼN = 'ss-' + tꓺmobile + '-{N}',
    tꓺssᱼmobileᱼNᱼ2x = tꓺssᱼmobileᱼN + '-2x',
    tꓺstate = 'state',
    tꓺstatus = 'status',
    tꓺstatusURL = 'statusURL',
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
    tꓺvꓺc10nPhone = '1-888-346-0222',
    //
    tꓺclevercanyonംcom = tꓺclevercanyon + tꓺംcom,
    tꓺමclevercanyonംcom = '@' + tꓺclevercanyonംcom,
    tꓺhttpsꓽⳇⳇclevercanyonംcom = tꓺhttpsꓽⳇⳇ + tꓺclevercanyonംcom,
    tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ = tꓺhttpsꓽⳇⳇclevercanyonംcom + '/',
    tꓺhttpsꓽⳇⳇclevercanyonംcomⳇlegalⳇ = tꓺhttpsꓽⳇⳇclevercanyonംcom + '/legal/',
    tꓺhttpsꓽⳇⳇstatusംclevercanyonംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺstatus + '.' + tꓺclevercanyonംcom + '/',
    tꓺhttpsꓽⳇⳇdiscordംclevercanyonംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺdiscord + '.' + tꓺclevercanyonംcom + '/',
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
    // Our two org-level brands get served from an R2 bucket, such that we don’t need to
    // perform added DNS lookups for things likes logos, icons from clevercanyon.com, hop.gdn.
    tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇ = tꓺhttpsꓽⳇⳇ + 'r2.' + tꓺhopംgdn + '/' + tꓺassets + '/' + tꓺbrands + '/',
    tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon = tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇ + tꓺclevercanyon,
    tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop = tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇ + tꓺhop,
    //
    tꓺംⳇassetsⳇbrand = './' + tꓺassets + '/' + tꓺbrand,
    tꓺംⳇassetsⳇbrandⳇicon = tꓺംⳇassetsⳇbrand + '/' + tꓺicon,
    tꓺംⳇassetsⳇbrandⳇiconᱼ2x = tꓺംⳇassetsⳇbrand + '/' + tꓺiconᱼ2x,
    tꓺംⳇassetsⳇbrandⳇlogoᱼonᱼdarkᱼbg = tꓺംⳇassetsⳇbrand + '/' + tꓺlogoᱼonᱼdarkᱼbg,
    tꓺംⳇassetsⳇbrandⳇlogoᱼonᱼdarkᱼbgᱼ2x = tꓺംⳇassetsⳇbrand + '/' + tꓺlogoᱼonᱼdarkᱼbgᱼ2x,
    tꓺംⳇassetsⳇbrandⳇlogoᱼonᱼlightᱼbg = tꓺംⳇassetsⳇbrand + '/' + tꓺlogoᱼonᱼlightᱼbg,
    tꓺംⳇassetsⳇbrandⳇlogoᱼonᱼlightᱼbgᱼ2x = tꓺംⳇassetsⳇbrand + '/' + tꓺlogoᱼonᱼlightᱼbgᱼ2x,
    tꓺംⳇassetsⳇbrandⳇogᱼimage = tꓺംⳇassetsⳇbrand + '/' + tꓺogᱼimage,
    tꓺംⳇassetsⳇbrandⳇogᱼimageᱼ2x = tꓺംⳇassetsⳇbrand + '/' + tꓺogᱼimageᱼ2x,
    tꓺംⳇassetsⳇbrandⳇssᱼdesktopᱼN = tꓺംⳇassetsⳇbrand + '/' + tꓺssᱼdesktopᱼN,
    tꓺംⳇassetsⳇbrandⳇssᱼdesktopᱼNᱼ2x = tꓺംⳇassetsⳇbrand + '/' + tꓺssᱼdesktopᱼNᱼ2x,
    tꓺംⳇassetsⳇbrandⳇssᱼmobileᱼN = tꓺംⳇassetsⳇbrand + '/' + tꓺssᱼmobileᱼN,
    tꓺംⳇassetsⳇbrandⳇssᱼmobileᱼNᱼ2x = tꓺംⳇassetsⳇbrand + '/' + tꓺssᱼmobileᱼNᱼ2x,
    //
    tꓺobjꓺwidthHeightᱼ304x60ˣ2ꘌ608x120 = { [tꓺwidth]: 608, [tꓺheight]: 120 } as { width: number; height: number },
    tꓺobjꓺwidthHeightᱼ433x60ˣ2ꘌ866x120 = { [tꓺwidth]: 866, [tꓺheight]: 120 } as { width: number; height: number },
    tꓺobjꓺwidthHeightᱼ512x512ˣ2ꘌ1024x1024 = { [tꓺwidth]: 1024, [tꓺheight]: 1024 } as { width: number; height: number },
    tꓺobjꓺwidthHeightᱼ1200x630ˣ2ꘌ2400x1260 = { [tꓺwidth]: 2400, [tꓺheight]: 1260 } as { width: number; height: number },
    tꓺobjꓺwidthHeightᱼ630x1200ˣ2ꘌ1260x2400 = { [tꓺwidth]: 1260, [tꓺheight]: 2400 } as { width: number; height: number };

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
    // Enforces brand raw props being readonly.
    rawProps[pkgName] = $obj.deepFreeze(props) as $type.BrandRawProps;

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

    // `&`, `&&` are self-referential
    // Clever Canyon and Hop.gdn aliases.
    pkgName =
        '&' === pkgName
            ? tꓺමclevercanyonⳇclevercanyonംcom
            : //
              '&&' === pkgName
              ? tꓺමclevercanyonⳇhopംgdn
              : //
                pkgName;

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
    rawProps[tꓺමclevercanyonⳇclevercanyonംcom] = $obj.deepFreeze({
        [tꓺorg]: tꓺමclevercanyonⳇclevercanyonംcom,
        [tꓺtype]: tꓺcorp, // Corporation.

        [tꓺlegalName]: tꓺClever𑂱Canyon + ' LLC',
        [tꓺaddress]: {
            [tꓺstreet]: '9 N River Rd #660',
            [tꓺcity]: 'Auburn',
            [tꓺstate]: 'ME',
            [tꓺzip]: '04210',
            [tꓺcountry]: 'US',
        },
        [tꓺfounder]: $profile.get('@jaswrks'),
        [tꓺfoundingDate]: '2023-10-03',
        [tꓺnumberOfEmployees]: 10,

        [tꓺn7m]: 'c10n',
        [tꓺname]: tꓺClever𑂱Canyon,

        [tꓺpkgName]: tꓺමclevercanyonⳇclevercanyonംcom,
        [tꓺnamespace]: tꓺCleverCanyon,

        [tꓺhostname]: tꓺclevercanyonംcom,
        [tꓺmxHostname]: tꓺclevercanyonംcom,

        [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ,
        [tꓺstatusURL]: tꓺhttpsꓽⳇⳇstatusംclevercanyonംcomⳇ,

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
            [tꓺlinkColor]: '#ff9a62',
            [tꓺlineColor]: '#17171c',
            [tꓺheadingColor]: '#ed5f3b',
        },
        [tꓺicon]: {
            [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺicon + tꓺംsvg,
            [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺiconᱼ2x + tꓺംpng,
            ...tꓺobjꓺwidthHeightᱼ512x512ˣ2ꘌ1024x1024,
        },
        [tꓺlogo]: {
            [tꓺonDarkBg]: {
                [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼdarkᱼbg + tꓺംsvg,
                [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼdarkᱼbgᱼ2x + tꓺംpng,
            },
            [tꓺonLightBg]: {
                [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼlightᱼbg + tꓺംsvg,
                [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺlogoᱼonᱼlightᱼbgᱼ2x + tꓺംpng,
            },
            ...tꓺobjꓺwidthHeightᱼ433x60ˣ2ꘌ866x120,
        },
        [tꓺogImage]: {
            [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺogᱼimage + tꓺംsvg,
            [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺogᱼimageᱼ2x + tꓺംpng,
            ...tꓺobjꓺwidthHeightᱼ1200x630ˣ2ꘌ2400x1260,
        },
        [tꓺscreenshots]: {
            [tꓺdesktop]: {
                ...Object.fromEntries(
                    ((entries: [number, { svg: string; png: string }][] = []) => {
                        for (let i = 1; i <= 3; i++)
                            entries.push([
                                i,
                                {
                                    [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺssᱼdesktopᱼN.replace('{N}', i.toString()) + tꓺംsvg,
                                    [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺssᱼdesktopᱼNᱼ2x.replace('{N}', i.toString()) + tꓺംpng,
                                },
                            ]);
                        return entries;
                    })(),
                ),
                ...tꓺobjꓺwidthHeightᱼ1200x630ˣ2ꘌ2400x1260,
            },
            [tꓺmobile]: {
                ...Object.fromEntries(
                    ((entries: [number, { svg: string; png: string }][] = []) => {
                        for (let i = 1; i <= 3; i++)
                            entries.push([
                                i,
                                {
                                    [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺssᱼmobileᱼN.replace('{N}', i.toString()) + tꓺംsvg,
                                    [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇclevercanyon + '/' + tꓺssᱼmobileᱼNᱼ2x.replace('{N}', i.toString()) + tꓺംpng,
                                },
                            ]);
                        return entries;
                    })(),
                ),
                ...tꓺobjꓺwidthHeightᱼ630x1200ˣ2ꘌ1260x2400,
            },
        },
        [tꓺpolicies]: {
            [tꓺterms]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇlegalⳇ + tꓺterms,
            [tꓺprivacy]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇlegalⳇ + tꓺprivacy,
            [tꓺcookies]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇlegalⳇ + tꓺcookies,
            [tꓺsecurity]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇlegalⳇ + tꓺsecurity,
            [tꓺdsar]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇlegalⳇ + tꓺdsar,
        },
        [tꓺcontacts]: {
            [tꓺadmin]: {
                [tꓺemail]: tꓺadmin + tꓺමclevercanyonംcom,
                [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺcontact,
                [tꓺphone]: tꓺvꓺc10nPhone,
            },
            [tꓺinfo]: {
                [tꓺemail]: tꓺinfo + tꓺමclevercanyonംcom,
                [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺcontact,
                [tꓺphone]: tꓺvꓺc10nPhone,
            },
            [tꓺsupport]: {
                [tꓺemail]: tꓺsupport + tꓺමclevercanyonംcom,
                [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺcontact,
                [tꓺphone]: tꓺvꓺc10nPhone,
            },
            [tꓺsecurity]: {
                [tꓺemail]: tꓺsecurity + tꓺමclevercanyonംcom,
                [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺcontact,
                [tꓺphone]: tꓺvꓺc10nPhone,
            },
            [tꓺprivacy]: {
                [tꓺemail]: tꓺprivacy + tꓺමclevercanyonംcom,
                [tꓺurl]: tꓺhttpsꓽⳇⳇclevercanyonംcomⳇ + tꓺcontact,
                [tꓺphone]: tꓺvꓺc10nPhone,
            },
        },
        [tꓺsocialProfiles]: {
            [tꓺdiscord]: tꓺhttpsꓽⳇⳇdiscordംclevercanyonംcomⳇ,
            [tꓺtwitter]: tꓺhttpsꓽⳇⳇ + tꓺtwitter + tꓺംcom + '/' + tꓺclevercanyon,
            [tꓺlinkedin]: tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺlinkedin + tꓺംcom + '/' + tꓺcompany + '/' + tꓺclevercanyon,
            [tꓺfacebook]: tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺfacebook + tꓺംcom + '/' + tꓺclevercanyon,
            [tꓺkeybase]: tꓺhttpsꓽⳇⳇ + tꓺkeybase + tꓺംio + '/' + tꓺteam + '/' + tꓺclevercanyon,
            [tꓺgithub]: tꓺhttpsꓽⳇⳇ + tꓺgithub + tꓺംcom + '/' + tꓺclevercanyon,
            [tꓺnpm]: tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺnpmjs + tꓺംcom + '/' + tꓺorg + '/' + tꓺclevercanyon,
        },
    }) as unknown as $type.BrandRawProps;

    /**
     * Clever Canyon, LLC (dba: Hop.gdn).
     */
    rawProps[tꓺමclevercanyonⳇhopംgdn] = $obj.deepFreeze(
        $obj.mergeDeep(rawProps[tꓺමclevercanyonⳇclevercanyonംcom], {
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
                // Inherits c10n status URL.

                [tꓺslug]: tꓺhop,
                [tꓺvar]: tꓺhop,

                [tꓺslugPrefix]: tꓺhop + '-',
                [tꓺvarPrefix]: tꓺhop + '_',

                [tꓺslogan]: 'Masters of the digital divide.',
                [tꓺdescription]: 'Great things, built on great technology.',

                [tꓺtheme]: {
                    ...rawProps[tꓺමclevercanyonⳇclevercanyonംcom][tꓺtheme],
                    [tꓺlinkColor]: '#80aff9',
                    [tꓺheadingColor]: '#5596ff',
                },
                [tꓺicon]: {
                    [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺicon + tꓺംsvg,
                    [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺiconᱼ2x + tꓺംpng,
                    ...tꓺobjꓺwidthHeightᱼ512x512ˣ2ꘌ1024x1024,
                },
                [tꓺlogo]: {
                    [tꓺonDarkBg]: {
                        [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼdarkᱼbg + tꓺംsvg,
                        [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼdarkᱼbgᱼ2x + tꓺംpng,
                    },
                    [tꓺonLightBg]: {
                        [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼlightᱼbg + tꓺംsvg,
                        [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺlogoᱼonᱼlightᱼbgᱼ2x + tꓺംpng,
                    },
                    ...tꓺobjꓺwidthHeightᱼ304x60ˣ2ꘌ608x120,
                },
                [tꓺogImage]: {
                    [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺogᱼimage + tꓺംsvg,
                    [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺogᱼimageᱼ2x + tꓺംpng,
                    ...tꓺobjꓺwidthHeightᱼ1200x630ˣ2ꘌ2400x1260,
                },
                [tꓺscreenshots]: {
                    [tꓺdesktop]: {
                        ...Object.fromEntries(
                            ((entries: [number, { svg: string; png: string }][] = []) => {
                                for (let i = 1; i <= 3; i++)
                                    entries.push([
                                        i,
                                        {
                                            [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺssᱼdesktopᱼN.replace('{N}', i.toString()) + tꓺംsvg,
                                            [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺssᱼdesktopᱼNᱼ2x.replace('{N}', i.toString()) + tꓺംpng,
                                        },
                                    ]);
                                return entries;
                            })(),
                        ),
                        ...tꓺobjꓺwidthHeightᱼ1200x630ˣ2ꘌ2400x1260,
                    },
                    [tꓺmobile]: {
                        ...Object.fromEntries(
                            ((entries: [number, { svg: string; png: string }][] = []) => {
                                for (let i = 1; i <= 3; i++)
                                    entries.push([
                                        i,
                                        {
                                            [tꓺsvg]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺssᱼmobileᱼN.replace('{N}', i.toString()) + tꓺംsvg,
                                            [tꓺpng]: tꓺhttpsꓽⳇⳇr2ംhopംgdnⳇassetsⳇbrandsⳇhop + '/' + tꓺssᱼmobileᱼNᱼ2x.replace('{N}', i.toString()) + tꓺംpng,
                                        },
                                    ]);
                                return entries;
                            })(),
                        ),
                        ...tꓺobjꓺwidthHeightᱼ630x1200ˣ2ꘌ1260x2400,
                    },
                },
                [tꓺcontacts]: {
                    [tꓺadmin]: {
                        [tꓺemail]: tꓺadmin + tꓺමhopംgdn,
                        [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ + tꓺcontact,
                        [tꓺphone]: tꓺvꓺc10nPhone,
                    },
                    [tꓺinfo]: {
                        [tꓺemail]: tꓺinfo + tꓺමhopംgdn,
                        [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ + tꓺcontact,
                        [tꓺphone]: tꓺvꓺc10nPhone,
                    },
                    [tꓺsupport]: {
                        [tꓺemail]: tꓺsupport + tꓺමhopംgdn,
                        [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ + tꓺcontact,
                        [tꓺphone]: tꓺvꓺc10nPhone,
                    },
                    [tꓺsecurity]: {
                        [tꓺemail]: tꓺsecurity + tꓺමhopംgdn,
                        [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ + tꓺcontact,
                        [tꓺphone]: tꓺvꓺc10nPhone,
                    },
                    [tꓺprivacy]: {
                        [tꓺemail]: tꓺprivacy + tꓺමhopംgdn,
                        [tꓺurl]: tꓺhttpsꓽⳇⳇhopംgdnⳇ + tꓺcontact,
                        [tꓺphone]: tꓺvꓺc10nPhone,
                    },
                },
            },
        }),
    ) as unknown as $type.BrandRawProps;
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
                    [tꓺsvg]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇicon + tꓺംsvg),
                    [tꓺpng]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇiconᱼ2x + tꓺംpng),
                },
                [tꓺlogo]: {
                    [tꓺonDarkBg]: {
                        [tꓺsvg]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇlogoᱼonᱼdarkᱼbg + tꓺംsvg),
                        [tꓺpng]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇlogoᱼonᱼdarkᱼbgᱼ2x + tꓺംpng),
                    },
                    [tꓺonLightBg]: {
                        [tꓺsvg]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇlogoᱼonᱼlightᱼbg + tꓺംsvg),
                        [tꓺpng]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇlogoᱼonᱼlightᱼbgᱼ2x + tꓺംpng),
                    },
                },
                [tꓺogImage]: {
                    [tꓺsvg]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇogᱼimage + tꓺംsvg),
                    [tꓺpng]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇogᱼimageᱼ2x + tꓺംpng),
                },
                [tꓺscreenshots]: {
                    [tꓺdesktop]: {
                        ...Object.fromEntries(
                            ((entries: [number, { svg: string; png: string }][] = []) => {
                                for (let i = 1; i <= 3; i++)
                                    entries.push([
                                        i,
                                        {
                                            [tꓺsvg]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇssᱼdesktopᱼN.replace('{N}', i.toString()) + tꓺംsvg),
                                            [tꓺpng]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇssᱼdesktopᱼNᱼ2x.replace('{N}', i.toString()) + tꓺംpng),
                                        },
                                    ]);
                                return entries;
                            })(),
                        ),
                    },
                    [tꓺmobile]: {
                        ...Object.fromEntries(
                            ((entries: [number, { svg: string; png: string }][] = []) => {
                                for (let i = 1; i <= 3; i++)
                                    entries.push([
                                        i,
                                        {
                                            [tꓺsvg]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇssᱼmobileᱼN.replace('{N}', i.toString()) + tꓺംsvg),
                                            [tꓺpng]: relPathToURLString(tꓺംⳇassetsⳇbrandⳇssᱼmobileᱼNᱼ2x.replace('{N}', i.toString()) + tꓺംpng),
                                        },
                                    ]);
                                return entries;
                            })(),
                        ),
                    },
                },
            },
            props,
        ) as unknown as $type.BrandRawProps,
    );
};
