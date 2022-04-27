/**
 * Clever Canyon™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Imports and other headers.">

/**
 * Imports.
 *
 * @since 2022-04-25
 */
import { default as uA6tStcUtilities } from './a6t/StcUtilities.js';
import { default as uEnv }             from './Env.js';

// </editor-fold>

/**
 * URL utilities.
 *
 * @since 2022-04-25
 */
export default class uURL extends uA6tStcUtilities {
	/**
	 * Gets current URL.
	 *
	 * @since 2022-04-25
	 *
	 * @returns {string} Current URL.
	 */
	static current() {
		if ( uEnv.isBrowser() ) {
			return location.href;
		} else {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gets current referrer.
	 *
	 * @since 2022-04-25
	 *
	 * @returns {string} Current referrer.
	 */
	static currentReferrer() {
		if ( uEnv.isBrowser() ) {
			return document.referrer;
		} else {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gets current scheme.
	 *
	 * @since 2022-04-25
	 *
	 * @returns {string} Current scheme.
	 */
	static currentScheme() {
		if ( uEnv.isBrowser() ) {
			return location.protocol.toLowerCase().slice( 0, -1 );
		} else {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gets current host.
	 *
	 * @since 2022-04-25
	 *
	 * @param {boolean} withPort Include port? Default is `true`.
	 *
	 * @returns {string} Current host.
	 */
	static currentHost( withPort = true ) {
		if ( uEnv.isBrowser() ) {
			return ( withPort ? location.host : location.hostname ).toLowerCase();
		} else {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gets current root host.
	 *
	 * @since 2022-04-25
	 *
	 * @param {boolean} withPort Include port? Default is `true`.
	 *
	 * @returns {string} Current root host.
	 */
	static currentRootHost( withPort = true ) {
		if ( uEnv.isBrowser() ) {
			return uURL.rootHost( uURL.currentHost( withPort ), withPort );
		} else {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gets current port.
	 *
	 * @since 2022-04-25
	 *
	 * @returns {string} Current port.
	 */
	static currentPort() {
		if ( uEnv.isBrowser() ) {
			return location.port;
		} else {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gets current path.
	 *
	 * @since 2022-04-25
	 *
	 * @returns {string} Current path.
	 */
	static currentPath() {
		if ( uEnv.isBrowser() ) {
			return location.pathname;
		} else {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gets current subpath.
	 *
	 * @since 2022-04-25
	 *
	 * @returns {string} Current subpath.
	 */
	static currentSubpath() {
		if ( uEnv.isBrowser() ) {
			return location.pathname.replace( /^\/|\/$/ug, '' );
		} else {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gets current query string.
	 *
	 * @since 2022-04-25
	 *
	 * @returns {string} Current query string.
	 */
	static currentQuery() {
		if ( uEnv.isBrowser() ) {
			return location.search.slice( 1 );
		} else {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gets current path & query string.
	 *
	 * @since 2022-04-25
	 *
	 * @returns {string} Current path & query string.
	 */
	static currentPathQuery() {
		if ( uEnv.isBrowser() ) {
			return location.pathname + location.search;
		} else {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gets root hostname.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string|URL|undefined} host     Host to parse.
	 *                                        Optional in browser. Default is {@see uURL.current()}.
	 *
	 * @param {boolean}              withPort Include port? Default is `true`.
	 *
	 * @returns {string} Root hostname.
	 */
	static rootHost( host = undefined, withPort = true ) {
		if ( undefined === host ) {
			if ( uEnv.isBrowser() ) {
				host = uURL.currentHost( withPort );
			} else {
				throw new Error( 'Missing required parameter: `host`.' );
			}
		}
		if ( host instanceof URL ) {
			host = host.host; // Includes port number.
		}
		if ( ! withPort && host.indexOf( ':' ) !== -1 ) {
			host = host.slice( 0, host.lastIndexOf( ':' ) );
		}
		return host.toLowerCase().split( '.' ).slice( -2 ).join( '.' );
	}

	/**
	 * Parses a URL string into a {@see URL}.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string|URL|undefined} url            URL to parse.
	 *                                              Optional in browser. Default is {@see uURL.current()}.
	 *
	 * @param {string|URL|undefined} base           Base URL; i.e., in the case of relative URLs.
	 *                                              Optional in browser. Default is {@see uURL.current()}.
	 *
	 * @param {boolean}              throwOnFailure Throw on failure? Default is `true`.
	 *
	 * @returns {?URL} URL; else throws error (or returns `null`) on failure.
	 *                 `throwOnFailure` defaults to `true`, resulting in an error on failure.
	 */
	static parse( url = undefined, base = undefined, throwOnFailure = true ) {
		if ( undefined === url ) {
			if ( uEnv.isBrowser() ) {
				url = uURL.current();
			} else {
				throw new Error( 'Missing required parameter: `url`.' );
			}
		}
		if ( undefined === base && uEnv.isBrowser() ) {
			base = uURL.current(); // Current URL as base.
		}
		if ( url && typeof url === 'string' && /^\/\//u.test( url ) ) {
			const scheme = uEnv.isBrowser() ? uURL.currentScheme() : 'http';
			url          = url.replace( /^\/\//u, scheme + '://' );
		}
		if ( base && typeof base === 'string' && /^\/\//u.test( base ) ) {
			const scheme = uEnv.isBrowser() ? uURL.currentScheme() : 'http';
			base         = base.replace( /^\/\//u, scheme + '://' );
		}
		try {
			return new URL( url, base );
		} catch ( error ) {
			if ( throwOnFailure ) {
				throw error;
			}
			return null;
		}
	}

	/**
	 * Gets a query string variable.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string}               name Query string variable name.
	 * @param {string|URL|undefined} url  URL from which to parse query string variable.
	 *                                    Optional in browser. Default is {@see uURL.current()}.
	 *
	 * @returns {?string} `null` if not found; else query string variable value.
	 */
	static getQueryVar( name, url = undefined ) {
		if ( undefined === url ) {
			if ( uEnv.isBrowser() ) {
				url = uURL.current();
			} else {
				throw new Error( 'Missing required parameter: `url`.' );
			}
		}
		const parsedURL = uURL.parse( url );

		if ( ! parsedURL.searchParams.has( name ) ) {
			return null; // Null when not exists.
		}
		return parsedURL.searchParams.get( name ) || '';
	}

	/**
	 * Gets query string variables.
	 *
	 * @since 2022-04-25
	 *
	 * @param {Array.<string>}   names   Optional array of query string variable names to get; excluding others.
	 *                                   Default is `[]`; i.e., all query string variables.
	 *
	 * @param {string|URL|undefined} url URL from which to parse query string variables.
	 *                                   Optional in browser. Default is {@see uURL.current()}.
	 *
	 * @returns {Object} Query string variables.
	 */
	static getQueryVars( names = [], url = undefined ) {
		if ( 1 === arguments.length
			&& ( 'string' === typeof arguments[ 0 ]
				|| arguments[ 0 ] instanceof URL ) ) {
			url = arguments[ 0 ], names = [];
		}
		if ( undefined === url ) {
			if ( uEnv.isBrowser() ) {
				url = uURL.current();
			} else {
				throw new Error( 'Missing required parameter: `url`.' );
			}
		}
		const vars      = {};// Initialize.
		const parsedURL = uURL.parse( url );

		if ( ! [ ...parsedURL.searchParams ].length ) {
			return vars; // No query string variables.
		}
		for ( const [ name, value ] of parsedURL.searchParams ) {
			vars[ name ] = value; // Populates variables.
		}
		if ( names.length ) {
			for ( const [ name ] of Object.entries( vars ) ) {
				if ( names.indexOf( name ) === -1 ) {
					delete vars[ name ];
				}
			}
		}
		return vars;
	}

	/**
	 * Adds a query string variable to a URL.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string}               name            Query string variable name.
	 * @param {string}               value           Query string variable value.
	 *
	 * @param {string|URL|undefined} url             URL to add query string variable to.
	 *                                               Optional in browser. Default is {@see uURL.current()}.
	 *
	 * @param {boolean}              replaceExisting Optional. Default is `true`.
	 *
	 * @returns {URL|string} Updated URL with query string variable added.
	 *                       Returns a {@see URL} if input `url` was a {@see URL}; else returns a string.
	 */
	static addQueryVar( name, value, url = undefined, replaceExisting = true ) {
		return uURL.addQueryVars( { [ name ] : value }, url, replaceExisting );
	}

	/**
	 * Adds query string variables.
	 *
	 * @since 2022-04-25
	 *
	 * @param {Object}               vars            Query string variables to add.
	 *
	 * @param {string|URL|undefined} url             URL to add query string variables to.
	 *                                               Optional in browser. Default is {@see uURL.current()}.
	 *
	 * @param {boolean}              replaceExisting Optional. Default is `true`.
	 *
	 * @returns {URL|string} URL with query string variables added.
	 *                       Returns a {@see URL} if input `url` was a {@see URL}; else returns a string.
	 */
	static addQueryVars( vars, url = undefined, replaceExisting = true ) {
		if ( undefined === url ) {
			if ( uEnv.isBrowser() ) {
				url = uURL.current();
			} else {
				throw new Error( 'Missing required parameter: `url`.' );
			}
		}
		const rtnURL    = url instanceof URL;
		const parsedURL = uURL.parse( url );

		for ( const [ name, value ] of Object.entries( vars ) ) {
			if ( replaceExisting || ! parsedURL.searchParams.has( name ) ) {
				parsedURL.searchParams.set( name, value );
			}
		}
		parsedURL.searchParams.sort();

		return rtnURL ? parsedURL : parsedURL.toString();
	}

	/**
	 * Removes a query string variable from a URL.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string}               name Query string variable name.
	 *
	 * @param {string|URL|undefined} url  URL to remove query string variable from.
	 *                                    Optional in browser. Default is {@see uURL.current()}.
	 *
	 * @returns {URL|string} Updated URL with query string variable removed.
	 *                       Returns a {@see URL} if input `url` was a {@see URL}; else returns a string.
	 */
	static removeQueryVar( name, url = undefined ) {
		return uURL.removeQueryVars( [ name ], url );
	}

	/**
	 * Removes query string variables.
	 *
	 * @since 2022-04-25
	 *
	 * @param {Array.<string>}       names Optional array of query string variable names to remove.
	 *                                     Default is `[]`; i.e., remove all query string variables.
	 *
	 * @param {string|URL|undefined} url   URL to remove query string variables from.
	 *                                     Optional in browser. Default is {@see uURL.current()}.
	 *
	 * @returns {URL|string} URL with query string variables removed.
	 *                       Returns a {@see URL} if input `url` was a {@see URL}; else returns a string.
	 */
	static removeQueryVars( names = [], url = undefined ) {
		if ( 1 === arguments.length
			&& ( 'string' === typeof arguments[ 0 ]
				|| arguments[ 0 ] instanceof URL ) ) {
			url = arguments[ 0 ], names = [];
		}
		if ( undefined === url ) {
			if ( uEnv.isBrowser() ) {
				url = uURL.current();
			} else {
				throw new Error( 'Missing required parameter: `url`.' );
			}
		}
		const rtnURL    = url instanceof URL;
		const parsedURL = uURL.parse( url );

		for ( const [ name ] of parsedURL.searchParams ) {
			if ( ! names.length || names.indexOf( name ) !== -1 ) {
				parsedURL.searchParams.delete( name );
			}
		}
		parsedURL.searchParams.sort();

		return rtnURL ? parsedURL : parsedURL.toString();
	}

	/**
	 * Removes (client|cache)-side-only query string variables.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string|URL|undefined} url URL to remove query string variables from.
	 *                                   Optional in browser. Default is {@see uURL.current()}.
	 *
	 * @returns {URL|string} URL with (client|cache)-side-only query string variables removed.
	 *                       Returns a {@see URL} if input `url` was a {@see URL}; else returns a string.
	 */
	static removeCSOQueryVars( url = undefined ) {
		if ( undefined === url ) {
			if ( uEnv.isBrowser() ) {
				url = uURL.current();
			} else {
				throw new Error( 'Missing required parameter: `url`.' );
			}
		}
		const rtnURL    = url instanceof URL;
		const parsedURL = uURL.parse( url );

		for ( const [ name ] of parsedURL.searchParams ) {
			if ( /^(?:ut[mx]_[a-z_0-9]+|_g[al]|(?:gcl|dcl|msclk|fbcl)(?:id|src)|wbraid|_ck)$/ui.test( name ) ) {
				parsedURL.searchParams.delete( name );
			}
		}
		parsedURL.searchParams.sort();

		return rtnURL ? parsedURL : parsedURL.toString();
	}
}
