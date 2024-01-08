/**
 * Filesize utilities.
 */

import '#@initialize.ts';

/**
 * Kilobytes (kb), kibibytes (kB).
 */
export const bytesInKilobyte = 1000;
export const bytesInKibibyte = 1024;

/**
 * Megabytes (MB), mebibytes (MiB).
 */
export const bytesInMegabyte = bytesInKilobyte * 1000;
export const bytesInMebibyte = bytesInKibibyte * 1024;

/**
 * Gigabytes (GB), gibibytes (GiB).
 */
export const bytesInGigabyte = bytesInMegabyte * 1000;
export const bytesInGibibyte = bytesInMebibyte * 1024;

/**
 * Terabytes (TB), tebibytes (TiB).
 */
export const bytesInTerabyte = bytesInGigabyte * 1000;
export const bytesInTebibyte = bytesInGibibyte * 1024;

/**
 * Petabytes (PB), pebibytes (PiB).
 */
export const bytesInPetabyte = bytesInTerabyte * 1000;
export const bytesInPebibyte = bytesInTebibyte * 1024;
