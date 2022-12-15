/**
 * Utility class.
 */

import $Env from './Env';

/**
 * URL utilities.
 */
export default class $URL {
	/**
	 * RFC 1738 URL encoding strategy.
	 */
	public static QUERY_RFC1738 = 'QUERY_RFC1738';

	/**
	 * RFC 3986 URL encoding strategy.
	 */
	public static QUERY_RFC3986 = 'QUERY_RFC3986';

	/**
	 * RFC 3986 encoding encoding strategy w/ AWS v4 compat.
	 */
	public static QUERY_RFC3986_AWS4 = 'QUERY_RFC3986_AWS4';

	/**
	 * Gets current URL.
	 *
	 * @returns Current URL.
	 */
	public static current(): string {
		if ($Env.isWeb()) {
			return location.href;
		} else {
			throw new Error('Not in browser.');
		}
	}

	/**
	 * Gets current referrer.
	 *
	 * @returns Current referrer.
	 */
	public static currentReferrer(): string {
		if ($Env.isWeb()) {
			return document.referrer;
		} else {
			throw new Error('Not in browser.');
		}
	}

	/**
	 * Gets current scheme.
	 *
	 * @returns Current scheme.
	 */
	public static currentScheme(): string {
		if ($Env.isWeb()) {
			return location.protocol.toLowerCase().slice(0, -1);
		} else {
			throw new Error('Not in browser.');
		}
	}

	/**
	 * Gets current host.
	 *
	 * @param   withPort Include port?
	 *
	 * @returns          Current host.
	 */
	public static currentHost(withPort: boolean = true): string {
		if ($Env.isWeb()) {
			return (withPort ? location.host : location.hostname).toLowerCase();
		} else {
			throw new Error('Not in browser.');
		}
	}

	/**
	 * Gets current root host.
	 *
	 * @param   withPort Include port?
	 *
	 * @returns          Current root host.
	 */
	public static currentRootHost(withPort: boolean = true): string {
		if ($Env.isWeb()) {
			return $URL.rootHost($URL.currentHost(withPort), withPort);
		} else {
			throw new Error('Not in browser.');
		}
	}

	/**
	 * Gets current port.
	 *
	 * @returns Current port.
	 */
	public static currentPort(): string {
		if ($Env.isWeb()) {
			return location.port;
		} else {
			throw new Error('Not in browser.');
		}
	}

	/**
	 * Gets current path.
	 *
	 * @returns Current path.
	 */
	public static currentPath(): string {
		if ($Env.isWeb()) {
			return location.pathname;
		} else {
			throw new Error('Not in browser.');
		}
	}

	/**
	 * Gets current subpath.
	 *
	 * @returns Current subpath.
	 */
	public static currentSubpath(): string {
		if ($Env.isWeb()) {
			return location.pathname.replace(/^\/|\/$/gu, '');
		} else {
			throw new Error('Not in browser.');
		}
	}

	/**
	 * Gets current query string.
	 *
	 * @returns Current query string.
	 */
	public static currentQuery(): string {
		if ($Env.isWeb()) {
			return location.search.slice(1);
		} else {
			throw new Error('Not in browser.');
		}
	}

	/**
	 * Gets current path & query string.
	 *
	 * @returns Current path & query string.
	 */
	public static currentPathQuery(): string {
		if ($Env.isWeb()) {
			return location.pathname + location.search;
		} else {
			throw new Error('Not in browser.');
		}
	}

	/**
	 * Gets root hostname.
	 *
	 * @param   host     Host for this method to parse. Optional in browser; i.e., default is {@see $URL.current()}.
	 * @param   withPort Include port? Default is `true`.
	 *
	 * @returns          Root hostname.
	 */
	public static rootHost(host?: URL | string | null, withPort: boolean = true): string {
		if (undefined === host) {
			if ($Env.isWeb()) {
				host = $URL.currentHost(withPort);
			} else {
				throw new Error('Missing required parameter: `host`.');
			}
		}
		if (host instanceof URL) {
			host = host.host; // Includes port.
		}
		host = host || ''; // Force string value.

		if (!withPort && host.indexOf(':') !== -1) {
			host = host.slice(0, host.lastIndexOf(':'));
		}
		return host.toLowerCase().split('.').slice(-2).join('.');
	}

	/**
	 * Parses a URL string into a {@see URL}.
	 *
	 * @param   url            URL for this method to parse. Optional in browser; i.e., default is {@see
	 *   $URL.current()}.
	 * @param   base           Base URL. Required in the case of relative URLs. Optional in browser; i.e., default is
	 *   {@see $URL.current()}.
	 * @param   throwOnFailure Throw on failure? Default is `true`.
	 *
	 * @returns                A {@see URL} instance. On failure this either throws an error or returns `null`.
	 *   `throwOnFailure` defaults to `true`, resulting in the default behavior being to throw an error on failure.
	 */
	public static parse(url?: URL | string | null, base?: URL | string | null, throwOnFailure: boolean = true): URL | null {
		if (undefined === url) {
			if ($Env.isWeb()) {
				url = $URL.current();
			} else {
				throw new Error('Missing required parameter: `url`.');
			}
		}
		if (undefined === base && $Env.isWeb()) {
			base = $URL.current(); // Current URL as base.
		}
		url = (url instanceof URL ? url.toString() : url) || '';
		base = (base instanceof URL ? base.toString() : base) || undefined;

		if (url && /^\/\//u.test(url)) {
			const scheme = $Env.isWeb() ? $URL.currentScheme() : 'http';
			url = url.replace(/^\/\//u, scheme + '://');
		}
		if (base && /^\/\//u.test(base)) {
			const scheme = $Env.isWeb() ? $URL.currentScheme() : 'http';
			base = base.replace(/^\/\//u, scheme + '://');
		}
		try {
			return new URL(url, base);
		} catch (error) {
			if (throwOnFailure) {
				throw error;
			}
			return null;
		}
	}

	/**
	 * Gets a query string variable.
	 *
	 * @param   name Query string variable name.
	 * @param   url  URL from which to parse query string variable. Optional in browser; i.e., default is {@see
	 *   $URL.current()}.
	 *
	 * @returns      `null` if not found; else query `string` variable value.
	 */
	public static getQueryVar(name: string, url?: URL | string | null): string | null {
		const parsedURL = $URL.parse(url);

		if (!parsedURL || !parsedURL.searchParams.has(name)) {
			return null; // Null when not exists.
		}
		return parsedURL.searchParams.get(name) || '';
	}

	/**
	 * Gets query string variables.
	 *
	 * @param   names Optional array of query string variable names to get; excluding others. Default is `[]`; i.e., get
	 *   all query string variables. If only one parameter is given and it's not an array, this parameter is treated as
	 *   the `url` parameter instead of `names`.
	 * @param   url   URL from which to parse query string variables. Optional in browser; i.e., default is {@see
	 *   $URL.current()}.
	 *
	 * @returns       Query string variables.
	 */
	public static getQueryVars(url?: URL | string | null): { [x: string]: string };
	public static getQueryVars(names: Array<string> | URL | string | null, url?: URL | string | null): { [x: string]: string };

	public static getQueryVars(names: Array<string> | URL | string | null = [], url?: URL | string | null): { [x: string]: string } {
		// eslint-disable-next-line prefer-rest-params
		if (1 === arguments.length && !(arguments[0] instanceof Array)) {
			// eslint-disable-next-line prefer-rest-params
			(url = arguments[0] as URL | string | null | undefined), (names = []);
		}
		if (!(names instanceof Array)) {
			names = []; // Force array.
		}
		const vars: { [x: string]: string } = {};
		const parsedURL = $URL.parse(url);

		if (!parsedURL || ![...parsedURL.searchParams].length) {
			return vars; // No query string variables.
		}
		for (const [name, value] of parsedURL.searchParams) {
			vars[name] = value; // Populates variables.
		}
		if (names.length) {
			for (const [name] of Object.entries(vars)) {
				if (names.indexOf(name) === -1) {
					delete vars[name];
				}
			}
		}
		return vars;
	}

	/**
	 * Adds a query string variable to a URL.
	 *
	 * @param   name            Query string variable name.
	 * @param   value           Query string variable value.
	 * @param   url             URL to add query string variable to. Optional in browser; i.e., default is {@see
	 *   $URL.current()}.
	 * @param   replaceExisting Optional. Default is `true`.
	 *
	 * @returns                 Updated URL with query string variable added. Returns a {@see URL} if input `url` was a
	 *   {@see URL}; else returns a {@see string}.
	 */
	public static addQueryVar(name: string, value: string, url: URL, replaceExisting: boolean): URL;
	public static addQueryVar(name: string, value: string, url?: string | null, replaceExisting?: boolean): string;
	public static addQueryVar(name: string, value: string, url?: URL | string | null, replaceExisting?: boolean): URL | string;

	public static addQueryVar(name: string, value: string, url?: URL | string | null, replaceExisting: boolean = true): URL | string {
		return $URL.addQueryVars({ [name]: value }, url, replaceExisting);
	}

	/**
	 * Adds query string variables.
	 *
	 * @param   vars            Query string variables to add.
	 * @param   url             URL to add query string variables to. Optional in browser; i.e., default is {@see
	 *   $URL.current()}.
	 * @param   replaceExisting Optional. Default is `true`.
	 *
	 * @returns                 URL with query string variables added. Returns a {@see URL} if input `url` was a {@see
	 *   URL}; else returns a {@see string}.
	 */
	public static addQueryVars(vars: { [x: string]: string }, url: URL, replaceExisting: boolean): URL;
	public static addQueryVars(vars: { [x: string]: string }, url?: string | null, replaceExisting?: boolean): string;
	public static addQueryVars(vars: { [x: string]: string }, url?: URL | string | null, replaceExisting?: boolean): URL | string;

	public static addQueryVars(vars: { [x: string]: string }, url?: URL | string | null, replaceExisting: boolean = true): URL | string {
		const rtnURL = url instanceof URL;
		const parsedURL = $URL.parse(url);

		if (!parsedURL) {
			return url || ''; // Not possible.
		}
		for (const [name, value] of Object.entries(vars)) {
			if (replaceExisting || !parsedURL.searchParams.has(name)) {
				parsedURL.searchParams.set(name, value);
			}
		}
		parsedURL.searchParams.sort();

		return rtnURL ? parsedURL : parsedURL.toString();
	}

	/**
	 * Removes a query string variable from a URL.
	 *
	 * @param   name Query string variable name.
	 * @param   url  URL to remove query string variable from. Optional in browser; i.e., default is {@see
	 *   $URL.current()}.
	 *
	 * @returns      Updated URL with query string variable removed. Returns a {@see URL} if input `url` was a {@see
	 *   URL}; else returns a {@see string}.
	 */
	public static removeQueryVar(name: string, url: URL): URL;
	public static removeQueryVar(name: string, url?: string | null): string;
	public static removeQueryVar(name: string, url?: URL | string | null): URL | string;

	public static removeQueryVar(name: string, url?: URL | string | null): URL | string {
		return $URL.removeQueryVars([name], url);
	}

	/**
	 * Removes query string variables.
	 *
	 * @param   names Optional array of query string variable names to remove. Default is `[]`; i.e., remove all query
	 *   string variables. If only one parameter is given and it's not an array, this parameter is treated as the `url`
	 *   parameter instead of `names`.
	 * @param   url   URL to remove query string variables from. Optional in browser; i.e., default is {@see
	 *   $URL.current()}.
	 *
	 * @returns       URL with query string variables removed. Returns a {@see URL} if input `url` was a {@see URL};
	 *   else returns a {@see string}.
	 */
	public static removeQueryVars(url: URL): URL;
	public static removeQueryVars(url?: string | null): string;
	public static removeQueryVars(url?: URL | string | null): URL | string;

	public static removeQueryVars(names: Array<string>, url: URL): URL;
	public static removeQueryVars(names: Array<string>, url?: string | null): string;
	public static removeQueryVars(names: Array<string>, url?: URL | string | null): URL | string;

	public static removeQueryVars(names: Array<string> | URL | string | null = [], url?: URL | string | null): URL | string {
		// eslint-disable-next-line prefer-rest-params
		if (1 === arguments.length && !(arguments[0] instanceof Array)) {
			// eslint-disable-next-line prefer-rest-params
			(url = arguments[0] as URL | string | null | undefined), (names = []);
		}
		if (!(names instanceof Array)) {
			names = []; // Force array.
		}
		const rtnURL = url instanceof URL;
		const parsedURL = $URL.parse(url);

		if (!parsedURL) {
			return url || ''; // Not possible.
		}
		for (const [name] of parsedURL.searchParams) {
			if (!names.length || names.indexOf(name) !== -1) {
				parsedURL.searchParams.delete(name);
			}
		}
		parsedURL.searchParams.sort();

		return rtnURL ? parsedURL : parsedURL.toString();
	}

	/**
	 * Removes (client|cache)-side-only query string variables.
	 *
	 * @param   url URL to remove query string variables from. Optional in browser; i.e., default is {@see
	 *   $URL.current()}.
	 *
	 * @returns     URL with (client|cache)-side-only query string variables removed. Returns a {@see URL} if input
	 *   `url` was a {@see URL}; else returns a {@see string}.
	 */
	public static removeCSOQueryVars(url: URL): URL;
	public static removeCSOQueryVars(url?: string | null): string;
	public static removeCSOQueryVars(url?: URL | string | null): URL | string;

	public static removeCSOQueryVars(url?: URL | string | null): URL | string {
		const rtnURL = url instanceof URL;
		const parsedURL = $URL.parse(url);

		if (!parsedURL) {
			return url || ''; // Not possible.
		}
		for (const [name] of parsedURL.searchParams) {
			if (/^(?:ut[mx]_[a-z_0-9]+|_g[al]|(?:gcl|dcl|msclk|fbcl)(?:id|src)|wbraid|_ck)$/iu.test(name)) {
				parsedURL.searchParams.delete(name);
			}
		}
		parsedURL.searchParams.sort();

		return rtnURL ? parsedURL : parsedURL.toString();
	}

	/**
	 * Encodes a URL component.
	 *
	 * @param   str      String to encode.
	 * @param   strategy Strategy. Default is {@see $URL.QUERY_RFC3986}. Use {@see $URL.QUERY_RFC3986} for {@see
	 *   rawurlencode()} PHP compatibility. Use {@see $URL.QUERY_RFC3986_AWS4} for {@see rawurlencode()} PHP w/ AWS v4
	 *   compatibility. Use {@see $URL.QUERY_RFC1738} for {@see urlencode()} PHP compatibility.
	 *
	 * @returns          Encoded string.
	 *
	 * @see https://locutus.io/php/url/urlencode/
	 * @see https://locutus.io/php/url/rawurlencode/
	 */
	public static encode(str: string, strategy: string = $URL.QUERY_RFC3986): string {
		switch (strategy) {
			case $URL.QUERY_RFC1738:
				return encodeURIComponent(str)
					.replace(/[!'()*~]/gu, function (c) {
						return '%' + c.charCodeAt(0).toString(16).toUpperCase();
					})
					.replace(/%20/gu, '+');

			case $URL.QUERY_RFC3986:
			case $URL.QUERY_RFC3986_AWS4:
			default: // Default strategy.
				return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
					return '%' + c.charCodeAt(0).toString(16).toUpperCase();
				});
		}
	}

	/**
	 * Decodes a URL component.
	 *
	 * @param   str      String to decode.
	 * @param   strategy Strategy. Default is {@see $URL.QUERY_RFC3986}. Use {@see $URL.QUERY_RFC3986} for {@see
	 *   rawurldecode()} PHP compatibility. Use {@see $URL.QUERY_RFC3986_AWS4} for {@see rawurldecode()} PHP w/ AWS v4
	 *   compatibility. Use {@see $URL.QUERY_RFC1738} for {@see urldecode()} PHP compatibility.
	 *
	 * @returns          Decoded string.
	 *
	 * @see https://locutus.io/php/url/urldecode/
	 * @see https://locutus.io/php/url/rawurldecode/
	 */
	public static decode(str: string, strategy: string = $URL.QUERY_RFC3986): string {
		switch (strategy) {
			case $URL.QUERY_RFC1738:
				return decodeURIComponent(str.replace(/%(?![0-9a-f]{2})/giu, () => '%25').replace(/\+/gu, '%20'));

			case $URL.QUERY_RFC3986:
			case $URL.QUERY_RFC3986_AWS4:
			default: // Default strategy.
				return decodeURIComponent(str.replace(/%(?![0-9a-f]{2})/giu, () => '%25'));
		}
	}
}
