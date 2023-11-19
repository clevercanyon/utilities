/**
 * Defines types for Turnstile.
 */
interface Window {
    onloadTurnstile: () => void;
}
declare var onloadTurnstile: () => void;

/**
 * Adds missing `remove()` fn.
 */
declare namespace Turnstile {
    interface Turnstile {
        remove(widgetId: string): void;
    }
}
