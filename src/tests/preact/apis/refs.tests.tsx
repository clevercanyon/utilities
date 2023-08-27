/**
 * Test suite.
 */

import { MutableRef, useRef, useState } from 'preact/hooks';
import * as $preactꓺssr from '../../../preact/apis/ssr.js';
import { describe, test, expect } from 'vitest';

describe('preact useRef tests', async () => {
	let yesRef: MutableRef<string>, noRef: MutableRef<string>, countRef: MutableRef<number>;
	let countState: number, setCountState;

	function TestComponent() {
		yesRef = useRef('yes');
		noRef = useRef('no');

		countRef = useRef(0);
		expect(countRef.current).toEqual(0); // countRef.current is always set to 0 on function rerun

		[countState, setCountState] = useState(0);
		setCountState(countState + 1);

		// Whereas countState can never be expected to be any single value.
		// expect(test).toEqual(0);

		// Keeping track of initial ref values
		const initialRefs = [yesRef, noRef];
		const initialResult = `${yesRef.current}+${noRef.current}`;

		// Ref updated values are not kept on rerender, can always be expected to be the value initialized
		// at the beginning of this component.
		expect(yesRef.current).toEqual('yes');
		expect(noRef.current).toEqual('no');

		// Update all ref values
		yesRef.current = 'hell yes';
		noRef.current = 'hell no';
		countRef.current = countRef.current + 1; // Always sets renderCount to 1. Never changes.

		// Tracking afterResult to compare to initialResult
		const afterResult = `${yesRef.current}+${noRef.current}`;

		// The values tested here are always the same regardless of rerenders.
		expect(initialResult).not.toEqual(afterResult);
		expect(initialRefs[0]).toEqual(yesRef);
		expect(initialRefs[1]).toEqual(noRef);
		expect(countRef.current).toEqual(1);

		return (
			<>
				yesRef: {yesRef.current}
				noRef: {noRef.current}
				countRef: {countRef.current}
				countState: {countState}
			</>
		);
	}

	test('useRef', async () => {
		const firstRender = <TestComponent />;
		const firstRenderString = $preactꓺssr.renderToString(firstRender);

		const secondRender = <TestComponent />;
		const secondRenderString = $preactꓺssr.renderToString(secondRender);

		const thirdRender = <TestComponent />;
		const thirdRenderString = $preactꓺssr.renderToString(thirdRender);

		// These values are always expected to be the same.

		expect(firstRenderString).toContain('yesRef: hell yes');
		expect(secondRenderString).toContain('yesRef: hell yes');
		expect(thirdRenderString).toContain('yesRef: hell yes');

		expect(firstRenderString).toContain('noRef: hell no');
		expect(secondRenderString).toContain('noRef: hell no');
		expect(thirdRenderString).toContain('noRef: hell no');

		expect(firstRenderString).toContain('countRef: 1');
		expect(secondRenderString).toContain('countRef: 1');
		expect(thirdRenderString).toContain('countRef: 1');

		// State variable does not(!?) change state, even though renderToString called between component renders.
		expect(firstRenderString).toContain('countState: 24');
		expect(secondRenderString).toContain('countState: 24');
		expect(thirdRenderString).toContain('countState: 24');
	});
});
