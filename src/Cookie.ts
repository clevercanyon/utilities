/**
 * Utility class.
 */

import { isWeb as envIsWeb } from './env';
import { hasOwn as objHasOwn } from './obj';
import { currentRootHost as urlCurrentRootHost, currentScheme as urlCurrentScheme, encode as urlEncode } from './url';

/**
 * Cookie options.
 */
interface Options {
	domain?: string;
	path?: string;
	expires?: number;
	samesite?: string;
	secure?: boolean;
}

/**
 * Cache.
 */
const cache: {
	cookies?: { [x: string]: string };
	[x: string]: unknown;
} = {};

/**
 * Parses a cookie header.
 *
 * @param   header Cookie header to parse. Optional in browser. Default is `document.cookie`.
 *
 * @returns        Cookies, as object props.
 */
export function parse(header?: string): { [x: string]: string } {
	let isWebHeader = null; // Initialize.
	let cookies: { [x: string]: string } = {};

	if (undefined === header) {
		if (envIsWeb()) {
			isWebHeader = true;
			header = document.cookie;
		} else {
			throw new Error('Missing required parameter: `header`.');
		}
	}
	if (isWebHeader && cache.cookies) {
		return cache.cookies;
	}
	if (isWebHeader) {
		cache.cookies = {}; // Initialize.
		cookies = cache.cookies;
	}
	if (!header) {
		return cookies; // Nothing to parse.
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
		if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1);
		}
		cookies[decodeURIComponent(name)] = decodeURIComponent(value);
	});
	return cookies;
}

/**
 * Cookie exists?
 *
 * @param   name Cookie name.
 *
 * @returns      `true` if cookie exists.
 */
export function has(name: string): boolean {
	if (!envIsWeb()) {
		throw new Error('Not in browser.');
	}
	return objHasOwn(parse(), name);
}

/**
 * Gets a cookie value.
 *
 * @param   name Cookie name.
 *
 * @returns      Cookie value; else `null`.
 */
export function get(name: string): string | null {
	if (!envIsWeb()) {
		throw new Error('Not in browser.');
	}
	const cookies = parse();

	if (!objHasOwn(cookies, name)) {
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
	if (!envIsWeb()) {
		throw new Error('Not in browser.');
	}
	if (!isValidName(name)) {
		throw new Error('Invalid cookie name: `' + name + '`.');
	}
	let domain: string = options.domain || '.' + urlCurrentRootHost(false);
	let path: string = options.path || '/';
	let expires: number | string = options.expires || 31536000;

	let samesite: string = options.samesite || 'lax';
	let secure: boolean | string = undefined === options.secure ? 'https' === urlCurrentScheme() : options.secure;
	secure = 'none' === samesite.toLowerCase() ? true : secure;

	domain = domain ? '; domain=' + domain : '';
	path = path ? '; path=' + path : '';
	expires = expires <= -1 ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT' : '; max-age=' + String(expires);
	samesite = samesite ? '; samesite=' + samesite : '';
	secure = secure ? '; secure' : '';

	// The `httonly` attribute is implied when using JavaScript.
	// {@see https://stackoverflow.com/a/14691716}.

	document.cookie = urlEncode(name) + '=' + urlEncode(value) + domain + path + expires + samesite + secure;

	if (cache.cookies) {
		cache.cookies[name] = value;
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
	if (!envIsWeb()) {
		throw new Error('Not in browser.');
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
