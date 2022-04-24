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
 * @since 2021-12-15
 */
// Nothing at this time.

// </editor-fold>

/**
 * Web utilities.
 *
 * @since 2022-02-26
 */
class Utilities {
	// Properties.

	/**
	 * Cache.
	 *
	 * @since 2022-02-26
	 *
	 * @type {Object} Cache.
	 */
	#cache = {};

	// Event utilities.

	/**
	 * Fires a call on document ready state.
	 *
	 * @param {Function} callback Callback.
	 */
	onDocReady( callback ) {
		if ( 'loading' !== document.readyState ) {
			callback();
		} else {
			document.addEventListener( 'DOMContentLoaded', callback );
		}
	}

	/**
	 * Handles a delegated event by firing a callback.
	 *
	 * @param {Event} event Event.
	 * @param {string} selector Selector.
	 * @param {Function} callback Callback.
	 */
	doDelegatedEvent( event, selector, callback ) {
		if ( event.target instanceof Element && event.target.matches( selector ) ) {
			callback( event.target, event );
		}
	}

	// Escape utilities.

	/**
	 * Escapes regexp dynamics.
	 *
	 * @param {string} str String to escape.
	 *
	 * @returns {string} Escaped string.
	 */
	escRegexp( str ) {
		return str.replace( /[.*+?^${}()|[\]\\-]/g, '\\$&' );
	}

	/**
	 * Escapes an element selector.
	 *
	 * @param {string} str String to escape.
	 *
	 * @returns {string} Escaped string.
	 */
	escSelector( str ) {
		return str.replace( /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\\\$&' );
	}

	/**
	 * Escapes a string for use in HTML.
	 *
	 * @param {string} str String to escape.
	 *
	 * @returns {string} Escaped string.
	 */
	escHtml( str ) {
		const entityMap = {
			'&'  : '&amp;',
			'<'  : '&lt;',
			'>'  : '&gt;',
			'"'  : '&quot;',
			'\'' : '&#39;',
		};
		return str.replace( /[&<>"']/g, ( char ) => {
			return entityMap[ char ];
		} );
	}

	// Time utilities.

	/**
	 * Converts `YYYY-MM-DD` into a unix timestamp.
	 *
	 * @param {string} ymd `YYYY-MM-DD` date.
	 *
	 * @returns {number} Unix timestamp.
	 */
	ymdTime( ymd ) {
		return this.ymdHisTime( ymd );
	}

	/**
	 * Converts `YYYY-MM-DD HH:II::SS` into a unix timestamp.
	 *
	 * @param {string} ymd `YYYY-MM-DD HH:II::SS` date & time.
	 *
	 * @returns {number} Unix timestamp.
	 */
	ymdHisTime( ymdHis ) {
		const parts = ymdHis.split( ' ', 2 );

		parts[ 0 ] = parts[ 0 ] || '1970-01-01';
		parts[ 1 ] = parts[ 1 ] || '00:00:00';

		return Math.round( Date.parse( parts[ 0 ] + 'T' + parts[ 1 ] + '.000Z' ) / 1000 );
	}

	/**
	 * Gets current unix timestamp.
	 *
	 * @returns {number} Current unix timestamp.
	 */
	currentTime() {
		return Math.round( new Date().getTime() / 1000 );
	}

	// UUID utilities.

	/**
	 * Generates a v4 UUID.
	 *
	 * @param {boolean} optimize Optimize? Default is `true`.
	 *
	 * @returns {string} Version 4 UUID (32 bytes optimized, 36 unoptimized).
	 */
	uuidV4( optimize = true ) {
		const uuid_v4 = ( [ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11 ).replace( /[018]/g, ( c ) => {
			return ( c ^ ( crypto.getRandomValues( new Uint8Array( 1 ) )[ 0 ] & ( 15 >> ( c / 4 ) ) ) ).toString( 16 );
		} );
		return optimize ? uuid_v4.replace( /-/g, '' ) : uuid_v4;
	}

	// Debounce utilities.

	/**
	 * Debounce handler.
	 *
	 * @param {Function} callback Callback.
	 * @param {number} delay Optional delay. Default is `100`.
	 * @param {boolean} immediate Immediate? Default is `false`.
	 *
	 * @returns {Function} Debouncer.
	 */
	debounce( callback, delay = 100, immediate = false ) {
		let timeout;

		return () => {
			const _this = this;
			const args  = arguments;

			const afterDelay = () => {
				if ( ! immediate ) {
					callback.apply( _this, args );
				}
				timeout = null;
			};

			if ( timeout ) {
				clearTimeout( timeout );
			} else if ( immediate ) {
				callback.apply( _this, args );
			}
			timeout = setTimeout( afterDelay, delay );
		};
	}

	// Cookie utilities.

	/**
	 * Gets cookies.
	 *
	 * @since 2022-02-26
	 *
	 * @returns {Object} Cookies.
	 */
	cookies() {
		if ( this.#cache.cookies ) {
			return this.#cache.cookies;
		}
		const header        = document.cookie;
		this.#cache.cookies = {}; // Initialize.

		if ( ! header ) {
			return this.#cache.cookies;
		}
		header.split( /\s*;\s*/ ).forEach( ( cookie ) => {
			let name, value; // Initialize.
			let eqIndex = cookie.indexOf( '=' );

			if ( -1 !== eqIndex ) {
				name  = cookie.substring( 0, eqIndex );
				value = cookie.substring( eqIndex + 1 );
			} else {
				[ name, value ] = [ cookie, '' ];
			}
			if ( value.startsWith( '"' ) && value.endsWith( '"' ) ) {
				value = value.slice( 1, -1 );
			}
			this.#cache.cookies[ decodeURIComponent( name ) ] = decodeURIComponent( value );
		} );
		return this.#cache.cookies;
	}

	/**
	 * Cookie exists?
	 *
	 * @param {string} name Cookie name.
	 *
	 * @returns {boolean} `true` if cookie exists.
	 */
	hasCookie( name ) {
		return Object.hasOwn( this.cookies(), name );
	}

	/**
	 * Gets a cookie value.
	 *
	 * @param {string} name Cookie name.
	 *
	 * @returns {?string} Cookie value; else `null`.
	 */
	getCookie( name ) {
		const cookies = this.cookies();

		if ( ! Object.hasOwn( cookies, name ) ) {
			return null;
		}
		return cookies[ name ] || '';
	}

	/**
	 * Sets a cookie value.
	 *
	 * @param {string} name Cookie name.
	 * @param {string} value Cookie value.
	 * @param {Object} options Optional cookie options. Default is `{}`.
	 *
	 * @returns {boolean} `true` on success.
	 */
	setCookie( name, value, options = {} ) {
		if ( ! this.isValidCookieName( name ) ) {
			throw 'Invalid cookie name: `' + name + '`.';
		}
		let domain  = options.domain || '.' + this.rootHostname();
		let path    = options.path || '/'; // Entire site.
		let expires = options.expires || 31536000;

		let samesite = options.samesite || 'lax';
		let secure   = undefined === options.secure ? ( 'https:' === location.protocol.toLowerCase() ) : options.secure;
		secure       = 'none' === samesite.toLowerCase() ? true : secure;

		( domain = '; domain=' + domain ), ( path = '; path=' + path );
		expires  = expires <= -1 ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT' : '; max-age=' + expires;
		samesite = '; samesite=' + samesite;
		secure   = secure ? '; secure' : '';

		document.cookie = encodeURIComponent( name ) + '=' + encodeURIComponent( value ) + domain + path + expires + samesite + secure;
		if ( this.#cache.cookies ) {
			this.#cache.cookies[ name ] = value;
		}
		return true;
	}

	/**
	 * Deletes a cookie.
	 *
	 * @param {string} name Cookie name.
	 * @param {string} value Optional cookie value. Default is ``.
	 * @param {Object} options Optional cookie options. Default is `{}`.
	 *
	 * @returns {boolean} `true` on success.
	 */
	deleteCookie( name, value = '', options = {} ) {
		return this.setCookie( name, value, Object.assign( {}, options || {}, { expires : -1 } ) );
	}

	/**
	 * Is a valid cookie name?
	 *
	 * @param {string} name Cookie name.
	 *
	 * @returns {boolean} `true` if valid cookie name.
	 */
	isValidCookieName( name ) {
		return name && /^[a-z0-9_-]+$/i.test( name ) && ! /^(?:domain|path|expires|max-age|samesite|secure|httponly)$/i.test( name );
	}

	// HTTP utilities.

	/**
	 * Can use Beacon API?
	 *
	 * @returns {boolean} `true` if can use Beacon API.
	 */
	canSendBeacon() {
		return 'function' === typeof navigator.sendBeacon;
	}

	// URL utilities.

	/**
	 * Gets root hostname.
	 *
	 * @returns {string} Root hostname.
	 */
	rootHostname() {
		return location.hostname.toLowerCase().split( '.' ).slice( -2 ).join( '.' );
	}

	/**
	 * Parses a URL into parts.
	 *
	 * @param {string} url Optional URL to parse. Default is current URL.
	 * @param {string} base Optional base URL. Default is current URL.
	 *
	 * @returns {?URL} URL; else `null` on failure.
	 */
	parseURL( url = location.href, base = location.href ) {
		try {
			return new URL( url.replace( /^\/\//, location.protocol + '//' ), base );
		} catch ( error ) {
			return null; // Not possible.
		}
	}

	/**
	 * Gets a query variable.
	 *
	 * @param {string} name Query variable name.
	 * @param {string} url Optional URL from which to parse. Default is current URL.
	 *
	 * @returns {?string} Query variable value; else `null`.
	 */
	getQueryVar( name, url = location.href ) {
		const queryVars = this.getQueryVars( url );
		return undefined === queryVars[ name ] ? null : ( queryVars[ name ] || '' );
	}

	/**
	 * Gets all query variables.
	 *
	 * @param {Array.<string>} names Optional array of query variable names. Default is `[]` (all names).
	 * @param {string} url Optional URL from which to parse. Default is current URL.
	 *
	 * @returns {Object} Query variables.
	 */
	getQueryVars( names = [], url = location.href ) {
		if ( 1 === arguments.length && 'string' === typeof arguments[ 0 ] ) {
			url = arguments[ 0 ], names = [];
		}
		const queryVars = {}; // Initialize.
		const cacheKey  = url + '|' + JSON.stringify( names.sort() );
		const cache     = this.#cache.getQueryVars || { last : { key : '', queryVars : {} } };

		if ( cache.last.key === cacheKey ) {
			return cache.last.queryVars;
		}
		if ( ! ( url = this.parseURL( url ) ) || ! url.searchParams ) {
			cache.last.key = cacheKey , cache.last.queryVars = {};
			return cache.last.queryVars;
		}
		url.searchParams.forEach( ( value, name ) => {
			queryVars[ name ] = value;
		} );
		if ( names.length ) {
			for ( let _name in queryVars ) {
				if ( -1 === names.indexOf( _name ) ) {
					delete queryVars[ _name ];
				}
			}
		}
		cache.last.key = cacheKey,
			cache.last.queryVars = queryVars;

		return queryVars;
	}

	/**
	 * Adds query variable to a URL.
	 *
	 * @param {string} name Query variable name.
	 * @param {string} value Query variable value.
	 * @param {string} url Optional URL to add variable to. Default is current URL.
	 * @param {boolean} replaceExisting Optional. Default is `true`.
	 *
	 * @returns {string} Updated URL, else `` on failure.
	 */
	addQueryVar( name, value, url = location.href, replaceExisting = true ) {
		if ( ! ( url = this.parseURL( url ) ) || ! url.searchParams ) {
			return ''; // Not possible.
		}
		if ( replaceExisting || ! url.searchParams.has( name ) ) {
			url.searchParams.set( name, value );
		}
		return url.toString();
	}

	// Element utilities.

	/**
	 * Attaches an element to `<head>`.
	 *
	 * @param {Element} element Element to attach.
	 */
	attachToHead( element ) {
		document.getElementsByTagName( 'head' )[ 0 ].appendChild( element );
	}

	/**
	 * Attaches an element to `<body>`.
	 *
	 * @param {Element} element Element to attach.
	 */
	attachToBody( element ) {
		document.getElementsByTagName( 'body' )[ 0 ].appendChild( element );
	}

	/**
	 * Attaches a `<script>` to `<body>`.
	 *
	 * @param {string} src Script source.
	 * @param {Object} attrs Optional attributes. Default is `{}`.
	 */
	attachScript( src, attrs = {} ) {
		this.attachToBody( this.createElement( 'script', Object.assign( {}, attrs, { src : src, async : true } ) ) );
	}

	/**
	 * Create a new HTML element.
	 *
	 * @param {string} tag Tag name.
	 * @param {Object} attrs Optional attributes. Default is `{}`.
	 *
	 * @return {Element} HTML element.
	 */
	createElement( tag, attrs = {} ) {
		const element = document.createElement( tag );

		for ( let attr in attrs ) {
			element.setAttribute( attr, attrs[ attr ] );
		}
		return element;
	}
}

window.clevercanyon               = window.clevercanyon || {};
window.clevercanyon.web           = window.clevercanyon.web || {};
window.clevercanyon.web.utilities = window.clevercanyon.web.utilities || new Utilities();
