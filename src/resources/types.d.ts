/**
 * Defines types for `color-parse` module, which has none.
 */
declare module 'color-parse' {
    function parse(arg: number | string): { space: keyof chroma.ColorSpaces; values: number[]; alpha: number };
    export = parse; // Default export is the parser.
}
