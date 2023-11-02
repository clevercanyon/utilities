/**
 * Preact component.
 */

import '../../resources/init.ts';

import { $obj, $preact } from '../../index.ts';
import { default as Data, type Props as DataProps } from '../components/data.tsx';
import { default as Location, type Props as LocationProps } from '../components/location.tsx';
import { default as Router, corePropKeys as routerCorePropKeys, type Props as RouterProps } from '../components/router.tsx';

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
        <Location {...$obj.pick(props, ['isHydration', 'url', 'baseURL', 'onChange'])}>
            <Data {...$obj.pick(props, ['globalObp', 'fetcher', 'head'])}>
                <Router {...$obj.pick(props, routerCorePropKeys())}>{props.children}</Router>
            </Data>
        </Location>
    );
}
