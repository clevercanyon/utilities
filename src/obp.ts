/**
 * Object path utilities.
 */

import '#@initialize.ts';

import { $is, $obj, $str, $to, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type Code = { init: string; set: string };

/**
 * Checks if an object has own or inherited, enumerable or not, object path.
 *
 * @param   objValue  Object to search in.
 * @param   path      Object path in `objValue`.
 * @param   separator Object path separator. Default is `.`.
 * @param   opts      Must be own key at end of object path? Set: `{endOwn: true}`.
 *
 * @returns           True if object has own or inherited, enumerable or not, path.
 *
 *   - See also: `endOwn` option, which changes the return value of this function.
 *
 * @note Object paths do not support symbol keys whatsoever.
 */
export const has = (objValue: unknown, path: $type.ObjectPath | $type.ObjectPath[], separator: string = '.', opts: { endOwn?: boolean } = {}): boolean => {
    path = splitPath(path, separator);

    if (0 === path.length || !$is.object(objValue) || !(path[0] in objValue)) {
        return false; // Can’t go further, or doesn’t have path.
    }
    if (1 === path.length && (!opts.endOwn || Object.hasOwn(objValue, path[0]))) {
        return true; // End of the line.
    }
    return has(objValue[path[0]], path.slice(1), separator, opts);
};

/**
 * Gets an object’s own or inherited, enumerable or not, object path value.
 *
 * @param   objValue     Object to search in.
 * @param   path         Object path in `objValue`.
 * @param   defaultValue Default value if `undefined`.
 * @param   separator    Object path separator. Default is `.`.
 *
 * @returns              Object’s own or inherited, enumerable or not, path value; else `defaultValue`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 */
export const get = (objValue: unknown, path: $type.ObjectPath | $type.ObjectPath[], defaultValue: unknown = undefined, separator: string = '.'): unknown => {
    if (undefined === objValue) {
        return defaultValue;
    }
    path = splitPath(path, separator);

    if (0 === path.length) {
        return objValue; // End of the line.
    }
    if (!$is.object(objValue)) {
        return defaultValue; // Can’t go further.
    }
    return get(objValue[path[0]], path.slice(1), defaultValue, separator);
};

/**
 * Sets an object’s own or inherited, enumerable or not, object path value.
 *
 * @param objValue  Object to search in.
 * @param path      Object path in `objValue`.
 * @param value     Value of the object path.
 * @param separator Object path separator. Default is `.`.
 * @param intOpts   Internal. Do not pass. Instead, use {@see defaultTo()}.
 *
 * @note Object paths do not support symbol keys whatsoever.
 */
export const set = (objValue: unknown, path: $type.ObjectPath | $type.ObjectPath[], value: unknown, separator: string = '.', intOpts: { defaultTo?: boolean } = {}): void => {
    if (!$is.object(objValue)) {
        return; // Nothing more to do.
    }
    path = splitPath(path, separator);

    if (0 === path.length) {
        return; // Nothing more to do.
    }
    const currentPath = path[0]; // Potential prototype.

    if ($is.protoPollutionKey(currentPath)) {
        throw Error('vdW86ej9'); // Denying write access to prototype pollution key: `' + String(currentPath) + '`.
    }
    if (1 === path.length) {
        if (!intOpts.defaultTo || undefined === objValue[currentPath]) {
            objValue[currentPath] = value; // Sets value, or default value.
        }
    } else {
        if (undefined === objValue[currentPath]) {
            objValue[currentPath] = $is.number(path[1]) ? [] : {};
        }
        set(objValue[currentPath], path.slice(1), value, separator, intOpts);
    }
};

/**
 * Sets an object’s own or inherited, enumerable or not, object path default value.
 *
 * @param objValue  Object to search in.
 * @param path      Object path in `objValue`.
 * @param value     Default value of the object path.
 * @param separator Object path separator. Default is `.`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 */
export const defaultTo = (objValue: unknown, path: $type.ObjectPath | $type.ObjectPath[], value: unknown, separator: string = '.'): void => {
    set(objValue, path, value, separator, { defaultTo: true });
};

/**
 * Unsets an object’s own or inherited, enumerable or not, object path.
 *
 * @param objValue  Object to search in.
 * @param path      Object path in `objValue`.
 * @param separator Object path separator. Default is `.`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 * @note The use of `*` only unsets array keys and/or end-own enumerable string keys.
 */
export const unset = (objValue: unknown, path: $type.ObjectPath | $type.ObjectPath[], separator: string = '.'): void => {
    if (!$is.object(objValue)) {
        return; // Nothing more to do.
    }
    path = splitPath(path, separator);

    if (0 === path.length) {
        return; // Nothing more to do.
    }
    const currentPath = path[0]; // Potential prototype.

    if ($is.protoPollutionKey(currentPath)) {
        throw Error('CcguuNCd'); // Denying write access to prototype pollution key: `' + String(currentPath) + '`.
    }
    if ('*' === currentPath) {
        if ($is.array(objValue)) {
            objValue.splice(0, objValue.length);
            //
        } /* Note: `Object.keys()` returns end-own enumerable string keys; i.e., of current `objValue`. */ else {
            for (const key of Array.from(Object.keys(objValue))) {
                delete objValue[key]; // Note: Does not unset symbol keys.
            }
        }
    } else if (1 === path.length) {
        if ($is.array(objValue) && $is.numeric(currentPath, 'safeArrayKey')) {
            objValue.splice(Number(currentPath), 1);
        } else {
            delete objValue[currentPath];
        }
    } else {
        if ('*' === path[1] && !$is.object(objValue[currentPath])) {
            objValue[currentPath] = undefined; // Not an object, so `undefined` is only choice.
        } else {
            unset(objValue[currentPath], path.slice(1), separator);
        }
    }
};

/**
 * Leaves an object’s own or inherited, enumerable or not, object path(s).
 *
 * @param objValue  Object to search in.
 * @param paths     Object path(s) in `objValue`.
 * @param separator Object path separator. Default is `.`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 * @note You can target (i.e., leave) own or inherited, enumerable or not, object paths; unsetting all others.
 *       However, when unsetting all others, this only unsets array keys and/or end-own enumerable string keys.
 *       i.e., It doesn’t unset (get rid of) end-inherited keys, non-enumerable keys, or symbol keys.
 */
export const leave = (objValue: unknown, paths: $type.ObjectPath | $type.ObjectPath[], separator: string = '.'): void => {
    if (!$is.object(objValue)) {
        return; // Nothing more to do.
    }
    const leavePaths: { [x: $type.ObjectPath]: $type.ObjectPath[] } = {};

    for (const path of $to.array(paths)) {
        if (!$is.safeObjectPath(path)) {
            throw Error('b8aD3mN4'); // Invalid object path. Got: `' + String(path) + '`.
        }
        let leavePath: $type.ObjectPath = path;
        let subPaths: $type.ObjectPath[] = [];

        if ($is.string(path) /* Split path into parts. */) {
            [leavePath, ...subPaths] = splitPath(path, separator);
        }
        if (!leavePaths[leavePath]) {
            leavePaths[leavePath] = []; // Initialize.
        }
        if (subPaths.length) {
            leavePaths[leavePath].push(subPaths.join(separator));
        }
    }
    if ($is.array(objValue)) {
        for (let key = objValue.length - 1; key >= 0; key--) {
            if (!(key in leavePaths)) {
                objValue.splice(key, 1); // Not leaving this key.
                //
            } else if (leavePaths[key].length && $is.object(objValue[key])) {
                leave(objValue[key], leavePaths[key], separator);
            }
        }
    } /* Note: `Object.keys()` returns end-own enumerable string keys; i.e., of current `objValue`. */ else {
        for (const key of Array.from(Object.keys(objValue)) /* Preserves symbol keys. */) {
            if (!(key in leavePaths)) {
                delete objValue[key]; // Not leaving this key.
                //
            } else if (leavePaths[key].length && $is.object(objValue[key])) {
                leave(objValue[key], leavePaths[key], separator);
            }
        }
    }
};

/**
 * Omits an object’s own or inherited, enumerable or not, object path(s).
 *
 * @param objValue  Object to search in.
 * @param paths     Object path(s) in `objValue`.
 * @param separator Object path separator. Default is `.`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 * @note The use of `*` only omits array keys and/or end-own enumerable string keys.
 */
export const omit = <Type>(objValue: Type, paths: $type.ObjectPath | $type.ObjectPath[], separator: string = '.'): Type => {
    const objClone: Type = $obj.cloneDeep(objValue) as Type;

    for (const path of $to.array(paths)) {
        unset(objClone, path, separator); // Leverages `unset` utility.
    }
    return objClone;
};

/**
 * Picks an object’s own or inherited, enumerable or not, object path(s).
 *
 * @param objValue  Object to search in.
 * @param paths     Object path(s) in `objValue`.
 * @param separator Object path separator. Default is `.`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 * @note You can target (i.e., pick) own or inherited, enumerable or not, object paths; unsetting all others.
 *       However, when unsetting all others, this only unsets array keys and/or end-own enumerable string keys.
 *       i.e., It doesn’t unset (get rid of) end-inherited keys, non-enumerable keys, or symbol keys.
 */
export const pick = <Type>(objValue: Type, paths: $type.ObjectPath | $type.ObjectPath[], separator: string = '.'): Type => {
    const objClone: Type = $obj.cloneDeep(objValue) as Type;

    // Leverages `leave` utility.
    leave(objClone, paths, separator);

    return objClone;
};

/**
 * Splits an object path into an array of parts.
 *
 * @param   path      Object path; e.g., `a.b.c[0]`.
 * @param   separator Object path separator. Default is `.`.
 *
 * @returns           An array of object path parts, split by `separator`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 * @note An array path should **not** be passed directly. Internal use only.
 *
 * @see $str.obpPartSafe() for a way to ensure a variable is safe to use as an object path part.
 */
export const splitPath = (path: $type.ObjectPath | $type.ObjectPath[], separator: string = '.'): $type.ObjectPath[] => {
    if ($is.array(path)) {
        // An array path should **not** be passed directly. Internal use only.
        return path; // Path is split already. Not validating for performance reasons.
    }
    if ($is.number(path)) {
        if (!$is.safeObjectPath(path)) {
            throw Error('tZVtFWYz'); // Invalid object path. Got: `' + String(path) + '`.
        }
        return [path]; // Array index.
    }
    if ($is.string(path)) {
        if (/^\[[0-9]+\]$/u.test(path)) {
            path = Number(path.slice(1, -1));

            if (!$is.safeObjectPath(path)) {
                throw Error('GnWqwYxh'); // Invalid object path. Got: `' + String(path) + '`.
            }
            return [path]; // Array index.
        }
        let splitPath = path.split(new RegExp('(' + $str.escRegExp(separator) + '|\\[[0-9]+\\])'));
        splitPath = splitPath.filter((pathPart): boolean => (pathPart && separator !== pathPart ? true : false));

        return splitPath.map((_pathPart): number | string => {
            let pathPart: number | string = _pathPart;

            if (/^\[[0-9]+\]$/u.test(_pathPart)) {
                pathPart = Number(_pathPart.slice(1, -1)); // Array index.
            }
            if (!$is.safeObjectPath(pathPart)) {
                throw Error('Zscn3aVu'); // Invalid object path. Part: `' + String(pathPart) + '`.
            }
            return pathPart; // Object path part.
        });
    }
    throw Error('npkVYFWz'); // Invalid object path. Got: `' + String(path) + '`.
};

/**
 * Returns code for initializing and setting an object path.
 *
 * @param   path      Object path; e.g., `a.b.c[0]`.
 * @param   separator Object path separator. Default is `.`.
 *
 * @returns           A two-part object containing: `{ init: string; set: string }`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 * @note An array path should **not** be passed directly. Internal use only.
 */
export const toScriptCode = (path: $type.ObjectPath | $type.ObjectPath[], separator: string = '.'): Code => {
    let init = ''; // Initialize.
    let set = 'globalThis'; // Initialize.

    for (let parts = splitPath(path, separator), i = 0; i < parts.length; i++) {
        set += $is.number(parts[i]) ? '[' + String(parts[i]) + ']' : '[' + $str.quote(String(parts[i])) + ']';
        init += (init ? ' ' : '') + set + ' = ' + set + ' || {};';
    }
    return { init, set };
};
