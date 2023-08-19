/**
 * Preact component.
 */

import { useHTML } from './html.js';
import * as $preact from '../../preact.js';
import { omit as $objꓺomit } from '../../obj.js';

/**
 * Props interface.
 */
export type Props = $preact.Props<{
	bodyClasses?: string | string[];
}>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	const { state, updateState } = useHTML();

	updateState({
		...$objꓺomit(props, ['classes', 'children', 'ref']),
		bodyClasses: props.classes || [],
	});
	return <body class={$preact.classes(state.bodyClasses)}>{props.children}</body>;
};
