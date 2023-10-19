/**
 * Preact component.
 */

import '../../resources/init.ts';

import { $preact } from '../../index.ts';
import { As, type AsProps } from '../components.tsx';

/**
 * Defines types.
 */
export type Props = AsProps;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note A class map can be used to disable default classes; {@see $preact.classes()}.
 */
export default function Prose(props: Props = {}): $preact.VNode<Props> {
    return (
        <As
            {...{
                ...$preact.omitProps(props, ['class']),
                class: $preact.classes('prose max-w-none gte-desktop:prose-lg', props),
            }}
        />
    );
}
