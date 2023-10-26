/**
 * Preact component.
 */

import '../../resources/init.ts';

import { $preact } from '../../index.ts';
import { default as Data, type Props as DataProps } from '../components/data.tsx';
import { default as Location, type Props as LocationProps } from '../components/location.tsx';
import { default as Router, type Props as RouterProps } from '../components/router.tsx';

/**
 * Defines types.
 */
export type Props = $preact.BasicProps<LocationProps & DataProps & RouterProps>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Root(props: Props): $preact.VNode<Props> {
    return (
        <Location isHydration={props.isHydration} url={props.url} baseURL={props.baseURL}>
            <Data globalObp={props.globalObp} fetcher={props.fetcher} head={props.head}>
                <Router onError={props.onError} onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
                    {props.children}
                </Router>
            </Data>
        </Location>
    );
}
