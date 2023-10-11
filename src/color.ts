/**
 * Color utilities.
 */

import './resources/init.ts';

import twColors from 'tailwindcss/colors.js';
import { $is, $obj } from './index.ts';

/**
 * Defines types.
 */
export type TWColors = typeof twColors;
export type TWColorName = keyof typeof twColors;
export type TWColorNameShades = (typeof twColors)['gray'];
export type SimpleTWColorName = 'inherit' | 'current' | 'transparent' | 'black' | 'white';
export type TWColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type HexToRGBOptions = { format: 'object' | 'r g b' | 'rgb()' };
export type RGBObject = { r: number; g: number; b: number };

/**
 * Gets Tailwind CSS color(s).
 *
 * @param   name  Optional color name; {@see TWColorName}.
 * @param   shade Optional color shade; {@see TWColorShade}.
 *
 * @returns       Requested Tailwind CSS(s).
 *
 *   - If no `name` is given, returns a shallow clone of all Tailwind colors; i.e., the full object value.
 *   - If no `shade` is given, returns a named color’s object keyed by shade. Unless `name` is given as a simple color, in
 *       which case this returns a hex color code string, as there is no object; e.g., {@see SimpleTWColorName}.
 *   - Otherwise; i.e., if `name` and `shade` are given, returns a hex color code string.
 */
export function tw(): TWColors;
export function tw(name: SimpleTWColorName, shade?: TWColorShade): string;
export function tw(name: Omit<TWColorName, SimpleTWColorName>): TWColorNameShades;
export function tw(name: Omit<TWColorName, SimpleTWColorName>, shade: TWColorShade): string;

export function tw<Name extends TWColorName, Shade extends TWColorShade>(name?: Name, shade?: Shade): TWColors | TWColorNameShades | string {
    if (!name) return { ...twColors } as TWColors;

    if ($is.string(twColors[name]) /* Simple; i.e., no shades. */) {
        return twColors[name as SimpleTWColorName] as string;
    }
    if (!shade) return twColors[name] as TWColorNameShades;

    return twColors[name][String(shade) as unknown as TWColorShade];
}

/**
 * Removes `#` hash from a hex color code.
 *
 * @param   hex Hex color code, with or without `#` hash.
 *
 * @returns     Hex color code without `#` hash.
 */
export const hexNoHash = (hex: string): string => {
    return '#' === hex.charAt(0) ? hex.slice(1) : hex;
};

/**
 * Expands a short 3-char hex color code into 6-chars.
 *
 * @param   hex Hex color code, with or without `#` hash.
 *
 * @returns     Hex color code, expanded to 6 chars.
 */
export const hex3To6Chars = (hex: string): string => {
    const rtnHash = '#' === hex.charAt(0);
    hex = hexNoHash(hex); // Removes `#` hash.

    if (3 === hex.length) {
        hex = hex.replace(/./gu, '$&$&');
    }
    return rtnHash ? '#' + hex : hex;
};

/**
 * Converts hex to RGB.
 *
 * @param   hex     Hex color code, with or without `#`.
 * @param   options Options (all optional); {@see HexToRGBOptions}.
 *
 * @returns         RGB. By default, as `rgb()` for use in HTML.
 *
 * @todo Add support for alpha setting.
 */
export const hexToRGB = <Options extends HexToRGBOptions>(hex: string, options?: Options): Options extends { format: 'object' } ? RGBObject : string => {
    const opts = $obj.defaults({}, options || {}, { format: 'rgb()' }) as Required<HexToRGBOptions>;

    hex = hexNoHash(hex);
    hex = hex3To6Chars(hex);

    if (6 !== hex.length) {
        throw new Error('Invalid hex code: `' + hex + '`.');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    switch (opts.format) {
        case 'object': {
            return { r, g, b } as ReturnType<typeof hexToRGB<Options>>;
        }
        case 'r g b': {
            return `${r} ${g} ${b}` as ReturnType<typeof hexToRGB<Options>>;
        }
        case 'rgb()':
        default: {
            return `rgb(${r} ${g} ${b})` as ReturnType<typeof hexToRGB<Options>>;
        }
    }
};
