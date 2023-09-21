/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $app, $class, $obj } from '../../index.ts';

describe('$class', async () => {
    test('.getBase()', async () => {
        const Base = $class.getBase();
        const base = new Base();

        expect($obj.tag(Base)).toBe('Function');
        expect($obj.tag(base)).toBe($app.pkgName + '/Base');
    });
});
