/**
 * Preact component.
 */

import '../../resources/init.ts';

import { $obj, $preact } from '../../index.ts';
import { default as Analytics } from '../components/analytics.tsx';
import { default as Clipboard } from '../components/clipboard.tsx';
import { default as Consent } from '../components/consent.tsx';
import { default as Data, namedPropKeys as namedDataPropKeys, type Props as DataProps } from '../components/data.tsx';
import { default as Location, namedPropKeys as namedLocationPropKeys, type Props as LocationProps } from '../components/location.tsx';
import { default as Router, namedPropKeys as namedRouterPropKeys, type Props as RouterProps } from '../components/router.tsx';
import { default as Turnstile } from '../components/turnstile.tsx';

/**
 * Defines types.
 */
export type Props = $preact.BasicTreeProps<LocationProps & DataProps & RouterProps>;

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
        <Consent>
            <Analytics>
                <Turnstile>
                    <Clipboard>
                        <Location {...$obj.pick(restProps, namedLocationPropKeys())}>
                            <Data {...$obj.pick(restProps, namedDataPropKeys())}>
                                <Router {...$obj.pick(restProps, namedRouterPropKeys())}>{children}</Router>
                            </Data>
                        </Location>
                    </Clipboard>
                </Turnstile>
            </Analytics>
        </Consent>
    );
}
