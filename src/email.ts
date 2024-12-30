/**
 * Email utilities.
 */

import '#@initialize.ts';

import { $str } from '#index.ts';

/**
 * Defines types.
 */
export type Addr = { name: string; email: string };

/**
 * Gets email from an addr.
 *
 * - `username@hostname`.
 * - `"Name" <username@hostname>`.
 *
 * @param   str String to consider.
 *
 * @returns     Email address; else empty string.
 */
export const fromAddr = (str: string): string => {
    return parseAddr(str)?.email || '';
};

/**
 * Parses an addr.
 *
 * - `username@hostname`.
 * - `"Name" <username@hostname>`.
 *
 * @param   str String to consider.
 *
 * @returns     Addr parts; else undefined.
 */
export const parseAddr = (str: string): Addr | undefined => {
    if (!str) return; // Empty string.

    if ($str.isEmail(str) /* Email only. */) {
        return { name: '', email: str };
    }
    const parts = str.split(/(?<=")\s(?=<)/u);
    if (
        2 === parts.length &&
        //
        parts[0].length >= 3 && // e.g., `"x"`.
        '"' === parts[0][0] && // Opening quote.
        '"' === parts[0][parts[0].length - 1] && // Closing quote.
        parts[0].length <= 255 + 2 && // 2 = quotes; i.e., `"..."`.
        //
        parts[1].length >= 3 && // e.g., `<x>`.
        '<' === parts[1][0] && // Opening bracket.
        '>' === parts[1][parts[1].length - 1] && // Closing bracket.
        $str.isEmail(parts[1].slice(1, -1)) // `<email>` validation.
    ) {
        return {
            name: parts[0].slice(1, -1),
            email: parts[1].slice(1, -1).toLowerCase(),
        };
    }
};
