/**
 * Consent API.
 *
 * @review We need to add a `.well-known/gpc.json` file to indicate our respect for that header.
 * @review We need to ensure there is proof of consent, so screenshots periodically, snapshots of source code, etc.
 *
 * @requiredEnv web
 */

import { $cookie, $dom, $env, $fn, $json, $obj, $obp, $time, type $type } from '../../../../index.ts';
import { type UpdateEvent as DialogUpdateEvent } from '../../../../preact/components/consent-dialog.tsx';

/**
 * Defines types.
 */
export type State = {
    debug: boolean;
    promise: Promise<void>;
    initialized: boolean;

    dataVersion: string;
    ipGeoData: $env.IPGeoData;

    hasOptOutFlag: boolean;
    hasUpdatedPrefs: boolean;
    hasGeoStalePrefs: boolean;
    needsOpenDialog:
        | boolean // Or data.
        | $type.PartialDeep<Data>;

    canUseCookies: {
        essential: boolean;
        thirdParty: boolean;
        functionality: boolean;
        analytics: boolean;
        advertising: boolean;
    };
};
export type Data = {
    prefs: {
        optIn: {
            acceptFunctionalityCookies: boolean | null;
            acceptAnalyticsCookies: boolean | null;
            acceptAdvertisingCookies: boolean | null;
        };
        optOut: {
            doNotSellOrSharePII: boolean | null;
        };
    };
    version: string;
    lastUpdated: number;
    lastUpdatedFrom: {
        country: string;
        regionCode: string;
    };
};
export type OpenDialogEvent = CustomEvent<{ data: $type.PartialDeep<Data> }>;

// ---
// API exports.

/**
 * Holds current state.
 *
 * @see initialize() for details.
 */
export const state: State = {} as State;

/**
 * Initializes state, etc.
 *
 * Callers should explicitly initialize consent, such that this module can be imported without it triggering
 * side-effects. If the consent API is used prior to being properly initialized, it will break. The best practice is to
 * wrap all consent calls with a `useConsent` promise, which calls this initializer and resolves exports.
 *
 *     type Consent = typeof import('./consent.ts');
 *     const useConsent = new Promise<Consent>((resolve): void => {
 *         void import('./consent.ts').then((consent): void => {
 *             void consent.initialize().then(() => resolve(consent));
 *         });
 *     });
 *     useConsent.then(({ openDialog }) => openDialog());
 *
 * Consider carefully when changing the format or contents of cookie data. Remember, we store consent data in a
 * client-side cookie, which includes a version. It’s important to know what version of data a cookie has, and equally
 * important to know whether that version of data is compatible with the current version that our API is running.
 *
 * To debug consent and analytics APIs set the following cookie and/or environment variable:
 *
 *     document.cookie = 'DEBUG=consent=1&analytics=1'; // `1`, or any truthy value will do.
 */
export const initialize = async (): Promise<void> => {
    // Initializes promise one time only.
    if (state.promise as unknown) return state.promise;

    // Sets potential debug mode for this API.
    state.debug = $env.inDebugMode({ consent: '!!' });

    // Initializes and returns a consent promise.
    return (state.promise = new Promise((resolve): void => {
        // Fetches remote IP geolocation data using our utilities.
        void $env.ipGeoData().then((ipGeoData: $env.IPGeoData): void => {
            // Waits for the DOM to reach ready state.
            $dom.onReady((): void => {
                // Initializes consent state.
                $obj.patchDeep(state, {
                    debug: state.debug,
                    promise: state.promise,
                    initialized: false,

                    dataVersion: '1.0.0',
                    ipGeoData, // From above.

                    hasOptOutFlag: false,
                    hasUpdatedPrefs: false,
                    hasGeoStalePrefs: false,
                    needsOpenDialog: false,

                    canUseCookies: {
                        essential: true,
                        thirdParty: false,
                        functionality: false,
                        analytics: false,
                        advertising: false,
                    },
                } as State);

                // Updates consent state using cookie data.
                updateStateUsingData(cookieData()); // Via cookie.

                // Listens for consent dialog updates.
                $dom.on(document, 'x:consentDialog:update', (event: DialogUpdateEvent) => {
                    updateStateUsingData(event.detail.data);
                });
                // Flags state as fully initialized now.
                state.initialized = true;

                // Resolves promise.
                resolve(); // Good to go.
            });
        });
    }));
};

/**
 * Opens consent dialog.
 *
 * @param data Optional partially preconfigured consent data; {@see Data}.
 */
export const openDialog = (data?: $type.PartialDeep<Data>): void => {
    state.needsOpenDialog = data || true; // In case dialog is not yet listening to DOM events.
    $dom.trigger(document, 'x:consent:openDialog', { data: data || {} });
};

// ---
// Stateless exports.

/**
 * Gets consent cookie data.
 *
 * This export MUST remain stateless, as it is explicitly imported by our consent dialog. It should not depend on state,
 * and it should not depend on anything else in this file that directly or indirectly depends on state.
 *
 * @returns Consent data; {@see Data}.
 */
export const cookieData = (): Data => {
    let data = $fn.try(() => $json.parse($cookie.get('consent') || '{}'), {})();

    const typeCastedPrefs = <Type extends object>(prefs: Type): Type => {
        for (const [key, value] of Object.entries(prefs)) {
            (prefs as $type.Object)[key] = null === value ? value : Boolean(value);
        }
        return prefs;
    };
    return {
        prefs: {
            optIn: typeCastedPrefs({
                acceptFunctionalityCookies: $obp.get(data, 'prefs.optIn.acceptFunctionalityCookies', null),
                acceptAnalyticsCookies: $obp.get(data, 'prefs.optIn.acceptAnalyticsCookies', null),
                acceptAdvertisingCookies: $obp.get(data, 'prefs.optIn.acceptAdvertisingCookies', null),
            } as Data['prefs']['optIn']),

            optOut: typeCastedPrefs({
                doNotSellOrSharePII: $obp.get(data, 'prefs.optOut.doNotSellOrSharePII', null),
            } as Data['prefs']['optOut']),
        },
        version: String($obp.get(data, 'version', '')),
        lastUpdated: Number($obp.get(data, 'lastUpdated', 0)) || 0,
        lastUpdatedFrom: {
            country: String($obp.get(data, 'lastUpdatedFrom.country', '')),
            regionCode: String($obp.get(data, 'lastUpdatedFrom.regionCode', '')),
        },
    };
};

/**
 * Updates consent cookie data.
 *
 * This export MUST remain stateless, as it is explicitly imported by our consent dialog. It should not depend on state,
 * and it should not depend on anything else in this file that directly or indirectly depends on state.
 *
 * @param data Consent data; {@see Data}.
 */
export const updateCookieData = (data: Data): void => {
    $cookie.set('consent', $json.stringify(data, { pretty: true }));
};

// ---
// Misc utilities.

/**
 * Updates consent state using data.
 *
 * @param data Consent data; {@see Data}.
 *
 * @diagram https://coggle.it/diagram/ZUg4jScP9MedqiuI/t/user/bca9701d3238b926fad4768aafce4182cfcecd58398bf379fad917f714c9d3ea
 */
const updateStateUsingData = (data: Data): void => {
    state.hasUpdatedPrefs = data.lastUpdated ? true : false;
    state.hasOptOutFlag = $env.hasGlobalPrivacy() || data.prefs.optOut.doNotSellOrSharePII ? true : false;
    state.hasGeoStalePrefs = state.hasUpdatedPrefs && // e.g., Whenever a user has changed locations since last setting prefs.
        (data.lastUpdatedFrom.country !== state.ipGeoData.country || data.lastUpdatedFrom.regionCode !== state.ipGeoData.regionCode); // prettier-ignore

    if (!state.hasOptOutFlag && 'US' === state.ipGeoData.country) {
        $obj.patchDeep(state.canUseCookies, {
            essential: true, // Always on.
            thirdParty: state.hasGeoStalePrefs ? false : true,
            functionality: state.hasGeoStalePrefs || false === data.prefs.optIn.acceptFunctionalityCookies ? false : true,
            analytics: state.hasGeoStalePrefs || false === data.prefs.optIn.acceptAnalyticsCookies ? false : true,
            advertising: state.hasGeoStalePrefs || false === data.prefs.optIn.acceptAdvertisingCookies ? false : true,
        });
        state.needsOpenDialog = state.hasGeoStalePrefs ? true : false;
    } else {
        $obj.patchDeep(state.canUseCookies, {
            essential: true, // Always on.
            thirdParty: !state.hasOptOutFlag && !state.hasGeoStalePrefs ? true : false,
            functionality: !state.hasOptOutFlag && !state.hasGeoStalePrefs && true === data.prefs.optIn.acceptFunctionalityCookies ? true : false,
            analytics: !state.hasOptOutFlag && !state.hasGeoStalePrefs && true === data.prefs.optIn.acceptAnalyticsCookies ? true : false,
            advertising: !state.hasOptOutFlag && !state.hasGeoStalePrefs && true === data.prefs.optIn.acceptAdvertisingCookies ? true : false,
        });
        state.needsOpenDialog = !state.hasUpdatedPrefs || state.hasGeoStalePrefs ? true : false;
    }
    if (!state.needsOpenDialog) {
        if (data.lastUpdated && data.lastUpdated < $time.stamp() - 180 * $time.dayInSeconds) {
            state.needsOpenDialog = true;
        }
    }
    if (state.debug) {
        console.log('[consent]:', { state });
    }
};
