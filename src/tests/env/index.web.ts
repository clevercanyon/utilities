/**
 * Test suite.
 */

import { $env, $is, $url } from '#index.ts';
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
    test('.set(), .unset()', async () => {
        const testVar = '_ZX6EUCDU_';
        window.env = window.env || {};

        $env.set('@global', testVar, 'true');
        expect(window.env[testVar]).toBe('true');

        $env.set('@global', testVar, true);
        expect(window.env[testVar]).toBe(true);

        $env.set('@global', testVar, 1);
        expect(window.env[testVar]).toBe(1);

        $env.set('@global', testVar, 1.01);
        expect(window.env[testVar]).toBe(1.01);

        $env.unset('@global', testVar);
        expect(window.env[testVar]).toBe(undefined);
    });
    test('.isLocal()', async () => {
        const flushCaches = () => {
            $url.currentHost.flush();
            $url.currentRootHost.flush();
            $env.isLocal.flush();
        };
        const origLocation = window.location.href; // Restored below.
        const setLocation = (loc: string) => Object.defineProperty(window, 'location', { value: new URL(loc) });

        flushCaches();
        setLocation('http://mac/');
        expect($env.isLocal()).toBe(false);

        flushCaches();
        setLocation('http://loc/');
        expect($env.isLocal()).toBe(false);

        flushCaches();
        setLocation('http://localhost/');
        expect($env.isLocal()).toBe(true);

        flushCaches();
        setLocation('http://localhost:3000/');
        expect($env.isLocal()).toBe(true);

        flushCaches();
        setLocation('http://x.tld/path');
        expect($env.isLocal()).toBe(false);

        flushCaches();
        setLocation('http://mac/path');
        expect($env.isLocal()).toBe(false);

        flushCaches();
        setLocation('http://loc/path');
        expect($env.isLocal()).toBe(false);

        flushCaches();
        setLocation('http://loc.x/path');
        expect($env.isLocal()).toBe(false);

        flushCaches();
        setLocation('http://x.mac/path');
        expect($env.isLocal()).toBe(true);

        flushCaches();
        setLocation('http://x.x.x.x.x.mac/path');
        expect($env.isLocal()).toBe(true);

        flushCaches();
        setLocation('http://x.loc/path');
        expect($env.isLocal()).toBe(true);

        flushCaches();
        setLocation('http://local/path');
        expect($env.isLocal()).toBe(true);

        flushCaches();
        setLocation('http://x.local/path');
        expect($env.isLocal()).toBe(true);

        flushCaches();
        setLocation('http://localhost/path');
        expect($env.isLocal()).toBe(true);

        flushCaches();
        setLocation('http://x.localhost/path');
        expect($env.isLocal()).toBe(true);

        flushCaches();
        setLocation('http://[::1]/path');
        expect($env.isLocal()).toBe(true);

        flushCaches();
        setLocation('http://[::11]/path');
        expect($env.isLocal()).toBe(false);

        flushCaches();
        setLocation(origLocation);
    });
});
