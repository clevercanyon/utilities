/**
 * Test suite.
 */

import { $mm } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$mm', async () => {
    test('.test()', async () => {
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', 'aeiou*')).toBe(true);
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '*aeiou*')).toBe(true);
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '*a{x,e}iou*')).toBe(true);
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '*çÇßØøÅåÆæœ🦊')).toBe(true);
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '*ꓺ*')).toBe(true);
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '*🦊')).toBe(true);
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '* ꓺ ... 🦊 *')).toBe(true);

        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', ' ')).toBe(false);
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', ' *')).toBe(false);
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', '*x*')).toBe(false);
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', '*a{x,z}iou*')).toBe(false);
        expect($mm.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', '*🦊🦊🦊🦊🦊🦊🦊*')).toBe(false);
    });
    test('.any(), .isMatch()', async () => {
        expect($mm.any('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', 'aeiou*')).toBe(true);
        expect($mm.any('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '*aeiou*')).toBe(true);
        expect($mm.any('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '*a{x,e}iou*')).toBe(true);
        expect($mm.isMatch('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '*çÇßØøÅåÆæœ🦊')).toBe(true);
        expect($mm.isMatch('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '*ꓺ*')).toBe(true);
        expect($mm.isMatch('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '*🦊')).toBe(true);
        expect($mm.isMatch('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', '* ꓺ ... 🦊 *')).toBe(true);

        expect($mm.any('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', ' ')).toBe(false);
        expect($mm.any('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', ' *')).toBe(false);
        expect($mm.isMatch('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', '*x*')).toBe(false);
        expect($mm.isMatch('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', '*a{x,z}iou*')).toBe(false);
        expect($mm.isMatch('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', '*🦊🦊🦊🦊🦊🦊🦊*')).toBe(false);

        expect($mm.any('/nested/path/abc', '**/abc/**')).toBe(true);
        expect($mm.any('/nested/path/abc/x/y/z', '**/abc/**')).toBe(true);
        expect($mm.any('/nested/nested/path/abc', '**/abc/**')).toBe(true);
        expect($mm.isMatch('/nested/nested/path/abc/x/y/z', '**/abc/**')).toBe(true);
        expect($mm.isMatch('/nested/nested/path/abc/.x/y/z', '**/abc/**')).toBe(false);
        expect($mm.isMatch('/nested/nested/path/abc/x/.y/z', '**/abc/**')).toBe(false);
        expect($mm.isMatch('/nested/nested/path/abc/x/y/.z', '**/abc/**')).toBe(false);
        expect($mm.isMatch('/nested/nested/path/abc/.x/.y/.z', '**/abc/**', { dot: true })).toBe(true);
    });
});
