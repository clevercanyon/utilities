/**
 * Test suite.
 */
// @ts-nocheck -- sandbox.

import { createContext } from 'preact';
import { $obj, $type } from '../../../index.js';
import { describe, test, expect } from 'vitest';
import { useContext, useReducer } from 'preact/hooks';
import * as $preactꓺssr from '../../../preact/apis/ssr.js';

describe('sandbox: preact', async () => {
	test('useReducer()', async () => {
		const Context = createContext({});
		const useData = () => useContext(Context);
		const reducer = (state, updates) => {
			console.log('State in reducer():', { state, updates });
			return $obj.mergeDeep(state, updates);
		};
		const Location = (props) => {
			return <>{props.children}</>;
		};
		const Data = (props) => {
			const [state, updateState] = useReducer(reducer, undefined, () => {
				return { url: 'http://x.tld/' };
			});
			console.log('State in <Data>:', state);
			return <Context.Provider value={{ state, updateState }}>{props.children}</Context.Provider>;
		};
		const Router = (props) => {
			return (
				<Location>
					<Data>{props.children}</Data>
				</Location>
			);
		};
		const App = (props) => {
			return (
				<Router>
					<Component />
					{props.children}
				</Router>
			);
		};
		const Component = (props) => {
			const { state, updateState } = useData();
			console.log('State in <Component> before update:', state);
			updateState({ url: 'http://x.tld/new-path' });
			console.log('State in <Component> after update:', state);
			return <>{props.children}</>;
		};
		console.log($preactꓺssr.renderToString(<App />));

		expect(true).toBe(true);
	});
});
