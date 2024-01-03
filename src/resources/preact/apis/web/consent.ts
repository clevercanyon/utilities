/**
 * Consent API.
 *
 * @requiredEnv web
 */

import { $dom, $env, $obj, $time, $user, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type State = $user.ConsentState & {
    debug: boolean;
    promise: Promise<void>;
    dataVersion: string;
    needsOpenDialog:
        | boolean // Or data.
        | $type.PartialDeep<$user.ConsentData>;
};
export type OpenDialogEvent = CustomEvent<{ data: $type.PartialDeep<$user.ConsentData> }>;

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
 *             void consent.initialize().then((): void => resolve(consent));
 *         });
 *     });
 *     useConsent.then(({ openDialog }): void => openDialog());
 *
 * Consider carefully when changing the format or contents of cookie data. Remember, we store consent data in a
 * client-side cookie, which includes a version. It’s important to know what version of data a cookie has, and equally
 * important to know whether that version of data is compatible with the current version that our API is running.
 *
 * To debug consent and analytics APIs set the following cookie and/or environment variable:
 *
 *     document.cookie = 'APP_DEBUG=consent=1&analytics=1'; // `1`, or any truthy value will do.
 *
 * @returns Void promise.
 */
export const initialize = async (): Promise<void> => {
    // Initializes promise one time only.
    if (state.promise as unknown) return state.promise;

    // Sets potential debug mode for this API.
    state.debug = $env.inDebugMode({ consent: true });

    // Initializes and returns a consent promise.
    return (state.promise = new Promise((resolve): void => {
        // Fetches remote IP geolocation data using our utilities.
        void $user.ipGeoData().then((ipGeoData: $user.IPGeoData): void => {
            // Waits for the DOM to reach ready state.
            $dom.onReady((): void => {
                // Initializes consent state.
                $obj.patchDeep(state, {
                    debug: state.debug,
                    promise: state.promise,

                    dataVersion: '1.0.0',
                    ipGeoData, // From above.

                    hasOptOutFlag: false,
                    hasUpdatedPrefs: false,
                    hasGeoStalePrefs: false,
                    needsOpenDialog: false,

                    canUse: {
                        essential: true,
                        thirdParty: false,
                        functionality: false,
                        analytics: false,
                        advertising: false,
                    },
                } as State);

                // Updates consent state.
                void updateState().then((): void => {
                    // Listens for consent dialog updates.
                    $dom.on(document, 'x:consentDialog:update', (): void => {
                        // Updates consent state.
                        void updateState().then((): void => {
                            $dom.trigger(document, 'x:consent:stateUpdate');
                        });
                    });
                    // Resolves promise.
                    resolve(); // Good to go.
                });
            });
        });
    }));
};

/**
 * Opens consent dialog.
 *
 * This accepts optional consent data, allowing a consent dialog to be opened in a preconfigured pseudo-state, ready to
 * save. For example, if a user is explicitly choosing to opt-out with a call-to-action like, "Do Not Sell or Share My
 * Personal Information", the opt-out setting can be preconfigured to enhance user experience.
 *
 * @param data Optional consent data; {@see $user.ConsentData}.
 */
export const openDialog = (data?: $type.PartialDeep<$user.ConsentData>): void => {
    state.needsOpenDialog = data || true; // In case dialog is not yet listening to DOM events.
    $dom.trigger(document, 'x:consent:openDialog', { data: data || {} });
};

// ---
// Misc utilities.

/**
 * Updates consent state.
 *
 * @diagram https://o5p.me/ZQ49Ij
 */
const updateState = async (): Promise<void> => {
    const data = $user.consentData();
    // Must patch with clones of readonly consent data.
    $obj.patchClonesDeep(state, await $user.consentState());

    if (!state.hasOptOutFlag && 'US' === state.ipGeoData.country) {
        state.needsOpenDialog = state.hasGeoStalePrefs ? true : false;
    } else {
        state.needsOpenDialog = !state.hasUpdatedPrefs || state.hasGeoStalePrefs ? true : false;
    }
    if (!state.needsOpenDialog) {
        if (data.lastUpdated && data.lastUpdated < $time.stamp() - (state.hasOptOutFlag ? 12 : 6) * $time.monthInSeconds) {
            state.needsOpenDialog = true;
        }
    }
    if (state.debug) {
        console.log('[consent]:', { state });
    }
};
