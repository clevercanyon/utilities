/**
 * Preact component.
 */

import { $preact } from '../../index.ts';

/**
 * Defines types.
 */
export type Props = $preact.Props<Partial<$preact.JSX.IntrinsicElements['aside']>>;

/**
 * Renders component.
 *
 * `<aside>` isolates supplementary content that is not part of the `<main>` content; {@see https://o5p.me/aSMP9n}.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Aside(props: Props = {}): $preact.VNode<Props> {
    return (
        <aside
            {...{
                ...$preact.omitProps(props, ['class', 'children']),
                class: $preact.classes(props),
            }}
        >
            {props.children}
        </aside>
    );
}
