/**
 * Error utilities.
 */

import '#@initialize.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $is, $obj } from '#index.ts';

/**
 * Defines types.
 */
export type MessageOptions = {
    causes?: string[];
    default: string;
};

/**
 * Error code regular expression.
 *
 * Error codes are {@see Error} instances containing a message that’s exactly 8 alphanumeric bytes in length; i.e.,
 * merely an error code. A few examples: `yYxSWAPg`, `56MMRj3J`, `xejqwBWR`, `Rqr8YpSW`, `t6Sg78Yr`, `fkDneern`. Using a
 * message with only an error code is not always approriate, but error codes are generally lighter and safer. They don’t
 * expose potentially sensitive information to an end-user. When they are used consistently throughout a codebase, the
 * result is that errors contribute far fewer bytes to the overall size of a JavaScript bundle.
 *
 * Code examples:
 *
 *     throw Error('yYxSWAPg'); // Must be a unique ID.
 *     throw Error('XZfhG2rc'); // Must be a unique ID.
 *
 * @returns Error code regular expression.
 *
 * @see $is.errorCode()
 */
export const codeRegExp = $fnꓺmemo((): RegExp => /^[a-z0-9]{8}$/iu);

/**
 * Generates an error message from a thrown value.
 *
 * @param   thrown  Something thrown and caught by this utility’s caller.
 * @param   options `{ default: 'Message or code.' }` is required; {@see MessageOptions}.
 *
 * @returns         Error message from thrown value.
 */
export const safeMessageFrom = (thrown: unknown, options: MessageOptions): string => {
    const opts = $obj.defaults({}, options || {}, { causes: [] }) as Required<MessageOptions>,
        isError = $is.error(thrown),
        isErrorCode = isError && $is.errorCode(thrown),
        tꓺError𑂱codeꓽ𑂱 = 'Error code: ';

    return isErrorCode ? tꓺError𑂱codeꓽ𑂱 + thrown.message + '.'
        : //
          isError && opts.causes.length && $is.string(thrown.cause) && opts.causes.includes(thrown.cause)
          ? thrown.message // Thrown message is deemed safe to use.
          : //
          codeRegExp().test(opts.default)
            ? tꓺError𑂱codeꓽ𑂱 + opts.default + '.'
            : opts.default;
    // prettier-ignore
};
