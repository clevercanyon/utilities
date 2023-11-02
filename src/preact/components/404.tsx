/**
 * Preact component.
 */

import '../../resources/init.ts';

import { $env, $is, $preact } from '../../index.ts';
import { default as Body } from './body.tsx';
import { default as Head } from './head.tsx';
import { default as HTML } from './html.tsx';

/**
 * Renders component.
 *
 * - This has its own main style bundle.
 * - This is purely static. It does not use a script bundle.
 * - This must only be used as a route and it does not accept props.
 *
 * @deprecated Because this uses its own stylesheet, it must swap the style bundle out and use its own. This is also why
 *   apps should prefer to create their own 404 error route. Ideally, one that can leverage an app’s existing styles.
 *
 * @returns VNode / JSX element tree.
 */
export default function Route404(): $preact.VNode {
    if ($is.empty($preact.useRoute())) {
        throw new Error(); // Must only be used as a route.
    }
    if ($env.isSSR()) {
        const { updateState: updateHTTPState } = $preact.useHTTP();
        updateHTTPState({ status: 404 }); // Records 404 error.
    }
    return (
        <HTML>
            <Head
                robots='noindex, nofollow'
                title='404 Error: Not Found'
                description='The resource you are looking for could not be found.'
                //
                styleBundle='https://cdn.clevercanyon.com/assets/uploads/404.css'
                scriptBundle='' // Purely static. It does not use a script bundle.
            />
            <Body>
                <Content />
            </Body>
        </HTML>
    );
}

/**
 * Defines types.
 */
type StandAloneProps = $preact.BasicPropsNoKeyRefChildren<{ lang?: string }> & {
    [x in $preact.ClassPropVariants]?: $preact.Classes;
};

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
    if (!$env.isSSR()) throw $env.errSSROnly;
    return (
        <html class={$preact.classes(props)} lang={props.lang || 'en-US'}>
            <head>
                <meta charSet='utf-8' />
                <meta name='robots' content='noindex, nofollow' />
                <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1' />

                <title>404 Error: Not Found</title>
                <meta name='description' content='The resource you are looking for could not be found.' />

                <link rel='stylesheet' href='https://cdn.clevercanyon.com/assets/uploads/404.css' media='all' />
            </head>
            <body>
                <Content />
            </body>
        </html>
    );
};

/**
 * Renders component.
 *
 * @returns VNode / JSX element tree.
 */
const Content = (): $preact.VNode => {
    return (
        <>
            <div class='noise' />
            <div class='overlay' />
            <div class='terminal'>
                <h1>
                    404 Error: <span class='error-message'>Not Found</span>
                </h1>
                <p class='output'>The resource you are looking for could not be found.</p>
                <p
                    class='output'
                    dangerouslySetInnerHTML={{
                        __html: `
                            Please
                            <a href="#" onClick="event.preventDefault(); event.stopImmediatePropagation(); history.back();">go back</a>
                            or <a href="/">return to the front page</a>.
                        `,
                    }}
                />
                <p class='output'>Good luck.</p>
            </div>
        </>
    );
};
