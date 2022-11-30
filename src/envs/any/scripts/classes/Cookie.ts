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
import { default as uObj }             from './Obj';
import { default as uURL }             from './URL';

// </editor-fold>

/**
 * Cookie options.
 *
 * @since 2022-04-25
 */
interface uCookieOptions {
	domain? : string;
	path? : string;
	expires? : number;
	samesite? : string;
	secure? : boolean;
}

/**
 * Cookie utilities.
 *
 * @since 2022-04-25
 */
export default class uCookie extends uA6tStcUtilities {
	/**
	 * Cache.
	 *
	 * @since 2022-04-25
	 */
	protected static cache : {
		cookies? : { [ $ : string ] : string },
		[ $ : string ] : unknown,
	} = {};

	/**
	 * Parses a cookie header.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} [header] Cookie header to parse.
	 *                          Optional in browser. Default is `document.cookie`.
	 *
	 * @returns {object<string,string>} Cookies.
	 */
	public static parse( header? : string ) : { [ $ : string ] : string } {
		let cookies : { [ $ : string ] : string } = {};
		let isBrowserHeader                       = null;

		if ( undefined === header ) {
			if ( uEnv.isWeb() ) {
				isBrowserHeader = true;
				header          = document.cookie;
			} else {
				throw new Error( 'Missing required parameter: `header`.' );
			}
		}
		if ( isBrowserHeader && uCookie.cache.cookies ) {
			return uCookie.cache.cookies;
		}
		if ( isBrowserHeader ) {
			uCookie.cache.cookies = {}; // Initialize.
			cookies               = uCookie.cache.cookies;
		}
		if ( ! header ) {
			return cookies; // Nothing to parse.
		}
		header.split( /\s*;\s*/ ).forEach( ( cookie ) => {
			let name, value; // Initialize.
			const eqIndex = cookie.indexOf( '=' );

			if ( -1 !== eqIndex ) {
				name  = cookie.substring( 0, eqIndex );
				value = cookie.substring( eqIndex + 1 );
			} else {
				[ name, value ] = [ cookie, '' ];
			}
			if ( value.startsWith( '"' ) && value.endsWith( '"' ) ) {
				value = value.slice( 1, -1 );
			}
			cookies[ decodeURIComponent( name ) ] = decodeURIComponent( value );
		} );
		return cookies;
	}

	/**
	 * Cookie exists?
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} name Cookie name.
	 *
	 * @returns {boolean} `true` if cookie exists.
	 */
	public static has( name : string ) : boolean {
		if ( ! uEnv.isWeb() ) {
			throw new Error( 'Not in browser.' );
		}
		return uObj.hasOwn( uCookie.parse(), name );
	}

	/**
	 * Gets a cookie value.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} name Cookie name.
	 *
	 * @returns {string|null} Cookie value; else `null`.
	 */
	public static get( name : string ) : string | null {
		if ( ! uEnv.isWeb() ) {
			throw new Error( 'Not in browser.' );
		}
		const cookies = uCookie.parse();

		if ( ! uObj.hasOwn( cookies, name ) ) {
			return null;
		}
		return cookies[ name ] || '';
	}

	/**
	 * Sets a cookie value.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string}         name         Cookie name.
	 * @param {string}         value        Cookie value.
	 * @param {uCookieOptions} [options={}] Optional. Default is `{}`.
	 *
	 * @returns {boolean} `true` on success.
	 */
	public static set( name : string, value : string, options : uCookieOptions = {} ) : boolean {
		if ( ! uEnv.isWeb() ) {
			throw new Error( 'Not in browser.' );
		}
		if ( ! uCookie.isValidName( name ) ) {
			throw new Error( 'Invalid cookie name: `' + name + '`.' );
		}
		let domain : string           = options.domain || '.' + uURL.currentRootHost( false );
		let path : string             = options.path || '/';
		let expires : number | string = options.expires || 31536000;

		let samesite : string         = options.samesite || 'lax';
		let secure : boolean | string = undefined === options.secure ? ( 'https' === uURL.currentScheme() ) : options.secure;
		secure                        = 'none' === samesite.toLowerCase() ? true : secure;

		domain   = domain ? '; domain=' + domain : '';
		path     = path ? '; path=' + path : '';
		expires  = expires <= -1 ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT' : '; max-age=' + String( expires );
		samesite = samesite ? '; samesite=' + samesite : '';
		secure   = secure ? '; secure' : '';

		// The `httonly` attribute is implied when using JavaScript.
		// {@see https://stackoverflow.com/a/14691716}.

		document.cookie = uURL.encode( name ) + '=' + uURL.encode( value ) + domain + path + expires + samesite + secure;

		if ( uCookie.cache.cookies ) {
			uCookie.cache.cookies[ name ] = value;
		}
		return true;
	}

	/**
	 * Deletes a cookie.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string}         name         Cookie name.
	 * @param {uCookieOptions} [options={}] Optional. Default is `{}`.
	 *
	 * @returns {boolean} `true` on success.
	 */
	public static delete( name : string, options : uCookieOptions = {} ) : boolean {
		if ( ! uEnv.isWeb() ) {
			throw new Error( 'Not in browser.' );
		}
		return uCookie.set( name, '', Object.assign( {}, options || {}, { expires : -1 } ) );
	}

	/**
	 * Is a valid cookie name?
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} name Cookie name.
	 *
	 * @returns {boolean} `true` if valid cookie name.
	 */
	public static isValidName( name : string ) : boolean {
		return /^[a-z0-9_-]+$/ui.test( name ) && ! /^(?:domain|path|expires|max-age|samesite|secure|httponly)$/ui.test( name );
	}
}
