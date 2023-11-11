/**
 * Defines types for Google Analytics.
 */
interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
}
declare var dataLayer: unknown[][];
declare var gtag: (...args: unknown[]) => void;
