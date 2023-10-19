/**
 * Preact utilities.
 */
// organize-imports-ignore

import './resources/init.ts';

import type * as preact from 'preact';
import { $is, $obj, $to, type $type } from './index.ts';
import { $fnꓺmemoize } from './resources/standalone/index.ts';

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
export { useLocation } from './preact/components/location.tsx';
export { useRoute } from './preact/components/router.tsx';

/**
 * Exports our Preact lazy loaders.
 */
export { lazyRoute, lazyComponent } from './resources/preact/apis/iso/lazy.tsx';

/**
 * Defines types.
 *
 * @note: `AsyncFnComponent` is a special type passed into `lazyComponent()`,
 *         which returns an acceptible `FnComponent`. It is not valid anywhere else.
 */
export type { JSX } from 'preact';
export type { Dispatch } from 'preact/hooks';

export type FnComponent<Type extends Props = Props> = preact.FunctionComponent<Type>;
export type AsyncFnComponent<Type extends Props = Props> = (...args: Parameters<FnComponent<Type>>) => Promise<ReturnType<FnComponent<Type>>>;
export type ClassComponent<Type extends Props = Props, Type2 extends State = State> = preact.ComponentClass<Type, Type2>;
export type AnyComponent<Type extends Props = Props, Type2 extends State = State> = FnComponent<Type> | ClassComponent<Type, Type2>;
export type VNode<Type extends Props = Props> = preact.VNode<Type>; // Function components return a VNode.

export type Props<Type extends object = $type.Object> = Readonly<preact.RenderableProps<Type & { [x in ClassPropVariants]?: Classes }>>;
export type Context<Type extends object = $type.Object> = Readonly<Omit<Type, 'children' | 'dangerouslySetInnerHTML'>>;
export type State<Type extends object = $type.Object> = Readonly<Omit<Type, 'children' | 'dangerouslySetInnerHTML'>>;
export type Ref<Type = unknown> = preact.RefObject<Type>;

export type ClassPropVariants = $type.Writable<typeof internalClassPropVariants>[number];
export type Classes = TypesOfClasses | (TypesOfClasses | Classes)[] | Set<TypesOfClasses | Classes>;

export type OmitPropOptions = { undefinedValues?: boolean };

type TypesOfClasses = // Internal class prop variants.
    //Types can be nested into arrays|sets infinitely deep.
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
 * @note This must remain a `const`. It’s used to keep types DRY in this file.
 */
const internalClassPropVariants = ['class', 'classes', 'className', 'classNames'] as const;

// Additional supporting utility functions for `class` prop variants.
export const classPropVariants = $fnꓺmemoize((): string[] => [...internalClassPropVariants]);
export const classPropVariantsRegExpStr = $fnꓺmemoize((): string => '^class(?:es|Names?)?$');
export const classPropVariantsRegExp = $fnꓺmemoize((): RegExp => new RegExp(classPropVariantsRegExpStr(), 'u'));

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

    if (propsToOmit.some((v) => internalClassPropVariants.includes(v as ClassPropVariants))) {
        propsToOmit = [...new Set(propsToOmit.concat(internalClassPropVariants as unknown as Key[]))];
    }
    return $obj.omit(props, propsToOmit, { undefinedValues: opts.undefinedValues });
};

/**
 * Gets component classes.
 *
 * Never access a class prop variant literally, but rather, use this utility. We accept, for a variety of reasons,
 * multiple prop names with CSS classes in them, and in differing formats. This utility will work out the variants and
 * assemble things for you. Unless you want bugs, there is no other option. Use this utility!
 *
 * Never feed this utility a class prop variant literally. Instead, give it props or state that it can search within.
 * The rule is the same as above, never access a class prop variant literally, and that goes also when using this
 * utility. Pass it all of the props, or your entire state. Or feed it any other acceptible values.
 *
 * @param   args Variadic; {@see Classes[]}.
 *
 *   - Strings, however deep, are split on whitespace.
 *   - Arrays and sets are traversed recursively. We look for classes within.
 *   - Plain objects are interpreted as component props or component state, or something else. In any plain object we look
 *       for class prop variants within and recurse into those props looking for classes; {@see ClassPropVariants}.
 *   - Map objects are interpreted as class maps with boolean values. A `true` value is required to enable a string key;
 *       e.g., `new Map(Object.entries({ abc: true, 'd e f': true, g: 1, h: 0, i: false }))` = `abc d e f`.
 *   - Any other object type that has a string `.value` property is interpreted as a signal-like value. Signal-like values
 *       are supported only because JSX supports them on the native `class` attribute across all HTML elements.
 *   - Any other value, including any other types of objects, are ignored entirely.
 *
 * @returns      Space-separated classes extracted from variadic args. If empty, `undefined` is returned. Note:
 *   `undefined` is deliberately returned when classes are empty. It’s to avoid adding `class=""` unnecessarily.
 *
 * @see https://www.npmjs.com/package/clsx
 * @see https://www.npmjs.com/package/classnames
 */
export const classes = (...args: Classes[]): undefined | string => {
    let flat: unknown[] = []; // Initialize.
    const map = classesꓺhelper(args);

    for (const [className] of map) flat.push(className);
    flat = [...new Set(flat.filter((c) => $is.notEmpty(c)))];

    return flat.length ? flat.join(' ') : undefined;
};

/**
 * Gets component classes as an array.
 *
 * @param   args Variadic; {@see classes()}.
 *
 * @returns      An array of component classes.
 */
export const splitClasses = (...args: Classes[]) => (classes(...args) || '').split(/\s+/u);

/**
 * Helps get component classes.
 *
 * @param   allArgs All arguments passed to {@see classes()}.
 * @param   map     Internal recursive use only. Please do not pass.
 *
 * @returns         `Map<string, true>` of all enabled classes.
 */
const classesꓺhelper = (allArgs: Classes[], map: Map<string, true> = new Map()): Map<string, true> => {
    for (const args of allArgs) {
        for (const arg of $to.array(args)) {
            if ($is.array(arg)) {
                classesꓺhelper(arg, map);
                //
            } else if ($is.set(arg)) {
                classesꓺhelper([...arg], map);
                //
            } else if ($is.string(arg)) {
                arg.split(/\s+/u).map((c) => map.set(c, true));
                //
            } else if ($is.map(arg)) {
                for (const [classNames, enable] of arg)
                    ($is.string(classNames) ? classNames : '').split(/\s+/u).map((c) => {
                        true === enable ? map.set(c, true) : map.delete(c);
                    });
            } else if ($is.plainObject(arg)) {
                for (const prop of internalClassPropVariants) {
                    if (Object.hasOwn(arg, prop)) classesꓺhelper([arg[prop]], map);
                }
            } else if ($is.object(arg) && Object.hasOwn(arg, 'value')) {
                classesꓺhelper([(arg as preact.JSX.SignalLike<string | undefined>).value], map);
            }
        }
    }
    return map;
};
