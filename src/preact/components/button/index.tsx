/**
 * Preact component.
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
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preactꓺVNode<Props> => {
	return <button class={$preactꓺclasses('', props)}>{props.children}</button>;
};
