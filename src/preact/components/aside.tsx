/**
 * Preact component.
 */

import { $preact } from '../../index.ts';

/**
 * Props interface.
 */
export type Props = $preact.Props<Partial<$preact.JSX.IntrinsicElements['aside']>>;

/**
 * Renders component.
 *
 * `<aside>` isolates supplementary content that is not part of the `<main>` content; {@see https://o5p.me/aSMP9n}.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element.
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
