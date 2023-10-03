/**
 * Preact component.
 */

import { $preact } from '../../index.ts';

/**
 * Defines types.
 */
export type Props = $preact.Props<Partial<$preact.JSX.IntrinsicElements['main']>>;

/**
 * Renders component.
 *
 * `<main>` (once only) is the dominant content of a document’s `<body>`; {@see https://o5p.me/0rssYI}.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Main(props: Props = {}): $preact.VNode<Props> {
    return (
        <main
            {...{
                ...$preact.omitProps(props, ['class', 'children']),
                class: $preact.classes(props),
            }}
        >
            {props.children}
        </main>
    );
}
