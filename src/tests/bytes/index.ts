/**
 * Test suite.
 */

import { $bytes } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$bytes', async () => {
    test('.in*', async () => {
        expect($bytes.inKilobyte).toBe(1000);
        expect($bytes.inKibibyte).toBe(1024);

        expect($bytes.inMegabyte).toBe(1000000);
        expect($bytes.inMebibyte).toBe(1048576);

        expect($bytes.inGigabyte).toBe(1000000000);
        expect($bytes.inGibibyte).toBe(1073741824);

        expect($bytes.inTerabyte).toBe(1000000000000);
        expect($bytes.inTebibyte).toBe(1099511627776);

        expect($bytes.inPetabyte).toBe(1000000000000000);
        expect($bytes.inPebibyte).toBe(1125899906842624);
    });
});
