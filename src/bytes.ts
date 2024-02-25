/**
 * Byte utilities.
 */

import '#@initialize.ts';

/**
 * Kilobytes (kb), kibibytes (kB).
 */
export const inKilobyte = 1000;
export const inKibibyte = 1024;

/**
 * Megabytes (MB), mebibytes (MiB).
 */
export const inMegabyte = inKilobyte * 1000;
export const inMebibyte = inKibibyte * 1024;

/**
 * Gigabytes (GB), gibibytes (GiB).
 */
export const inGigabyte = inMegabyte * 1000;
export const inGibibyte = inMebibyte * 1024;

/**
 * Terabytes (TB), tebibytes (TiB).
 */
export const inTerabyte = inGigabyte * 1000;
export const inTebibyte = inGibibyte * 1024;

/**
 * Petabytes (PB), pebibytes (PiB).
 */
export const inPetabyte = inTerabyte * 1000;
export const inPebibyte = inTebibyte * 1024;

/**
 * Combines byte arrays.
 *
 * @param   uint8Arrays Input byte arrays.
 *
 * @returns             Byte array promise; {@see Uint8Array}.
 */
export const combine = async (uint8Arrays: Readonly<Uint8Array>[]): Promise<Uint8Array> => {
    const blob = new Blob(uint8Arrays),
        arrayBuffer = await blob.arrayBuffer();

    return new Uint8Array(arrayBuffer);
};
