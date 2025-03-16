/**
 * Test suite.
 */

import { $env, $is } from '#index.ts';
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
        expect(import.meta.env.APP_IS_VITE).toBe('serve=' + import.meta.env.MODE);
        expect(import.meta.env.MODE).toBeOneOf(['ci', 'dev', 'prod', 'stage']);
    });
    test('.isWeb()', async () => {
        expect($env.isWeb()).toBe(false);
    });
    test('.isWebViaJSDOM()', async () => {
        expect($env.isWebViaJSDOM()).toBe(false);
    });
    test('.isNode()', async () => {
        expect($env.isNode()).toBe(true);
    });
    test('.isCFW()', async () => {
        expect($env.isCFW()).toBe(false);
    });
    test('.isWorker()', async () => {
        expect($env.isWorker()).toBe(false);
    });
    test('.isServiceWorker()', async () => {
        expect($env.isServiceWorker()).toBe(false);
    });
    test('.set(), .unset()', async () => {
        const testVar = '_ZX6EUCDU_';

        $env.set('@global', testVar, 'true');
        expect(process.env[testVar]).toBe('true');
        expect($env.get('@global', testVar)).toBe(true);

        $env.set('@global', testVar, true);
        expect(process.env[testVar]).toBe('true');
        expect($env.get('@global', testVar)).toBe(true);

        $env.set('@global', testVar, 1);
        expect(process.env[testVar]).toBe('1');
        expect($env.get('@global', testVar)).toBe(1);

        $env.set('@global', testVar, 1.01);
        expect(process.env[testVar]).toBe('1.01');
        expect($env.get('@global', testVar)).toBe(1.01);

        $env.unset('@global', testVar);
        expect(process.env[testVar]).toBe(undefined);
        expect($env.get('@global', testVar)).toBe(undefined);
    });
});
