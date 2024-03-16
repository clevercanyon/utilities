/**
 * Test suite.
 */

Object.defineProperty(window, 'location', {
    value: new URL('https://localhost:3000/'),
});
import './index.any.ts';
