/**
 * Test suite.
 */

import { MutableRef, useRef } from 'preact/hooks';
import * as $preactꓺssr from '../../../preact/apis/ssr.js';
import { describe, test, expect } from 'vitest';

describe('preact useRef tests', async () => {
	let ref1: MutableRef<string>, ref2: MutableRef<string>;

	function TestComponent() {
		ref1 = useRef('yes');
		ref2 = useRef('no');

		const initialRefs = [ref1, ref2];
		const initialResult = `${ref1.current}+${ref2.current}`;

		ref1.current = 'hell yes';
		ref2.current = 'hell no';

		const afterResult = `${ref1.current}+${ref2.current}`;

		expect(initialResult !== afterResult);
		expect(initialRefs[0] === ref1);
		expect(initialRefs[1] === ref2);

		return <></>;
	}

	test('useRef', () => {
		// Refs get updated here
		$preactꓺssr.renderToString(<TestComponent />);
	});
});
