/**
 * Test suite.
 */

import { $is, $symbol } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$symbol', async () => {
    test('.objTag', async () => {
        expect($is.symbol($symbol.objTag)).toBe(true);
    });
    test('.objStringTag', async () => {
        expect($is.symbol($symbol.objStringTag)).toBe(true);
    });
    test('.objToPlain', async () => {
        expect($is.symbol($symbol.objToPlain)).toBe(true);
    });
    test('.objToEquals', async () => {
        expect($is.symbol($symbol.objToEquals)).toBe(true);
    });
    test('.objToJSON', async () => {
        expect($is.string($symbol.objToJSON)).toBe(true);
    });
    test('.objToClone', async () => {
        expect($is.symbol($symbol.objToClone)).toBe(true);
    });
});
