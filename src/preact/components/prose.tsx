/**
 * Preact component.
 */

import { $preact } from '../../index.ts';
import { Custom, type CustomProps } from '../components.tsx';

/**
 * Defines types.
 */
export type Props = Partial<CustomProps> & {
    as?: string; // HTML tag name.
    color?: string; // Prose color class.
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Prose(props: Props = {}): $preact.VNode<Props> {
    const { as = 'div', color = '' } = props;
    const proseClasses = [
        'prose', //
        'max-w-none',
        color, // e.g., `prose-neutral`.
        'dark:prose-invert',
        'gte-desktop:prose-lg',
    ];
    if (as.includes('-') /* Custom tag? */) {
        return <Custom {...{ as, ...$preact.omitProps(props, ['as', 'color', 'class']), class: $preact.classes(proseClasses, props) }} />;
    }
    return $preact.createElement(as as 'div' | 'span', {
        ...$preact.omitProps(props, ['as', 'color', 'class']),
        class: $preact.classes(proseClasses, props),
    }) as $preact.VNode<Props>;
}
