/**
 * URL utilities.
 */

import { isWeb as $envꓺisWeb } from './env.ts';
import { try as $fnꓺtry } from './fn.ts';
import type { $type } from './index.ts';
import { array as $isꓺarray, url as $isꓺurl } from './is.ts';
import { deep as $moizeꓺdeep, svz as $moizeꓺsvz } from './moize.ts';
import { defaults as $objꓺdefaults } from './obj.ts';

/**
 * Defines types.
 */
export type CurrentHostOptions = { withPort?: boolean };
export type CurrentRootHostOptions = { withPort?: boolean };
export type RootHostOptions = { withPort?: boolean };
export type ParseOptions = { throwOnError?: boolean };
export type TryParseOptions = Omit<ParseOptions, 'throwOnError'>;
export type AddQueryVarOptions = { replaceExisting?: boolean };

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
 * Gets current URL.
 *
 * @returns Current URL.
 */
export const current = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): string => {
		if (!$envꓺisWeb()) {
			throw new Error('Not web.');
		}
		return location.href;
	},
);

/**
 * Gets current referrer.
 *
 * @returns Current referrer.
 */
export const currentReferrer = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): string => {
		if (!$envꓺisWeb()) {
			throw new Error('Not web.');
		}
		return document.referrer;
	},
);

/**
 * Gets current scheme.
 *
 * @returns Current scheme.
 */
export const currentScheme = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): string => {
		if (!$envꓺisWeb()) {
			throw new Error('Not web.');
		}
		return location.protocol.toLowerCase().slice(0, -1);
	},
);

/**
 * Gets current host.
 *
 * @param   options Options (all optional).
 *
 * @returns         Current host.
 */
export const currentHost = $moizeꓺdeep({ maxSize: 2 })(
	// Memoized function.
	(options: CurrentHostOptions = {}): string => {
		if (!$envꓺisWeb()) {
			throw new Error('Not web.');
		}
		const opts = $objꓺdefaults({}, options, { withPort: true }) as Required<CurrentHostOptions>;
		return (opts.withPort ? location.host : location.hostname).toLowerCase();
	},
);

/**
 * Gets current root host.
 *
 * @param   options Options (all optional).
 *
 * @returns         Current root host.
 */
export const currentRootHost = $moizeꓺdeep({ maxSize: 2 })(
	// Memoized function.
	(options: CurrentRootHostOptions = {}): string => {
		if (!$envꓺisWeb()) {
			throw new Error('Not web.');
		}
		const opts = $objꓺdefaults({}, options, { withPort: true }) as Required<CurrentRootHostOptions>;
		return rootHost(currentHost({ withPort: opts.withPort }), { withPort: opts.withPort });
	},
);

/**
 * Gets current port.
 *
 * @returns Current port.
 */
export const currentPort = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): string => {
		if (!$envꓺisWeb()) {
			throw new Error('Not web.');
		}
		return location.port;
	},
);

/**
 * Gets current path.
 *
 * @returns Current path.
 */
export const currentPath = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): string => {
		if (!$envꓺisWeb()) {
			throw new Error('Not web.');
		}
		return location.pathname;
	},
);

/**
 * Gets current subpath.
 *
 * @returns Current subpath.
 */
export const currentSubpath = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): string => {
		if (!$envꓺisWeb()) {
			throw new Error('Not web.');
		}
		return location.pathname.replace(/^\/|\/$/gu, '');
	},
);

/**
 * Gets current query string.
 *
 * @returns Current query string.
 */
export const currentQuery = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): string => {
		if (!$envꓺisWeb()) {
			throw new Error('Not web.');
		}
		return location.search.slice(1);
	},
);

/**
 * Gets current path & query string.
 *
 * @returns Current path & query string.
 */
export const currentPathQuery = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): string => {
		if (!$envꓺisWeb()) {
			throw new Error('Not web.');
		}
		return location.pathname + location.search;
	},
);

/**
 * Gets root hostname.
 *
 * @param   host     Host for this method to parse.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 * @param   withPort Include port? Default is `true`.
 *
 * @returns          Root hostname.
 */
export const rootHost = $moizeꓺdeep({ maxSize: 12 })({
	transformArgs: (args: unknown[]) => {
		if ($isꓺurl(args[0])) args[0] = args[0].toString();
		return args; // Converts URL arg into a string.
	},
})(
	// Memoized function.
	(host?: URL | $type.cf.URL | string, options: RootHostOptions = {}): string => {
		const opts = $objꓺdefaults({}, options, { withPort: true }) as Required<RootHostOptions>;

		if (undefined === host) {
			if ($envꓺisWeb()) {
				host = currentHost({ withPort: opts.withPort });
			} else {
				throw new Error('Missing `host`.');
			}
		}
		if ($isꓺurl(host)) {
			host = host.host; // Potentially includes port number.
		}
		let strHost = String(host || ''); // Force string value.

		if (!opts.withPort && strHost.includes(':')) {
			strHost = strHost.slice(0, strHost.lastIndexOf(':'));
		}
		return strHost.toLowerCase().split('.').slice(-2).join('.');
	},
);

/**
 * Parses a URL string into a {@see URL}.
 *
 * @param   url     URL for this method to parse.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 * @param   base    Base URL. Required for relative URLs.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 * @param   options Options (all optional). Default is `{ throwOnError: true }`.
 *
 * @returns         A {@see URL} instance. On failure this either throws an error or returns `undefined`.
 *
 *   - `throwOnError` defaults to `true`. {@see tryParse()} for the opposite default behavior.
 *
 *
 * @note This function cannot be memoized because the return URL object is likely to be updated by reference.
 */
export const parse = (url?: URL | $type.cf.URL | string, base?: URL | $type.cf.URL | string, options: ParseOptions = {}): URL | $type.cf.URL | undefined => {
	const opts = $objꓺdefaults({}, options, { throwOnError: true }) as Required<ParseOptions>;

	if (undefined === url) {
		if ($envꓺisWeb()) {
			url = current();
		} else {
			throw new Error('Missing `url`.');
		}
	}
	if (undefined === base) {
		base = $envꓺisWeb() ? current() : '';
	}
	let strURL = String($isꓺurl(url) ? url.toString() : url);
	let strBase = String($isꓺurl(base) ? base.toString() : base);

	if (strURL && /^\/\//u.test(strURL)) {
		strURL = strURL.replace(/^\/\//u, ($envꓺisWeb() ? currentScheme() : 'https') + '://');
	}
	if (strBase && /^\/\//u.test(strBase)) {
		strBase = strBase.replace(/^\/\//u, ($envꓺisWeb() ? currentScheme() : 'https') + '://');
	}
	return $fnꓺtry(() => new URL(strURL, strBase || undefined), undefined, { throwOnError: opts.throwOnError })();
};

/**
 * Tries to parse a URL string into a {@see URL}.
 *
 * @param   url     URL for this method to parse.
 * @param   base    Base URL. Required for relative URLs.
 * @param   options Options (all optional) — `{ throwOnError: false }` is always on.
 *
 * @returns         A {@see URL} instance, else `undefined` on failure.
 *
 * @note This function cannot be memoized because the return URL object is likely to be updated by reference.
 */
export const tryParse = (url?: URL | $type.cf.URL | string, base?: URL | $type.cf.URL | string, options: TryParseOptions = {}): URL | $type.cf.URL | undefined => {
	return parse(url, base, { ...options, throwOnError: false });
};

/**
 * Gets a query string variable.
 *
 * @param   name Query string variable name.
 * @param   url  URL from which to parse query string variable.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 *
 * @returns      Query string variable value, else undefined.
 */
export const getQueryVar = $moizeꓺsvz({ maxSize: 24 })({
	transformArgs: (args: unknown[]) => {
		if ($isꓺurl(args[1])) args[1] = args[1].toString();
		return args; // Converts URL arg into a string.
	},
})(
	// Memoized function.
	(name: string, url?: URL | $type.cf.URL | string): string | undefined => {
		const objURL = parse(url);

		if (!objURL || !objURL.searchParams.has(name)) {
			return undefined; // Does not exist.
		}
		return objURL.searchParams.get(name) || '';
	},
);

/**
 * Gets query string variables.
 *
 * @param   names Optional array of query string variable names to get; excluding others.
 *
 *   - Default is `[]`; i.e., get all query string variables.
 *   - If only one parameter is given and it's not an array, this parameter is treated as the `url` parameter instead of
 *       `names`. Please review the various functions signatures below for further details.
 *
 * @param   url   URL from which to parse query string variables.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 *
 * @returns       Query string variables as a plain object.
 *
 * @note This function is memoized. Thus, return object keys are readonly.
 */
function _getQueryVars(url?: URL | $type.cf.URL | string): { readonly [x: string]: string };
function _getQueryVars(names: string[] | URL | $type.cf.URL | string, url?: URL | $type.cf.URL | string): { readonly [x: string]: string };

function _getQueryVars(names: string[] | URL | $type.cf.URL | string = [], url?: URL | $type.cf.URL | string): { readonly [x: string]: string } {
	// eslint-disable-next-line prefer-rest-params
	if (1 === arguments.length && !$isꓺarray(arguments[0])) {
		// eslint-disable-next-line prefer-rest-params
		(names = []), (url = arguments[0] as undefined | URL | $type.cf.URL | string);
	}
	if (!$isꓺarray(names)) {
		names = []; // Force array.
	}
	const objURL = parse(url);
	const vars: { [x: string]: string } = {};

	if (!objURL || ![...objURL.searchParams].length) {
		return vars; // No query string variables.
	}
	for (const [name, value] of objURL.searchParams) {
		vars[name] = value; // Populates variables.
	}
	if (names.length) {
		for (const name of Array.from(Object.keys(vars))) {
			if (!names.includes(name)) delete vars[name];
		}
	}
	return vars; // Query string variables.
}
export const getQueryVars = $moizeꓺdeep({ maxSize: 24 })({
	transformArgs: (args: unknown[] /* Converts URL args into strings. */) => {
		return args.map((arg) => ($isꓺurl(arg) ? arg.toString() : arg));
	},
})(_getQueryVars /* Memoized function. */);

/**
 * Adds a query string variable to a URL.
 *
 * @param   name    Query string variable name.
 * @param   value   Query string variable value.
 * @param   url     URL to add query string variable to.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 * @param   options Options (all optional). Default is `{ replaceExisting: true }`.
 *
 * @returns         Updated URL with query string variable added.
 *
 *   - Returns a {@see URL} if input `url` was a {@see URL}. A string otherwise.
 *
 *
 * @note This function cannot be memoized because the return URL object is likely to be updated by reference.
 */
export function addQueryVar(name: string, value: string, url: URL | $type.cf.URL, options?: AddQueryVarOptions): URL | $type.cf.URL;
export function addQueryVar(name: string, value: string, url?: string, options?: AddQueryVarOptions): string;
export function addQueryVar(name: string, value: string, url?: URL | $type.cf.URL | string, options?: AddQueryVarOptions): URL | $type.cf.URL | string;

export function addQueryVar(name: string, value: string, url?: URL | $type.cf.URL | string, options?: AddQueryVarOptions): URL | $type.cf.URL | string {
	return addQueryVars({ [name]: value }, url, options);
}

/**
 * Adds query string variables.
 *
 * @param   vars    Query string variables to add.
 * @param   url     URL to add query string variables to.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 * @param   options Options (all optional). Default is `{ replaceExisting: true }`.
 *
 * @returns         URL with query string variables added.
 *
 *   - Returns a {@see URL} if input `url` was a {@see URL}. A string otherwise.
 *
 *
 * @note This function cannot be memoized because the return URL object is likely to be updated by reference.
 */
export function addQueryVars(vars: { [x: string]: string }, url: URL | $type.cf.URL, options?: AddQueryVarOptions): URL | $type.cf.URL;
export function addQueryVars(vars: { [x: string]: string }, url?: string, options?: AddQueryVarOptions): string;
export function addQueryVars(vars: { [x: string]: string }, url?: URL | $type.cf.URL | string, options?: AddQueryVarOptions): URL | $type.cf.URL | string;

export function addQueryVars(vars: { [x: string]: string }, url?: URL | $type.cf.URL | string, options?: AddQueryVarOptions): URL | $type.cf.URL | string {
	const opts = $objꓺdefaults({}, options || {}, { replaceExisting: true }) as Required<AddQueryVarOptions>;

	const rtnObjURL = $isꓺurl(url);
	const objURL = parse(url);

	if (!objURL) {
		return url || ''; // Not possible.
	}
	for (const [name, value] of Object.entries(vars)) {
		if (opts.replaceExisting || !objURL.searchParams.has(name)) {
			objURL.searchParams.set(name, value);
		}
	}
	objURL.searchParams.sort();

	return rtnObjURL ? objURL : objURL.toString();
}

/**
 * Removes a query string variable from a URL.
 *
 * @param   name Query string variable name.
 * @param   url  URL to remove query string variable from.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 *
 * @returns      Updated URL with query string variable removed.
 *
 *   - Returns a {@see URL} if input `url` was a {@see URL}. A string otherwise.
 *
 *
 * @note This function cannot be memoized because the return URL object is likely to be updated by reference.
 */
export function removeQueryVar(name: string, url: URL | $type.cf.URL): URL | $type.cf.URL;
export function removeQueryVar(name: string, url?: string): string;
export function removeQueryVar(name: string, url?: URL | $type.cf.URL | string): URL | $type.cf.URL | string;

export function removeQueryVar(name: string, url?: URL | $type.cf.URL | string): URL | $type.cf.URL | string {
	return removeQueryVars([name], url);
}

/**
 * Removes query string variables.
 *
 * @param   names Optional array of query string variable names to remove.
 *
 *   - Default is `[]`; i.e., remove all query string variables.
 *   - If only one parameter is given and it's not an array, this parameter is treated as the `url` instead of `names`.
 *       Please review the various functions signatures below for further details.
 *
 * @param   url   URL to remove query string variables from.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 *
 * @returns       URL with query string variables removed.
 *
 *   - Returns a {@see URL} if input `url` was a {@see URL}. A string otherwise.
 *
 *
 * @note This function cannot be memoized because the return URL object is likely to be updated by reference.
 */
export function removeQueryVars(url: URL | $type.cf.URL): URL | $type.cf.URL;
export function removeQueryVars(url?: string): string;
export function removeQueryVars(url?: URL | $type.cf.URL | string): URL | $type.cf.URL | string;

export function removeQueryVars(names: string[], url: URL | $type.cf.URL): URL | $type.cf.URL;
export function removeQueryVars(names: string[], url?: string): string;
export function removeQueryVars(names: string[], url?: URL | $type.cf.URL | string): URL | $type.cf.URL | string;

export function removeQueryVars(names: string[] | URL | $type.cf.URL | string = [], url?: URL | $type.cf.URL | string): URL | $type.cf.URL | string {
	// eslint-disable-next-line prefer-rest-params
	if (1 === arguments.length && !$isꓺarray(arguments[0])) {
		// eslint-disable-next-line prefer-rest-params
		(names = []), (url = arguments[0] as undefined | URL | $type.cf.URL | string);
	}
	if (!$isꓺarray(names)) {
		names = []; // Force array.
	}
	const rtnObjURL = $isꓺurl(url);
	const objURL = parse(url);

	if (!objURL) {
		return url || ''; // Not possible.
	}
	for (const name of Array.from(objURL.searchParams.keys())) {
		if (!names.length || names.indexOf(name) !== -1) {
			objURL.searchParams.delete(name);
		}
	}
	objURL.searchParams.sort();

	return rtnObjURL ? objURL : objURL.toString();
}

/**
 * Removes (client|cache)-side-only query string variables.
 *
 * @param   url URL to remove query string variables from.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 *
 * @returns     URL with (client|cache)-side-only query string variables removed.
 *
 *   - Returns a {@see URL} if input `url` was a {@see URL}. A string otherwise.
 *
 *
 * @note This function cannot be memoized because the return URL object is likely to be updated by reference.
 */
export function removeCSOQueryVars(url: URL | $type.cf.URL): URL | $type.cf.URL;
export function removeCSOQueryVars(url?: string): string;
export function removeCSOQueryVars(url?: URL | $type.cf.URL | string): URL | $type.cf.URL | string;

export function removeCSOQueryVars(url?: URL | $type.cf.URL | string): URL | $type.cf.URL | string {
	const rtnObjURL = $isꓺurl(url);
	const objURL = parse(url);

	if (!objURL) {
		return url || ''; // Not possible.
	}
	for (const name of Array.from(objURL.searchParams.keys())) {
		if (/^(?:ut[mx]_[a-z_0-9]+|_g[al]|(?:gcl|dcl|msclk|fbcl)(?:id|src)|wbraid|_ck)$/iu.test(name)) {
			objURL.searchParams.delete(name);
		}
	}
	objURL.searchParams.sort();

	return rtnObjURL ? objURL : objURL.toString();
}

/**
 * Encodes a URL component.
 *
 * @param   str      String to encode.
 * @param   strategy Strategy. Default is {@see QUERY_RFC3986}.
 *
 *   - Use {@see QUERY_RFC3986} for {@see rawurlencode()} PHP compatibility.
 *   - Use {@see QUERY_RFC3986_AWS4} for {@see rawurlencode()} PHP w/ AWS v4 compatibility.
 *   - Use {@see QUERY_RFC1738} for {@see urlencode()} PHP compatibility.
 *
 *
 * @returns          Encoded string.
 *
 * @note Inspired by <https://locutus.io/php/url/urlencode/>.
 * @note Inspired by <https://locutus.io/php/url/rawurlencode/>.
 */
export const encode = $moizeꓺsvz({ maxSize: 12 })(
	// Memoized function.
	(str: string, strategy: string = QUERY_RFC3986): string => {
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
	},
);

/**
 * Decodes a URL component.
 *
 * @param   str      String to decode.
 * @param   strategy Strategy. Default is {@see QUERY_RFC3986}.
 *
 *   - Use {@see QUERY_RFC3986} for {@see rawurldecode()} PHP compatibility.
 *   - Use {@see QUERY_RFC3986_AWS4} for {@see rawurldecode()} PHP w/ AWS v4 compatibility.
 *   - Use {@see QUERY_RFC1738} for {@see urldecode()} PHP compatibility.
 *
 *
 * @returns          Decoded string.
 *
 * @note Inspired by <https://locutus.io/php/url/urldecode/>.
 * @note Inspired by <https://locutus.io/php/url/rawurldecode/>.
 */
export const decode = $moizeꓺsvz({ maxSize: 12 })(
	// Memoized function.
	(str: string, strategy: string = QUERY_RFC3986): string => {
		switch (strategy) {
			case QUERY_RFC1738:
				return decodeURIComponent(str.replace(/%(?![0-9a-f]{2})/giu, () => '%25').replace(/\+/gu, '%20'));

			case QUERY_RFC3986:
			case QUERY_RFC3986_AWS4:
			default: // Default strategy.
				return decodeURIComponent(str.replace(/%(?![0-9a-f]{2})/giu, () => '%25'));
		}
	},
);
