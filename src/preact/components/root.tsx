/**
 * Preact component.
 */

import '../../resources/init.ts';

import { $preact } from '../../index.ts';
import { Data, Location, Router, type DataProps, type LocationProps, type RouterProps } from '../components.tsx';

/**
 * Defines types.
 */
export type Props = Omit<$preact.Props<LocationProps & DataProps & RouterProps>, $preact.ClassPropVariants>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Root(props: Props): $preact.VNode<Props> {
    return (
        <Location url={props.url} baseURL={props.baseURL}>
            <Data globalObp={props.globalObp} fetcher={props.fetcher} head={props.head}>
                <Router onError={props.onError} onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
                    {props.children}
                </Router>
            </Data>
        </Location>
    );
}
