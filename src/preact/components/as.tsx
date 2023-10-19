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
        tag?: string; // HTML tag name. Remember to use a dash in any custom tags.
    }
>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note If no `tag` prop, the default tag is a `<div>`.
 * @note If no classes, and it’s a custom tag, default class is `block`.
 */
export default function As(props: Props): $preact.VNode<Props> {
    const tag = props.tag || 'div';
    const classes = $preact.classes(props);
    const displayClasses = !classes && tag.includes('-') ? 'block' : '';

    return $preact.createElement(tag as 'div' | 'span', {
        ...$preact.omitProps(props, ['tag', 'class']),
        class: $preact.classes(displayClasses, classes),
    }) as $preact.VNode<Props>;
}
