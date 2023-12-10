/**
 * Person utilities.
 */

import '#@initialize.ts';

import { $class, $str, type $type } from '#index.ts';

/**
 * Tracks initialization.
 */
let rawPropsInitialized = false;

/**
 * Cache of instances keyed by username.
 */
const instances: { [x: string]: $type.Person } = {};

/**
 * Raw props keyed by username.
 */
const rawProps: { [x: string]: $type.PersonRawProps } = {};

/**
 * Defines tokens.
 *
 * Why are there so many crazy variables used here? The intention is to optimize for minification. i.e., By using as
 * many variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome.
 * Remember, variable names can be minified, so the length of variable names is not an issue.
 */
const tꓺavatar = 'avatar',
    tꓺbrucewrks = 'brucewrks',
    tꓺCaldwell = 'Caldwell',
    tꓺംcom = '.com',
    tꓺdescription = 'description',
    tꓺfacebook = 'facebook',
    tꓺfirstName = 'firstName',
    tꓺgithub = 'github',
    tꓺgravatar = 'gravatar',
    tꓺheadline = 'headline',
    tꓺhttpsꓽⳇⳇ = 'https://',
    tꓺjaswrks = 'jaswrks',
    tꓺlastName = 'lastName',
    tꓺlinkedin = 'linkedin',
    tꓺnpm = 'npm',
    tꓺsocialProfiles = 'socialProfiles',
    tꓺtwitter = 'twitter',
    tꓺurl = 'url',
    tꓺusername = 'username',
    tꓺwwwം = 'www.',
    //
    tꓺhttpsꓽⳇⳇtwitterംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺtwitter + tꓺംcom + '/',
    tꓺhttpsꓽⳇⳇwwwംlinkedinംcomⳇinⳇ = tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺlinkedin + tꓺംcom + '/in/',
    tꓺhttpsꓽⳇⳇwwwംfacebookംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺfacebook + tꓺംcom + '/',
    tꓺhttpsꓽⳇⳇgithubംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺgithub + tꓺംcom + '/',
    tꓺhttpsꓽⳇⳇwwwംnpmjsംcomⳇ = tꓺhttpsꓽⳇⳇ + tꓺwwwം + tꓺnpm + 'js' + tꓺംcom + '/~',
    //
    tꓺhttpsꓽⳇⳇgravatarംcomⳇavatarⳇ = tꓺhttpsꓽⳇⳇ + tꓺgravatar + tꓺംcom + '/' + tꓺavatar + '/',
    tꓺobjꓺwidthHeight512x512 = { width: 512, height: 512 } as { width: number; height: number };

/**
 * Adds a new person at runtime.
 *
 * @param   username The person’s username.
 * @param   props    Raw person props; {@see $type.PersonRawProps}.
 *
 * @returns          Person instance {@see $type.Person}.
 */
export const add = (username: string, props: $type.PersonRawProps): $type.Person => {
    if (!rawPropsInitialized) initializeRawProps();

    if (Object.hasOwn(rawProps, username)) {
        throw new Error(); // Person `' + username + '` exists already.
    }
    rawProps[username] = props;

    return get(username);
};

/**
 * Removes a person at runtime.
 *
 * @param username The person’s username.
 */
export const remove = (username: string): void => {
    if (!rawPropsInitialized) initializeRawProps();

    if (Object.hasOwn(rawProps, username)) {
        delete rawProps[username];
    }
};

/**
 * Gets a person instance.
 *
 * @param   username Person username.
 *
 * @returns          Person instance {@see $type.Person}.
 */
export const get = (username: string): $type.Person => {
    if (!rawPropsInitialized) initializeRawProps();

    username = $str.lTrim(username, '@');
    username = '&' === username ? tꓺjaswrks : username;
    // `&` is a self-referential founder alias.

    if (!username || !rawProps[username]) {
        throw new Error(); // Missing person: `' + username + '`.
    }
    if (instances[username]) {
        return instances[username];
    }
    const Person = $class.getPerson(); // Person class.
    instances[username] = new Person({ ...rawProps[username] });

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
    rawProps[tꓺjaswrks] = {
        [tꓺfirstName]: 'Jason',
        [tꓺlastName]: tꓺCaldwell,
        [tꓺusername]: tꓺjaswrks,

        [tꓺheadline]: 'Engineering Manager, Consultant, Staff Engineer',
        [tꓺdescription]: 'Entrepreneur and full-stack engineer with 20+ years experience.',
        [tꓺurl]: tꓺhttpsꓽⳇⳇ + tꓺjaswrks + tꓺംcom + '/',

        [tꓺgravatar]: {
            [tꓺurl]: tꓺhttpsꓽⳇⳇgravatarംcomⳇavatarⳇ + '17c7f6ff2e18895eb11da018bf928c8a3e3603607546426805f29f2a700e693c?s=512',
            ...tꓺobjꓺwidthHeight512x512,
        },
        [tꓺsocialProfiles]: {
            [tꓺtwitter]: tꓺhttpsꓽⳇⳇtwitterംcomⳇ + tꓺjaswrks,
            [tꓺlinkedin]: tꓺhttpsꓽⳇⳇwwwംlinkedinംcomⳇinⳇ + tꓺjaswrks,
            [tꓺfacebook]: tꓺhttpsꓽⳇⳇwwwംfacebookംcomⳇ + tꓺjaswrks,
            [tꓺgithub]: tꓺhttpsꓽⳇⳇgithubംcomⳇ + tꓺjaswrks,
            [tꓺnpm]: tꓺhttpsꓽⳇⳇwwwംnpmjsംcomⳇ + tꓺjaswrks,
        },
    };

    /**
     * Bruce Caldwell.
     */
    rawProps[tꓺbrucewrks] = {
        [tꓺfirstName]: 'Bruce',
        [tꓺlastName]: tꓺCaldwell,
        [tꓺusername]: tꓺbrucewrks,

        [tꓺheadline]: 'Senior Fullstack Engineer, NodeJS, React, PHP, DevOps',
        [tꓺdescription]: 'Entrepreneur and full-stack engineer with 10+ years experience.',
        [tꓺurl]: tꓺhttpsꓽⳇⳇgithubംcomⳇ + tꓺbrucewrks,

        [tꓺgravatar]: {
            [tꓺurl]: tꓺhttpsꓽⳇⳇgravatarംcomⳇavatarⳇ + 'bcdabcc96b6c049e1de6e6e32b0d4b772a4e9cb92e14e50591ee021ec4dd8317?s=512',
            ...tꓺobjꓺwidthHeight512x512,
        },
        [tꓺsocialProfiles]: {
            [tꓺlinkedin]: tꓺhttpsꓽⳇⳇwwwംlinkedinംcomⳇinⳇ + tꓺbrucewrks,
            [tꓺgithub]: tꓺhttpsꓽⳇⳇgithubംcomⳇ + tꓺbrucewrks,
            [tꓺnpm]: tꓺhttpsꓽⳇⳇwwwംnpmjsംcomⳇ + tꓺbrucewrks,
        },
    };
};
