/**
 * Utility class.
 */

import { isWeb as $envꓺisWeb } from './env.js';
import { hasOwn as $objꓺhasOwn } from './obj.js';
import {
	currentScheme as $urlꓺcurrentScheme, //
	currentRootHost as $urlꓺcurrentRootHost,
	encode as $urlꓺencode,
	decode as $urlꓺdecode,
} from './url.js';

/**
 * Options.
 */
export interface Options {
	domain?: string;
	path?: string;
	expires?: number;
	samesite?: string;
	secure?: boolean;
}

/**
 * Default web header cookies.
 */
let defaultWebHeaderCookies: { [x: string]: string } | undefined;

/**
 * Parses a cookie header.
 *
 * @param   header Cookie header to parse. Optional in browser. Default is `document.cookie`.
 *
 * @returns        Parsed cookies; i.e., as object props.
 */
export function parse(header?: string): { [x: string]: string } {
	let isDefaultWebHeader = false; // Initialize.
	let cookies: { [x: string]: string } = {};

	if (undefined === header) {
		if ($envꓺisWeb()) {
			header = document.cookie;
			isDefaultWebHeader = true;
		} else {
			throw new Error('Missing `header`.');
		}
	}
	if (isDefaultWebHeader) {
		if (defaultWebHeaderCookies) {
			return { ...defaultWebHeaderCookies };
		}
		defaultWebHeaderCookies = {};
		cookies = defaultWebHeaderCookies;
	}
	header.split(/\s*;\s*/).forEach((cookie) => {
		let name, value; // Initialize.
		const eqIndex = cookie.indexOf('=');

		if (-1 !== eqIndex) {
			name = cookie.substring(0, eqIndex);
			value = cookie.substring(eqIndex + 1);
		} else {
			[name, value] = [cookie, ''];
		}
		if ('' === name || !isValidName(name)) {
			return; // Invalid name.
		}
		if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1);
		}
		cookies[$urlꓺdecode(name)] = $urlꓺdecode(value);
	});
	return { ...cookies };
}

/**
 * Cookie exists?
 *
 * @param   name Cookie name.
 *
 * @returns      `true` if cookie exists.
 */
export function exists(name: string): boolean {
	if (!$envꓺisWeb()) {
		throw new Error('Not web.');
	}
	return $objꓺhasOwn(parse(), name);
}

/**
 * Gets a cookie value.
 *
 * @param   name Cookie name.
 *
 * @returns      Cookie value; else `null`.
 */
export function get(name: string): string | null {
	if (!$envꓺisWeb()) {
		throw new Error('Not web.');
	}
	const cookies = parse();

	if (!$objꓺhasOwn(cookies, name)) {
		return null;
	}
	return cookies[name] || '';
}

/**
 * Sets a cookie value.
 *
 * @param   name    Cookie name.
 * @param   value   Cookie value.
 * @param   options Optional. Default is `{}`.
 *
 * @returns         `true` on success.
 */
export function set(name: string, value: string, options: Options = {}): boolean {
	if (!$envꓺisWeb()) {
		throw new Error('Not web.');
	}
	if (!isValidName(name)) {
		throw new Error('Invalid name: `' + name + '`.');
	}
	let domain: string = options.domain || '.' + $urlꓺcurrentRootHost(false);
	let path: string = options.path || '/';
	let expires: number | string = options.expires || 31536000;

	let samesite: string = options.samesite || 'lax';
	let secure: boolean | string = undefined === options.secure ? 'https' === $urlꓺcurrentScheme() : options.secure;
	secure = 'none' === samesite.toLowerCase() ? true : secure;

	domain = domain ? '; domain=' + domain : '';
	path = path ? '; path=' + path : '';
	expires = expires <= -1 ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT' : '; max-age=' + String(expires);
	samesite = samesite ? '; samesite=' + samesite : '';
	secure = secure ? '; secure' : '';

	// The `httponly` attribute is implied when using JavaScript.
	// {@see https://stackoverflow.com/a/14691716}.

	document.cookie = $urlꓺencode(name) + '=' + $urlꓺencode(value) + domain + path + expires + samesite + secure;

	if (defaultWebHeaderCookies) {
		defaultWebHeaderCookies[name] = value;

		if ('' === value && options.expires && options.expires <= -1) {
			delete defaultWebHeaderCookies[name];
		}
	}
	return true;
}

/**
 * Deletes a cookie.
 *
 * @param   name    Cookie name.
 * @param   options Optional. Default is `{}`.
 *
 * @returns         `true` on success.
 */
export function del(name: string, options: Options = {}): boolean {
	if (!$envꓺisWeb()) {
		throw new Error('Not web.');
	}
	return set(name, '', Object.assign({}, options || {}, { expires: -1 }));
}

/**
 * Is a valid cookie name?
 *
 * @param   name Cookie name.
 *
 * @returns      `true` if valid cookie name.
 */
export function isValidName(name: string): boolean {
	return /^[a-z0-9_-]+$/iu.test(name) && !/^(?:domain|path|expires|max-age|samesite|secure|httponly)$/iu.test(name);
}
