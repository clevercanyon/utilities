/**
 * Preact component.
 */

import { $preact, $url } from '../../index.ts';

/**
 * Props interface.
 */
export type Props = $preact.Props<Partial<$preact.JSX.IntrinsicElements['a']>> & {
    href?: string; // String value only.
};

/**
 * Renders component.
 *
 * `<link>` is equivalent to `<a>`, but this automatically handles an app’s base path. In the future we may extend this
 * further to support `<button>` elements, or to support differing behaviors. Please stay tuned for more.
 *
 * - WARNING: Do not use this with a dummy `#`; {@see https://o5p.me/OwYOMI}.
 * - WARNING: Do not use this w/o a child node; {@see https://o5p.me/OwYOMI}.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element.
 */
export default function Link(props: Props): $preact.VNode<Props> {
    let href = props.href || undefined; // Initialize.

    if (href && $url.isRootRelative(href)) {
        href = $url.pathFromAppBase(href);
    }
    if ('#' === href || !props.children) {
        throw new Error('A11y: Invalid <Link />.');
    }
    return (
        <a
            {...{
                ...$preact.omitProps(props, ['class', 'href', 'children']),
                href, // Potentially modified above.
                class: $preact.classes(props),
            }}
        >
            {props.children}
        </a>
    );
}
