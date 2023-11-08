/**
 * Defines types for Google Analytics.
 */
interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
}
declare var dataLayer: unknown[][];
declare var gtag: (...args: unknown[]) => void;

/**
 * Defines types for `color-parse` module, which has none.
 */
declare module 'color-parse' {
    function parse(arg: number | string): { space: keyof chroma.ColorSpaces; values: number[]; alpha: number };
    export = parse; // Default export is the parser.
}
