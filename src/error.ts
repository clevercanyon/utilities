/**
 * Error utilities.
 */

import '#@initialize.ts';

import { $is, $obj } from '#index.ts';

/**
 * Defines types.
 */
export type MessageOptions = {
    causes?: string[];
    default: string;
};

/**
 * Generates an error message from a thrown value.
 *
 * @param   thrown  Something thrown and caught by this utility’s caller.
 * @param   options `{ default: 'Message.' }` is required; {@see MessageOptions}.
 *
 * @returns         Error message from thrown value.
 */
export const safeMessageFrom = (thrown: unknown, options: MessageOptions): string => {
    const opts = $obj.defaults({}, options || {}, { causes: [] }) as Required<MessageOptions>,
        isError = $is.error(thrown),
        isErrorCode = isError && $is.errorCode(thrown);

    return isErrorCode ? 'Error code: ' + thrown.message + '.'
        : //
          isError && opts.causes.length && $is.string(thrown.cause) && opts.causes.includes(thrown.cause)
          ? thrown.message // Thrown message is deemed safe to use.
          : //
            opts.default || 'Unknown error: 9SDfdYDq.'; // prettier-ignore
};
