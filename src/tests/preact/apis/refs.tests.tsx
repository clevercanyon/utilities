/**
 * Test suite.
 */

import { MutableRef, useRef, useState } from 'preact/hooks';
import * as $preactꓺssr from '../../../preact/apis/ssr.js';
import { describe, test, expect } from 'vitest';

describe('preact useRef tests', async () => {
	let ref1: MutableRef<string>, ref2: MutableRef<string>, renderCount: MutableRef<number>;
	let testValue: number, setTestValue;

	function TestComponent() {
		ref1 = useRef('yes');
		ref2 = useRef('no');

		renderCount = useRef(0);
		expect(renderCount.current).toEqual(0);

		[testValue, setTestValue] = useState(0);

		const initialRefs = [ref1, ref2];
		const initialResult = `${ref1.current}+${ref2.current}`;

		expect(ref1.current).toEqual('yes');
		expect(ref2.current).toEqual('no');

		setTestValue(testValue + 1);

		ref1.current = 'hell yes';
		ref2.current = 'hell no';
		renderCount.current = renderCount.current + 1; // Always sets renderCount to 1. Never changes.

		const afterResult = `${ref1.current}+${ref2.current}`;

		// Neither of these can be always true as the function rerenders.
		// expect(test).toEqual(0);
		// expect(test).toEqual(1);

		// But these values are always the same.
		expect(initialResult).not.toEqual(afterResult);
		expect(initialRefs[0]).toEqual(ref1);
		expect(initialRefs[1]).toEqual(ref2);
		expect(renderCount.current).toEqual(1);

		console.log('renderCount', renderCount.current, testValue);

		return (
			<>
				{ref1.current} | {ref2.current} | {renderCount.current} | {testValue}
			</>
		);
	}

	test('useRef', async () => {
		// Refs get updated here
		$preactꓺssr.renderToString(<TestComponent />);
		$preactꓺssr.renderToString(<TestComponent />);
		const finalRender = $preactꓺssr.renderToString(<TestComponent />);

		console.log('final render', finalRender.toString());
		expect(finalRender).toContain('1');

		await new Promise((resolve) => {
			setTimeout(resolve, 500);
		});

		console.log(ref1, ref2, renderCount);
	});
});
