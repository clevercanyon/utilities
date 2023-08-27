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
		expect(countRef.current).toEqual(0);

		[countState, setCountState] = useState(0);

		const initialRefs = [yesRef, noRef];
		const initialResult = `${yesRef.current}+${noRef.current}`;

		expect(yesRef.current).toEqual('yes');
		expect(noRef.current).toEqual('no');

		setCountState(countState + 1);

		yesRef.current = 'hell yes';
		noRef.current = 'hell no';
		countRef.current = countRef.current + 1; // Always sets renderCount to 1. Never changes.

		const afterResult = `${yesRef.current}+${noRef.current}`;

		// Neither of these can be always true as the function rerenders.
		// expect(test).toEqual(0);
		// expect(test).toEqual(1);

		// But these values are always the same.
		expect(initialResult).not.toEqual(afterResult);
		expect(initialRefs[0]).toEqual(yesRef);
		expect(initialRefs[1]).toEqual(noRef);
		expect(countRef.current).toEqual(1);

		console.log('renderCount', countRef.current, countState);

		return (
			<>
				{yesRef.current} | {noRef.current} | {countRef.current} | {countState}
			</>
		);
	}

	test('useRef', async () => {
		<TestComponent />;
		<TestComponent />;
		const finalRender = $preactꓺssr.renderToString(<TestComponent />);

		console.log('final render', finalRender);
		expect(finalRender).toContain('1'); // countRef.current is always 1, no matter how many times rerendered.
	});
});
