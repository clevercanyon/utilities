/**
 * Test suite.
 */

import { $email } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$email', async () => {
    test('.fromAddr()', async () => {
        expect($email.fromAddr('x@x')).toBe('x@x');
        expect($email.fromAddr('x+x@x')).toBe('x+x@x');

        expect($email.fromAddr('x@localhost')).toBe('x@localhost');
        expect($email.fromAddr('x+x@localhost')).toBe('x+x@localhost');

        expect($email.fromAddr('x@hop.gdn')).toBe('x@hop.gdn');
        expect($email.fromAddr('x+x@hop.gdn')).toBe('x+x@hop.gdn');

        expect($email.fromAddr('"X" <x@x>')).toBe('x@x');
        expect($email.fromAddr('"X" <x+x@x>')).toBe('x+x@x');

        expect($email.fromAddr('"X" <x@localhost>')).toBe('x@localhost');
        expect($email.fromAddr('"X" <x+x@localhost>')).toBe('x+x@localhost');

        expect($email.fromAddr('"X" <x@hop.gdn>')).toBe('x@hop.gdn');
        expect($email.fromAddr('"X" <x+x@hop.gdn>')).toBe('x+x@hop.gdn');

        expect($email.fromAddr('"X" <x@x>')).toBe('x@x');
        expect($email.fromAddr('"X X" <x@x>')).toBe('x@x');

        expect($email.fromAddr('x@x,x')).toBe('');
        expect($email.fromAddr('x,x@x')).toBe('');
        expect($email.fromAddr('<x@hop.gdn>')).toBe('');
        expect($email.fromAddr('x @hop.gdn')).toBe('');

        expect($email.fromAddr('X x@x')).toBe('');
        expect($email.fromAddr('"X" x@x')).toBe('');
        expect($email.fromAddr('"" <x@x>')).toBe('');
        expect($email.fromAddr('"X"  <x@x>')).toBe('');
        expect($email.fromAddr('"X" <x@>')).toBe('');
        expect($email.fromAddr('"X" <@x>')).toBe('');
    });
});
