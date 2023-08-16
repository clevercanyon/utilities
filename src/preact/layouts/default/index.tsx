/**
 * Preact layout.
 */

import {
	VNode as $preactꓺVNode, //
	Props as $preactꓺProps,
	classes as $preactꓺclasses,
} from '../../../preact.js';

/**
 * Props interface.
 */
export interface Props extends $preactꓺProps {}

/**
 * Renders layout.
 *
 * @param   props Layout props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preactꓺVNode<Props> => {
	return <div class={$preactꓺclasses('', props)}>{props.children}</div>;
};
