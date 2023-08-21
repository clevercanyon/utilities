/**
 * Preact component.
 */

import { useData } from './data.js';
import * as $preact from '../../preact.js';

/**
 * Defines types.
 */
export type State = {
	classes?: string | string[];
};
export type PartialState = Partial<State>;
export type Props = $preact.Props<PartialState>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	const { state, updateState } = useData();
	updateState({ html: { body: { ...$preact.cleanProps(props) } } });
	return <body class={$preact.classes(state.html.body.classes)}>{props.children}</body>;
};
