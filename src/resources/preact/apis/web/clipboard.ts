/**
 * Clipboard API.
 *
 * @requiredEnv web
 */

import { $dom, $env, $obj, $str, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type State = {
    debug: boolean;
    promise: Promise<void>;
    addedListeners: boolean;
};

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
 * Callers should explicitly initialize clipboard, such that this module can be imported without it triggering
 * side-effects. If the clipboard API is used prior to being properly initialized, it will break. The best practice is
 * to wrap all clipboard calls with a `useClipboard` promise, which calls this initializer and resolves exports.
 *
 *     type Clipboard = typeof import('./clipboard.ts');
 *     const useClipboard = new Promise<Clipboard>((resolve): void => {
 *         void import('./clipboard.ts').then((clipboard): void => {
 *             void clipboard.initialize().then((): void => resolve(clipboard));
 *         });
 *     });
 *     useClipboard.then(({ addListeners }): void => void addListeners());
 *
 * To debug the clipboard API set the following cookie and/or environment variable:
 *
 *     document.cookie = 'APP_DEBUG=clipboard=1'; // `1`, or any truthy value will do.
 *
 * @returns Void promise.
 */
export const initialize = async (): Promise<void> => {
    // Initializes promise one time only.
    if (state.promise as unknown) return state.promise;

    // Sets potential debug mode for this API.
    state.debug = $env.inDebugMode({ clipboard: true });

    // Initializes and returns a clipboard promise.
    return (state.promise = new Promise((resolve): void => {
        // Initializes state.
        $obj.patchDeep(state, {
            debug: state.debug,
            promise: state.promise,
            addedListeners: false,
        } as State);

        // Resolves promise.
        resolve(); // Good to go.
    }));
};

/**
 * Copies something to clipboard.
 *
 * @param   value We only support `text/plain` right now.
 *
 * @returns       Void promise on success. Rejection on failure.
 */
export const copy = async (value: string): Promise<void> => {
    const type = 'text/plain';
    const blob = new Blob([value], { type });
    const data = [new ClipboardItem({ [type]: blob })];

    // Only available in secure contexts.
    return navigator.clipboard.write(data);
};

/**
 * Adds baked-in listeners.
 */
export const addListeners = async (): Promise<void> => {
    // Add listeners once only.
    if (state.addedListeners) return;
    state.addedListeners = true;

    // Attaches click listener and handler for all click-to-copy buttons.
    $dom.on(document, 'click', 'button[data-copy-id]', (event: $type.DOMEventDelegated): void => {
        // Click target; i.e., a click-to-copy button.
        const clickTarget = event.detail.target as HTMLElement;

        // Acquires copy target ID.
        const copyTargetId = clickTarget.dataset.copyId;
        if (!copyTargetId) return; // Bail; no copy target ID.

        // We’re using an attribute selector because hash IDs that begin with a `~` are technically invalid in
        // the eyes of `document.querySelector()`. We get around the nag by instead using an attribute selector.
        const copyTarget = $dom.query('[id="' + $str.escSelector(copyTargetId) + '"]') as unknown as HTMLElement | null;
        if (!copyTarget?.innerText) return; // ID not found, or nothing to actually copy.

        // Clones and cleans up text in the copy target.
        const cleanCopyTarget = copyTarget.cloneNode(true) as HTMLElement;
        // This removes, for example, line numbers added by starry night syntax highlighting.
        cleanCopyTarget.querySelectorAll('[hidden], [aria-hidden="true"]').forEach((node) => node.remove());

        // Shorter; optimizing for minification.
        const copyTargetClassList = copyTarget.classList,
            clickTargetClassList = clickTarget.classList;

        // Copy in-progress classes we apply to copy target.
        const copyTargetCopyInProgressClasses = ['-copy-in-progress'],
            // Copy success classes we apply to click target.
            clickTargetCopySuccessClasses = ['-copy-success'];

        // Disables click target while in-progress.
        $dom.setAtts(clickTarget, { disabled: '' });

        // Adds copy in-progress classes to copy target.
        copyTargetClassList.add(...copyTargetCopyInProgressClasses);

        // Peforms copy operation.
        void copy(cleanCopyTarget.innerText.trim())
            .then(() => {
                // Adds copy success classes to click target.
                clickTargetClassList.add(...clickTargetCopySuccessClasses);

                // Removes copy in-progress classes after just a brief delay.
                // Requires that any CSS transitions use a duration of `.5s`; i.e., matching timeout below.
                setTimeout(() => $dom.onNextFrame(() => copyTargetClassList.remove(...copyTargetCopyInProgressClasses)), 500);

                // Removes copy success classes and re-enables click target.
                // Requires that CSS transitions use a duration of `1s`; i.e., matching timeout below.
                setTimeout(
                    () =>
                        $dom.onNextFrame(() => {
                            clickTargetClassList.remove(...clickTargetCopySuccessClasses);
                            $dom.setAtts(clickTarget, { disabled: null });
                        }),
                    1000,
                );
            })
            .catch((copyError: Error) => state.debug && console.log({ copyError }));
    });
};
