/**
 * Utility class.
 */

import $Env from './Env';
import $Obj from './Obj';
import $URL from './URL';

/**
 * Cookie options.
 */
interface $CookieOptions {
	domain?: string;
	path?: string;
	expires?: number;
	samesite?: string;
	secure?: boolean;
}

/**
 * Cookie utilities.
 */
export default class $Cookie {
	/**
	 * Cache.
	 */
	protected static cache: {
		cookies?: { [x: string]: string };
		[x: string]: unknown;
	} = {};

	/**
	 * Parses a cookie header.
	 *
	 * @param header Cookie header to parse.
	 *               Optional in browser. Default is `document.cookie`.
	 *
	 * @returns Cookies, as object props.
	 */
	public static parse(header?: string): { [x: string]: string } {
		let cookies: { [x: string]: string } = {};
		let isBrowserHeader = null;

		if (undefined === header) {
			if ($Env.isWeb()) {
				isBrowserHeader = true;
				header = document.cookie;
			} else {
				throw new Error('Missing required parameter: `header`.');
			}
		}
		if (isBrowserHeader && $Cookie.cache.cookies) {
			return $Cookie.cache.cookies;
		}
		if (isBrowserHeader) {
			$Cookie.cache.cookies = {}; // Initialize.
			cookies = $Cookie.cache.cookies;
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
	 * @param name Cookie name.
	 *
	 * @returns `true` if cookie exists.
	 */
	public static has(name: string): boolean {
		if (!$Env.isWeb()) {
			throw new Error('Not in browser.');
		}
		return $Obj.hasOwn($Cookie.parse(), name);
	}

	/**
	 * Gets a cookie value.
	 *
	 * @param name Cookie name.
	 *
	 * @returns Cookie value; else `null`.
	 */
	public static get(name: string): string | null {
		if (!$Env.isWeb()) {
			throw new Error('Not in browser.');
		}
		const cookies = $Cookie.parse();

		if (!$Obj.hasOwn(cookies, name)) {
			return null;
		}
		return cookies[name] || '';
	}

	/**
	 * Sets a cookie value.
	 *
	 * @param name    Cookie name.
	 * @param value   Cookie value.
	 * @param options Optional. Default is `{}`.
	 *
	 * @returns `true` on success.
	 */
	public static set(name: string, value: string, options: $CookieOptions = {}): boolean {
		if (!$Env.isWeb()) {
			throw new Error('Not in browser.');
		}
		if (!$Cookie.isValidName(name)) {
			throw new Error('Invalid cookie name: `' + name + '`.');
		}
		let domain: string = options.domain || '.' + $URL.currentRootHost(false);
		let path: string = options.path || '/';
		let expires: number | string = options.expires || 31536000;

		let samesite: string = options.samesite || 'lax';
		let secure: boolean | string = undefined === options.secure ? 'https' === $URL.currentScheme() : options.secure;
		secure = 'none' === samesite.toLowerCase() ? true : secure;

		domain = domain ? '; domain=' + domain : '';
		path = path ? '; path=' + path : '';
		expires = expires <= -1 ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT' : '; max-age=' + String(expires);
		samesite = samesite ? '; samesite=' + samesite : '';
		secure = secure ? '; secure' : '';

		// The `httonly` attribute is implied when using JavaScript.
		// {@see https://stackoverflow.com/a/14691716}.

		document.cookie = $URL.encode(name) + '=' + $URL.encode(value) + domain + path + expires + samesite + secure;

		if ($Cookie.cache.cookies) {
			$Cookie.cache.cookies[name] = value;
		}
		return true;
	}

	/**
	 * Deletes a cookie.
	 *
	 * @param name    Cookie name.
	 * @param options Optional. Default is `{}`.
	 *
	 * @returns `true` on success.
	 */
	public static delete(name: string, options: $CookieOptions = {}): boolean {
		if (!$Env.isWeb()) {
			throw new Error('Not in browser.');
		}
		return $Cookie.set(name, '', Object.assign({}, options || {}, { expires: -1 }));
	}

	/**
	 * Is a valid cookie name?
	 *
	 * @param name Cookie name.
	 *
	 * @returns `true` if valid cookie name.
	 */
	public static isValidName(name: string): boolean {
		return /^[a-z0-9_-]+$/iu.test(name) && !/^(?:domain|path|expires|max-age|samesite|secure|httponly)$/iu.test(name);
	}
}
