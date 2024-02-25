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
        expect($error.safeMessageFrom(thrown3, { expectedCauses: [], default: 'Unknown error.' })).toBe('Unknown error.');

        const thrown4 = Error('Something is wrong.', { cause: 'user' });
        expect($error.safeMessageFrom(thrown4, { expectedCauses: ['user'], default: 'Unknown error.' })).toBe('Something is wrong.');

        const thrown5 = Error('Thrown.', { cause: 'foo-bar:baz' });
        expect($error.safeMessageFrom(thrown5, { expectedCauses: ['foo-bar'], default: 'Unknown error.' })).toBe('Thrown.');
        expect($error.safeMessageFrom(thrown5, { expectedCauses: ['foo-bar:'], default: 'Unknown error.' })).toBe('Thrown.');
        expect($error.safeMessageFrom(thrown5, { expectedCauses: [/^foo-bar:/u], default: 'Unknown error.' })).toBe('Thrown.');

        const thrown6 = Error('Thrown 6.', { cause: 'foo:bar' });
        const thrown7 = Error('Thrown 7.', { cause: thrown6 });
        const thrown8 = Error('Thrown 8.', { cause: thrown7 });
        expect($error.safeMessageFrom(thrown8, { expectedCauses: ['foo'], default: 'Unknown error.' })).toBe('Thrown 6.');
        expect($error.safeMessageFrom(thrown8, { expectedCauses: ['foo:bar'], default: 'Unknown error.' })).toBe('Thrown 6.');
        expect($error.safeMessageFrom(thrown8, { expectedCauses: ['foo:bar:'], default: 'Unknown error.' })).toBe('Thrown 6.');
    });
});
