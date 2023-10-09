/**
 * Test suite.
 */

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { $env, $preact, $url } from '../../../index.ts';
import { Route, Router } from '../../../preact/components.tsx';

const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'string', default: '' });

describe('<Router>', async () => {
    beforeAll(async () => {
        $env.set('APP_BASE_URL', 'http://x.tld/');
    });
    afterAll(async () => {
        $env.set('APP_BASE_URL', __origAppBaseURL__);
        $url.appBase.flush();
        $url.appBasePath.flush();
    });
    test('basics', async () => {
        expect(
            $preact.ssr.renderToString(
                <Router url={$url.appBase()} baseURL={$url.appBase()}>
                    <Route default component={(await import('../../../preact/components/error-404.tsx')).default} />
                </Router>,
            ),
        ).toContain('</html>');
    });
});
