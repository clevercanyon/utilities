/**
 * DOM utilities.
 *
 * @requiredEnv web
 */

import './resources/init.ts';

import { finder as buildCSSSelector } from '@medv/finder';
import { $fn, $is, $obj, $preact, $to, type $type } from './index.ts';
import { $fnꓺmemo } from './resources/standalone/index.ts';

/**
 * Tracks scroll status.
 */
let userIsScrolling = false;
let initializedScrollStatus = false;

/**
 * Defines types.
 */
export type WDES = Window | Document | Element | string;
export type AnyAtts = { [x: string]: unknown };

export type AnyVoidFn = (() => void) | (() => Promise<void>);
export type AnyEventHandler =
    | ((event: Event) => void) //
    | ((event: CustomEvent) => void)
    | ((event: Event) => Promise<void>)
    | ((event: CustomEvent) => Promise<void>);

export type EventTools = { cancel: () => void };

/**
 * Initializes scroll status.
 */
const initializeScrollStatus = (): void => {
    if (initializedScrollStatus) return;
    initializedScrollStatus = true;

    const onScrollCallback = $fn.throttle((): void => {
        onScrollEndCallback.cancel(), (userIsScrolling = true);
    });
    const onScrollEndCallback = $fn.throttle((): void => {
        onScrollCallback.cancel(), (userIsScrolling = false);
        trigger(window, 'x:scrollEnd');
    });
    on(window, 'scroll', onScrollCallback);
    on(window, 'scrollend', onScrollEndCallback);

    /**
     * We treat wheeling like a `scroll` event here because when it’s used for scrolling it can reach the bottom of a
     * page and then continue turning; e.g., MX Revolution mice tend to do this. In such a case, upon reaching the
     * bottom of a page, wheeling ceases to be a `scroll` event; i.e., `scroll`, `scrollend` events are no longer fired
     * because there is nothing left to scroll on the page, so browsers just ignore the wheeling altogether.
     *
     * However, if the page content changes, or the scroll position changes programmatically, and the wheel happens to
     * still be turning, then it’s possible it could start firing residual `scroll`, `scrollend` events again, which
     * yields a very confusing situation for a user when residual scrolling is mixed with programmatic scrolling.
     *
     * The mouse wheel is most often used for scrolling. Not always, but we’ll take that risk. Worse case scenario, we
     * treat some other action that a wheel controls as if it were a scroll event. Either way, it’s still a user
     * interacting with the window, and anything listening for a `scrollend` event is likely interested in awaiting the
     * end of that user interaction, whatever it may actually be. e.g., {@see onScrollEnd()} in this file.
     */
    let wheelTimeout: $type.Timeout | undefined;
    const wheelScrollEndCallback = () => void onScrollEndCallback();

    const onWheelCallback = $fn.throttle(
        (): void => {
            clearTimeout(wheelTimeout), void onScrollCallback();
            wheelTimeout = setTimeout(wheelScrollEndCallback, 300);
        },
        { waitTime: 250 }, // Absolutely *must* be less than `wheelTimeout`.
    );
    on(window, 'wheel', onWheelCallback);
};

/**
 * Fires a callback on document ready state.
 *
 * @param   callback Callback.
 *
 * @returns          Event tools; {@see EventTools}.
 */
export const onReady = (callback: AnyVoidFn): EventTools => {
    const eventName = 'DOMContentLoaded';
    const actualCallback = (): void => void callback();

    if ('loading' !== document.readyState) {
        actualCallback(); // Fires callback immediately.
    } else {
        addEventListener(eventName, actualCallback, { once: true });
    }
    return { cancel: (): void => removeEventListener(eventName, actualCallback) };
};

/**
 * Fires a callback on window loaded state.
 *
 * @param   callback Callback.
 *
 * @returns          Event tools; {@see EventTools}.
 */
export const onLoad = (callback: AnyVoidFn): EventTools => {
    const eventName = 'load';
    const actualCallback = (): void => void callback();

    if ('complete' === document.readyState) {
        actualCallback(); // Fires callback immediately.
    } else {
        addEventListener(eventName, actualCallback, { once: true });
    }
    return { cancel: (): void => removeEventListener(eventName, actualCallback) };
};

/**
 * Fires a callback after user stops scrolling.
 *
 * @param   callback Callback.
 *
 * @returns          Event tools; {@see EventTools}.
 */
export const onScrollEnd = (callback: AnyVoidFn): EventTools => {
    initializeScrollStatus(); // If not already.

    const eventName = 'x:scrollEnd';
    const actualCallback = (): void => void callback();

    if (!userIsScrolling) {
        actualCallback(); // Fires callback immediately.
    } else {
        addEventListener(eventName, actualCallback, { once: true });
    }
    return { cancel: (): void => removeEventListener(eventName, actualCallback) };
};

/**
 * Fires a callback on the next frame.
 *
 * @param   callback Callback.
 *
 * @returns          Event tools; {@see EventTools}.
 */
export const onNextFrame = (callback: AnyVoidFn): EventTools => {
    const raf = requestAnimationFrame((): void => void callback());
    return { cancel: (): void => cancelAnimationFrame(raf) };
};

/**
 * Fires a callback after the next frame.
 *
 * Callback is invoked after the browser has a painted a new frame. We accomplish this by combining use of RAF; i.e.,
 * {@see requestAnimationFrame} together with {@see setTimeout()} to invoke a callback after the next frame. A timeout
 * is scheduled in parallel to ensure the callback is always invoked; e.g., if the browser tab is not visible.
 *
 * @param   callback Callback.
 *
 * @returns          Event tools; {@see EventTools}.
 */
export const afterNextFrame = (callback: AnyVoidFn): EventTools => {
    const done = () => {
        clearTimeout(timeout);
        cancelAnimationFrame(raf);
        setTimeout((): void => void callback());
    };
    const timeout = setTimeout(done, 100);
    const raf = requestAnimationFrame(done);
    return {
        cancel: (): void => {
            cancelAnimationFrame(raf);
            clearTimeout(timeout);
        },
    };
};

/**
 * Fires a callback on a named event.
 *
 * @param   wdes       Window, document, element, or selectors.
 * @param   eventNames Event name(s). Space-separated string or array.
 * @param   selectors  Optional selectors. If given, `callback` and `options` shift to new arg positions and a delegated
 *   event handler will be configured instead of a regular event handler. Selectors = deleganted event handler.
 * @param   callback   Callback for event handler.
 * @param   options    Options (all optional); {@see AddEventListenerOptions}.
 *
 * @returns            Event tools; {@see EventTools}.
 */
export function on(wdes: WDES, eventNames: string | string[], callback: AnyEventHandler, options?: AddEventListenerOptions): EventTools;
export function on(wdes: WDES, eventNames: string | string[], selectors: string, callback: AnyEventHandler, options?: AddEventListenerOptions): EventTools;

export function on(...args: unknown[]): EventTools {
    const wdes = args[0] as WDES; // Window, document, element, or string.
    const wde = $is.string(wdes) ? require(wdes) : wdes;

    const cancelers: (() => void)[] = []; // Initialize.
    const eventNames = $to.array(args[1]).join(' ').split(/\s+/u);

    let selectors = '';
    let actualCallback: (event: Event) => void;
    let callback: ((event: Event) => void) | ((event: Event) => Promise<void>);
    let options: AddEventListenerOptions | undefined; // Optional listener options.

    if ($is.function(args[3]) /* Selectors are given for delegated event handler? */) {
        [, , selectors, callback, options] = args as [0, 0, typeof selectors, typeof callback, typeof options];
    } else [, , callback, options] = args as [0, 0, typeof callback, typeof options];

    if (selectors && callback /* Selectors are given for delegated event handler? */) {
        actualCallback = (event: Event): void => {
            let { currentTarget, target } = event;
            if (!$is.element(target)) return;
            do {
                if (target.matches(selectors)) void callback.call(target, event);
            } while ($is.element((target = target.parentNode)) && target !== currentTarget);
        };
    } else actualCallback = (event: Event): void => void callback.call(event.target, event);

    for (const eventName of eventNames) {
        if (!eventName) throw new Error(); // Missing event name.
        wde.addEventListener(eventName, actualCallback, options);
        cancelers.push((): void => wde.removeEventListener(eventName, actualCallback, options));
    }
    return { cancel: (): void => cancelers.forEach((cancel) => cancel()) };
}

/**
 * Triggers a custom event.
 *
 * @param wdes    Window, document, element, or selectors.
 * @param event   Name of a custom event, {@see CustomEvent}, or {@see Event}.
 * @param data    For a custom event, optional data to pass as `detail` to listeners.
 * @param options For a custom event, optional initialization options; {@see CustomEventInit}.
 */
export const trigger = (wdes: WDES, event: string | CustomEvent | Event, data?: object, options?: CustomEventInit): void => {
    const wde = $is.string(wdes) ? require(wdes) : wdes;
    if ($is.string(event)) event = new CustomEvent(event, { detail: data || {}, ...options });
    wde.dispatchEvent(event);
};

/**
 * Appends an element to `<head>`.
 *
 * @param element Element to attach.
 */
export const headAppend = (element: Element): void => {
    head().appendChild(element);
};

/**
 * Appends an element to `<body>`.
 *
 * @param element Element to attach.
 */
export const bodyAppend = (element: Element): void => {
    body().appendChild(element);
};

/**
 * Appends a `<link rel="stylesheet" media="all">` to `<head>`.
 *
 * @param href Stylesheet source.
 * @param atts Optional attributes.
 *
 *   - Attributes may override default `rel`, `media` if necessary.
 */
export const appendStyle = (href: string, atts: Partial<HTMLLinkElement> = {}): void => {
    headAppend(create('link', { rel: 'stylesheet', media: 'all', ...atts, href }));
};

/**
 * Appends a `<script async>` to `<head>`.
 *
 * @param src  Script source.
 * @param atts Optional attributes.
 *
 *   - Attributes may override default `async` if necessary.
 */
export const appendScript = (src: string, atts: Partial<HTMLScriptElement> = {}): void => {
    headAppend(create('script', { async: true, ...atts, src }));
};

/**
 * Appends a `<script type="module">` to `<head>`.
 *
 * @param src  Script source.
 * @param atts Optional attributes.
 *
 *   - Attributes may override default `type` if necessary.
 */
export const appendModule = (src: string, atts: Partial<HTMLScriptElement> = {}): void => {
    headAppend(create('script', { type: 'module', ...atts, src }));
};

/**
 * Creates a new text node, SVG, HTML, or other element.
 *
 * @param   tag  `textNode`, `svg`, or other HTML tag name.
 * @param   atts Optional attributes. Or, plain text when `tag=textNode`.
 *
 * @returns      Text node, SVG, HTML, or other element.
 */
export function create(tag: 'textNode', value?: $type.Primitive): Text;
export function create<Tag extends keyof HTMLElementTagNameMap>(tag: Tag, atts?: Partial<HTMLElementTagNameMap[Tag]>): HTMLElementTagNameMap[Tag];
export function create<Tag extends keyof SVGElementTagNameMap>(tag: Tag, atts?: Partial<SVGElementTagNameMap[Tag]>): SVGElementTagNameMap[Tag];
export function create<Tag extends keyof MathMLElementTagNameMap>(tag: Tag, atts?: Partial<MathMLElementTagNameMap[Tag]>): MathMLElementTagNameMap[Tag];
export function create<Tag extends keyof HTMLElementDeprecatedTagNameMap>(tag: Tag, atts?: Partial<HTMLElementDeprecatedTagNameMap[Tag]>): HTMLElementDeprecatedTagNameMap[Tag];
export function create(tag: string, atts?: AnyAtts): Element;

export function create(...args: unknown[]): Text | Element {
    const tag = (args[0] as string).toLowerCase();
    let value: $type.Primitive | undefined, atts: AnyAtts | undefined;

    if ('textNode' === tag) {
        value = args[1] as typeof value;
        return document.createTextNode($to.string(value));
    } else {
        let element; // Initialize.
        atts = args[1] as typeof atts;

        if ('svg' === tag) {
            element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        } else {
            element = document.createElement(tag);
        }
        if (atts) setAtts(element, atts);

        return element;
    }
}
export { create as h }; // `h` is short for hyperscript. Meaning, "JavaScript that produces HTML".

/**
 * Resets an element’s attributes.
 *
 * This utility is simply one that resets arbitrary attributes for any element type. Thus, we use an intentionally loose
 * type for `atts`, as we prefer to avoid colliding with any type validations that have already occurred higher up in
 * the call stack; e.g., in a more element-specific context.
 *
 * - Attributes that are being set will not first be removed. Saves time.
 * - Attributes that already exist with the same value will not be set again.
 * - For further details, {@see setAtts()}.
 *
 * @param element Element.
 * @param atts    Attributes.
 */
export const newAtts = (element: Element, atts: AnyAtts): void => {
    for (let i = 0; i < element.attributes.length; i++) {
        const { name } = element.attributes[i];
        if (!Object.hasOwn(atts, name)) element.removeAttribute(name);
    }
    setAtts(element, atts);
};

/**
 * Sets an element’s attributes.
 *
 * This utility is simply one that sets arbitrary attributes for any element type. Thus, we use an intentionally loose
 * type for `atts`, as we prefer to avoid colliding with any type validations that have already occurred higher up in
 * the call stack; e.g., in a more element-specific context.
 *
 * - Attributes that already exist with the same value will not be set again.
 * - Attributes set to `false`, `null`, or `undefined`, will be removed entirely.
 * - `innerText`, `children`, will set `innerText`, which is not technically an attribute.
 * - `innerHTML`, `dangerouslySetInnerHTML` will set `innerHTML`, which is not technically an attribute.
 * - This supports attributes with function values; e.g., `onload`, `onclick`, etc.
 *
 * @param element Element.
 * @param atts    Attributes.
 */
export const setAtts = (element: Element, atts: AnyAtts): void => {
    // Cast as keyable so we can access properties.
    const elemObj = element as Element & $type.Object;

    // Removes internal preact props, which are not real attributes.
    // We don’t, however, remove `children`, because there are cases in which we can handle.
    atts = $obj.omit(atts, ['jsx', 'ref', 'key']); // We also handle `dangerouslySetInnerHTML`.

    // Consolidates class prop variants into a single `class` attribute.
    if ($preact.classPropVariants().some((variant) => Object.hasOwn(atts, variant))) {
        atts = { ...$preact.omitProps(atts, ['class']), class: $preact.classes(atts) };
    }
    // Iterates all new attribute names/values.
    for (let [name, newValue] of Object.entries(atts)) {
        const currentValue = elemObj.getAttribute(name);

        if (['innerText', 'children'].includes(name)) {
            if (!$is.primitive(newValue)) throw new Error();
            const newStrValue = $to.string(newValue);
            if (elemObj.innerText !== newStrValue) elemObj.innerText = newStrValue;
            //
        } else if (['innerHTML', 'dangerouslySetInnerHTML'].includes(name)) {
            if ($is.object(newValue)) newValue = newValue.__html;
            const newStrValue = $to.string(newValue);
            if (elemObj.innerHTML !== newStrValue) elemObj.innerHTML = newStrValue;
            //
        } else if (true === newValue) {
            if (currentValue !== '') elemObj.setAttribute(name, '');
            //
        } else if (false === newValue || null === newValue || undefined === newValue) {
            if (currentValue !== null) elemObj.removeAttribute(name);
            //
        } else if ($is.function(newValue)) {
            if (elemObj[name] !== newValue) elemObj[name] = newValue;
            //
        } else {
            const newStrValue = $to.string(newValue); // e.g., URL, Time, etc.
            if (currentValue !== newStrValue) elemObj.setAttribute(name, newStrValue);
        }
    }
};

/**
 * Caches `<html>` element for each reuse.
 *
 * @returns HTML element; {@see HTMLHtmlElement}.
 */
export const html = $fnꓺmemo((): HTMLHtmlElement => require('html'));

/**
 * Caches `<head>` element for each reuse.
 *
 * @returns Head element; {@see HTMLHeadElement}.
 */
export const head = $fnꓺmemo((): HTMLHeadElement => require('head'));

/**
 * Caches `<body>` element for each reuse.
 *
 * @returns Body element; {@see HTMLBodyElement}.
 */
export const body = $fnꓺmemo((): HTMLBodyElement => require('body'));

/**
 * Caches `<x-preact-app>` element for each reuse.
 *
 * @returns Element; {@see HTMLElement}, else `null` if not present in DOM.
 */
export const xPreactApp = $fnꓺmemo((): HTMLElement | null => query('body > x-preact-app'));

/**
 * Queries DOM element(s).
 *
 * @param   selectors Selectors. Comma-delimited string or array.
 *
 * @returns           An {@see Element|NodeListOf<Element>}; else `null`.
 *
 *   - Passing `selectors` as a string implies {@see document.querySelector()}, and returns an element.
 *   - Passing `selectors` as an array implies {@see document.querySelectorAll()}, and returns a {@see NodeList}.
 */
export function query<Type extends keyof HTMLElementTagNameMap>(selectors: Type): HTMLElementTagNameMap[Type] | null;
export function query<Type extends keyof HTMLElementTagNameMap>(selectors: Type[]): NodeListOf<HTMLElementTagNameMap[Type]>;

export function query<Type extends keyof SVGElementTagNameMap>(selectors: Type): SVGElementTagNameMap[Type] | null;
export function query<Type extends keyof SVGElementTagNameMap>(selectors: Type[]): NodeListOf<SVGElementTagNameMap[Type]>;

export function query<Type extends keyof MathMLElementTagNameMap>(selectors: Type): MathMLElementTagNameMap[Type] | null;
export function query<Type extends keyof MathMLElementTagNameMap>(selectors: Type[]): NodeListOf<MathMLElementTagNameMap[Type]>;

export function query<Type extends keyof HTMLElementDeprecatedTagNameMap>(selectors: Type): HTMLElementDeprecatedTagNameMap[Type] | null;
export function query<Type extends keyof HTMLElementDeprecatedTagNameMap>(selectors: Type[]): NodeListOf<HTMLElementDeprecatedTagNameMap[Type]>;

export function query<Type extends Element = Element>(selectors: string): Type | null;
export function query<Type extends Element = Element>(selectors: string[]): NodeListOf<Type>;

export function query<Type extends Element = Element, Selectors extends string[] | string = string>(
    selectors: Selectors,
): Selectors extends string[] ? NodeListOf<Type> : Type | null {
    type RtnType = Selectors extends string[] ? NodeListOf<Type> : Type | null;

    if ($is.array(selectors)) {
        return document.querySelectorAll(selectors.join(', ')) as RtnType;
    }
    return document.querySelector(selectors) as RtnType;
}

/**
 * Requires DOM element(s).
 *
 * @param   selectors Selectors. Comma-delimited string or array.
 *
 * @returns           An {@see Element|NodeListOf<Element>}; else throws error.
 *
 *   - Passing `selectors` as a string implies {@see document.querySelector()}, and returns an element.
 *   - Passing `selectors` as an array implies {@see document.querySelectorAll()}, and returns a {@see NodeList}.
 */
export function require<Type extends keyof HTMLElementTagNameMap>(selectors: Type): HTMLElementTagNameMap[Type];
export function require<Type extends keyof HTMLElementTagNameMap>(selectors: Type[]): NodeListOf<HTMLElementTagNameMap[Type]>;

export function require<Type extends keyof SVGElementTagNameMap>(selectors: Type): SVGElementTagNameMap[Type];
export function require<Type extends keyof SVGElementTagNameMap>(selectors: Type[]): NodeListOf<SVGElementTagNameMap[Type]>;

export function require<Type extends keyof MathMLElementTagNameMap>(selectors: Type): MathMLElementTagNameMap[Type];
export function require<Type extends keyof MathMLElementTagNameMap>(selectors: Type[]): NodeListOf<MathMLElementTagNameMap[Type]>;

export function require<Type extends keyof HTMLElementDeprecatedTagNameMap>(selectors: Type): HTMLElementDeprecatedTagNameMap[Type];
export function require<Type extends keyof HTMLElementDeprecatedTagNameMap>(selectors: Type[]): NodeListOf<HTMLElementDeprecatedTagNameMap[Type]>;

export function require<Type extends Element = Element>(selectors: string): Type;
export function require<Type extends Element = Element>(selectors: string[]): NodeListOf<Type>;

export function require<Type extends Element = Element, Selectors extends string[] | string = string>(selectors: Selectors): Selectors extends string[] ? NodeListOf<Type> : Type {
    type RtnType = Selectors extends string[] ? NodeListOf<Type> : Type;
    let rtnValue; // Initialize.

    if ($is.array(selectors)) {
        rtnValue = document.querySelectorAll(selectors.join(', '));
        rtnValue = rtnValue.length ? rtnValue : null;
    } else rtnValue = document.querySelector(selectors);

    if (!rtnValue /* Cannot be an empty node list, either. */) {
        throw new Error('DOM query failed on: `' + $to.array(selectors).join(', ') + '`.');
    }
    return rtnValue as RtnType;
}

/**
 * Gets computed styles of a required DOM element.
 *
 * @param   selectors Selectors. Comma-delimited string, or an existing {@see Element}.
 *
 * @returns           A computed {@see CSSStyleDeclaration}.
 */
export const stylesOf = (selectors: string | Element): CSSStyleDeclaration => {
    return getComputedStyle($is.string(selectors) ? require(selectors) : selectors);
};

/**
 * Gets selector path leading to a given element in the DOM.
 *
 * @param   element An {@see Element} in the DOM.
 *
 * @returns         Selector path leading to a given element in the DOM.
 */
export const pathTo = (element: Element): string => {
    return $fn.try(
        (): string =>
            buildCSSSelector(element, {
                root: xPreactApp() || body(),
            }),
        '',
    )();
};
