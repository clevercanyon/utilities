/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $env } from '../../index.ts';

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
    test('.isLocalWeb()', async () => {
        const origLoc = window.location.href; // Restored below.
        const setLoc = (loc: string) => Object.defineProperty(window, 'location', { value: new URL(loc) });

        setLoc('http://localhost:3000');
        expect($env.isLocalWeb()).toBe(true);

        setLoc('http://x.tld/path');
        expect($env.isLocalWeb.fresh()).toBe(false);

        setLoc('http://mac/path');
        expect($env.isLocalWeb.fresh()).toBe(true);

        setLoc('http://loc/path');
        expect($env.isLocalWeb.fresh()).toBe(true);

        setLoc('http://loc.x/path');
        expect($env.isLocalWeb.fresh()).toBe(false);

        setLoc('http://x.mac/path');
        expect($env.isLocalWeb.fresh()).toBe(true);

        setLoc('http://x.x.x.x.x.mac/path');
        expect($env.isLocalWeb.fresh()).toBe(true);

        setLoc('http://x.loc/path');
        expect($env.isLocalWeb.fresh()).toBe(true);

        setLoc('http://local/path');
        expect($env.isLocalWeb.fresh()).toBe(true);

        setLoc('http://x.local/path');
        expect($env.isLocalWeb.fresh()).toBe(true);

        setLoc('http://localhost/path');
        expect($env.isLocalWeb.fresh()).toBe(true);

        setLoc('http://x.localhost/path');
        expect($env.isLocalWeb.fresh()).toBe(true);

        setLoc('http://[::1]/path');
        expect($env.isLocalWeb.fresh()).toBe(true);

        setLoc('http://[::11]/path');
        expect($env.isLocalWeb.fresh()).toBe(false);

        setLoc(origLoc); // Restores the original `window.location`.
    });
});
