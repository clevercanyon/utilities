/**
 * Error utilities.
 */

import '#@initialize.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $is, $obj, $str } from '#index.ts';

/**
 * Defines types.
 */
export type MessageOptions = {
    expectedCauses?: (string | RegExp)[];
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
 * A safe message from a thrown value is a message that’s attached to a {@see Error}, and is either an error code, or
 * was thrown due to an expected cause. Expected causes can be passed as an option to this utility.
 *
 * @param   thrown  Something thrown and caught by this utility’s caller.
 * @param   options `{ default: 'Message or code.' }` is required; {@see MessageOptions}.
 *
 * @returns         Safe error message from thrown value.
 *
 * @see isExpectedCause()
 */
export const safeMessageFrom = (thrown: unknown, options: MessageOptions): string => {
    const opts = $obj.defaults({}, options || {}, { expectedCauses: [] }) as Required<MessageOptions>,
        tꓺError𑂱codeꓽ𑂱 = 'Error code: '; // Text token.

    if ($is.errorCode(thrown)) {
        return tꓺError𑂱codeꓽ𑂱 + thrown.message + '.';
    }
    if (opts.expectedCauses.length && $is.error(thrown)) {
        let error: unknown = thrown; // Initialize.

        while ($is.error(error) && $is.errorCause(error.cause)) {
            if (
                error.message &&
                (($is.string(error.cause) && isExpectedCause(opts.expectedCauses, error.cause)) ||
                    ($is.plainObject(error.cause) && isExpectedCause(opts.expectedCauses, error.cause.code)))
            ) {
                return error.message; // Expected; i.e., safe, error message.
            }
            error = error.cause; // Up the stack we go.
        }
    }
    return codeRegExp().test(opts.default) ? tꓺError𑂱codeꓽ𑂱 + opts.default + '.' : opts.default;
};

// ---
// Misc utilites.

/**
 * Checks if a cause code is expected.
 *
 * @param   expectedCauses Expected causes.
 * @param   code           An error’s cause code.
 *
 * @returns                True if cause code is expected.
 */
const isExpectedCause = (expectedCauses: (string | RegExp)[], code: string): boolean => {
    return expectedCauses.some((expectedCause: string | RegExp): boolean => {
        if ($is.string(expectedCause)) {
            return (
                code === $str.rTrim(expectedCause, ':') || // Even match.
                //
                // `expectedCause` does not contain a `:`. True if code starts with `expectedCause:`.
                (!expectedCause.includes(':') && code.startsWith(expectedCause + ':')) ||
                //
                // `expectedCause` explicitly ends with a `:`. True if `code` starts with `expectedCause:`.
                (expectedCause.endsWith(':') && code.startsWith(expectedCause)) // i.e., Ends with a prefix.
            );
        }
        return expectedCause.test(code); // Expected cause w/ its own regular expression.
    });
};
