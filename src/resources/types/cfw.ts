/**
 * Types.
 */
// organize-imports-ignore

import { type $type } from '#index.ts';
export type * from '@cloudflare/workers-types/experimental';
import type * as cfw from '@cloudflare/workers-types/experimental';

export type Request<CfHostMetadata = unknown, Cf = cfw.CfProperties<CfHostMetadata>> = cfw.Request<CfHostMetadata, Cf> & $type.RequestC10nProps;
export type RequestInfo<CfHostMetadata = unknown, Cf = cfw.CfProperties<CfHostMetadata>> = Request<CfHostMetadata, Cf> | cfw.URL | string;
export type RequestInit<Cf = cfw.CfProperties> = cfw.RequestInit<Cf> & $type.RequestC10nProps;
