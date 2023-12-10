/**
 * Preact component.
 */

import '#@initialize.ts';

import { $preact } from '#index.ts';
import { default as As, type Props as AsProps } from '#preact/components/as.tsx';

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
    const classMap = $preact.classMap(props);
    return (
        <As
            {...{
                ...$preact.omitProps(props, ['class']),
                // In our Tailwind implementation, `p` = `prose`.
                // The `text-base` class handles auto-scaling of prose copy.
                // Prose styles use em units while `text-base` uses autoscaling clamps.
                class: $preact.classes('p', classMap.hasTextSize() ? '' : 'text-base', props),
            }}
        />
    );
}
