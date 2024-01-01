/**
 * Analytics API.
 *
 * @requiredEnv web
 */

import { initialize as consentInitialize, state as consentState } from '#@preact/apis/web/consent.ts';
import { $app, $cookie, $dom, $env, $fn, $is, $json, $obj, $str, $url, type $type } from '#index.ts';
import { finder as buildCSSSelector } from '@medv/finder';

/**
 * Defines types.
 */
export type State = {
    debug: boolean;
    promise: Promise<void>;

    initialized: boolean;
    consentInitialized: boolean;

    configured: boolean;
    deployed: boolean;

    context: string;
    subcontext: string;

    userId: string;
    customerId: string;

    gtagId: string;
    // Others may come in future updates.
};
export type EventProps = { [x: string]: unknown };

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
 * Callers should explicitly initialize analytics, such that this module can be imported without it triggering
 * side-effects. If the analytics API is used prior to being properly initialized, it will break. The best practice is
 * to wrap all analytics calls with a `useAnalytics` promise, which calls this initializer and resolves exports.
 *
 *     type Analytics = typeof import('./analytics.ts');
 *     const useAnalytics = new Promise<Analytics>((resolve): void => {
 *         void import('./analytics.ts').then((analytics): void => {
 *             void analytics.initialize().then((): void => resolve(analytics));
 *         });
 *     });
 *     useAnalytics.then(({ trackPageView }): void => void trackPageView());
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
    state.debug = $env.inDebugMode({ analytics: true });

    // Initializes and returns an analytics promise.
    return (state.promise = new Promise((resolve): void => {
        // Awaits window loading completion.
        $dom.onLoad((): void => {
            // Awaits consent API initialization.
            void consentInitialize().then((): void => {
                // Acquires app’s brand.
                const brand = $app.brand();

                // Initializes analytics state.
                $obj.patchDeep(state, {
                    debug: state.debug,
                    promise: state.promise,

                    initialized: false,
                    consentInitialized: false,

                    configured: false,
                    deployed: false,

                    context: 'web', // This is explicitly `web` analytics.
                    subcontext: ['site'].includes(brand.type) ? brand.type : 'unknown',

                    userId: $cookie.get('utx_user_id', ''),
                    customerId: $cookie.get('utx_customer_id', ''),

                    // Default gtag ID is our own; i.e., for Clever Canyon.
                    gtagId: $env.get('APP_GTAG_ID', { type: 'string', default: 'G-Y5BS7MMHMD' }),
                } as State);

                // Initializes analytics providers.
                initializeProviders(); // + Consent data.

                // Configures analytics providers.
                configureProviders(); // e.g., Event trackers.

                // Extracts from consent state.
                const { ipGeoData, canUse } = consentState;

                // Because Google Analytics is our primary analytics provider, who is indeed a third party,
                // there is simply no reason to deploy if third-party cookies are not currently allowed by user.
                // e.g., `anonId()`, `sessionId()`, and other parts of our API depend on Google Analytics.

                // Checks if user is in a GA banned country.
                const inBannedCountry = gaBannedCountries.includes(ipGeoData.country);

                // Conditionally deploys analytics providers.
                if (canUse.thirdParty && canUse.analytics && !inBannedCountry) deployProviders();

                // Listens for consent state updates.
                $dom.on(document, 'x:consent:stateUpdate', (): void => {
                    // Updates consent data associated with analytics providers.
                    updateProvidersConsentData(); // Uses consent state.

                    // If not deployed already...
                    if (!state.deployed) {
                        // Extracts from consent state.
                        const { canUse } = consentState;

                        // Conditionally deploys analytics providers.
                        if (canUse.thirdParty && canUse.analytics && !inBannedCountry) deployProviders();
                    }
                });
                // Tracking events will be pending promise resolution until we have at least deployed Google Analytics,
                // who is our primary analytics provider. However, tracking events can still be queued up, such that if we
                // do deploy at some point, they will then fire in the order they were triggered by various callers.

                resolve(); // Resolves promise.
            });
        });
    }));
};

/**
 * Gets anon ID (aka: client ID), powered by GA.
 *
 * @returns Anon ID promise; e.g., `826737564.1651025377` (20 chars); 36 chars max.
 */
export const anonId = async (): Promise<string> => {
    return new Promise((resolve) => {
        gtag('get', state.gtagId, 'client_id', resolve);
    }).then((value: unknown): string => String(value || ''));
};

/**
 * Gets session ID (based on timestamp), powered by GA.
 *
 * @returns Session ID promise; e.g., `1651031160` (10 chars); 36 chars max.
 */
export const sessionId = async (): Promise<string> => {
    return new Promise((resolve) => {
        gtag('get', state.gtagId, 'session_id', resolve);
    }).then((value: unknown): string => String(value || ''));
};

/**
 * Gets user ID (e.g., a hash).
 *
 * @returns User ID promise; 36 chars max.
 */
export const userId = async (): Promise<string> => {
    return state.userId; // Async uniformity.
};

/**
 * Gets customer ID (e.g., a hash).
 *
 * @returns Customer ID promise; 36 chars max.
 */
export const customerId = async (): Promise<string> => {
    return state.customerId; // Async uniformity.
};

/**
 * Tracks a page view event.
 *
 * @param   props Optional event props.
 *
 * @returns       True promise on success.
 */
export const trackPageView = async (props: EventProps = {}): Promise<boolean> => {
    if ($url.getQueryVar('utm_source')) {
        $cookie.set('utx_touch', $json.stringify(utmXQueryVars()));
    }
    return trackEvent('page_view', props);
};

/**
 * Tracks a click event.
 *
 * @param   element Element clicked.
 * @param   props   Optional event props.
 *
 * @returns         True promise on success.
 */
export const trackClick = async (element: HTMLElement, props: EventProps = {}): Promise<boolean> => {
    return trackElement(element, 'x_click', props);
};

/**
 * Tracks a submit event.
 *
 * @param   element Element submitted.
 * @param   props   Optional event props.
 *
 * @returns         True promise on success.
 */
export const trackSubmit = async (element: HTMLElement, props: EventProps = {}): Promise<boolean> => {
    return trackElement(element, 'x_submit', props);
};

/**
 * Tracks an element event.
 *
 * @param   element   Element to track.
 * @param   eventName Custom event name.
 * @param   props     Optional event props.
 *
 * @returns           True promise on success.
 */
export const trackElement = async (element: HTMLElement, eventName: string, props: EventProps = {}): Promise<boolean> => {
    const parent = element.closest(semanticParentSelectors().join(','));
    if (!$is.htmlElement(parent)) return false; // Not in a semantic parent.

    const parentTagName = parent.tagName.toLowerCase();
    const elementTagName = element.tagName.toLowerCase();

    return trackEvent(eventName, {
        x_parent_flex_id: $str.clip(domPathTo(parent) || '<' + parentTagName + '>', { maxChars: 100 }),
        x_parent_flex_subid: $str.clip('<' + parentTagName + '>', { maxChars: 100 }),

        x_class_id: $str.clip(element.dataset.classId || '', { maxChars: 100 }),
        x_class_subid: $str.clip(element.dataset.classSubid || '', { maxChars: 100 }),

        x_flex_id: $str.clip(domPathTo(element) || '<' + elementTagName + '>', { maxChars: 100 }),
        x_flex_subid: $str.clip('<' + elementTagName + '>', { maxChars: 100 }),

        ...('x_click' === eventName
            ? {
                  x_flex_value: $str.clip((element as HTMLAnchorElement).href || (element as HTMLButtonElement).formAction || '', { maxChars: 100 }),
                  x_flex_subvalue: $str.clip(element.title || element.innerText.replace(/\s+/gu, ' ').trim() || '', { maxChars: 100 }),
              }
            : 'x_submit' === eventName
              ? {
                    x_flex_value: $str.clip((element as HTMLFormElement).action || $url.current(), { maxChars: 100 }),
                    x_flex_subvalue: $str.clip(((element as HTMLFormElement).method || 'GET').toUpperCase(), { maxChars: 100 }),
                }
              : {}),
        ...props, // Any additional props passed in.
    });
};

/**
 * Tracks any single event.
 *
 * - Event naming rules in GA; {@see https://o5p.me/iBQAXv}.
 * - Event collection limits in GA; {@see https://o5p.me/MLg35g}.
 *
 * @param   name  Custom event name, or `page_view`.
 * @param   props Optional event props.
 *
 * @returns       True promise on success.
 */
export const trackEvent = async (name: string, props: EventProps = {}): Promise<boolean> => {
    if (!['page_view'].includes(name)) {
        if (!name.startsWith('x_')) name = 'x_' + name;
    }
    // Note: `anonId()`, `sessionId()` depend on Google Analytics.
    // If for any reason GA doesn’t load or does not resolve, nothing will occur until it does.
    return Promise.all([anonId(), sessionId(), userId(), customerId()]).then(([anonId, sessionId, userId, customerId]) => {
        const eventData = {
            // Let’s be specific.
            send_to: [state.gtagId],

            // A `user_id` strictly identifies logged-in users.
            // We also put `userId` into `user_properties` below.
            user_id: $str.clip(userId, { maxChars: 256 }) || undefined,

            // User properties, for any user, logged-in or otherwise.
            user_properties: {
                // These are a mirror of GA’s client/session IDs.
                x_anon_id: $str.clip(anonId, { maxChars: 36 }),
                x_session_id: $str.clip(sessionId, { maxChars: 36 }),

                // A logged-in user may also have a customer ID.
                x_user_id: $str.clip(userId, { maxChars: 36 }) || undefined,
                x_customer_id: $str.clip(userId ? customerId : '', { maxChars: 36 }) || undefined,
            },
            // Analytics contexts; e.g., `web`, `site`.
            x_context: $str.clip(state.context, { maxChars: 100 }),
            x_subcontext: $str.clip(state.subcontext, { maxChars: 100 }),

            // Analytics hostname; e.g., `acme.example.com:3000` (with port).
            x_hostname: $str.clip($url.currentHost({ withPort: true }), { maxChars: 100 }),

            ...utmXQueryVarDimensions(), // e.g., `x_utm_source`, etc.
            ...props, // Any additional props passed in.
        };
        if (state.debug /* Only when debugging. */) {
            if ($str.charLength(name) > 40) {
                throw Error('RCbdD6Dv'); // Event name exceeds 40 chars.
            }
            if ([anonId, sessionId, userId, customerId].some((id) => $str.charLength(id) > 36)) {
                // Technically, `userId` can be 256 chars, but we also put it in `user_properties`, which only allows `36`.
                throw Error('VKDvXeVR'); // Exceeds limit of 36 chars.
            }
            if (Object.keys(eventData).length > 25) {
                throw Error('BsW77Cjk'); // Event data exceeds total limit of 25 parameters.
            }
            for (const [key, value] of Object.entries(eventData)) {
                if ($str.charLength(key) > 40) throw Error('E7cVVUH6'); // Event parameter exceeds name limit of 40 chars.
                if ($is.string(value) && $str.charLength(value) > 100) throw Error('JpEhtbyf'); // Event parameter exceeds value limit of 100 chars.
            }
            console.log('[analytics]:', { eventName: name, eventData });
        }
        gtag('event', name, eventData);

        return true;
    });
};

// ---
// Misc utilities.

/**
 * Initializes analytics providers.
 */
const initializeProviders = (): void => {
    // Initializes once only.
    if (state.initialized) return;
    state.initialized = true;

    // Initializes Google Analytics.
    (window.dataLayer = []),
        (window.gtag = function () {
            dataLayer.push(arguments);
        });
    // Initializes consent data associated with analytics providers.
    updateProvidersConsentData(); // First update initializes.
};

/**
 * Configures analytics providers.
 */
const configureProviders = (): void => {
    // Configures once only.
    if (state.configured) return;
    state.configured = true;

    // Extracts from consent state.
    const { canUse } = consentState;

    // Configures Google Analytics `gtm.js` and `gtm.start` timer.
    // This must be the second queue addition, with consent being first.
    gtag('js', new Date()); // i.e., Current date/time.

    // Configures Google Analytics.
    // This must be the third queue addition.
    gtag('config', state.gtagId, {
        // General configuration values.
        groups: ['default'], // {@see https://o5p.me/YRKCj5}.
        send_page_view: false, // {@see https://o5p.me/xspUre}.
        debug_mode: state.debug, // {@see https://o5p.me/2eT772}.
        url_passthrough: false, // {@see https://o5p.me/vD9oq0}.

        // We don’t depend on these, so they are always in privacy mode, for now.
        allow_google_signals: canUse.advertising ? false : false, // {@see https://o5p.me/nSUIYa}.
        allow_ad_personalization_signals: canUse.advertising ? false : false, // {@see https://o5p.me/BkZrLm}.
        restricted_data_processing: canUse.advertising ? true : true, // {@see https://o5p.me/nIUVf6}.
        ads_data_redaction: canUse.advertising ? true : true, // {@see https://o5p.me/8JrK91}.
    });
    // Tracks initial page view.
    void trackPageView();

    // Sets up location change event tracking.
    $dom.on(document, 'x:location:change', (): void => void trackPageView());

    // Sets up click tracking for anchors, buttons, and input buttons.
    $dom.on(document, 'click', 'a, button, input[type="button"], input[type="submit"]', (event: $type.DOMEventDelegated): void => {
        void trackClick(event.detail.target as HTMLElement);
    });
    // Sets up form submission tracking.
    $dom.on(document, 'submit', 'form', (event: $type.DOMEventDelegated): void => {
        void trackSubmit(event.detail.target as HTMLElement);
    });
};

/**
 * Deploys analytics providers.
 */
const deployProviders = (): void => {
    // Deploys once only.
    if (state.deployed) return;
    state.deployed = true;

    // Extracts from consent state.
    const { canUse } = consentState;

    // Parent element receiving analytics tags.
    let parentElement: Element; // Parent container.

    // Parent element receiving analytics tags.
    if ($dom.xPreactApp() /* Preact apps use `<x-preact-app-analytics>`. */) {
        $dom.bodyAppend((parentElement = $dom.create('x-preact-app-analytics', { class: 'block' })));
    } else parentElement = $dom.head(); // `<head>` in all other cases.

    // Google Analytics is our primary analytics provider, who is indeed a third party.
    // This check exists for legal/privacy redundancy, but actually, it should never be `false` here.
    // i.e., Because Google Analytics is our primary analytics provider, there is simply no reason to deploy
    // if third-party cookies are disallowed, so we don’t. Therefore, we should not have a `false` condition here.
    if (canUse.thirdParty && canUse.analytics) {
        parentElement.appendChild($dom.create('script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=' + $url.encode(state.gtagId) }));
    }
};

/**
 * Updates consent data associated with analytics providers.
 *
 * Regarding {@see state.consentInitialized}. The first update initializes consent data. Consent data can then
 * potentially be updated beyond the initial data; e.g., if a user updates their preferences using our consent dialog.
 *
 * @diagram https://coggle.it/diagram/ZUg4jScP9MedqiuI/t/user/bca9701d3238b926fad4768aafce4182cfcecd58398bf379fad917f714c9d3ea
 */
const updateProvidersConsentData = (): void => {
    // Extracts from consent state.
    const { consentInitialized } = state,
        { canUse } = consentState;

    // Updates Google Analytics consent data.
    // When initializing, this must be the first addition to the GA queue.
    // i.e., Consent data must come even before `gtag('js', ...)`, and others.
    gtag('consent', consentInitialized ? 'update' : 'default', {
        // We do consider these to be essential cookies.
        // However, they are still third-party cookies that share/sell data.
        security_storage: canUse.thirdParty && canUse.essential ? 'granted' : 'denied',

        // We don’t consider these to be essential cookies.
        // For our purposes, personalization === functionality.
        functionality_storage: canUse.thirdParty && canUse.functionality ? 'granted' : 'denied',
        personalization_storage: canUse.thirdParty && canUse.functionality ? 'granted' : 'denied',

        // We don’t consider these to be essential cookies.
        // These are the only two buckets actually used by Google Analytics.
        analytics_storage: canUse.thirdParty && canUse.analytics ? 'granted' : 'denied',
        ad_storage: canUse.thirdParty && canUse.advertising ? 'granted' : 'denied',
    });
    // Flags consent data as having now been initialized.
    state.consentInitialized = true; // First update initializes consent data.
};

/**
 * Gets selector path leading to a given element in the DOM.
 *
 * This utility also exists as {@see $dom.pathTo()}; i.e., for other use cases. At this time, however, only our
 * analytics API is using the underlying `buildCSSSelector` dependency. Therefore, we have copied the utility into this
 * specific file to avoid the scenario where `buildCSSSelector` is added to an app’s bundle, given that our analytics
 * API is imported dynamically and does not intend to substanitally contribute to an app’s main bundle size.
 *
 * @param   element An {@see Element} in the DOM.
 *
 * @returns         Selector path leading to a given element in the DOM.
 */
const domPathTo = (element: Element): string => {
    return $fn.try(
        (): string =>
            buildCSSSelector(element, {
                root: $dom.xPreactApp() || $dom.body(),
            }),
        '',
    )();
};

/**
 * Gets an array of semantic parent selectors.
 *
 * @returns An array of semantic parent selectors.
 */
const semanticParentSelectors = (): string[] => ['header', 'main', 'aside', 'footer', 'x-preact-app', 'body'];

/**
 * Gets `ut[mx]_*` query variables.
 *
 * @returns `ut[mx]_*` query variables.
 */
const utmXQueryVars = (): $url.QueryVars => {
    return $url.getQueryVars(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utx_ref']);
};

/**
 * Gets `x_ut[mx]_*` query variable dimensions.
 *
 * @returns `x_ut[mx]_*` query variable dimensions.
 */
const utmXQueryVarDimensions = (): { [x: string]: string } => {
    const dimensions: { [x: string]: string } = {};
    const queryVars = utmXQueryVars();

    for (const [name, value] of Object.entries(queryVars)) {
        dimensions['x_' + name] = $str.clip(String(value), { maxChars: 100 });
    }
    return dimensions;
};

/**
 * Countries where Google Analytics has been banned.
 *
 * @review Consider using Plausible or another provider.
 *
 * @see https://plausible.io/blog/google-analytics-illegal
 */
const gaBannedCountries = ['AT', 'FR', 'IT', 'DK', 'FI', 'NO', 'SE'];
