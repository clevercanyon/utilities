/**
 * Test suite.
 */

import { $app, $is } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$app', async () => {
    test('$pkgName', async () => {
        expect($is.string($app.$pkgName)).toBe(true);
    });
    test('.pkgName', async () => {
        expect($app.pkgName()).toBe($app.$pkgName);
    });
    test('.pkgNameParts', async () => {
        expect($app.pkgNameParts()).toStrictEqual({ org: 'clevercanyon', name: 'utilities' });
        expect($app.pkgNameParts('@foo/bar')).toStrictEqual({ org: 'foo', name: 'bar' });
        expect($app.pkgNameParts('foo-bar')).toStrictEqual({ org: '', name: 'foo-bar' });
        expect($app.pkgNameParts('foo/bar')).toStrictEqual({ org: '', name: '' });
    });
    test('.pkgSlug()', async () => {
        expect($app.pkgSlug()).toBe('utilities');
        expect($app.pkgSlug('workers.o5p.me')).toBe('workers-o5p-me');
        expect($app.pkgSlug('workers.o5p.org')).toBe('workers-o5p-org');
    });
});
