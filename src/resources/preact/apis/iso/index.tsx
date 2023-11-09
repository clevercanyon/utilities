/**
 * Preact ISO.
 */

import { $env, $is, $obj, $preact } from '../../../../index.ts';

/**
 * Defines types.
 */
export type PrerenderOptions = {
    props?: $preact.Props;
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
    if (!$env.isSSR()) throw $env.errSSROnly;

    let vNode: $preact.VNode; // Initializes vNode.
    let currentDepth = 0; // Initializes current depth.
    const opts = $obj.defaults({}, options || {}, { props: {}, maxDepth: 10 }) as Required<PrerenderOptions>;

    if ($is.function(componentOrVNode)) {
        vNode = $preact.create(componentOrVNode as $preact.AnyComponent, opts.props);
    } else {
        vNode = $preact.clone(componentOrVNode as $preact.VNode, opts.props);
    }
    const render = (): Promise<string> | string => {
        if (++currentDepth > opts.maxDepth) {
            throw new Error(); // Max prerender depth: `' + String(opts.maxDepth) + '`.
        }
        try {
            return $preact.ssr.renderToString(vNode);
        } catch (thrown) {
            if ($is.promise(thrown)) {
                return thrown.then(render);
            } else throw thrown;
        }
    };
    return { html: await render() };
}
