/**
 * Test suite.
 */

import { $class } from '#index.ts';
import { describe, expect, test } from 'vitest';

const LRUMap = $class.getLRUMap();

describe('LRUMap', async () => {
    test('.get(), .set(), .size, .maxSize', async () => {
        const map1 = new LRUMap([], { maxSize: 3 });
        map1.set('zero', 0);
        map1.set('one', 1);
        map1.set('two', 2);
        map1.set('three', 3);
        expect([...map1.keys()]).toStrictEqual(['one', 'two', 'three']);

        // ---

        const map2 = new LRUMap([]);
        map2.set('zero', 0);
        map2.set('one', 1);
        map2.set('two', 2);
        map2.set('three', 3);
        expect([...map2.keys()]).toStrictEqual(['zero', 'one', 'two', 'three']);

        // ---

        const map3 = new LRUMap([], { maxSize: 1 });
        map3.set('zero', 0);
        map3.set('one', 1);
        map3.set('two', 2);
        map3.set('three', 3);
        expect([...map3.keys()]).toStrictEqual(['three']);

        map3.maxSize = 10;
        map3.set('zero', 0);
        map3.set('one', 1);
        map3.set('two', 2);
        map3.set('three', 3);
        map3.maxSize = 1;
        map3.set('one', 1);
        expect([...map3.keys()]).toStrictEqual(['one']);
        expect(map3.get('zero')).toBe(undefined);
    });
});
