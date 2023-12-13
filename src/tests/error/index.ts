/**
 * Test suite.
 */

import { $error } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$error', async () => {
    test('.safeMessageFrom()', async () => {
        const thrown1 = Error('3uqBgVtZ');
        expect($error.safeMessageFrom(thrown1, { default: 'Unknown error.' })).toBe('Error code: 3uqBgVtZ.');

        const thrown2 = Error('Something is wrong.');
        expect($error.safeMessageFrom(thrown2, { default: 'Unknown error.' })).toBe('Unknown error.');

        const thrown3 = Error('Something is wrong.', { cause: 'user' });
        expect($error.safeMessageFrom(thrown3, { causes: [], default: 'Unknown error.' })).toBe('Unknown error.');

        const thrown4 = Error('Something is wrong.', { cause: 'user' });
        expect($error.safeMessageFrom(thrown4, { causes: ['user'], default: 'Unknown error.' })).toBe('Something is wrong.');
    });
});
