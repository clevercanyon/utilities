/**
 * Preact component.
 */

import { useData } from './data.js';
import * as $preact from '../../preact.js';
import { mergeDeep as $objꓺmergeDeep } from '../../obj.js';

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
	const { state: dataState } = useData();
	if (!dataState) throw new Error('Missing data context.');

	const partialState = $objꓺmergeDeep(
		$preact.cleanProps(props), //
		dataState.html?.body,
	) as unknown as PartialState;

	const state: State = { ...partialState };

	return <body class={$preact.classes(state.classes)}>{props.children}</body>;
};
