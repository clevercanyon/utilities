/**
 * Preact utilities.
 */
// organize-imports-ignore

import type * as preact from 'preact';
import { $is, $obj, $to, type $type } from './index.ts';

/**
 * Exports Preact.
 */
export {
    Component,
    Fragment,
    cloneElement,
    createContext,
    createElement,
    createRef,
    h,
    hydrate,
    isValidElement,
    options,
    render,
    toChildArray, //
} from 'preact';

/**
 * Exports Preact hooks.
 */
export {
    useCallback,
    useContext,
    useDebugValue,
    useEffect,
    useErrorBoundary,
    useId,
    useImperativeHandle,
    useLayoutEffect,
    useMemo,
    useReducer,
    useRef,
    useState, //
} from 'preact/hooks';

/**
 * Exports our Preact APIs.
 */
export * as iso from './resources/preact/apis/iso.tsx';
export * as ssr from './resources/preact/apis/ssr.tsx';

/**
 * Exports our Preact hooks.
 */
export { useHTML } from './preact/components/html.tsx';
export { useHead } from './preact/components/head.tsx';
export { useBody } from './preact/components/body.tsx';
export { useData, useHTTP } from './preact/components/data.tsx';
export { useLocation, useRoute } from './preact/components/router.tsx';

/**
 * Exports our Preact lazy loaders.
 */
export { lazyRoute, lazyComponent } from './preact/components/router.tsx';

/**
 * Defines types.
 */
export type { Dispatch } from 'preact/hooks';
export type VNode<P extends Props = Props> = preact.VNode<P>;
export type FnComponent<P extends Props = Props> = preact.FunctionComponent<P>;
export type AsyncFnComponent<P extends Props = Props> = (...args: Parameters<FnComponent<P>>) => Promise<ReturnType<FnComponent<P>>>;
export type Props<P extends object = $type.Object> = preact.RenderableProps<Readonly<P & { classes?: unknown }>>;

export type { Props as DataProps } from './preact/components/data.tsx';
export type { Props as HTMLProps } from './preact/components/html.tsx';
export type { Props as HeadProps } from './preact/components/head.tsx';
export type { Props as BodyProps } from './preact/components/body.tsx';
export type { Props as RouterProps } from './preact/components/router.tsx';

/**
 * Defines dirty props.
 */
const dirtyProps = ['key', 'jsx', 'dangerouslySetInnerHTML', 'ref', 'children'];

/**
 * Cleans VNode props.
 *
 * @param   props           Props that will be cleaned up.
 * @param   otherDirtyProps Optional. Any other dirty props to clean up.
 *
 * @returns                 A clone of {props} stripped of all dirty props.
 *
 * @note This also removes props with undefined values.
 */
export const cleanProps = <Type extends Props, Key extends keyof Type>(props: Type, otherDirtyProps?: Key[]): Omit<Type, Key> => {
    return $obj.omit(props, dirtyProps.concat((otherDirtyProps || []) as string[]) as Key[], { undefinedValues: true });
};

/**
 * Formats component classes.
 *
 * @param   ...variadicArgs Classes.
 *
 *   - Strings, however deep, are split on whitespace.
 *   - Arrays are traversed recursively, looking for strings.
 *   - Objects are tested for a `classes` prop with type {@see Props['classes']}.
 *   - Objects without a `classes` prop are assumed to have class string keys w/ `true|false` values. `true` explicitly
 *       required to enable; e.g., `{ abc: true, 'd e f': true, g: 1, h: 0, i: false, jkl: true }` = `abc d e f jkl`.
 *
 *
 * @returns                 Space-separated classes extracted from variadic args. If empty, `undefined` is returned.
 *   Note: `undefined` is deliberately returned when classes are empty. It’s to avoid adding `class=""` unnecessarily.
 *
 * @see https://www.npmjs.com/package/clsx
 * @see https://www.npmjs.com/package/classnames
 */
export const classes = (...variadicArgs: unknown[]): undefined | string => {
    let list: unknown[] = []; // Initialize.

    for (const args of variadicArgs) {
        for (const arg of $to.array(args)) {
            if ($is.string(arg)) {
                list = list.concat(arg.split(/\s+/u));
                //
            } else if ($is.array(arg) /* recursive */) {
                list = list.concat((classes(arg) || '').split(/\s+/u));
                //
            } else if ($is.object(arg)) {
                if (Object.hasOwn(arg, 'classes')) {
                    list = list.concat($to.array(arg.classes));
                } else {
                    for (const [classes, enable] of Object.entries(arg)) {
                        if (true === enable) list = list.concat(classes.split(/\s+/u));
                    }
                }
            }
        }
    } // We only want unique, non-empty, string CSS class names.
    list = [...new Set(list.filter($is.string).filter($is.notEmpty))];

    return !list.length ? undefined : list.join(' ');
};
