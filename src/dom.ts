/**
 * DOM utilities.
 */

import './resources/init.ts';

import { $env, $is, $to } from './index.ts';

/**
 * Queries DOM element(s).
 *
 * @param   selectors Selectors. Comma-delimited string or array.
 *
 * @returns           An {@see Element|NodeListOf<Element>}; else `undefined`.
 *
 *   - Passing `selectors` as a string implies {@see document.querySelector()}, and returns an element.
 *   - Passing `selectors` as an array implies {@see document.querySelectorAll()}, and returns an element array.
 */
export function query<Type extends keyof HTMLElementTagNameMap>(selectors: Type): HTMLElementTagNameMap[Type] | undefined;
export function query<Type extends keyof HTMLElementTagNameMap>(selectors: Type[]): NodeListOf<HTMLElementTagNameMap[Type]> | undefined;

export function query<Type extends keyof SVGElementTagNameMap>(selectors: Type): SVGElementTagNameMap[Type] | undefined;
export function query<Type extends keyof SVGElementTagNameMap>(selectors: Type[]): NodeListOf<SVGElementTagNameMap[Type]> | undefined;

export function query<Type extends keyof MathMLElementTagNameMap>(selectors: Type): MathMLElementTagNameMap[Type] | undefined;
export function query<Type extends keyof MathMLElementTagNameMap>(selectors: Type[]): NodeListOf<MathMLElementTagNameMap[Type]> | undefined;

export function query<Type extends keyof HTMLElementDeprecatedTagNameMap>(selectors: Type): HTMLElementDeprecatedTagNameMap[Type] | undefined;
export function query<Type extends keyof HTMLElementDeprecatedTagNameMap>(selectors: Type[]): NodeListOf<HTMLElementDeprecatedTagNameMap[Type]> | undefined;

export function query<Type extends Element = Element>(selectors: string): Type | undefined;
export function query<Type extends Element = Element>(selectors: string[]): NodeListOf<Type> | undefined;

export function query<Type extends Element = Element, Selectors extends string[] | string = string>(
    selectors: Selectors,
): Selectors extends string[] ? NodeListOf<Type> | undefined : Type | undefined {
    //
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    type RtnType = Selectors extends string[] ? NodeListOf<Type> | undefined : Type | undefined;

    if ($is.array(selectors)) {
        return (document.querySelectorAll(selectors.join(', ')) || undefined) as RtnType;
    }
    return (document.querySelector(selectors) || undefined) as RtnType;
}

/**
 * Requires DOM element(s).
 *
 * @param   selectors Selectors. Comma-delimited string or array.
 *
 * @returns           An {@see Element|NodeListOf<Element>}; else throws error.
 *
 *   - Passing `selectors` as a string implies {@see document.querySelector()}, and returns an element.
 *   - Passing `selectors` as an array implies {@see document.querySelectorAll()}, and returns an element array.
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
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    type RtnType = Selectors extends string[] ? NodeListOf<Type> : Type;

    let rtnValue; // Initialize.

    if ($is.array(selectors)) {
        rtnValue = document.querySelectorAll(selectors.join(', '));
    } else rtnValue = document.querySelector(selectors);

    if (!rtnValue /* Must succeed, else throws error. */) {
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
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    const element = selectors instanceof Element ? selectors : require(selectors);
    return window.getComputedStyle(element);
};
