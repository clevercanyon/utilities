/**
 * Preact utilities.
 */
// organize-imports-ignore

import '#@initialize.ts';

import { $is, $obj, $to, $str, type $type } from '#index.ts';
import { $fnꓺmemo } from '#@standalone/index.ts';
import { getClass as getClassMap, type Class as ClassMap } from '#@preact/classes/class-map.ts';

import type * as preact from 'preact';
import {
    useReducer as preactꓺhooksꓺuseReducer, //
    type StateUpdater as preactꓺhooksꓺStateUpdater,
    type Dispatch as preactꓺhooksꓺStateDispatcher,
} from 'preact/hooks';

/**
 * Exports Preact.
 */
export {
    Component,
    Fragment,
    //
    createRef,
    createContext,
    //
    // createElement, // We prefer `create`.
    createElement as create, // i.e., we prefer this.
    // `h`  is an alias of the more verbose `create`, `createElement`.
    h, // `h` is short for hyperscript. Meaning, "JavaScript that produces HTML".
    //
    // cloneElement, // We prefer `clone`.
    cloneElement as clone, // i.e., we prefer this.
    //
    // isValidElement, // We prefer `isVNode`.
    isValidElement as isVNode, // i.e., we prefer this.
    // Please note that `isVNode`, `isValidElement` are extremely naive.
    // Instead, see: `$is.vNode()`, which is more exhaustive.
    //
    render,
    hydrate,
    //
    toChildArray,
    options,
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
 * Exports Preact signals.
 */
export {
    Signal,
    signal,
    computed,
    effect,
    batch,
    untracked, //
} from '@preact/signals';

/**
 * Exports Preact signal hooks.
 */
export {
    useSignal,
    useComputed,
    useSignalEffect, //
} from '@preact/signals';

/**
 * Exports our Preact APIs.
 */
export * as iso from '#@preact/apis/iso.tsx';
export * as ssr from '#@preact/apis/ssr.tsx';

/**
 * Exports our Preact lazy loaders.
 *
 * These get lifted up into the top level of our `$preact` utilities. Alternatively, they can be accessed via
 * `$preact.iso.*`. However, we’re exporting here as first-class citizens, for convenience.
 */
export {
    lazyLoader,
    lazyComponent,
    lazyRoute, //
} from '#@preact/apis/iso.tsx';

/**
 * Exports our Preact hooks.
 */
export { useAuditLogger } from '#preact/components/audit-logger.tsx';
export { useConsentLogger } from '#preact/components/consent-logger.tsx';
export { useConsent } from '#preact/components/consent.tsx';
export { useAnalytics } from '#preact/components/analytics.tsx';
export { useTurnstile } from '#preact/components/turnstile.tsx';
export { useClipboard } from '#preact/components/clipboard.tsx';
export { useLocation } from '#preact/components/location.tsx';
export { useData, useFetcher } from '#preact/components/data.tsx';
export { useHTTP } from '#preact/components/http.tsx';
export { useRoute } from '#preact/components/router.tsx';
export { useLayout } from '#preact/components/layout-context.tsx';
export { useHTML } from '#preact/components/html.tsx';
export { useHead, computeHead } from '#preact/components/head.tsx';
export { useBody } from '#preact/components/body.tsx';

/**
 * Defines types.
 */
export type Child = preact.ComponentChild;
export type Children = preact.ComponentChildren;

export type Intrinsic = preact.JSX.IntrinsicElements;
export type VNode<Type extends AnyProps = Props> = preact.VNode<Type>;

export type AnyComponent<Type extends AnyProps = Props, Type2 extends State = State> = FnComponent<Type> | ClassComponent<Type, Type2>;
export type AnyProps<Type extends $type.StrKeyable = $type.StrKeyable> = Props<Type> | BasicProps<Type> | BasicTreeProps<Type> | CleanProps<Type> | NoProps;

export type FnComponent<Type extends AnyProps = Props> = preact.FunctionComponent<Type>;
export type AsyncFnComponent<Type extends AnyProps = Props> = (...args: Parameters<FnComponent<Type>>) => Promise<ReturnType<FnComponent<Type>>>;
export type ClassComponent<Type extends AnyProps = Props, Type2 extends State = State> = preact.ComponentClass<Type, Type2>;

export type Props<Type extends $type.StrKeyable = $type.StrKeyable> = Omit<Readonly<preact.RenderableProps<Type & { [x in ClassPropVariants]?: Classes }>>, 'jsx'>;
export type BasicProps<Type extends $type.StrKeyable = $type.StrKeyable> = Omit<Readonly<preact.RenderableProps<Type>>, 'jsx'>;
export type BasicTreeProps<Type extends $type.StrKeyable = $type.StrKeyable> = Omit<Readonly<preact.RenderableProps<Type>>, 'jsx' | 'key' | 'ref'>;
export type CleanProps<Type extends $type.StrKeyable = $type.StrKeyable> = Omit<Readonly<preact.RenderableProps<Type>>, 'jsx' | 'key' | 'ref' | 'children'>;
export type NoProps = CleanProps<{}>; // Explicitly no props whatsoever.

export type State<Type extends $type.StrKeyable = $type.StrKeyable> = Omit<Readonly<Type>, 'children' | 'dangerouslySetInnerHTML'>;
export type Context<Type extends $type.StrKeyable = $type.StrKeyable> = Omit<Readonly<Type>, 'children' | 'dangerouslySetInnerHTML'>;
export type Ref<Type = unknown> = preact.RefObject<Type>;

export type StateUpdater<Type> = preactꓺhooksꓺStateUpdater<Type>; // e.g., {@see useState()}.
export type StateDispatcher<Type> = preactꓺhooksꓺStateDispatcher<Type>; // e.g., {@see useReducedState()}.

export type { ClassMap }; // Re-exports class map type.
export type ClassPropVariants = $type.Writable<typeof internalClassPropVariants>[number];
export type Classes = TypesOfClasses | (TypesOfClasses | Classes)[] | Set<TypesOfClasses | Classes>;
export type Styles = preact.JSX.CSSProperties;

type TypesOfClasses = // Internal class prop variants.
    // Types can be nested into arrays|sets infinitely deep.
    | null
    | undefined
    | string
    | ClassMap
    | Map<string, boolean>
    | $type.Object<{ [x in ClassPropVariants]?: Classes }>
    // Signal-like is supported because JSX supports it on the `class` attribute.
    | preact.JSX.SignalLike<null | undefined | string>; // Exactly the same as JSX internals.

// ---
// Prop utilities.

/**
 * Omits specific component props.
 *
 * @param   props   Props from which to omit `keys`.
 * @param   keys    Specific keys to omit from `props`.
 *
 *   - `data-` prop keys should be passed in kebab-case like anywhere else.
 *   - `aria-` can be passed as `aria-[key]` as per usual, or as camelCase `aria[Key]`.
 *   - All other prop keys should be passed as camelCase keys so we can derive proper variants.
 *   - //
 * @param   options Options (all optional); {@see $obj.OmitOptions}.
 *
 * @returns         A clone of `props` with all `keys` omitted; {@see $obj.omit()}.
 */
export const omitProps = <Type extends AnyProps, Key extends keyof Type>(props: Type, keys: Key[], options?: $obj.OmitOptions): Omit<Type, Key> => {
    if ((keys as string[]).includes('for')) {
        (keys as string[]).push('htmlFor');
    }
    for (const key of [...keys] as string[]) {
        keys = [...new Set(keys.concat([$str.camelCase(key), $str.kebabCase(key), key.toLowerCase()] as unknown as Key[]))];
    }
    if (keys.some((v) => internalClassPropVariants.includes(v as ClassPropVariants))) {
        keys = [...new Set(keys.concat(internalClassPropVariants as unknown as Key[]))];
    }
    return $obj.omit(props, keys, options); // Same as `$obj.omit()`, otherwise.
};

// ---
// State utilities.

/**
 * Produces initial state.
 *
 * `Type` is inferred by the return type of the arrow function that should always be used to wrap this utility; i.e.,
 * the best practice when using this utility is to initialize state inside of an arrow function.
 *
 *     (): State => initialState(...args);
 *
 * Such that `Type` = `State` from the arrow function. Just to clarify, TypeScript is smart enough to handle the
 * inferred type provided by the outer arrow function, which is why we don’t need a default value for `Type`.
 *
 * @param   args Variadic objects.
 *
 * @returns      Initialized state.
 */
export const initialState = <Type extends State>(...args: object[]): Type => {
    return $obj.mergeDeep(...args) as Type;
};

/**
 * Reduces state updates.
 *
 * `Type` is inferred from first argument, which is the current state. Additionally, we form an intersection of `Type`
 * and `Updates` to resolve the reduced state. Note that `Updates` must be a deep partial of `Type`.
 *
 * When `Type`; i.e., current state, is a partial of a potentially larger allowable state, you’ll need to pass a param
 * to this utility declaring full `Type` vs. allowing `Type` to be inferred only from the arguments. In the case of this
 * being baked into {@see useReducedState()}, we’re able to do just that, by default. So it’s truly an edge case.
 *
 * While this utility is already baked into {@see useReducedState()}, we still export it, because there are rare cases
 * when it’s convenient to call on this method directly as a way of determining next state synchronously. Of course that
 * comes with caveats, and not generally a best practice, but there are times when it is reasonably ok.
 *
 * - It is generally harmful, because invalid assumptions can be made regarding next state, given that multiple requests
 *   to update state can be dispatched and processed asynchronously in a queue, prior to actually re-rendering. That’s
 *   how Preact works under the hood. Therefore, calculating next state synchronously is quite risky.
 *
 *   However, calling this directly would be reasonably ok if you’re going to, for example, reload the document when next
 *   state matches a condition that arises as the result of an update you’ve made, or are about to dispatch.
 *   Short-circuiting asynchronous updates is still not a good idea, but it might be reasonably ok in rare cases.
 *
 * @param   state   Current state.
 * @param   updates State updates.
 *
 * @returns         New state, else old state.
 *
 * @note There is a special `isInitial` state key that, if present, will be updated to `false` automatically.
 *       i.e., If we are reducing state, then we are no longer dealing with initial state.
 */
export const reduceState = <Type extends State, Updates extends $type.PartialDeep<Type> = $type.PartialDeep<Type>>(state: Type, updates: Updates): Type & Updates => {
    if (Object.hasOwn(state, 'isInitial')) (updates as $type.Object).isInitial = false;
    return $obj.updateDeep(state, updates) as Type & Updates;
};

/**
 * Uses state via {@see useReducer()} hook with a baked-in reducer; {@see reduceState()}.
 *
 * Like {@see initialState()}, `Type` is inferred by the return type of the arrow function that should always be used to
 * wrap the `initialStateFn` passed to this utility; i.e., the best practice when using this utility is to initialize
 * state inside of an arrow function, then pass that arrow function to this utility.
 *
 *     useReducedState((): State => initialState(...args));
 *
 * Such that `Type` = `State` from the arrow function. Just to clarify, TypeScript is smart enough to handle the
 * inferred type provided by the arrow function, which is why we don’t need a default value for `Type`.
 *
 * @param   initialStateFn Function; e.g., `() => initialState(...args)`; {@see initialState()}.
 *
 * @returns                An array; i.e., `[ state, stateDispatcher; aka: updateState ]`; {@see StateDispatcher}.
 */
export const useReducedState = <Type extends State>(initialStateFn: () => Type): [Type, StateDispatcher<$type.PartialDeep<Type>>] => {
    return preactꓺhooksꓺuseReducer(reduceState<Type>, undefined, initialStateFn);
};

// ---
// Class utilities.

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
export const classPropVariantsRegExpStr = $fnꓺmemo((): string => '^class(?:es|Names?)?$');
export const classPropVariantsRegExp = $fnꓺmemo((): RegExp => new RegExp(classPropVariantsRegExpStr(), 'u'));
export const classPropVariants = $fnꓺmemo((): Readonly<string[]> => $obj.freeze([...internalClassPropVariants]));

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
 * @param   args Variadic; {@see Classes[]} {@see classesꓺhelper()}.
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
export const classes = (...args: Classes[]): string | undefined => {
    const classes = [...classesꓺhelper(args).keys()];
    return classes.length ? classes.join(' ') : undefined;
};

/**
 * Gets component classes, as a map.
 *
 * @param   args Variadic; {@see Classes[]} {@see classesꓺhelper()}.
 *
 * @returns      `Map<string, true>` of all enabled classes.
 */
export const classMap = (...args: Classes[]): ClassMap => {
    return classesꓺhelper(args);
};

/**
 * Helps get component classes.
 *
 * @param   allArgs  All arguments passed to {@see classes()}.
 * @param   classMap Internal recursive use only. Please do not pass.
 *
 * @returns          `Map<string, true>` of all enabled classes; {@see ClassMap}.
 */
const classesꓺhelper = (allArgs: Classes[], classMap?: ClassMap): ClassMap => {
    const map = classMap || new (getClassMap())();

    for (const args of allArgs) {
        for (const arg of $to.array(args)) {
            if ($is.array(arg)) {
                classesꓺhelper(arg, map);
                //
            } else if ($is.set(arg)) {
                classesꓺhelper([...arg], map);
                //
            } else if ($is.string(arg)) {
                arg.split(/\s+/u).map((c) => c && map.set(c, true));
                //
            } else if ($is.map(arg)) {
                for (const [classNames, enable] of arg)
                    ($is.string(classNames) ? classNames : '').split(/\s+/u).map((c) => {
                        c && true === enable ? map.set(c, true) : map.delete(c);
                    });
            } else if ($is.plainObject(arg)) {
                for (const prop of internalClassPropVariants) {
                    if (Object.hasOwn(arg, prop)) classesꓺhelper([arg[prop]], map);
                }
            } else if ($is.object(arg) && Object.hasOwn(arg, 'value')) {
                // Note: accessing `.value` subscribes us to the signal-like value.
                classesꓺhelper([(arg as preact.JSX.SignalLike<null | undefined | string>).value], map);
            }
        }
    }
    return map;
};
