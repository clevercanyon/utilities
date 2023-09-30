/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $app, $env, $is } from '../../index.ts';

describe('$env', async () => {
    test('.isTest(), .test()', async () => {
        expect($env.isTest()).toBe(true);

        expect($env.test('TEST')).toBe(true);
        expect($env.test('VITEST')).toBe(true);
        expect($env.test('VITEST_MODE')).toBe(true);

        expect($is.boolean($env.get('TEST'))).toBe(true);
        expect($is.boolean($env.get('VITEST'))).toBe(true);
        expect($is.string($env.get('VITEST_MODE'))).toBe(true);
    });
    test('$env.setTopLevelObp()', async () => {
        expect($env.setTopLevelObp($app.pkgName)).toBe(undefined);
        expect($env.setTopLevelObp($app.pkgName)).toBe(undefined);
    });
    test('.get()', async () => {
        expect($env.set('', 'TEST_FOO', 'true')).toBe(undefined);
        expect($env.set($app.pkgName, 'TEST_BAR', 'true')).toBe(undefined);

        expect($env.get('', 'TEST_FOO')).toBe(true);
        expect($env.get('', 'TEST_BAR')).toBe(true);

        expect($env.get('@top', 'TEST_FOO')).toBe(true);
        expect($env.get('@top', 'TEST_BAR')).toBe(true);

        expect($env.get($app.pkgName, 'TEST_FOO')).toBe(true);
        expect($env.get($app.pkgName, 'TEST_BAR')).toBe(true);

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
        expect($env.get($app.pkgName, 'TEST_FOO')).toBe(true);

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
    test('.isC10n(), .test()', async () => {
        expect($env.isC10n()).toBe(false);

        expect($env.set('@top', 'APP_IS_C10N', '0')).toBe(undefined);
        expect($env.isC10n()).toBe(false);
        expect($env.isC10n({ foo: '*' })).toBe(false);

        expect($env.set('@top', 'APP_IS_C10N', '1')).toBe(undefined);
        expect($env.isC10n()).toBe(true);
        expect($env.isC10n({ foo: '*' })).toBe(false);
        expect($env.isC10n({ foo: '**' })).toBe(false);

        expect($env.set('@top', 'APP_IS_C10N', 'foo')).toBe(undefined);
        expect($env.isC10n()).toBe(true);
        expect($env.isC10n({ foo: '' })).toBe(true);
        expect($env.isC10n({ foo: '*' })).toBe(true);
        expect($env.isC10n({ foo: '**' })).toBe(true);

        expect($env.set('@top', 'APP_IS_C10N', 'foo=0')).toBe(undefined);
        expect($env.isC10n()).toBe(true);
        expect($env.isC10n({ foo: '' })).toBe(true);
        expect($env.isC10n({ foo: '*' })).toBe(true);
        expect($env.isC10n({ foo: '**' })).toBe(true);
        expect($env.isC10n({ foo: '?*' })).toBe(false);
        expect($env.isC10n({ foo: '?**' })).toBe(false);
        expect($env.isC10n({ foo: '{,0}' })).toBe(true);
        expect($env.isC10n({ foo: '0' })).toBe(true);

        expect($env.set('@top', 'APP_IS_C10N', 'foo=1')).toBe(undefined);
        expect($env.isC10n()).toBe(true);
        expect($env.isC10n({ foo: '' })).toBe(true);
        expect($env.isC10n({ foo: '*' })).toBe(true);
        expect($env.isC10n({ foo: '**' })).toBe(true);
        expect($env.isC10n({ foo: '?*' })).toBe(true);
        expect($env.isC10n({ foo: '?**' })).toBe(true);
        expect($env.isC10n({ foo: '{,1}' })).toBe(true);
        expect($env.isC10n({ foo: '1' })).toBe(true);

        // Alternate call signature.

        expect($env.set('APP_IS_C10N', '0')).toBe(undefined);
        expect($env.isC10n()).toBe(false);
        expect($env.isC10n({ foo: '*' })).toBe(false);

        expect($env.set('APP_IS_C10N', '1')).toBe(undefined);
        expect($env.isC10n()).toBe(true);
        expect($env.isC10n({ foo: '*' })).toBe(false);
        expect($env.isC10n({ foo: '**' })).toBe(false);

        expect($env.set('APP_IS_C10N', 'foo')).toBe(undefined);
        expect($env.isC10n()).toBe(true);
        expect($env.isC10n({ foo: '' })).toBe(true);
        expect($env.isC10n({ foo: '*' })).toBe(true);
        expect($env.isC10n({ foo: '**' })).toBe(true);

        expect($env.set('APP_IS_C10N', 'foo=0')).toBe(undefined);
        expect($env.isC10n()).toBe(true);
        expect($env.isC10n({ foo: '' })).toBe(true);
        expect($env.isC10n({ foo: '*' })).toBe(true);
        expect($env.isC10n({ foo: '**' })).toBe(true);
        expect($env.isC10n({ foo: '?*' })).toBe(false);
        expect($env.isC10n({ foo: '?**' })).toBe(false);
        expect($env.isC10n({ foo: '{,0}' })).toBe(true);
        expect($env.isC10n({ foo: '0' })).toBe(true);

        expect($env.set('APP_IS_C10N', 'foo=1')).toBe(undefined);
        expect($env.isC10n()).toBe(true);
        expect($env.isC10n({ foo: '' })).toBe(true);
        expect($env.isC10n({ foo: '*' })).toBe(true);
        expect($env.isC10n({ foo: '**' })).toBe(true);
        expect($env.isC10n({ foo: '?*' })).toBe(true);
        expect($env.isC10n({ foo: '?**' })).toBe(true);
        expect($env.isC10n({ foo: '{,1}' })).toBe(true);
        expect($env.isC10n({ foo: '1' })).toBe(true);
    });
});
