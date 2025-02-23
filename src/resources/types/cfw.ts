/**
 * Types.
 */
// organize-imports-ignore

import { type $type } from '#index.ts';
export type * from '@cloudflare/workers-types/experimental';
import type * as cfw from '@cloudflare/workers-types/experimental';

export type Request<CfHostMetadata = unknown> = cfw.Request<CfHostMetadata> & $type.RequestC10nProps;
export type RequestInit<Cf = cfw.CfProperties> = cfw.RequestInit<Cf> & $type.RequestC10nProps;
