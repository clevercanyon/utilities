/**
 * Test suite.
 */

import { $mime } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$mime', async () => {
    test('.cleanType()', async () => {
        expect($mime.cleanType('path/file.jpg')).toBe('image/jpeg');
        expect($mime.cleanType('path/file.jpeg')).toBe('image/jpeg');
        expect($mime.cleanType('path/file.png')).toBe('image/png');
        expect($mime.cleanType('path/file.webp')).toBe('image/webp');
        expect($mime.cleanType('path/file.svg')).toBe('image/svg+xml');
    });
    test('.contentType()', async () => {
        expect($mime.contentType('path/file.jpg')).toBe('image/jpeg');
        expect($mime.contentType('path/file.jpeg')).toBe('image/jpeg');
        expect($mime.contentType('path/file.png')).toBe('image/png');
        expect($mime.contentType('path/file.webp')).toBe('image/webp');
        expect($mime.contentType('path/file.svg')).toBe('image/svg+xml; charset=utf-8');
    });
});
