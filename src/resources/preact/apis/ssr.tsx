/**
 * Preact API.
 */

import { $env, $is, $obj, $preact, type $type } from '#index.ts';
import { renderToStringAsync } from 'preact-render-to-string';

/**
 * Defines types.
 */
export type RenderToStringOptions = {
    props?: $preact.AnyProps;
};

/**
 * Renders a component or vNode tree as a string.
 *
 * @param   componentOrVNode Component or vNode to render.
 * @param   options          Options (all optional); {@see RenderToStringOptions}.
 *
 * @returns                  Promise of {@see RenderToStringResponse}.
 *
 * @note This utility must only be used server-side.
 */
export async function renderToString(componentOrVNode: $preact.AnyComponent | $preact.VNode, options?: RenderToStringOptions): Promise<string> {
    if (!$env.isSSR()) throw Error('auyKXPAm');

    // Enables error boundaries in `preact-render-to-string`; {@see https://o5p.me/XaPyFV}.
    ($preact.options as $type.Object).errorBoundaries = true;

    let vNode: $preact.VNode; // Initializes vNode.
    const opts = $obj.defaults({}, options || {}, { props: {} }) as Required<RenderToStringOptions>;

    if ($is.function(componentOrVNode)) {
        vNode = $preact.create(componentOrVNode as $preact.AnyComponent, opts.props);
    } else {
        vNode = $preact.clone(componentOrVNode as $preact.VNode, opts.props);
    }
    return await renderToStringAsync(vNode);
}
