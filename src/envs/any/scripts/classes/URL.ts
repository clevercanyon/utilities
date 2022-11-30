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
import { default as uA6tStcUtilities } from './a6t/StcUtilities';
import { default as uEnv }             from './Env';

// </editor-fold>

/**
 * URL utilities.
 *
 * @since 2022-04-25
 */
export default class uURL extends uA6tStcUtilities {
	/**
	 * RFC 1738 URL encoding strategy.
	 *
	 * @since 2022-04-25
	 */
	public static QUERY_RFC1738 = 'QUERY_RFC1738';

	/**
	 * RFC 3986 URL encoding strategy.
	 *
	 * @since 2022-04-25
	 */
	public static QUERY_RFC3986 = 'QUERY_RFC3986';

	/**
	 * RFC 3986 encoding encoding strategy w/ AWS v4 compat.
	 *
	 * @since 2022-04-25
	 */
	public static QUERY_RFC3986_AWS4 = 'QUERY_RFC3986_AWS4';

	/**
	 * Gets current URL.
	 *
	 * @since 2022-04-25
	 *
	 * @returns {string} Current URL.
	 */
	public static current() : string {
		if ( uEnv.isWeb() ) {
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
	public static currentReferrer() : string {
		if ( uEnv.isWeb() ) {
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
	public static currentScheme() : string {
		if ( uEnv.isWeb() ) {
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
	 * @param {boolean} [withPort=true] Include port?
	 *
	 * @returns {string} Current host.
	 */
	public static currentHost( withPort : boolean = true ) : string {
		if ( uEnv.isWeb() ) {
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
	 * @param {boolean} [withPort=true] Include port?
	 *
	 * @returns {string} Current root host.
	 */
	public static currentRootHost( withPort : boolean = true ) : string {
		if ( uEnv.isWeb() ) {
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
	public static currentPort() : string {
		if ( uEnv.isWeb() ) {
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
	public static currentPath() : string {
		if ( uEnv.isWeb() ) {
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
	public static currentSubpath() : string {
		if ( uEnv.isWeb() ) {
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
	public static currentQuery() : string {
		if ( uEnv.isWeb() ) {
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
	public static currentPathQuery() : string {
		if ( uEnv.isWeb() ) {
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
	 * @param {URL|string|null} [host]          Host to parse.
	 *                                          Optional in browser; i.e., default is {@see uURL.current()}.
	 *
	 * @param {boolean}         [withPort=true] Include port? Default is `true`.
	 *
	 * @returns {string} Root hostname.
	 */
	public static rootHost( host? : URL | string | null, withPort : boolean = true ) : string {
		if ( undefined === host ) {
			if ( uEnv.isWeb() ) {
				host = uURL.currentHost( withPort );
			} else {
				throw new Error( 'Missing required parameter: `host`.' );
			}
		}
		if ( host instanceof URL ) {
			host = host.host; // Includes port.
		}
		host = host || ''; // Force string value.

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
	 * @param {URL|string|null} [url]                 URL to parse.
	 *                                                Optional in browser; i.e., default is {@see uURL.current()}.
	 *
	 * @param {URL|string|null} [base]                Base URL. Required in the case of relative URLs.
	 *                                                Optional in browser; i.e., default is {@see uURL.current()}.
	 *
	 * @param {boolean}         [throwOnFailure=true] Throw on failure? Default is `true`.
	 *
	 * @returns {URL|null} {@see URL}; else throws error (or returns {@see null}) on failure.
	 *                     `throwOnFailure` defaults to `true`, resulting in an error on failure.
	 */
	public static parse( url? : URL | string | null, base? : URL | string | null, throwOnFailure : boolean = true ) : URL | null {
		if ( undefined === url ) {
			if ( uEnv.isWeb() ) {
				url = uURL.current();
			} else {
				throw new Error( 'Missing required parameter: `url`.' );
			}
		}
		if ( undefined === base && uEnv.isWeb() ) {
			base = uURL.current(); // Current URL as base.
		}
		url  = ( url instanceof URL ? url.toString() : url ) || '';
		base = ( base instanceof URL ? base.toString() : base ) || undefined;

		if ( url && /^\/\//u.test( url ) ) {
			const scheme = uEnv.isWeb() ? uURL.currentScheme() : 'http';
			url          = url.replace( /^\/\//u, scheme + '://' );
		}
		if ( base && /^\/\//u.test( base ) ) {
			const scheme = uEnv.isWeb() ? uURL.currentScheme() : 'http';
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
	 * @param {string}          name  Query string variable name.
	 *
	 * @param {URL|string|null} [url] URL from which to parse query string variable.
	 *                                Optional in browser; i.e., default is {@see uURL.current()}.
	 *
	 * @returns {string|null} `null` if not found; else query `string` variable value.
	 */
	public static getQueryVar( name : string, url? : URL | string | null ) : string | null {
		const parsedURL = uURL.parse( url );

		if ( ! parsedURL || ! parsedURL.searchParams.has( name ) ) {
			return null; // Null when not exists.
		}
		return parsedURL.searchParams.get( name ) || '';
	}

	/**
	 * Gets query string variables.
	 *
	 * @since 2022-04-25
	 *
	 * @param {array<string>|URL|string|null} [names=[]] Optional array of query string variable names to get; excluding others.
	 *                                                   Default is `[]`; i.e., get all query string variables.
	 *
	 *                                                       * If only one parameter is given and it's not an array,
	 *                                                         this parameter is treated as the `url` parameter instead of `names`.
	 *
	 * @param {URL|string|null} [url]                    URL from which to parse query string variables.
	 *                                                   Optional in browser; i.e., default is {@see uURL.current()}.
	 *
	 * @returns {object<string,string>} Query string variables.
	 */
	public static getQueryVars( url? : URL | string | null ) : { [ $ : string ] : string };
	public static getQueryVars( names : Array<string> | URL | string | null, url? : URL | string | null ) : { [ $ : string ] : string };

	public static getQueryVars( names : Array<string> | URL | string | null = [], url? : URL | string | null ) : { [ $ : string ] : string } {
		if ( 1 === arguments.length && ! ( arguments[ 0 ] instanceof Array ) ) {
			url = arguments[ 0 ] as URL | string | null | undefined, names = [];
		}
		if ( ! ( names instanceof Array ) ) {
			names = []; // Force array.
		}
		const vars : { [ $ : string ] : string } = {};
		const parsedURL                          = uURL.parse( url );

		if ( ! parsedURL || ! [ ...parsedURL.searchParams ].length ) {
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
	 * @param {string}          name                   Query string variable name.
	 * @param {string}          value                  Query string variable value.
	 *
	 * @param {URL|string|null} [url]                  URL to add query string variable to.
	 *                                                 Optional in browser; i.e., default is {@see uURL.current()}.
	 *
	 * @param {boolean}         [replaceExisting=true] Optional. Default is `true`.
	 *
	 * @returns {URL|string} Updated URL with query string variable added.
	 *                       Returns a {@see URL} if input `url` was a {@see URL}; else returns a {@see string}.
	 */
	public static addQueryVar( name : string, value : string, url : URL, replaceExisting : boolean ) : URL;
	public static addQueryVar( name : string, value : string, url? : string | null, replaceExisting? : boolean ) : string;
	public static addQueryVar( name : string, value : string, url? : URL | string | null, replaceExisting? : boolean ) : URL | string;

	public static addQueryVar( name : string, value : string, url? : URL | string | null, replaceExisting : boolean = true ) : URL | string {
		return uURL.addQueryVars( { [ name ] : value }, url, replaceExisting );
	}

	/**
	 * Adds query string variables.
	 *
	 * @since 2022-04-25
	 *
	 * @param {object<string,string>} vars                   Query string variables to add.
	 *
	 * @param {URL|string|null}       [url]                  URL to add query string variables to.
	 *                                                       Optional in browser; i.e., default is {@see uURL.current()}.
	 *
	 * @param {boolean}               [replaceExisting=true] Optional. Default is `true`.
	 *
	 * @returns {URL|string} URL with query string variables added.
	 *                       Returns a {@see URL} if input `url` was a {@see URL}; else returns a {@see string}.
	 */
	public static addQueryVars( vars : { [ $ : string ] : string }, url : URL, replaceExisting : boolean ) : URL;
	public static addQueryVars( vars : { [ $ : string ] : string }, url? : string | null, replaceExisting? : boolean ) : string;
	public static addQueryVars( vars : { [ $ : string ] : string }, url? : URL | string | null, replaceExisting? : boolean ) : URL | string;

	public static addQueryVars( vars : { [ $ : string ] : string }, url? : URL | string | null, replaceExisting : boolean = true ) : URL | string {
		const rtnURL    = url instanceof URL;
		const parsedURL = uURL.parse( url );

		if ( ! parsedURL ) {
			return url || ''; // Not possible.
		}
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
	 * @param {string}          name  Query string variable name.
	 *
	 * @param {URL|string|null} [url] URL to remove query string variable from.
	 *                                Optional in browser; i.e., default is {@see uURL.current()}.
	 *
	 * @returns {URL|string} Updated URL with query string variable removed.
	 *                       Returns a {@see URL} if input `url` was a {@see URL}; else returns a {@see string}.
	 */
	public static removeQueryVar( name : string, url : URL ) : URL;
	public static removeQueryVar( name : string, url? : string | null ) : string;
	public static removeQueryVar( name : string, url? : URL | string | null ) : URL | string;

	public static removeQueryVar( name : string, url? : URL | string | null ) : URL | string {
		return uURL.removeQueryVars( [ name ], url );
	}

	/**
	 * Removes query string variables.
	 *
	 * @since 2022-04-25
	 *
	 * @param {array<string>|URL|string|null} [names=[]] Optional array of query string variable names to remove.
	 *                                                   Default is `[]`; i.e., remove all query string variables.
	 *
	 *                                                       * If only one parameter is given and it's not an array,
	 *                                                         this parameter is treated as the `url` parameter instead of `names`.
	 *
	 * @param {URL|string|null}               [url]      URL to remove query string variables from.
	 *                                                   Optional in browser; i.e., default is {@see uURL.current()}.
	 *
	 * @returns {URL|string} URL with query string variables removed.
	 *                       Returns a {@see URL} if input `url` was a {@see URL}; else returns a {@see string}.
	 */
	public static removeQueryVars( url : URL ) : URL;
	public static removeQueryVars( url? : string | null ) : string;
	public static removeQueryVars( url? : URL | string | null ) : URL | string;

	public static removeQueryVars( names : Array<string>, url : URL ) : URL;
	public static removeQueryVars( names : Array<string>, url? : string | null ) : string;
	public static removeQueryVars( names : Array<string>, url? : URL | string | null ) : URL | string;

	public static removeQueryVars( names : Array<string> | URL | string | null = [], url? : URL | string | null ) : URL | string {
		if ( 1 === arguments.length && ! ( arguments[ 0 ] instanceof Array ) ) {
			url = arguments[ 0 ] as URL | string | null | undefined, names = [];
		}
		if ( ! ( names instanceof Array ) ) {
			names = []; // Force array.
		}
		const rtnURL    = url instanceof URL;
		const parsedURL = uURL.parse( url );

		if ( ! parsedURL ) {
			return url || ''; // Not possible.
		}
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
	 * @param {URL|string|null} [url] URL to remove query string variables from.
	 *                                Optional in browser; i.e., default is {@see uURL.current()}.
	 *
	 * @returns {URL|string} URL with (client|cache)-side-only query string variables removed.
	 *                       Returns a {@see URL} if input `url` was a {@see URL}; else returns a {@see string}.
	 */
	public static removeCSOQueryVars( url : URL ) : URL;
	public static removeCSOQueryVars( url? : string | null ) : string;
	public static removeCSOQueryVars( url? : URL | string | null ) : URL | string;

	public static removeCSOQueryVars( url? : URL | string | null ) : URL | string {
		const rtnURL    = url instanceof URL;
		const parsedURL = uURL.parse( url );

		if ( ! parsedURL ) {
			return url || ''; // Not possible.
		}
		for ( const [ name ] of parsedURL.searchParams ) {
			if ( /^(?:ut[mx]_[a-z_0-9]+|_g[al]|(?:gcl|dcl|msclk|fbcl)(?:id|src)|wbraid|_ck)$/ui.test( name ) ) {
				parsedURL.searchParams.delete( name );
			}
		}
		parsedURL.searchParams.sort();

		return rtnURL ? parsedURL : parsedURL.toString();
	}

	/**
	 * Encodes a URL component.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} str                             String to encode.
	 * @param {string} [strategy={uURL.QUERY_RFC3986}] Strategy. Default is {@see uURL.QUERY_RFC3986}.
	 *                                                 * Use {@see uURL.QUERY_RFC3986} for {@see rawurlencode()} PHP compatibility.
	 *                                                 * Use {@see uURL.QUERY_RFC3986_AWS4} for {@see rawurlencode()} PHP w/ AWS v4 compatibility.
	 *                                                 * Use {@see uURL.QUERY_RFC1738} for {@see urlencode()} PHP compatibility.
	 *
	 * @return {string} Encoded string.
	 *
	 * @see https://locutus.io/php/url/urlencode/
	 * @see https://locutus.io/php/url/rawurlencode/
	 */
	public static encode( str : string, strategy : string = uURL.QUERY_RFC3986 ) : string {
		switch ( strategy ) {
			case uURL.QUERY_RFC1738:
				return encodeURIComponent( str ).replace( /[!'()*~]/ug, function ( c ) {
					return '%' + c.charCodeAt( 0 ).toString( 16 ).toUpperCase();
				} ).replace( /%20/ug, '+' );

			case uURL.QUERY_RFC3986:
			case uURL.QUERY_RFC3986_AWS4:
			default: // Default strategy.
				return encodeURIComponent( str ).replace( /[!'()*]/g, function ( c ) {
					return '%' + c.charCodeAt( 0 ).toString( 16 ).toUpperCase();
				} );
		}
	}

	/**
	 * Decodes a URL component.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} str                             String to decode.
	 * @param {string} [strategy={uURL.QUERY_RFC3986}] Strategy. Default is {@see uURL.QUERY_RFC3986}.
	 *                                                 * Use {@see uURL.QUERY_RFC3986} for {@see rawurldecode()} PHP compatibility.
	 *                                                 * Use {@see uURL.QUERY_RFC3986_AWS4} for {@see rawurldecode()} PHP w/ AWS v4 compatibility.
	 *                                                 * Use {@see uURL.QUERY_RFC1738} for {@see urldecode()} PHP compatibility.
	 *
	 * @return {string} Decoded string.
	 *
	 * @see https://locutus.io/php/url/urldecode/
	 * @see https://locutus.io/php/url/rawurldecode/
	 */
	public static decode( str : string, strategy : string = uURL.QUERY_RFC3986 ) : string {
		switch ( strategy ) {
			case uURL.QUERY_RFC1738:
				return decodeURIComponent( str.replace( /%(?![0-9a-f]{2})/ugi, () => '%25' ).replace( /\+/ug, '%20' ) );

			case uURL.QUERY_RFC3986:
			case uURL.QUERY_RFC3986_AWS4:
			default: // Default strategy.
				return decodeURIComponent( str.replace( /%(?![0-9a-f]{2})/ugi, () => '%25' ) );
		}
	}
}
