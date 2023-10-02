/**
 * Test suite.
 */

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { $env, $preact, $url } from '../../../index.ts';
import { Route, Router } from '../../../preact/components.tsx';

const __origAppBaseURL__ = $url.currentAppBase(); // App’s base URL, as string.

describe('<Router>', async () => {
    beforeAll(async () => {
        $env.set('APP_BASE_URL', 'http://x.tld');
    });
    afterAll(async () => {
        $env.set('APP_BASE_URL', __origAppBaseURL__);
    });
    test('basics', async () => {
        expect(
            $preact.ssr.renderToString(
                <Router url='http://x.tld'>
                    <Route default component={(await import('../../../preact/components/error-404.tsx')).default} />
                </Router>,
            ),
        ).toContain('</html>');
    });
});
