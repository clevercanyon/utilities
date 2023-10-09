/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $url } from '../../index.ts';

describe('$url', async () => {
    test('.current()', async () => {
        expect(() => $url.current()).toThrow();
    });
    test('.currentReferrer()', async () => {
        expect(() => $url.currentReferrer()).toThrow();
    });
    test('.currentScheme()', async () => {
        expect(() => $url.currentScheme()).toThrow();
    });
    test('.currentHost()', async () => {
        expect(() => $url.currentHost()).toThrow();
    });
    test('.currentRootHost()', async () => {
        expect(() => $url.currentRootHost()).toThrow();
    });
    test('.currentPort()', async () => {
        expect(() => $url.currentPort()).toThrow();
    });
    test('.currentPath()', async () => {
        expect(() => $url.currentPath()).toThrow();
    });
    test('.currentSubpath()', async () => {
        expect(() => $url.currentSubpath()).toThrow();
    });
    test('.currentQuery()', async () => {
        expect(() => $url.currentQuery()).toThrow();
    });
    test('.currentHash()', async () => {
        expect(() => $url.currentHash()).toThrow();
    });
    test('.currentPathQuery()', async () => {
        expect(() => $url.currentPathQuery()).toThrow();
    });
    test('.currentPathQueryHash()', async () => {
        expect(() => $url.currentPathQueryHash()).toThrow();
    });
    test('.currentBase()', async () => {
        expect(() => $url.currentBase()).toThrow();
    });
    test('.currentBasePath()', async () => {
        expect(() => $url.currentBasePath()).toThrow();
    });
});
