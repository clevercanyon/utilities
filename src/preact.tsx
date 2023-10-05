/**
 * Preact utilities.
 */
// organize-imports-ignore

import './resources/init.ts';

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
export { useLayout } from './preact/components/layout-context.tsx';
export { useLocation, useRoute } from './preact/components/router.tsx';

/**
 * Exports our Preact lazy loaders.
 */
export { lazyRoute, lazyComponent } from './preact/components/router.tsx';

/**
 * Defines types.
 */
export type { JSX } from 'preact';
export type { Dispatch } from 'preact/hooks';

export type FnComponent<P extends Props = Props> = preact.FunctionComponent<P>;
export type AsyncFnComponent<P extends Props = Props> = (...args: Parameters<FnComponent<P>>) => Promise<ReturnType<FnComponent<P>>>;

export type VNode<P extends Props = Props> = preact.VNode<P>;
export type ClassPropVariants = (typeof classPropVariants)[number];
export type Classes = TypesOfClasses | (TypesOfClasses | Classes)[] | Set<TypesOfClasses | Classes>;
export type Props<P extends object = $type.Object> = preact.RenderableProps<Readonly<P & { [x in ClassPropVariants]?: Classes }>>;

export type CleanPropOptions = { undefinedValues?: boolean };
export type OmitPropOptions = { undefinedValues?: boolean };

type TypesOfClasses = // Internal class prop variant types.
    // These types can be nested into arrays|sets infinitely deep.
    | string
    | undefined
    | Map<string, boolean>
    | $type.Object<{ [x in ClassPropVariants]?: Classes }>
    // Signal-like is supported because JSX supports it on the `class` attribute.
    | preact.JSX.SignalLike<string | undefined>; // Exactly the same as JSX internals.

/**
 * Defines `class` component prop variants.
 *
 * Never access a class variant prop literally, but rather, {@see classes()} export in this file. We accept, for a
 * variety of reasons, multiple prop names with CSS classes in them, and in differing formats. The {@see classes()}
 * utility will work out the variants and assemble things for you. Unless you want bugs, there is no other option.
 *
 * @note This must remain a constant, not a function. It’s used for DRY types above.
 */
export const classPropVariants = ['class', 'classes', 'className', 'classNames'] as const;

/**
 * Omits specific component props.
 *
 * @param   props       Props that will be worked on here.
 * @param   propsToOmit Specific prop keys to omit from `props`.
 * @param   options     Options (all optional); {@see OmitPropOptions}.
 *
 * @returns             A clone of `props` stripped of all `propsToOmit` props.
 *
 * @note By default, this also removes props with undefined values.
 * @note If `propsToOmit` includes a class prop variant, then all class prop variants are omitted.
 */
export const omitProps = <Type extends Props, Key extends keyof Type>(props: Type, propsToOmit: Key[], options?: OmitPropOptions): Omit<Type, Key> => {
    const opts = $obj.defaults({}, options || {}, { undefinedValues: true }) as Required<OmitPropOptions>;

    if (propsToOmit.some((v) => classPropVariants.includes(v as ClassPropVariants))) {
        propsToOmit = [...new Set(propsToOmit.concat(classPropVariants as unknown as Key[]))];
    }
    return $obj.omit(props, propsToOmit, { undefinedValues: opts.undefinedValues });
};

/**
 * Formats component classes.
 *
 * Never access a class variant prop literally, but rather, {@see classes()} export in this file. We accept, for a
 * variety of reasons, multiple prop names with CSS classes in them, and in differing formats. The {@see classes()}
 * utility will work out the variants and assemble things for you. Unless you want bugs, there is no other option.
 *
 * Never feed {@see classes()} a class prop variant literally. Instead, give it props or state that it can search
 * within. The rule is the same, never access a class variant prop literally, and that goes also when using this
 * utility. Pass it all of the props, or your entire state. Or feed it any other acceptible values.
 *
 * @param   ...variadicArgs {@see Classes[]}.
 *
 *   - Strings, however deep, are split on whitespace.
 *   - Arrays and sets are traversed recursively. We look for classes within.
 *   - Plain objects are interpreted as component props or component state, or something else. In any plain object we look
 *       for class prop variants within and recurse into those props looking for classes; {@see ClassPropVariants}.
 *   - Map objects are interpreted as class name maps with boolean values. A `true` value is required to enable a string
 *       key; e.g., `new Map(Object.entries({ abc: true, 'd e f': true, g: 1, h: 0, i: false }))` = `abc d e f`.
 *   - Any other object type that has a string `.value` property is interpreted as a signal-like value. Signal-like values
 *       are supported only because JSX supports them on the native `class` attribute across all HTML elements.
 *   - Any other value, including any other types of objects, are ignored entirely.
 *
 *
 * @returns                 Space-separated classes extracted from variadic args. If empty, `undefined` is returned.
 *   Note: `undefined` is deliberately returned when classes are empty. It’s to avoid adding `class=""` unnecessarily.
 *
 * @see https://www.npmjs.com/package/clsx
 * @see https://www.npmjs.com/package/classnames
 */
export const classes = (...variadicArgs: Classes[]): undefined | string => {
    const sepRegExp = /\s+/u; // Initialize.
    let flat: unknown[] = []; // Initialize.

    for (const args of variadicArgs) {
        for (const arg of $to.array(args)) {
            //
            if ($is.string(arg)) {
                flat = flat.concat(arg.split(sepRegExp));
                //
            } else if ($is.array(arg) || $is.set(arg)) {
                // Important to spread sets here, or we loop infinintely.
                flat = flat.concat((classes([...arg]) || '').split(sepRegExp));
                //
            } else if ($is.plainObject(arg)) {
                for (const prop of classPropVariants) {
                    if (!Object.hasOwn(arg, prop)) continue;
                    flat = flat.concat((classes(arg[prop]) || '').split(sepRegExp));
                }
            } else if ($is.map(arg)) {
                for (const [classNames, enable] of arg) {
                    if (true !== enable || !$is.string(classNames)) continue;
                    flat = flat.concat(classNames.split(sepRegExp));
                }
            } else if ($is.object(arg) && Object.hasOwn(arg, 'value')) {
                // Important to access `.value` just once, as it may trigger side-effects.
                const classNames = (arg as preact.JSX.SignalLike<string | undefined>).value;
                if ($is.string(classNames)) flat = flat.concat(classNames.split(sepRegExp));
            }
        }
    } // We only want unique, non-empty class names.
    flat = [...new Set(flat.filter((c) => $is.notEmpty(c)))];

    return flat.length ? flat.join(' ') : undefined;
};
