/**
 * URL utilities.
 */

import { isWeb as $envꓺisWeb } from './env.js';

/**
 * RFC 1738 URL encoding strategy.
 */
export const QUERY_RFC1738 = 'QUERY_RFC1738';

/**
 * RFC 3986 URL encoding strategy.
 */
export const QUERY_RFC3986 = 'QUERY_RFC3986';

/**
 * RFC 3986 encoding encoding strategy w/ AWS v4 compat.
 */
export const QUERY_RFC3986_AWS4 = 'QUERY_RFC3986_AWS4';

/**
 * Prefined errors.
 */
const NotWebError = new Error('Not web.');

/**
 * Gets current URL.
 *
 * @returns Current URL.
 */
export function current(): string {
	if ($envꓺisWeb()) {
		return location.href;
	} else {
		throw NotWebError;
	}
}

/**
 * Gets current referrer.
 *
 * @returns Current referrer.
 */
export function currentReferrer(): string {
	if ($envꓺisWeb()) {
		return document.referrer;
	} else {
		throw NotWebError;
	}
}

/**
 * Gets current scheme.
 *
 * @returns Current scheme.
 */
export function currentScheme(): string {
	if ($envꓺisWeb()) {
		return location.protocol.toLowerCase().slice(0, -1);
	} else {
		throw NotWebError;
	}
}

/**
 * Gets current host.
 *
 * @param   withPort Include port?
 *
 * @returns          Current host.
 */
export function currentHost(withPort: boolean = true): string {
	if ($envꓺisWeb()) {
		return (withPort ? location.host : location.hostname).toLowerCase();
	} else {
		throw NotWebError;
	}
}

/**
 * Gets current root host.
 *
 * @param   withPort Include port?
 *
 * @returns          Current root host.
 */
export function currentRootHost(withPort: boolean = true): string {
	if ($envꓺisWeb()) {
		return rootHost(currentHost(withPort), withPort);
	} else {
		throw NotWebError;
	}
}

/**
 * Gets current port.
 *
 * @returns Current port.
 */
export function currentPort(): string {
	if ($envꓺisWeb()) {
		return location.port;
	} else {
		throw NotWebError;
	}
}

/**
 * Gets current path.
 *
 * @returns Current path.
 */
export function currentPath(): string {
	if ($envꓺisWeb()) {
		return location.pathname;
	} else {
		throw NotWebError;
	}
}

/**
 * Gets current subpath.
 *
 * @returns Current subpath.
 */
export function currentSubpath(): string {
	if ($envꓺisWeb()) {
		return location.pathname.replace(/^\/|\/$/gu, '');
	} else {
		throw NotWebError;
	}
}

/**
 * Gets current query string.
 *
 * @returns Current query string.
 */
export function currentQuery(): string {
	if ($envꓺisWeb()) {
		return location.search.slice(1);
	} else {
		throw NotWebError;
	}
}

/**
 * Gets current path & query string.
 *
 * @returns Current path & query string.
 */
export function currentPathQuery(): string {
	if ($envꓺisWeb()) {
		return location.pathname + location.search;
	} else {
		throw NotWebError;
	}
}

/**
 * Gets root hostname.
 *
 * @param   host     Host for this method to parse. Optional in browser; i.e., default is {@see current()}.
 * @param   withPort Include port? Default is `true`.
 *
 * @returns          Root hostname.
 */
export function rootHost(host?: URL | string | null, withPort: boolean = true): string {
	if (undefined === host) {
		if ($envꓺisWeb()) {
			host = currentHost(withPort);
		} else {
			throw new Error('Missing `host`.');
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
 * @param   url            URL for this method to parse. Optional in browser; i.e., default is {@see current()}.
 * @param   base           Base URL. Required for relative URLs. Optional in browser; i.e., default is {@see current()}.
 * @param   throwOnFailure Throw on failure? Default is `true`.
 *
 * @returns                A {@see URL} instance. On failure this either throws an error or returns `null`.
 *   `throwOnFailure` defaults to `true`, resulting in the default behavior being to throw an error on failure.
 */
export function parse(url?: URL | string | null, base?: URL | string | null, throwOnFailure: boolean = true): URL | null {
	if (undefined === url) {
		if ($envꓺisWeb()) {
			url = current();
		} else {
			throw new Error('Missing `url`.');
		}
	}
	if (undefined === base && $envꓺisWeb()) {
		base = current(); // Current URL as base.
	}
	url = (url instanceof URL ? url.toString() : url) || '';
	base = (base instanceof URL ? base.toString() : base) || undefined;

	if (url && /^\/\//u.test(url)) {
		const scheme = $envꓺisWeb() ? currentScheme() : 'https';
		url = url.replace(/^\/\//u, scheme + '://');
	}
	if (base && /^\/\//u.test(base)) {
		const scheme = $envꓺisWeb() ? currentScheme() : 'https';
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
 * @param   url  URL from which to parse query string variable. Optional in browser; i.e., default is {@see current()}.
 *
 * @returns      `null` if not found; else query `string` variable value.
 */
export function getQueryVar(name: string, url?: URL | string | null): string | null {
	const parsedURL = parse(url);

	if (!parsedURL || !parsedURL.searchParams.has(name)) {
		return null; // Null when not exists.
	}
	return parsedURL.searchParams.get(name) || '';
}

/**
 * Gets query string variables.
 *
 * @param   names Optional array of query string variable names to get; excluding others. Default is `[]`; i.e., get all
 *   query string variables. If only one parameter is given and it's not an array, this parameter is treated as the
 *   `url` parameter instead of `names`.
 * @param   url   URL from which to parse query string variables. Optional in browser; i.e., default is {@see
 *   current()}.
 *
 * @returns       Query string variables.
 */
export function getQueryVars(url?: URL | string | null): { [x: string]: string };
export function getQueryVars(names: Array<string> | URL | string | null, url?: URL | string | null): { [x: string]: string };

export function getQueryVars(names: Array<string> | URL | string | null = [], url?: URL | string | null): { [x: string]: string } {
	// eslint-disable-next-line prefer-rest-params
	if (1 === arguments.length && !(arguments[0] instanceof Array)) {
		// eslint-disable-next-line prefer-rest-params
		(url = arguments[0] as URL | string | null | undefined), (names = []);
	}
	if (!(names instanceof Array)) {
		names = []; // Force array.
	}
	const vars: { [x: string]: string } = {};
	const parsedURL = parse(url);

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
 * @param   url             URL to add query string variable to. Optional in browser; i.e., default is {@see current()}.
 * @param   replaceExisting Optional. Default is `true`.
 *
 * @returns                 Updated URL with query string variable added. Returns a {@see URL} if input `url` was a
 *   {@see URL}; else returns a {@see string}.
 */
export function addQueryVar(name: string, value: string, url: URL, replaceExisting: boolean): URL;
export function addQueryVar(name: string, value: string, url?: string | null, replaceExisting?: boolean): string;
export function addQueryVar(name: string, value: string, url?: URL | string | null, replaceExisting?: boolean): URL | string;

export function addQueryVar(name: string, value: string, url?: URL | string | null, replaceExisting: boolean = true): URL | string {
	return addQueryVars({ [name]: value }, url, replaceExisting);
}

/**
 * Adds query string variables.
 *
 * @param   vars            Query string variables to add.
 * @param   url             URL to add query string variables to. Optional in browser; i.e., default is {@see
 *   current()}.
 * @param   replaceExisting Optional. Default is `true`.
 *
 * @returns                 URL with query string variables added. Returns a {@see URL} if input `url` was a {@see URL};
 *   else returns a {@see string}.
 */
export function addQueryVars(vars: { [x: string]: string }, url: URL, replaceExisting: boolean): URL;
export function addQueryVars(vars: { [x: string]: string }, url?: string | null, replaceExisting?: boolean): string;
export function addQueryVars(vars: { [x: string]: string }, url?: URL | string | null, replaceExisting?: boolean): URL | string;

export function addQueryVars(vars: { [x: string]: string }, url?: URL | string | null, replaceExisting: boolean = true): URL | string {
	const rtnURL = url instanceof URL;
	const parsedURL = parse(url);

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
 * @param   url  URL to remove query string variable from. Optional in browser; i.e., default is {@see current()}.
 *
 * @returns      Updated URL with query string variable removed. Returns a {@see URL} if input `url` was a {@see URL};
 *   else returns a {@see string}.
 */
export function removeQueryVar(name: string, url: URL): URL;
export function removeQueryVar(name: string, url?: string | null): string;
export function removeQueryVar(name: string, url?: URL | string | null): URL | string;

export function removeQueryVar(name: string, url?: URL | string | null): URL | string {
	return removeQueryVars([name], url);
}

/**
 * Removes query string variables.
 *
 * @param   names Optional array of query string variable names to remove. Default is `[]`; i.e., remove all query
 *   string variables. If only one parameter is given and it's not an array, this parameter is treated as the `url`
 *   parameter instead of `names`.
 * @param   url   URL to remove query string variables from. Optional in browser; i.e., default is {@see current()}.
 *
 * @returns       URL with query string variables removed. Returns a {@see URL} if input `url` was a {@see URL}; else
 *   returns a {@see string}.
 */
export function removeQueryVars(url: URL): URL;
export function removeQueryVars(url?: string | null): string;
export function removeQueryVars(url?: URL | string | null): URL | string;

export function removeQueryVars(names: Array<string>, url: URL): URL;
export function removeQueryVars(names: Array<string>, url?: string | null): string;
export function removeQueryVars(names: Array<string>, url?: URL | string | null): URL | string;

export function removeQueryVars(names: Array<string> | URL | string | null = [], url?: URL | string | null): URL | string {
	// eslint-disable-next-line prefer-rest-params
	if (1 === arguments.length && !(arguments[0] instanceof Array)) {
		// eslint-disable-next-line prefer-rest-params
		(url = arguments[0] as URL | string | null | undefined), (names = []);
	}
	if (!(names instanceof Array)) {
		names = []; // Force array.
	}
	const rtnURL = url instanceof URL;
	const parsedURL = parse(url);

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
 * @param   url URL to remove query string variables from. Optional in browser; i.e., default is {@see current()}.
 *
 * @returns     URL with (client|cache)-side-only query string variables removed. Returns a {@see URL} if input `url`
 *   was a {@see URL}; else returns a {@see string}.
 */
export function removeCSOQueryVars(url: URL): URL;
export function removeCSOQueryVars(url?: string | null): string;
export function removeCSOQueryVars(url?: URL | string | null): URL | string;

export function removeCSOQueryVars(url?: URL | string | null): URL | string {
	const rtnURL = url instanceof URL;
	const parsedURL = parse(url);

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
 * @param   strategy Strategy. Default is {@see QUERY_RFC3986}. Use {@see QUERY_RFC3986} for {@see rawurlencode()} PHP
 *   compatibility. Use {@see QUERY_RFC3986_AWS4} for {@see rawurlencode()} PHP w/ AWS v4 compatibility. Use {@see
 *   QUERY_RFC1738} for {@see urlencode()} PHP compatibility.
 *
 * @returns          Encoded string.
 *
 * @see https://locutus.io/php/url/urlencode/
 * @see https://locutus.io/php/url/rawurlencode/
 */
export function encode(str: string, strategy: string = QUERY_RFC3986): string {
	switch (strategy) {
		case QUERY_RFC1738:
			return encodeURIComponent(str)
				.replace(/[!'()*~]/gu, function (c) {
					return '%' + c.charCodeAt(0).toString(16).toUpperCase();
				})
				.replace(/%20/gu, '+');

		case QUERY_RFC3986:
		case QUERY_RFC3986_AWS4:
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
 * @param   strategy Strategy. Default is {@see QUERY_RFC3986}. Use {@see QUERY_RFC3986} for {@see rawurldecode()} PHP
 *   compatibility. Use {@see QUERY_RFC3986_AWS4} for {@see rawurldecode()} PHP w/ AWS v4 compatibility. Use {@see
 *   QUERY_RFC1738} for {@see urldecode()} PHP compatibility.
 *
 * @returns          Decoded string.
 *
 * @see https://locutus.io/php/url/urldecode/
 * @see https://locutus.io/php/url/rawurldecode/
 */
export function decode(str: string, strategy: string = QUERY_RFC3986): string {
	switch (strategy) {
		case QUERY_RFC1738:
			return decodeURIComponent(str.replace(/%(?![0-9a-f]{2})/giu, () => '%25').replace(/\+/gu, '%20'));

		case QUERY_RFC3986:
		case QUERY_RFC3986_AWS4:
		default: // Default strategy.
			return decodeURIComponent(str.replace(/%(?![0-9a-f]{2})/giu, () => '%25'));
	}
}
