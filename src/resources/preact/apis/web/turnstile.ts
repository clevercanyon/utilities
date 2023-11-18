/**
 * Turnstile API.
 *
 * @requiredEnv web
 */

import { $dom, $env, $obj } from '../../../../index.ts';

/**
 * Defines types.
 */
export type State = {
    debug: boolean;
    promise: Promise<void>;
    deployPromise?: Promise<Turnstile>;
};
export type Turnstile = Turnstile.Turnstile;

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
 * Callers should explicitly initialize turnstile, such that this module can be imported without it triggering
 * side-effects. If the turnstile API is used prior to being properly initialized, it will break. The best practice is
 * to wrap all turnstile calls with a `useTurnstile` promise, which calls this initializer and resolves exports.
 *
 *     type Turnstile = typeof import('./turnstile.ts');
 *     const useTurnstile = new Promise<Turnstile>((resolve): void => {
 *         void import('./turnstile.ts').then((turnstile): void => {
 *             void turnstile.initialize().then((): void => resolve(turnstile));
 *         });
 *     });
 *     useTurnstile.then(({ deploy }) => deploy().then({ render }) => render(...));
 *
 * To debug the turnstile API set the following cookie and/or environment variable:
 *
 *     document.cookie = 'APP_DEBUG=turnstile=1'; // `1`, or any truthy value will do.
 *
 * @returns Void promise.
 */
export const initialize = async (): Promise<void> => {
    // Initializes promise one time only.
    if (state.promise as unknown) return state.promise;

    // Sets potential debug mode for this API.
    state.debug = $env.inDebugMode({ turnstile: true });

    // Initializes and returns a turnstile promise.
    return (state.promise = new Promise((resolve): void => {
        // Initializes consent state.
        $obj.patchDeep(state, {
            debug: state.debug,
            promise: state.promise,
            deployPromise: undefined,
        } as State);

        // Resolves promise.
        resolve(); // Good to go.
    }));
};

/**
 * Deploys turnstile.
 *
 * @returns Turnstile promise.
 */
export const deploy = async (): Promise<Turnstile> => {
    // Deploys promise one time only.
    if (state.deployPromise) return state.deployPromise;

    // Deploys and returns a turnstile API promise.
    return (state.deployPromise = new Promise((resolve): void => {
        // Waits for the DOM to reach ready state.
        $dom.onReady((): void => {
            // Defines turnstile onload callback.
            window.onloadTurnstile = (): void => resolve(turnstile);

            // Parent element receiving turnstile script tag.
            let parentElement: Element; // Parent container.

            // Parent element receiving turnstile script tag.
            if ($dom.xPreactApp() /* Preact apps use `<x-preact-app-turnstile>`. */) {
                $dom.bodyAppend((parentElement = $dom.create('x-preact-app-turnstile', { class: 'block' })));
            } else parentElement = $dom.head(); // `<head>` in all other cases.

            // Deploys turnstile using parent element container.
            // Note: Turnstile does not use cookies whatsoever, so no need for a consent check.
            parentElement.appendChild($dom.create('script', { async: true, src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstile' }));
        });
    }));
};
