/**
 * Test suite.
 */

import { $env } from '#index.ts';
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
});
