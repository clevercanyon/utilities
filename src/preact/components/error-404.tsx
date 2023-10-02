/**
 * Preact component.
 */

import { $env, $preact } from '../../index.ts';
import { Body, HTML, Head } from '../components.tsx';
import { type RouteContextAsProps } from './router.tsx';

/**
 * Defines types.
 */
export type StandAloneProps = $preact.Props;
export type Props = $preact.Props<RouteContextAsProps>;

/**
 * Renders route component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note No SSR style/script bundles, as this is a purely static page.
 */
export default function Error404(props: Props): $preact.VNode<Props> {
    if (!$env.isWeb() || $env.isTest() /* Server-side only, with an exception for automated testing. */) {
        const { updateState: updateHTTPState } = $preact.useHTTP();
        updateHTTPState({ status: 404 }); // Record 404 error.
    }
    return (
        <HTML classes={$preact.classes(props)}>
            <Head
                robots={'noindex, nofollow'}
                title={'404 Error: Not Found'}
                description={'The resource you are looking for could not be found.'}
                {...(!$env.isWeb() ? { mainStyleBundle: '', mainScriptBundle: '' } : {})}
            >
                <link rel='stylesheet' href='https://cdn.clevercanyon.com/assets/uploads/404.css' media='all' />
            </Head>
            <Body>
                <BodyContents />
            </Body>
        </HTML>
    );
}

/**
 * Renders stand-alone component.
 *
 * @param   props Stand-alone component props.
 *
 * @returns       Stand-alone vNode / JSX element tree.
 *
 * @note This component should be easy to render as a string and then for it be easily
 * dropped into any system, serving as a 404 error page; e.g., for a Cloudflare Pages site.
 */
export const StandAlone = (props: StandAloneProps = {}): $preact.VNode<StandAloneProps> => {
    return (
        <html class={$preact.classes(props)} lang={'en'}>
            <head>
                <meta charSet={'utf-8'} />
                <meta name='robots' content={'noindex, nofollow'} />
                <meta name='viewport' content={'width=device-width, initial-scale=1.0, minimum-scale=1.0'} />

                <title>{'404 Error: Not Found'}</title>
                <meta name='description' content={'The resource you are looking for could not be found.'} />

                <link rel='stylesheet' href='https://cdn.clevercanyon.com/assets/uploads/404.css' media='all' />
            </head>
            <body>
                <BodyContents />
            </body>
        </html>
    );
};

/**
 * Produces 404 page body contents.
 *
 * @returns Commmon body contents tree.
 */
const BodyContents = (): $preact.VNode => {
    return (
        <>
            <div class='noise' />
            <div class='overlay' />
            <div class='terminal'>
                <h1>
                    {'404 Error: '}
                    <span class='error-message'>{'Not Found'}</span>
                </h1>
                <p class='output'>{'The resource you are looking for could not be found.'}</p>
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
                <p class='output'>{'Good luck.'}</p>
            </div>
        </>
    );
};
