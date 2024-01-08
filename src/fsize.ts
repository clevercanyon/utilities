/**
 * Filesize utilities.
 */

import '#@initialize.ts';

/**
 * Kilobytes, kibibytes.
 */
export const bytesInKilobyte = 1000;
export const bytesInKibibyte = 1024;

/**
 * Megabytes, mebibytes.
 */
export const bytesInMegabyte = bytesInKilobyte * 1000;
export const bytesInMebibyte = bytesInKibibyte * 1024;

/**
 * Gigabytes, gibibytes.
 */
export const bytesInGigabyte = bytesInMegabyte * 1000;
export const bytesInGibibyte = bytesInMebibyte * 1024;

/**
 * Terabytes, tebibytes.
 */
export const bytesInTerabyte = bytesInGigabyte * 1000;
export const bytesInTebibyte = bytesInGibibyte * 1024;

/**
 * Petabytes, pebibytes.
 */
export const bytesInPetabyte = bytesInTerabyte * 1000;
export const bytesInPebibyte = bytesInTebibyte * 1024;
