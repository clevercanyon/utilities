/**
 * Preact ISO.
 */

import { $env, $is, $obj, $preact, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type PrerenderOptions = {
    props?: $preact.AnyProps;
    maxDepth?: number;
};
export type PrerenderResult = { html: string };

/**
 * Prerenders a component or vNode tree.
 *
 * @param   componentOrVNode Component or vNode to prerender.
 * @param   options          Options (all optional); {@see PrerenderOptions}.
 *
 * @returns                  Promise of {@see PrerenderResult}.
 *
 * @note This utility must only be used server-side.
 */
export async function prerender(componentOrVNode: $preact.AnyComponent | $preact.VNode, options?: PrerenderOptions): Promise<PrerenderResult> {
    if (!$env.isSSR()) throw Error('auyKXPAm');

    // Enables error boundaries in `preact-render-to-string`; {@see https://o5p.me/XaPyFV}.
    ($preact.options as $type.Object).errorBoundaries = true;

    let vNode: $preact.VNode, // Initializes vNode.
        currentDepth = 0; // Initializes current depth.
    const opts = $obj.defaults({}, options || {}, { props: {}, maxDepth: 10 }) as Required<PrerenderOptions>;

    if ($is.function(componentOrVNode)) {
        vNode = $preact.create(componentOrVNode as $preact.AnyComponent, opts.props);
    } else {
        vNode = $preact.clone(componentOrVNode as $preact.VNode, opts.props);
    }
    const render = (): string | Promise<string> => {
        if (++currentDepth > opts.maxDepth) {
            throw Error('maxDepth'); // Max prerender depth.
        }
        try {
            return $preact.ssr.renderToString(vNode);
            //
        } catch (thrown) {
            if ($is.promise(thrown)) {
                return thrown.then(render);
            }
            throw thrown; // Otherwise, re-throw.
        }
    };
    return { html: await render() };
}
