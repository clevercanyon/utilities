/**
 * Preact component.
 */

import { $preact } from '../../index.ts';

/**
 * Defines types.
 */
export type Props = $preact.Props<Partial<$preact.JSX.IntrinsicElements['div']>>;

/**
 * Renders component.
 *
 * `<x-midsection>` identifies a section between `<header>` and `<footer>`; e.g., `<header><x-midsection><footer>`. We
 * use this tag frequently at all levels of a DOM tree, as there is often a desire not to use `<section>` as a sibling
 * of `<header><footer>`. So `<x-midsection>` identifies a block between `<header>` and `<footer>` that is purely for
 * styling purposes. Other than `<div>`, HTML doesn’t offer a semantic tag for this natively.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Midsection(props: Props = {}): $preact.VNode<Props> {
    return $preact.createElement('x-midsection' as 'div', {
        ...$preact.omitProps(props, ['class']), // Does not omit `children`.
        class: $preact.classes('block', props),
    }) as $preact.VNode<Props>;
}
