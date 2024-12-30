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
    test('.parseAddr()', async () => {
        expect($email.parseAddr('x@x')).toStrictEqual({ email: 'x@x' });
        expect($email.parseAddr('x+x@x')).toStrictEqual({ email: 'x+x@x' });

        expect($email.parseAddr('x@localhost')).toStrictEqual({ email: 'x@localhost' });
        expect($email.parseAddr('x+x@localhost')).toStrictEqual({ email: 'x+x@localhost' });

        expect($email.parseAddr('x@hop.gdn')).toStrictEqual({ email: 'x@hop.gdn' });
        expect($email.parseAddr('x+x@hop.gdn')).toStrictEqual({ email: 'x+x@hop.gdn' });

        expect($email.parseAddr('"X" <x@x>')).toStrictEqual({ name: 'X', email: 'x@x' });
        expect($email.parseAddr('"X" <x+x@x>')).toStrictEqual({ name: 'X', email: 'x+x@x' });

        expect($email.parseAddr('"X" <x@localhost>')).toStrictEqual({ name: 'X', email: 'x@localhost' });
        expect($email.parseAddr('"X" <x+x@localhost>')).toStrictEqual({ name: 'X', email: 'x+x@localhost' });

        expect($email.parseAddr('"X" <x@hop.gdn>')).toStrictEqual({ name: 'X', email: 'x@hop.gdn' });
        expect($email.parseAddr('"X" <x+x@hop.gdn>')).toStrictEqual({ name: 'X', email: 'x+x@hop.gdn' });

        expect($email.parseAddr('"X" <x@x>')).toStrictEqual({ name: 'X', email: 'x@x' });
        expect($email.parseAddr('"X X" <x@x>')).toStrictEqual({ name: 'X X', email: 'x@x' });

        expect($email.parseAddr('x@x,x')).toBe(undefined);
        expect($email.parseAddr('x,x@x')).toBe(undefined);
        expect($email.parseAddr('<x@hop.gdn>')).toBe(undefined);
        expect($email.parseAddr('x @hop.gdn')).toBe(undefined);

        expect($email.parseAddr('X x@x')).toBe(undefined);
        expect($email.parseAddr('"X" x@x')).toBe(undefined);
        expect($email.parseAddr('"" <x@x>')).toBe(undefined);
        expect($email.parseAddr('"X"  <x@x>')).toBe(undefined);
        expect($email.parseAddr('"X" <x@>')).toBe(undefined);
        expect($email.parseAddr('"X" <@x>')).toBe(undefined);
    });
});
