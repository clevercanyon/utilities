/**
 * Color utilities.
 */

import './resources/init.ts';

import * as c2k from 'color2k';
import parseColor from 'parse-css-color';
import tailwindColors from 'tailwindcss/colors.js';
import { $is, $obj, type $type } from './index.ts';

// These exist in code, but they are already removed from Tailwind’s types.
// Accessing them yields a warning in Node, so we need to avoid accessing any of these.
const deprecatedTailwindColorNames = ['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray'];

/**
 * Defines types.
 */
export type TailwindColors = typeof tailwindColors;
export type TailwindColorsWithShades = Omit<TailwindColors, TailwindSimpleColorName>;

export type TailwindColorName = keyof TailwindColors;
export type TailwindShadedColorName = keyof TailwindColorsWithShades;
export type TailwindSimpleColorName = 'inherit' | 'current' | 'transparent' | 'black' | 'white';

export type TailwindColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type TailwindColorShades<Name extends TailwindColorName> = Pick<TailwindColors, Name>;
export type TailwindShadedColorShades<Name extends TailwindShadedColorName> = Pick<TailwindColorsWithShades, Name>;

export type ToRGBOptions = { as?: 'default' | 'array' | 'object' };
export type RGBArray = [string, string, string, string];
export type RGBObject = { r: string; g: string; b: string; a: string };

export type ToHSLOptions = { as?: 'default' | 'array' | 'object' };
export type HSLArray = [string, string, string, string];
export type HSLObject = { h: string; s: string; l: string; a: string };

/**
 * Gets Tailwind CSS color(s).
 *
 * @param   name  Optional color name; {@see TailwindColorName}.
 * @param   shade Optional color shade; {@see TailwindColorShade}.
 *
 * @returns       Requested Tailwind CSS(s).
 *
 *   - If no `name` is given, returns a shallow clone of all Tailwind colors; i.e., the full object value.
 *   - If no `shade` is given, returns a named color’s object keyed by shade. Unless `name` is given as a simple color, in
 *       which case this returns a hex color code string, as there is no object; e.g., {@see TailwindSimpleColorName}.
 *   - Otherwise; i.e., if `name` and `shade` are given, returns a hex color code string.
 */
export function tw(): TailwindColors;
export function tw<Name extends TailwindSimpleColorName>(name: Name, shade?: TailwindColorShade): string;
export function tw<Name extends TailwindShadedColorName>(name: Name): TailwindShadedColorShades<Name>;
export function tw<Name extends TailwindShadedColorName>(name: Name, shade: TailwindColorShade): string;

export function tw<Name extends TailwindColorName, Shade extends TailwindColorShade>(name?: Name, shade?: Shade): TailwindColors | TailwindColorShades<Name> | string {
    if (!name) {
        const colors = {} as $type.Object;
        for (const key of Object.keys(tailwindColors))
            if (!deprecatedTailwindColorNames.includes(key)) {
                colors[key] = (tailwindColors as unknown as $type.Object)[key];
            }
        return $obj.cloneDeep(colors) as unknown as TailwindColors;
    }
    if ($is.string(tailwindColors[name]) /* Simple; i.e., no shades. */) {
        return tailwindColors[name as TailwindSimpleColorName] as string;
    }
    if (!shade) return tailwindColors[name] as unknown as TailwindColorShades<Name>;

    return tailwindColors[name][String(shade) as unknown as TailwindColorShade];
}

/**
 * Parses a color into a hex color code.
 *
 * @param   color Color to parse; {@see https://o5p.me/ce0m3O}.
 *
 *   - RGB/A color module level 3 and 4 (number, percentage).
 *   - HSL/A color module level 3 and 4 (number, deg, rad, turn).
 *   - Hexadecimal `#RGBA` `#RRGGBBAA` (4 and 8-char notations).
 *   - Hexadecimal RGB value: `#RGB` `#RRGGBB` (3 and 6-char notations).
 *
 * @returns       Hex color code; potentially with 8-chars; i.e., with alpha.
 *
 * @note Hex color codes must begin with `#` in order to parse w/o error.
 */
export const parse = (color: string): string => {
    const data = parseColor(color);

    if (!$is.object(data)) {
        throw new Error('Color parse error: `' + String(color) + '`.');
    }
    type Args = [number, number, number, number];

    if ('rgb' === data.type) {
        return c2k.toHex(c2k.rgba.apply(undefined, [...data.values, data.alpha] as Args));
    }
    if ('hsl' === data.type) {
        return c2k.toHex(c2k.hsla.apply(undefined, [data.values[0], data.values[1] / 100, data.values[2] / 100, data.alpha] as Args));
    }
    throw new Error('Color2k parse error: `' + String(color) + '`.');
};

/**
 * Converts a color to hex.
 *
 * @param   color Parseable color; {@see https://o5p.me/ce0m3O}.
 *
 * @returns       Hex color code; e.g., `#xxxxxx[xx]`.
 */
export const toHex = (color: string): string => {
    return c2k.toHex(parse(color));
};

/**
 * Converts a color to RGB.
 *
 * @param   color   Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   options Options (all optional); {@see ToRGBOptions}.
 *
 * @returns         By default, an RGB color code; e.g., `rgb(x x x / x)`.
 *
 *   - If `{ as: 'array' }` in options, this returns an array instead of a string.
 *   - If `{ as: 'object' }` in options, this returns an object instead of a string.
 */
export const toRGB = <Options extends ToRGBOptions>(
    color: string,
    options?: Options,
): Options extends { as: 'array' } ? RGBArray : Options extends { as: 'object' } ? RGBObject : string => {
    const opts = $obj.defaults({}, options || {}, { as: 'default' }) as Required<ToRGBOptions>;

    const [_r, _g, _b, _a] = c2k.parseToRgba(parse(color));

    const r = c2k.guard(0, 255, _r).toFixed();
    const g = c2k.guard(0, 255, _g).toFixed();
    const b = c2k.guard(0, 255, _b).toFixed();
    const a = String(parseFloat(c2k.guard(0, 1, _a).toFixed(3)));

    if ('array' === opts.as) {
        return [r, g, b, a] as ReturnType<typeof toRGB<Options>>;
    }
    if ('object' === opts.as) {
        return { r, g, b, a } as ReturnType<typeof toRGB<Options>>;
    }
    return ('rgb(' + [r, g, b].join(' ') + ' / ' + a + ')') as ReturnType<typeof toRGB<Options>>;
};

/**
 * Converts a color to an RGB list w/o alpha.
 *
 * @param   color Parseable color; {@see https://o5p.me/ce0m3O}.
 *
 * @returns       An RGB list w/o alpha; e.g., `x x x`; for a CSS variable.
 */
export const toRGBListNoAlpha = (color: string): string => {
    return toRGB(color, { as: 'array' }).slice(0, -1).join(' ');
};

/**
 * Converts a color to HSL.
 *
 * @param   color   Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   options Options (all optional); {@see ToHSLOptions}.
 *
 * @returns         By default, an HSL color code; e.g., `hsl(x x x / x)`.
 *
 *   - If `{ as: 'array' }` in options, this returns an array instead of a string.
 *   - If `{ as: 'object' }` in options, this returns an object instead of a string.
 */
export const toHSL = <Options extends ToHSLOptions>(
    color: string,
    options?: Options,
): Options extends { as: 'array' } ? HSLArray : Options extends { as: 'object' } ? HSLObject : string => {
    const opts = $obj.defaults({}, options || {}, { as: 'default' }) as Required<ToHSLOptions>;

    let [_h, _s, _l, _a] = c2k.parseToHsla(parse(color));

    const h = (_h % 360).toFixed();
    const s = c2k.guard(0, 100, _s * 100).toFixed() + '%';
    const l = c2k.guard(0, 100, _l * 100).toFixed() + '%';
    const a = String(parseFloat(c2k.guard(0, 1, _a).toFixed(3)));

    if ('array' === opts.as) {
        return [h, s, l, a] as ReturnType<typeof toHSL<Options>>;
    }
    if ('object' === opts.as) {
        return { h, s, l, a } as ReturnType<typeof toHSL<Options>>;
    }
    return ('hsl(' + [h, s, l].join(' ') + ' / ' + a + ')') as ReturnType<typeof toHSL<Options>>;
};

/**
 * Converts a color to an HSL list w/o alpha.
 *
 * @param   color Parseable color; {@see https://o5p.me/ce0m3O}.
 *
 * @returns       An HSL list w/o alpha; e.g., `x x x`; for a CSS variable.
 */
export const toHSLListNoAlpha = (color: string): string => {
    return toHSL(color, { as: 'array' }).slice(0, -1).join(' ');
};

/**
 * Lightens a color.
 *
 * @param   color  Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   amount Amount to lighten, given as a decimal between `0` and `1` inclusive.
 *
 * @returns        Hex color code; e.g., `#xxxxxx[xx]`.
 */
export const lighten = (color: string, amount: number): string => {
    return c2k.toHex(c2k.lighten(parse(color), Math.abs(amount)));
};

/**
 * Darkens a color.
 *
 * @param   color  Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   amount Amount to darken, given as a decimal between `0` and `1` inclusive.
 *
 * @returns        Hex color code; e.g., `#xxxxxx[xx]`.
 */
export const darken = (color: string, amount: number): string => {
    return c2k.toHex(c2k.darken(parse(color), Math.abs(amount)));
};

/**
 * Saturates a color.
 *
 * @param   color  Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   amount Amount to saturate, given as a decimal between `0` and `1` inclusive.
 *
 * @returns        Hex color code; e.g., `#xxxxxx[xx]`.
 */
export const saturate = (color: string, amount: number): string => {
    return c2k.toHex(c2k.saturate(parse(color), Math.abs(amount)));
};

/**
 * Desaturates a color.
 *
 * @param   color  Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   amount Amount to desaturate, given as a decimal between `0` and `1` inclusive.
 *
 * @returns        Hex color code; e.g., `#xxxxxx[xx]`.
 */
export const desaturate = (color: string, amount: number): string => {
    return c2k.toHex(c2k.desaturate(parse(color), Math.abs(amount)));
};

/**
 * Increases a color’s opacity.
 *
 * @param   color  Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   amount Amount to increase opacity by, given as a decimal between `0` and `1` inclusive.
 *
 * @returns        Hex color code; e.g., `#xxxxxx[xx]`.
 */
export const strengthen = (color: string, amount: number): string => {
    return c2k.toHex(c2k.opacify(parse(color), Math.abs(amount)));
};

/**
 * Decreases a color’s opacity.
 *
 * @param   color  Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   amount Amount to decrease opacity by, given as a decimal between `0` and `1` inclusive.
 *
 * @returns        Hex color code; e.g., `#xxxxxx[xx]`.
 */
export const weaken = (color: string, amount: number): string => {
    return c2k.toHex(c2k.transparentize(parse(color), Math.abs(amount)));
};

/**
 * Spins hue of a color.
 *
 * @param   color   Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   degrees Degrees to adjust the input color, between `0` and `360` inclusive.
 *
 * @returns         Hex color code; e.g., `#xxxxxx[xx]`.
 */
export const spin = (color: string, degrees: number): string => {
    return c2k.toHex(c2k.adjustHue(parse(color), Math.abs(degrees)));
};

/**
 * Mixes two colors together.
 *
 * @param   color1 Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   color2 Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   weight Both the `weight` and the relative opacity of each color determines how much of each color is in the
 *   result. The `weight` must be a number between `0` and `1` inclusive. A larger `weight` indicates that more of
 *   `color1` should be used, and a smaller `weight` indicates that more of `color2` should be used.
 *
 * @returns        Hex color code; e.g., `#xxxxxx[xx]`.
 */
export const mix = (color1: string, color2: string, weight: number): string => {
    return c2k.toHex(c2k.mix(parse(color1), parse(color2), Math.abs(weight)));
};

/**
 * Gets a `scale(n)` function for a series of colors.
 *
 * Given a series colors, this function will return a `scale(n)` function that accepts a percentage as a decimal between
 * `0` and `1` inclusive, and returns the color at that percentage in the scale.
 *
 * @param   colors Variadic parseable colors; {@see https://o5p.me/ce0m3O}.
 *
 * @returns        A `scale(n)` function, which returns a hex color code; e.g., `#xxxxxx[xx]`.
 */
export const getScale = (...colors: string[]): ((n: number) => string) => {
    return (n: number) => c2k.toHex(c2k.getScale(...colors.map((c) => parse(c)))(Math.abs(n)));
};

/**
 * Gets contrast between two colors.
 *
 * @param   color1 Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   color2 Parseable color; {@see https://o5p.me/ce0m3O}.
 *
 * @returns        Returns contrast ratio between colors; {@see https://o5p.me/zMeTFB}.
 */
export const getContrast = (color1: string, color2: string): number => {
    return c2k.getContrast(parse(color1), parse(color2));
};

/**
 * Gets a color’s luminance.
 *
 * @param   color Parseable color; {@see https://o5p.me/ce0m3O}.
 *
 * @returns       Number representing luminance of the given color.
 */
export const getLuminance = (color: string): number => {
    return c2k.getLuminance(parse(color));
};

/**
 * Gets a readable color, given a contrasting color.
 *
 * @param   color Parseable color; {@see https://o5p.me/ce0m3O}.
 *
 * @returns       Hex color code; e.g., `#xxxxxx[xx]` (black or white).
 */
export const getReadable = (color: string): string => {
    return c2k.toHex(c2k.readableColor(parse(color)));
};

/**
 * Checks if a color meets contrast standards.
 *
 * @param   fgColor  Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   bgColor  Parseable color; {@see https://o5p.me/ce0m3O}.
 * @param   standard Standard by which to determine. Default is `aa`.
 *
 * @returns          True if the `fgColor` against the `bgColor` meets contrast standard.
 */
export const contrastOK = (fgColor: string, bgColor: string, standard: 'decorative' | 'readable' | 'aa' | 'aaa' = 'aa'): boolean => {
    return !c2k.hasBadContrast(parse(fgColor), standard, parse(bgColor));
};
