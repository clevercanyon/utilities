/**
 * Preact layout.
 */

import * as $preact from '../../../preact.js';

/**
 * Props interface.
 */
export interface Props extends $preact.Props {}

/**
 * Renders layout.
 *
 * @param   props Layout props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	return <div class={$preact.classes('', props)}>{props.children}</div>;
};
