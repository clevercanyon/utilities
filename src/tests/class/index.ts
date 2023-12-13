/**
 * Test suite.
 */

import { $app, $class, $obj } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$class', async () => {
    test('.getBase()', async () => {
        const Base = $class.getBase();
        const base = new Base();

        expect($obj.tag(Base)).toBe('Function');
        expect($obj.tag(base)).toBe($app.$pkgName + '/Base');
    });
});
