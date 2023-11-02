/**
 * Preact component.
 */

import '../../resources/init.ts';

import { $obj, $preact } from '../../index.ts';
import { default as Data, namedPropKeys as namedDataPropKeys, type Props as DataProps } from '../components/data.tsx';
import { default as Location, namedPropKeys as namedLocationPropKeys, type Props as LocationProps } from '../components/location.tsx';
import { default as Router, namedPropKeys as namedRouterPropKeys, type Props as RouterProps } from '../components/router.tsx';

/**
 * Defines types.
 */
export type Props = $preact.BasicPropsNoKeyRef<LocationProps & DataProps & RouterProps>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Root(props: Props): $preact.VNode<Props> {
    const { children, ...restProps } = props;
    return (
        <Location {...$obj.pick(restProps, namedLocationPropKeys())}>
            <Data {...$obj.pick(restProps, namedDataPropKeys())}>
                <Router {...$obj.pick(restProps, namedRouterPropKeys())}>{children}</Router>
            </Data>
        </Location>
    );
}
