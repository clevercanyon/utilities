/**
 * Types.
 */
// organize-imports-ignore
/* eslint-disable @typescript-eslint/no-redeclare */

import { type $type } from '#index.ts';
export type * from '@cloudflare/workers-types/experimental/index.ts';
import type * as cfw from '@cloudflare/workers-types/experimental/index.ts';

export declare var Request: {
    prototype: Request;
    new <
        CfHostMetadata = unknown, //
        Cf = cfw.CfProperties<CfHostMetadata>,
    >(
        info: RequestInfo<cfw.CfProperties>,
        init?: RequestInit<Cf>,
    ): Request<CfHostMetadata, Cf>;
};
export interface Request<CfHostMetadata = unknown, Cf = cfw.CfProperties<CfHostMetadata>> extends cfw.Request<CfHostMetadata, Cf> {
    c10n?: $type.RequestC10nProps;
}
export type RequestInfo<CfHostMetadata = unknown, Cf = cfw.CfProperties<CfHostMetadata>> = Request<CfHostMetadata, Cf> | cfw.URL | string;
export type RequestInit<Cf = cfw.CfProperties> = cfw.RequestInit<Cf> & { c10n?: $type.RequestC10nProps };

export type ServiceWorkerGlobalScope = Omit<cfw.ServiceWorkerGlobalScope, 'Request' | 'fetch'> & {
    Request: typeof Request;
    fetch(
        this: void, // {@see https://typescript-eslint.io/rules/unbound-method/}.
        info: RequestInfo,
        init?: RequestInit<cfw.RequestInitCfProperties>,
    ): Promise<cfw.Response>;
};
