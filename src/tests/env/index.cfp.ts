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
        expect(import.meta.env.MODE).toBeOneOf(['ci', 'dev', 'prod', 'stage']);
        expect($env.get('_APP_IS_VITE')).toBe('serve=' + import.meta.env.MODE);
    });
    test('.isWeb()', async () => {
        expect($env.isWeb()).toBe(true);
    });
    test('.isWebViaJSDOM()', async () => {
        expect($env.isWebViaJSDOM()).toBe(true);
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
});
