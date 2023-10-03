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
 * `<x-wrapper>` identifies a wrap-around tag used explicitly for styling purposes. We use this sparingly, and typically
 * only at the top-level of a layout to help clarify the intended purpose, as it makes our layout code more readable.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Wrapper(props: Props = {}): $preact.VNode<Props> {
    return $preact.createElement('x-wrapper' as 'div', {
        ...$preact.omitProps(props, ['class']), // Does not omit `children`.
        class: $preact.classes('block', props),
    }) as $preact.VNode<Props>;
}
