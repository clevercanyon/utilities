/**
 * Profile utilities.
 */

import '#@initialize.ts';

import { $class, $obj, $str, type $type } from '#index.ts';

/**
 * Tracks initialization.
 */
let rawPropsInitialized = false;

/**
 * Cache of instances keyed by username.
 */
const instances: { [x: string]: $type.Profile } = {};

/**
 * Raw props keyed by username.
 */
const rawProps: { [x: string]: $type.ProfileRawProps } = {};

/**
 * Defines tokens.
 *
 * Why are there so many crazy variables used here? The intention is to optimize for minification. i.e., By using as
 * many variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome.
 * Remember, variable names can be minified, so the length of variable names is not an issue.
 */
const tꓺbrucewrks = 'brucewrks',
    tꓺCaldwell = 'Caldwell',
    tꓺംcom = '.com',
    tꓺdescription = 'description',
    tꓺfacebook = 'facebook',
    tꓺfirstName = 'firstName',
    tꓺgithub = 'github',
    tꓺgravatar = 'gravatar',
    tꓺheadline = 'headline',
    tꓺംhopംgdn = '.hop.gdn',
    tꓺhttpsꓽⳇⳇ = 'https://',
    tꓺംio = '.io',
    tꓺjaswrks = 'jaswrks',
    tꓺkeybase = 'keybase',
    tꓺlastName = 'lastName',
    tꓺlinkedin = 'linkedin',
    tꓺlocation = 'location',
    tꓺNorthern𑂱Maine𑂱USA = 'Northern Maine, USA',
    tꓺnpm = 'npm',
    tꓺnpmjs = tꓺnpm + 'js',
    tꓺsocialProfiles = 'socialProfiles',
    tꓺtwitter = 'twitter',
    tꓺurl = 'url',
    tꓺusername = 'username',
    tꓺworkers = 'workers',
    tꓺwwwം = 'www.',
    tꓺx = 'x',
    //
    tꓺhttpsꓽⳇⳇxംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺx + tꓺംcom + '/',
    tꓺhttpsꓽⳇⳇtwitterംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺtwitter + tꓺംcom + '/',
    tꓺhttpsꓽⳇⳇwwwംlinkedinംcomⳇinⳇ = tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺlinkedin + tꓺംcom + '/in/',
    tꓺhttpsꓽⳇⳇwwwംfacebookംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺfacebook + tꓺംcom + '/',
    tꓺhttpsꓽⳇⳇgithubംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺgithub + tꓺംcom + '/',
    tꓺhttpsꓽⳇⳇwwwംnpmjsംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺnpmjs + tꓺംcom + '/~',
    tꓺhttpsꓽⳇⳇkeybaseംioⳇ = tꓺhttpsꓽⳇⳇ + tꓺkeybase + tꓺംio + '/',
    //
    tꓺhttpsꓽⳇⳇworkersംhopംgdnⳇapiⳇgravatarⳇv1ⳇ = tꓺhttpsꓽⳇⳇ + tꓺworkers + tꓺംhopംgdn + '/api/' + tꓺgravatar + '/v1/',
    tꓺobjꓺwidthHeight512x512 = { width: 512, height: 512 } as { width: number; height: number };

/**
 * Adds a new profile at runtime.
 *
 * @param   username The profile’s username.
 * @param   props    Raw profile props; {@see $type.ProfileRawProps}.
 *
 * @returns          Profile instance {@see $type.Profile}.
 */
export const add = (username: string, props: $type.ProfileRawProps): $type.Profile => {
    if (!rawPropsInitialized) initializeRawProps();

    if (Object.hasOwn(rawProps, username)) {
        throw Error('Czuf6MDV');
    }
    // Enforces raw props being readonly.
    rawProps[username] = $obj.deepFreeze(props);

    return get(username);
};

/**
 * Removes a profile at runtime.
 *
 * @param username The profile’s username.
 */
export const remove = (username: string): void => {
    if (!rawPropsInitialized) initializeRawProps();

    if (Object.hasOwn(rawProps, username)) {
        delete rawProps[username];
    }
};

/**
 * Gets a profile instance.
 *
 * @param   username Profile username.
 *
 * @returns          Profile instance {@see $type.Profile}.
 */
export const get = (username: string): $type.Profile => {
    if (!rawPropsInitialized) initializeRawProps();

    username = $str.lTrim(username, '@');
    username = '&' === username ? tꓺjaswrks : username;
    // `&` is a self-referential founder alias.

    if (!username || !rawProps[username]) {
        throw Error('72PZaBbj');
    }
    if (instances[username]) {
        return instances[username];
    }
    const Profile = $class.getProfile();
    instances[username] = new Profile({ ...rawProps[username] });

    return instances[username];
};

/**
 * Initializes raw props.
 */
const initializeRawProps = (): void => {
    if (rawPropsInitialized) return;
    rawPropsInitialized = true;

    /**
     * Jason Caldwell.
     */
    rawProps[tꓺjaswrks] = $obj.deepFreeze({
        [tꓺfirstName]: 'Jason',
        [tꓺlastName]: tꓺCaldwell,
        [tꓺusername]: tꓺjaswrks,

        [tꓺheadline]: 'Engineering Manager, Consultant, Staff Engineer',
        [tꓺdescription]: 'Entrepreneur and full-stack engineer with 20+ years experience.',

        [tꓺlocation]: tꓺNorthern𑂱Maine𑂱USA,
        [tꓺurl]: tꓺhttpsꓽⳇⳇ + tꓺjaswrks + tꓺംcom + '/',

        [tꓺgravatar]: {
            [tꓺurl]: tꓺhttpsꓽⳇⳇworkersംhopംgdnⳇapiⳇgravatarⳇv1ⳇ + '17c7f6ff2e18895eb11da018bf928c8a3e3603607546426805f29f2a700e693c.png?size=512',
            ...tꓺobjꓺwidthHeight512x512,
        },
        [tꓺsocialProfiles]: {
            [tꓺx]: tꓺhttpsꓽⳇⳇxംcomⳇ + tꓺjaswrks,
            [tꓺtwitter]: tꓺhttpsꓽⳇⳇtwitterംcomⳇ + tꓺjaswrks,
            [tꓺlinkedin]: tꓺhttpsꓽⳇⳇwwwംlinkedinംcomⳇinⳇ + tꓺjaswrks,
            [tꓺfacebook]: tꓺhttpsꓽⳇⳇwwwംfacebookംcomⳇ + tꓺjaswrks,
            [tꓺkeybase]: tꓺhttpsꓽⳇⳇkeybaseംioⳇ + tꓺjaswrks,
            [tꓺgithub]: tꓺhttpsꓽⳇⳇgithubംcomⳇ + tꓺjaswrks,
            [tꓺnpm]: tꓺhttpsꓽⳇⳇwwwംnpmjsംcomⳇ + tꓺjaswrks,
        },
    });

    /**
     * Bruce Caldwell.
     */
    rawProps[tꓺbrucewrks] = $obj.deepFreeze({
        [tꓺfirstName]: 'Bruce',
        [tꓺlastName]: tꓺCaldwell,
        [tꓺusername]: tꓺbrucewrks,

        [tꓺheadline]: 'Senior Fullstack Engineer, NodeJS, React, PHP, DevOps',
        [tꓺdescription]: 'Entrepreneur and full-stack engineer with 10+ years experience.',

        [tꓺlocation]: tꓺNorthern𑂱Maine𑂱USA,
        [tꓺurl]: tꓺhttpsꓽⳇⳇgithubംcomⳇ + tꓺbrucewrks,

        [tꓺgravatar]: {
            [tꓺurl]: tꓺhttpsꓽⳇⳇworkersംhopംgdnⳇapiⳇgravatarⳇv1ⳇ + 'bcdabcc96b6c049e1de6e6e32b0d4b772a4e9cb92e14e50591ee021ec4dd8317.png?size=512',
            ...tꓺobjꓺwidthHeight512x512,
        },
        [tꓺsocialProfiles]: {
            [tꓺx]: tꓺhttpsꓽⳇⳇxംcomⳇ + tꓺbrucewrks,
            [tꓺtwitter]: tꓺhttpsꓽⳇⳇtwitterംcomⳇ + tꓺbrucewrks,
            [tꓺlinkedin]: tꓺhttpsꓽⳇⳇwwwംlinkedinംcomⳇinⳇ + tꓺbrucewrks,
            [tꓺfacebook]: tꓺhttpsꓽⳇⳇwwwംfacebookംcomⳇ + tꓺbrucewrks,
            [tꓺkeybase]: tꓺhttpsꓽⳇⳇkeybaseംioⳇ + tꓺbrucewrks,
            [tꓺgithub]: tꓺhttpsꓽⳇⳇgithubംcomⳇ + tꓺbrucewrks,
            [tꓺnpm]: tꓺhttpsꓽⳇⳇwwwംnpmjsംcomⳇ + tꓺbrucewrks,
        },
    });
};
