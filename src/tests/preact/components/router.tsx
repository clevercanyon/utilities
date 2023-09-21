/**
 * Test suite.
 */

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { $env } from '../../../index.ts';
import * as $preactꓺapisꓺssr from '../../../preact/apis/ssr.tsx';
import { default as $preactꓺcomponentsꓺRouter, Route as $preactꓺcomponentsꓺrouterꓺRoute } from '../../../preact/components/router.tsx';
import { default as $preactꓺroutesꓺ404 } from '../../../preact/routes/404.tsx';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

describe('<Router>', async () => {
    beforeAll(async () => {
        $env.set('@top', 'APP_BASE_URL', 'http://x.tld');
    });
    afterAll(async () => {
        $env.set('@top', 'APP_BASE_URL', __origAppBaseURL__);
    });
    test('basics', async () => {
        expect(
            $preactꓺapisꓺssr.renderToString(
                <$preactꓺcomponentsꓺRouter url='http://x.tld'>
                    <$preactꓺcomponentsꓺrouterꓺRoute default component={$preactꓺroutesꓺ404} />
                </$preactꓺcomponentsꓺRouter>,
            ),
        ).toContain('</html>');
    });
});
