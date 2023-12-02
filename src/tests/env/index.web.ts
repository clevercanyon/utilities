/**
 * Test suite.
 */

import { $env, $url } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$env', async () => {
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
    test('.isCFWViaMiniflare()', async () => {
        expect($env.isCFWViaMiniflare()).toBe(false);
    });
    test('.isWorker()', async () => {
        expect($env.isWorker()).toBe(false);
    });
    test('.isServiceWorker()', async () => {
        expect($env.isServiceWorker()).toBe(false);
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
