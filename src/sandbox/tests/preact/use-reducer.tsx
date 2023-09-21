/**
 * Test suite.
 */
// @ts-nocheck -- sandbox.

import { createContext as preactꓺcreateContext } from 'preact';
import { useReducer as preactꓺhooksꓺuseReducer } from 'preact/hooks';
import { describe, expect, test } from 'vitest';
import * as $preactꓺapisꓺssr from '../../../preact/apis/ssr.tsx';

describe('sandbox: preact', async () => {
    test('useReducer()', async () => {
        const initialState = (componentName) => {
            console.log('Initial <' + componentName + '> State:', {});
        };
        const reducer = (state, updates) => {
            console.log('reducing:', { state, updates });
        };
        const App = (props) => {
            return (
                <Router>
                    <Route />
                    <Route />
                </Router>
            );
        };
        const Router = (props) => {
            return (
                <Location>
                    <Data>{props.children}</Data>
                </Location>
            );
        };
        const Route = (props) => {
            const { state, updateState } = preactꓺhooksꓺuseReducer(reducer, undefined, () => initialState('Route'));
            console.log('<Route> state:', state);
            return (
                <HTML>
                    <Head />
                    <Body></Body>
                </HTML>
            );
        };
        const LocationContext = preactꓺcreateContext({});
        const Location = (props) => {
            const { state, updateState } = preactꓺhooksꓺuseReducer(reducer, undefined, () => initialState('Location'));
            console.log('<Location> State:', state);
            return <LocationContext.Provider value={{ state, updateState }}>{props.children}</LocationContext.Provider>;
        };
        const DataContext = preactꓺcreateContext({});
        const Data = (props) => {
            const { state, updateState } = preactꓺhooksꓺuseReducer(reducer, undefined, () => initialState('Data'));
            console.log('<Data> State:', state);
            return <DataContext.Provider value={{ state, updateState }}>{props.children}</DataContext.Provider>;
        };
        const HTML = (props) => {
            const { state, updateState } = preactꓺhooksꓺuseReducer(reducer, undefined, () => initialState('HTML'));
            console.log('<HTML> State:', state);
            return <html>{props.children}</html>;
        };
        const Head = (props) => {
            const { state, updateState } = preactꓺhooksꓺuseReducer(reducer, undefined, () => initialState('Head'));
            console.log('<Head> State:', state);
            return <head>{props.children}</head>;
        };
        const Body = (props) => {
            const { state, updateState } = preactꓺhooksꓺuseReducer(reducer, undefined, () => initialState('Body'));
            console.log('<Body> State:', state);
            return <body>{props.children}</body>;
        };
        console.log($preactꓺapisꓺssr.renderToString(<App />));
        expect(true).toBe(true);
    });
});
