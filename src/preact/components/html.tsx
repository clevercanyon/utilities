/**
 * Preact component.
 */

import { useData } from './data.js';
import * as $preact from '../../preact.js';

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
	const { state, updateState } = useData();

	if (!state || !updateState) {
		throw new Error('Missing state.');
	}
	updateState({
		html: {
			...$preact.cleanProps(props),
			lang: props.lang || 'en',
			head: props.head || {},
			body: props.body || {},
		},
	});
	return (
		<html lang={state.html.lang} class={$preact.classes(state.html.classes)} data-preact-iso>
			{props.children}
		</html>
	);
};
