/**
 * Test suite.
 */

import { $fsize } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$fsize', async () => {
    test('.bytesIn*', async () => {
        expect($fsize.bytesInKilobyte).toBe(1000);
        expect($fsize.bytesInKibibyte).toBe(1024);

        expect($fsize.bytesInMegabyte).toBe(1000000);
        expect($fsize.bytesInMebibyte).toBe(1048576);

        expect($fsize.bytesInGigabyte).toBe(1000000000);
        expect($fsize.bytesInGibibyte).toBe(1073741824);

        expect($fsize.bytesInTerabyte).toBe(1000000000000);
        expect($fsize.bytesInTebibyte).toBe(1099511627776);

        expect($fsize.bytesInPetabyte).toBe(1000000000000000);
        expect($fsize.bytesInPebibyte).toBe(1125899906842624);
    });
});
