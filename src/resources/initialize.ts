/**
 * Initialization.
 */

import { type $type } from '#index.ts';

/**
 * Overrides global Request class.
 *
 * Adds support for `c10n` property.
 */
globalThis.Request = class extends Request {
    public c10n?: $type.RequestC10nProps;

    public constructor(info: $type.RequestInfo, init?: $type.RequestInit) {
        super(info as RequestInfo | URL, init as RequestInit | undefined);

        if (init?.c10n) {
            this.c10n = init.c10n;
        } else if (info instanceof Request && info.c10n) {
            this.c10n = info.c10n;
        }
    }
};
