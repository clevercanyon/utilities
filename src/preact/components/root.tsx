/**
 * Preact component.
 */

import '#@initialize.ts';

import { $obj, $preact } from '#index.ts';
import { default as Analytics } from '#preact/components/analytics.tsx';
import { default as AuditLogger, namedPropKeys as namedAuditLoggerPropKeys, type Props as AuditLoggerProps } from '#preact/components/audit-logger.tsx';
import { default as Clipboard } from '#preact/components/clipboard.tsx';
import { default as ConsentLogger, namedPropKeys as namedConsentLoggerPropKeys, type Props as ConsentLoggerProps } from '#preact/components/consent-logger.tsx';
import { default as Consent } from '#preact/components/consent.tsx';
import { default as Data, namedPropKeys as namedDataPropKeys, type Props as DataProps } from '#preact/components/data.tsx';
import { default as HTTP, namedPropKeys as namedHTTPPropKeys, type Props as HTTPProps } from '#preact/components/http.tsx';
import { default as Location, namedPropKeys as namedLocationPropKeys, type Props as LocationProps } from '#preact/components/location.tsx';
import { default as Router, namedPropKeys as namedRouterPropKeys, type Props as RouterProps } from '#preact/components/router.tsx';
import { default as Turnstile } from '#preact/components/turnstile.tsx';

/**
 * Defines types.
 */
export type Props = $preact.BasicTreeProps<AuditLoggerProps & ConsentLoggerProps & HTTPProps & LocationProps & DataProps & RouterProps>;

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
        <AuditLogger {...$obj.pick(restProps, namedAuditLoggerPropKeys())}>
            <ConsentLogger {...$obj.pick(restProps, namedConsentLoggerPropKeys())}>
                <Consent>
                    <Analytics>
                        <Turnstile>
                            <Clipboard>
                                <HTTP {...$obj.pick(restProps, namedHTTPPropKeys())}>
                                    <Location {...$obj.pick(restProps, namedLocationPropKeys())}>
                                        <Data {...$obj.pick(restProps, namedDataPropKeys())}>
                                            <Router {...$obj.pick(restProps, namedRouterPropKeys())}>{children}</Router>
                                        </Data>
                                    </Location>
                                </HTTP>
                            </Clipboard>
                        </Turnstile>
                    </Analytics>
                </Consent>
            </ConsentLogger>
        </AuditLogger>
    );
}
