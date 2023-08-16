/**
 * Preact component.
 */

import * as $preact from '../../../preact.js';

/**
 * Props interface.
 */
export interface Props extends $preact.Props {}

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	return <button class={$preact.classes('', props)}>{props.children}</button>;
};
