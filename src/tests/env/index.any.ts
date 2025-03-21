/**
 * Test suite.
 */

import { $app, $env, $is } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$env', async () => {
    test('.isTest(), .test()', async () => {
        expect($env.isTest()).toBe(true);

        expect($env.test('TEST')).toBe(true);
        expect($env.test('VITEST')).toBe(true);

        expect($is.boolean($env.get('TEST'))).toBe(true);
        expect($is.boolean($env.get('VITEST'))).toBe(true);

        expect(import.meta.env.TEST).toBe('true');
        expect(import.meta.env.VITEST).toBe('true');
        expect(import.meta.env.MODE).toBeOneOf(['ci', 'dev', 'prod', 'stage']);
        expect($env.get('_APP_IS_VITE')).toBe('serve=' + import.meta.env.MODE);
    });
    test('$env.setTopLevelObp()', async () => {
        expect($env.setTopLevelObp($app.$pkgName)).toBe(undefined);
        expect($env.setTopLevelObp($app.$pkgName)).toBe(undefined);
    });
    test('.get()', async () => {
        expect($env.set('', 'TEST_FOO', 'true')).toBe(undefined);
        expect($env.set($app.$pkgName, 'TEST_BAR', 'true')).toBe(undefined);

        expect($env.get('', 'TEST_FOO')).toBe(true);
        expect($env.get('', 'TEST_BAR')).toBe(true);

        expect($env.get('@top', 'TEST_FOO')).toBe(true);
        expect($env.get('@top', 'TEST_BAR')).toBe(true);

        expect($env.get($app.$pkgName, 'TEST_FOO')).toBe(true);
        expect($env.get($app.$pkgName, 'TEST_BAR')).toBe(true);

        expect($env.get('@global', 'TEST_FOO')).toBe(undefined);
        expect($env.get('@global', 'TEST_BAR')).toBe(undefined);

        expect($env.get('@nonexistent', 'TEST_FOO')).toBe(undefined);
        expect($env.get('@nonexistent', 'TEST_BAR')).toBe(undefined);
    });
    test('.set()', async () => {
        expect($env.set('', 'TEST_FOO', 'true')).toBe(undefined);
        expect($env.get('', 'TEST_FOO')).toBe(true);
    });
    test('.unset()', async () => {
        expect($env.set('', 'TEST_FOO', 'true')).toBe(undefined);
        expect($env.get('', 'TEST_FOO')).toBe(true);
        expect($env.get($app.$pkgName, 'TEST_FOO')).toBe(true);

        expect($env.unset('', 'TEST_FOO')).toBe(undefined);
        expect($env.get('', 'TEST_FOO')).toBe(undefined);
    });
    test('.capture()', async () => {
        expect($env.capture('@top', { FOO: 'true', BAR: 'bar' })).toBe(undefined);
        expect($env.capture('@test', { BAZ: 'true', BIZ: 'biz' })).toBe(undefined);
        expect($env.capture('@global', { BUZ: 'true', FUZ: 'fuz' })).toBe(undefined);

        expect($env.get('', 'FOO')).toBe(true);
        expect($env.get('', 'BAR')).toBe('bar');
        expect($env.get('', 'BAZ')).toBe(undefined);
        expect($env.get('', 'BIZ')).toBe(undefined);
        expect($env.get('', 'BUZ')).toBe(true);
        expect($env.get('', 'FUZ')).toBe('fuz');

        expect($env.get('@top', 'FOO')).toBe(true);
        expect($env.get('@top', 'BAR')).toBe('bar');
        expect($env.get('@top', 'BAZ')).toBe(undefined);
        expect($env.get('@top', 'BIZ')).toBe(undefined);
        expect($env.get('@top', 'BUZ')).toBe(true);
        expect($env.get('@top', 'FUZ')).toBe('fuz');

        expect($env.get('@test', 'FOO')).toBe(undefined);
        expect($env.get('@test', 'BAR')).toBe(undefined);
        expect($env.get('@test', 'BAZ')).toBe(true);
        expect($env.get('@test', 'BIZ')).toBe('biz');
        expect($env.get('@test', 'BUZ')).toBe(undefined);
        expect($env.get('@test', 'FUZ')).toBe(undefined);

        expect($env.get('@global', 'FOO')).toBe(undefined);
        expect($env.get('@global', 'BAR')).toBe(undefined);
        expect($env.get('@global', 'BAZ')).toBe(undefined);
        expect($env.get('@global', 'BIZ')).toBe(undefined);
        expect($env.get('@global', 'BUZ')).toBe(true);
        expect($env.get('@global', 'FUZ')).toBe('fuz');
    });
    test('.isVite()', async () => {
        expect($env.isVite()).toBe(true);
    });
    test('.isC10n(), .test()', async () => {
        expect($env.isC10n()).toBe(false);

        expect($env.set('@top', 'APP_IS_C10N', '0')).toBe(undefined);
        expect($env.isC10n.fresh()).toBe(false);
        expect($env.isC10n.fresh({ foo: null })).toBe(false);

        expect($env.set('@top', 'APP_IS_C10N', '1')).toBe(undefined);
        expect($env.isC10n.fresh()).toBe(true);
        expect($env.isC10n.fresh({ foo: null })).toBe(false);
        expect($env.isC10n.fresh({ foo: undefined })).toBe(false);

        expect($env.set('@top', 'APP_IS_C10N', 'foo')).toBe(undefined);
        expect($env.isC10n.fresh()).toBe(true);
        expect($env.isC10n.fresh({ foo: null })).toBe(true);
        expect($env.isC10n.fresh({ foo: undefined })).toBe(true);

        expect($env.set('@top', 'APP_IS_C10N', 'foo=0')).toBe(undefined);
        expect($env.isC10n.fresh()).toBe(true);
        expect($env.isC10n.fresh({ foo: null })).toBe(true);
        expect($env.isC10n.fresh({ foo: undefined })).toBe(true);
        expect($env.isC10n.fresh({ foo: true })).toBe(false);
        expect($env.isC10n.fresh({ foo: false })).toBe(true);
        expect($env.isC10n.fresh({ bar: false })).toBe(true);
        expect($env.isC10n.fresh({ foo: /^0?$/u })).toBe(true);
        expect($env.isC10n.fresh({ foo: /^0$/u })).toBe(true);

        expect($env.set('@top', 'APP_IS_C10N', 'foo=1')).toBe(undefined);
        expect($env.isC10n.fresh()).toBe(true);
        expect($env.isC10n.fresh({ foo: null })).toBe(true);
        expect($env.isC10n.fresh({ foo: undefined })).toBe(true);
        expect($env.isC10n.fresh({ foo: true })).toBe(true);
        expect($env.isC10n.fresh({ bar: true })).toBe(false);
        expect($env.isC10n.fresh({ bar: false })).toBe(true);
        expect($env.isC10n.fresh({ foo: /^1?$/u })).toBe(true);
        expect($env.isC10n.fresh({ foo: /^1$/u })).toBe(true);

        // Alternate call signature.

        expect($env.set('APP_IS_C10N', '0')).toBe(undefined);
        expect($env.isC10n.fresh()).toBe(false);
        expect($env.isC10n.fresh({ foo: null })).toBe(false);

        expect($env.set('APP_IS_C10N', '1')).toBe(undefined);
        expect($env.isC10n.fresh()).toBe(true);
        expect($env.isC10n.fresh({ foo: null })).toBe(false);
        expect($env.isC10n.fresh({ foo: undefined })).toBe(false);

        expect($env.set('APP_IS_C10N', 'foo')).toBe(undefined);
        expect($env.isC10n.fresh()).toBe(true);
        expect($env.isC10n.fresh({ foo: null })).toBe(true);
        expect($env.isC10n.fresh({ foo: undefined })).toBe(true);

        expect($env.set('APP_IS_C10N', 'foo=0')).toBe(undefined);
        expect($env.isC10n.fresh()).toBe(true);
        expect($env.isC10n.fresh({ foo: null })).toBe(true);
        expect($env.isC10n.fresh({ foo: undefined })).toBe(true);
        expect($env.isC10n.fresh({ foo: true })).toBe(false);
        expect($env.isC10n.fresh({ foo: /^0?$/u })).toBe(true);
        expect($env.isC10n.fresh({ foo: /^0$/u })).toBe(true);

        expect($env.set('APP_IS_C10N', 'foo=1')).toBe(undefined);
        expect($env.isC10n.fresh()).toBe(true);
        expect($env.isC10n.fresh({ foo: null })).toBe(true);
        expect($env.isC10n.fresh({ foo: undefined })).toBe(true);
        expect($env.isC10n.fresh({ foo: true })).toBe(true);
        expect($env.isC10n.fresh({ foo: /^1?$/u })).toBe(true);
        expect($env.isC10n.fresh({ foo: /^1$/u })).toBe(true);
    });
});
