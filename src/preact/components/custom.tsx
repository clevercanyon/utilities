/**
 * Preact component.
 */

import '../../resources/init.ts';

import { $preact } from '../../index.ts';

/**
 * Defines types.
 */
export type Props = $preact.Props<
    Partial<$preact.JSX.IntrinsicElements['div'] | $preact.JSX.IntrinsicElements['span']> & {
        as: string; // Custom HTML tag name; must include a dash.
    }
>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Custom(props: Props): $preact.VNode<Props> {
    const { as } = props;

    if (!as.includes('-')) {
        throw new Error('Custom tag missing `-`.');
    }
    const classes = $preact.classes(props);
    const displayClasses = classes ? '' : 'block';

    return $preact.createElement(as as 'div' | 'span', {
        ...$preact.omitProps(props, ['as', 'class']),
        class: $preact.classes(displayClasses, classes),
    }) as $preact.VNode<Props>;
}
