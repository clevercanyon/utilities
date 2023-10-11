/**
 * Preact component.
 */

import { $preact } from '../../index.ts';
import { Custom, type CustomProps } from '../components.tsx';

/**
 * Defines types.
 */
export type Props = $preact.Props<
    Partial<CustomProps> & {
        as?: string; // HTML tag name to use.
    }
>;

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
    const { as = 'div' } = props;
    const proseClasses = [
        'prose', //
        'max-w-none',
        'dark:prose-invert',
        'gte-desktop:prose-lg',
    ];
    if (as.includes('-') /* Custom tag? */) {
        return (
            <Custom
                {...{
                    ...$preact.omitProps(props, ['as', 'class']),
                    ...{ as, class: $preact.classes(proseClasses, props) },
                }}
            />
        );
    }
    return $preact.createElement(as as 'div' | 'span', {
        ...$preact.omitProps(props, ['as', 'class']),
        class: $preact.classes(proseClasses, props),
    }) as $preact.VNode<Props>;
}
