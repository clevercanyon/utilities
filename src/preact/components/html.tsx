/**
 * Preact component.
 */

import { useData } from './data.js';
import * as $preact from '../../preact.js';
import { mergeDeep as $objꓺmergeDeep } from '../../obj.js';
import type { State as HeadState, PartialState as HeadPartialState, Props as HeadProps } from './head.js';
import type { State as BodyState, PartialState as BodyPartialState, Props as BodyProps } from './body.js';

/**
 * Defines types.
 */
export type State = {
	classes?: string | string[];
	lang?: string;
	head: HeadState;
	body: BodyState;
};
export type PartialState = {
	classes?: string | string[];
	lang?: string;
	head?: HeadPartialState;
	body?: BodyPartialState;
};
export type Props = $preact.Props<
	PartialState & {
		head?: HeadProps;
		body?: BodyProps;
	}
>;

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
		dataState.html,
	) as unknown as PartialState;

	const state: State = {
		...partialState,
		lang: partialState.lang || 'en',
		head: partialState.head || {},
		body: partialState.body || {},
	};
	return (
		<html lang={state.lang} class={$preact.classes(state.classes)} data-preact-iso>
			{props.children}
		</html>
	);
};
