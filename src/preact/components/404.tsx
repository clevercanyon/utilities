/**
 * Preact component.
 */

import '#@initialize.ts';

import { $env, $preact } from '#index.ts';

/**
 * Defines types.
 */
type StandAloneProps = $preact.CleanProps<{
    [x in $preact.ClassPropVariants]?: $preact.Classes;
}>;

/**
 * Renders component.
 *
 * This component should be easy to render as a string and then for it be easily dropped into any system, serving as a
 * default 404 error page; e.g., for a Cloudflare Pages site serving static assets. It does not depend on `<Location>`,
 * `<Data>`, `<Router>`, `<HTML>`, or any other context and/or component outside of this file.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @requiredEnv ssr -- This component must only be used server-side.
 */
export const StandAlone = (props: StandAloneProps = {}): $preact.VNode<StandAloneProps> => {
    if (!$env.isSSR()) throw Error('a7uu3pZV');

    return (
        <html class={$preact.classes(props)} lang='en-US' dir='ltr'>
            <head>
                <meta charSet='utf-8' />
                <meta name='robots' content='noindex, nofollow' />
                <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1' />

                <title>404 Error: Not Found</title>
                <meta name='description' content='The resource you are looking for could not be found.' />

                <link rel='stylesheet' href='https://r2.hop.gdn/assets/404/index.css' media='all' />
            </head>
            <body>
                <div class='noise' />
                <div class='overlay' />
                <div class='terminal'>
                    <h1>
                        404 Error: <span class='error-message'>Not Found</span>
                    </h1>
                    <p class='output'>The resource you are looking for could not be found.</p>
                    <p class='output'>
                        Please go back or <a href='/'>return to the front page</a>.
                    </p>
                    <p class='output'>Good luck.</p>
                </div>
            </body>
        </html>
    );
};
