/**
 * Types.
 */
// organize-imports-ignore

import { type $type } from '#index.ts';
export type * from '@cloudflare/workers-types/experimental';
import type * as cfw from '@cloudflare/workers-types/experimental';

export type Request<CfHostMetadata = unknown> = cfw.Request<CfHostMetadata> & {
    c10n?: $type.RequestC10n['c10n'];
};
