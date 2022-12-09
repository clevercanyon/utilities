/**
 * Utility class.
 */

import $Env from './Env';
import $Str from './Str';
import $URL from './URL';

/**
 * Request config.
 */
interface $HTTPRequestConfig {}

/**
 * Response config.
 */
interface $HTTPResponseConfig {
	response? : Response;
	status? : number;
	body? : BodyInit | null;
	headers? : Headers | { [ x : string ] : string };
	appendHeaders? : Headers | { [ x : string ] : string };
	enableCORs? : boolean;
	enableCDN? : boolean;
}

/**
 * HTTP utilities.
 */
export default class $HTTP {
	/**
	 * HTTP request config.
	 *
	 * @param config Optional config options.
	 *
	 * @return HTTP request config.
	 */
	public static requestConfig( config : $HTTPRequestConfig = {} ) : $HTTPRequestConfig {
		return Object.assign( {}, config );
	}

	/**
	 * Prepares an HTTP request.
	 *
	 * @param request HTTP request object.
	 * @param config  Optional config options.
	 *
	 * @return HTTP response.
	 */
	public static prepareRequest( request : Request, config : $HTTPRequestConfig = {} ) : Request {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars -- `config` ok.
		config = $HTTP.requestConfig( config );

		const cleanURL  = $URL.removeCSOQueryVars( request.url );
		const parsedURL = $URL.parse( cleanURL );

		if ( ! parsedURL ) {
			throw 'Parse failure. Invalid request URL.';
		}
		const requestHasOrigin     = request.headers.has( 'origin' );
		const requestIsUserDynamic = $HTTP.requestIsFromUser( request )
			&& $HTTP.requestPathIsDynamic( request, parsedURL );

		if ( requestHasOrigin ) {
			const _ck = parsedURL.searchParams.get( '_ck' ) || '';
			parsedURL.searchParams.set( '_ck', ( _ck ? _ck + ';' : '' ) + 'origin:' + ( request.headers.get( 'origin' ) || '' ) );
		}
		if ( requestIsUserDynamic ) {
			const _ck = parsedURL.searchParams.get( '_ck' ) || '';
			parsedURL.searchParams.set( '_ck', ( _ck ? _ck + ';' : '' ) + 'user-dynamic:true' );
		}
		parsedURL.searchParams.sort(); // Query sort optimizes cache.

		return new Request( parsedURL.toString(), request );
	}

	/**
	 * HTTP response config.
	 *
	 * @param config Optional config options.
	 *
	 * @return HTTP response config.
	 */
	public static responseConfig( config : $HTTPResponseConfig = {} ) : $HTTPResponseConfig {
		return Object.assign( {
			response      : null,
			status        : 500,
			body          : null,
			headers       : {},
			appendHeaders : {},
			enableCORs    : false,
			enableCDN     : ! $Env.isCfw(),
		}, config );
	}

	/**
	 * Prepares an HTTP response.
	 *
	 * @param request HTTP request object.
	 * @param config  Optional config options.
	 *
	 * @return HTTP response.
	 */
	public static prepareResponse( request : Request, config : $HTTPResponseConfig = {} ) : Response {
		config        = $HTTP.responseConfig( config );
		config.status = config.status || 500;

		if ( config.response ) {
			config.status = config.response.status,
				config.body = config.response.body;

			$HTTP.prepareResponseHeaders( request, config );
			return config.response; // Configured response.
		}
		if ( config.enableCORs && 'OPTIONS' === request.method ) {
			config.status = 204; // No content for CORs preflight requests.
		}
		return new Response( $HTTP.requestNeedsContentBody( request, config.status ) ? config.body : null, {
			status     : config.status,
			statusText : $HTTP.responseStatusText( config.status ),
			headers    : $HTTP.prepareResponseHeaders( request, config ),
		} );
	}

	/**
	 * Prepares HTTP response headers.
	 *
	 * @param request HTTP request object.
	 * @param config  Optional config options.
	 *
	 * @return HTTP response headers.
	 */
	public static prepareResponseHeaders( request : Request, config : $HTTPResponseConfig = {} ) : Headers {
		config        = $HTTP.responseConfig( config );
		config.status = config.status || 500;

		const parsedURL = $URL.parse( request.url );

		config.headers = config.headers instanceof Headers
			? config.headers : new Headers( config.headers || {} );

		config.appendHeaders = config.appendHeaders instanceof Headers
			? config.appendHeaders : new Headers( config.appendHeaders || {} );

		// eslint-disable-next-line prefer-const -- `let` OK.
		let existingHeaders : { [ x : string ] : string } = {};

		// eslint-disable-next-line prefer-const -- `let` OK.
		let alwaysOnHeaders : { [ x : string ] : string } = {};

		// eslint-disable-next-line prefer-const -- `let` OK.
		let contentHeaders : { [ x : string ] : string } = {};

		// eslint-disable-next-line prefer-const -- `let` OK.
		let cacheHeaders : { [ x : string ] : string } = {};

		let securityHeaders : { [ x : string ] : string } = {};
		let corsHeaders : { [ x : string ] : string }     = {};

		// Existing response headers.

		if ( config.response ) { // Extracts existing headers.
			existingHeaders = $HTTP.extractHeaders( config.response.headers );
		}
		// Always-on headers.

		alwaysOnHeaders[ 'date' ] = ( new Date() ).toUTCString();

		if ( 503 === config.status ) {
			alwaysOnHeaders[ 'retry-after' ] = '300';
		}
		// Content-related headers.

		if ( $HTTP.requestNeedsContentHeaders( request, config.status || 0 ) ) {
			contentHeaders[ 'x-ua-compatible' ] = 'IE=edge';
		}
		// Cache control and related headers.

		cacheHeaders[ 'vary' ] = 'origin, accept, accept-language, accept-encoding';

		if ( ! $HTTP.requestHasCacheableMethod( request ) || config.status >= 300 ) {
			cacheHeaders[ 'cdn-cache-control' ] = 'no-store';
			cacheHeaders[ 'cache-control' ]     = 'no-store';

		} else if ( $HTTP.requestPathIsSEORelatedFile( request, parsedURL ) ) {
			cacheHeaders[ 'cdn-cache-control' ] = 'public, must-revalidate, max-age=86400, stale-while-revalidate=86400, stale-if-error=86400';
			cacheHeaders[ 'cache-control' ]     = 'public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=86400';

		} else if ( $HTTP.requestPathIsStatic( request, parsedURL ) && ( config.response?.headers.has( 'etag' ) || config.headers.has( 'etag' ) ) ) {
			cacheHeaders[ 'cdn-cache-control' ] = 'public, must-revalidate, max-age=31536000, stale-while-revalidate=604800, stale-if-error=604800';
			cacheHeaders[ 'cache-control' ]     = 'public, must-revalidate, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800, stale-if-error=604800';

		} else if ( $HTTP.requestPathIsInAdmin( request, parsedURL ) || $HTTP.requestIsFromUser( request ) ) {
			cacheHeaders[ 'cdn-cache-control' ] = 'no-store';
			cacheHeaders[ 'cache-control' ]     = 'no-store';

		} else {
			cacheHeaders[ 'cdn-cache-control' ] = 'public, must-revalidate, max-age=41400, stale-while-revalidate=1800, stale-if-error=1800';
			cacheHeaders[ 'cache-control' ]     = 'no-store';
		}
		if ( ! config.enableCDN || config.headers.has( 'cache-control' ) ) {
			delete existingHeaders[ 'cdn-cache-control' ];
			delete cacheHeaders[ 'cdn-cache-control' ];
		}
		// Security-related headers.

		if ( $Env.isC10n() ) {
			securityHeaders = {
				'x-frame-options'              : 'SAMEORIGIN',
				'x-content-type-options'       : 'nosniff',
				'cross-origin-embedder-policy' : 'unsafe-none',
				'cross-origin-opener-policy'   : 'same-origin',
				'cross-origin-resource-policy' : 'same-origin',
				'referrer-policy'              : 'strict-origin-when-cross-origin',
				'strict-transport-security'    : 'max-age=15552000; includeSubDomains; preload',
				'content-security-policy'      : 'report-uri https://clevercanyon.report-uri.com/r/d/csp/enforce; report-to csp; upgrade-insecure-requests; base-uri \'self\'; frame-ancestors \'self\'; default-src * data: blob: mediastream: \'report-sample\'; style-src * data: blob: \'unsafe-inline\' \'report-sample\'; object-src \'none\'; script-src blob: \'self\' \'unsafe-inline\' \'unsafe-eval\' \'report-sample\' *.wobots.com *.stripe.com *.cloudflare.com *.cloudflareinsights.com *.google.com *.googletagmanager.com *.google-analytics.com *.googleadservices.com googleads.g.doubleclick.net *.cookie-script.com;',
				'permissions-policy'           : 'accelerometer=(self), ambient-light-sensor=(self), autoplay=(self), battery=(self), camera=(self), clipboard-read=(self), clipboard-write=(self), conversion-measurement=(self), cross-origin-isolated=(self), display-capture=(self), document-domain=(self), encrypted-media=(self), execution-while-not-rendered=(self), execution-while-out-of-viewport=(self), focus-without-user-activation=(self), fullscreen=(self), gamepad=(self), geolocation=(self), gyroscope=(self), hid=(self), idle-detection=(self), interest-cohort=(self), keyboard-map=(self), magnetometer=(self), microphone=(self), midi=(self), navigation-override=(self), payment=(self "https://js.stripe.com" "https://pay.google.com"), picture-in-picture=(self), publickey-credentials-get=(self), screen-wake-lock=(self), serial=(self), speaker-selection=(self), sync-script=(self), sync-xhr=(self), trust-token-redemption=(self), usb=(self), vertical-scroll=(self), web-share=(self), window-placement=(self), xr-spatial-tracking=(self)',

				'nel'       : '{ "report_to": "default", "max_age": 31536000, "include_subdomains": true }',
				'expect-ct' : 'max-age=604800, report-uri="https://clevercanyon.report-uri.com/r/d/ct/reportOnly"',
				'report-to' : '{ "group": "default", "max_age": 31536000, "endpoints": [ { "url": "https://clevercanyon.report-uri.com/a/d/g" } ], "include_subdomains": true }, { "group": "csp", "max_age": 31536000, "endpoints": [ { "url": "https://clevercanyon.report-uri.com/r/d/csp/enforce" } ], "include_subdomains": true }',
			};
		} else {
			securityHeaders = {
				'x-frame-options'              : 'SAMEORIGIN',
				'x-content-type-options'       : 'nosniff',
				'cross-origin-embedder-policy' : 'unsafe-none',
				'cross-origin-opener-policy'   : 'same-origin',
				'cross-origin-resource-policy' : 'same-origin',
				'referrer-policy'              : 'strict-origin-when-cross-origin',
				'content-security-policy'      : 'base-uri \'self\'; frame-ancestors \'self\'; default-src * data: blob: mediastream: \'report-sample\'; style-src * data: blob: \'unsafe-inline\' \'report-sample\'; object-src \'none\'; script-src blob: \'self\' \'unsafe-inline\' \'unsafe-eval\' \'report-sample\' *.wobots.com *.stripe.com *.cloudflare.com *.cloudflareinsights.com *.google.com *.googletagmanager.com *.google-analytics.com *.googleadservices.com googleads.g.doubleclick.net *.cookie-script.com;',
				'permissions-policy'           : 'accelerometer=(self), ambient-light-sensor=(self), autoplay=(self), battery=(self), camera=(self), clipboard-read=(self), clipboard-write=(self), conversion-measurement=(self), cross-origin-isolated=(self), display-capture=(self), document-domain=(self), encrypted-media=(self), execution-while-not-rendered=(self), execution-while-out-of-viewport=(self), focus-without-user-activation=(self), fullscreen=(self), gamepad=(self), geolocation=(self), gyroscope=(self), hid=(self), idle-detection=(self), interest-cohort=(self), keyboard-map=(self), magnetometer=(self), microphone=(self), midi=(self), navigation-override=(self), payment=(self "https://js.stripe.com" "https://pay.google.com"), picture-in-picture=(self), publickey-credentials-get=(self), screen-wake-lock=(self), serial=(self), speaker-selection=(self), sync-script=(self), sync-xhr=(self), trust-token-redemption=(self), usb=(self), vertical-scroll=(self), web-share=(self), window-placement=(self), xr-spatial-tracking=(self)',
			};
		}
		// CORs-related headers.

		if ( config.enableCORs ) {
			corsHeaders = {
				'access-control-max-age'           : '7200',
				'access-control-allow-credentials' : 'true',
				'access-control-allow-methods'     : $HTTP.supportedRequestMethods.join( ', ' ),
				'access-control-allow-headers'     : $HTTP.requestHeaderNames.join( ', ' ),
				'access-control-expose-headers'    : $HTTP.responseHeaderNames.join( ', ' ),
				'timing-allow-origin'              : request.headers.has( 'origin' ) ? ( request.headers.get( 'origin' ) || '' ) : '*',
				'access-control-allow-origin'      : request.headers.has( 'origin' ) ? ( request.headers.get( 'origin' ) || '' ) : '*',
			};
		} else if ( $HTTP.requestPathHasStaticExtension( request, parsedURL, /[^.]\.(?:eot|otf|ttf|woff)[0-9]*$/ui ) ) {
			corsHeaders = {
				'access-control-allow-origin' : request.headers.has( 'origin' ) ? ( request.headers.get( 'origin' ) || '' ) : '*',
			};
		}
		// Return all headers.

		const headers = new Headers( { ...existingHeaders, ...alwaysOnHeaders, ...contentHeaders, ...cacheHeaders, ...securityHeaders, ...corsHeaders } );

		config.headers.forEach( ( value, name ) => headers.set( name, value ) );
		config.appendHeaders.forEach( ( value, name ) => headers.append( name, value ) );

		if ( config.response ) {
			config.response.headers.forEach( ( value, name ) => config.response?.headers.delete( name ) );
			headers.forEach( ( value, name ) => config.response?.headers.set( name, value ) );
		}
		return headers;
	}

	/**
	 * Get HTTP response status text.
	 *
	 * @param status HTTP status code.
	 *
	 * @return HTTP response status text.
	 */
	public static responseStatusText( status : number ) : string {
		return $HTTP.responseStatusCodes[ String( status ) ] || '';
	}

	/**
	 * Request method supported?
	 *
	 * @param request HTTP request object.
	 *
	 * @returns `true` if request method is supported.
	 */
	public static requestMethodSupported( request : Request ) : boolean {
		return $HTTP.supportedRequestMethods.indexOf( request.method ) !== -1;
	}

	/**
	 * Request has a cacheable request method?
	 *
	 * @param request HTTP request object.
	 *
	 * @returns `true` if request has a cacheable request method.
	 */
	public static requestHasCacheableMethod( request : Request ) : boolean {
		return $HTTP.requestMethodSupported( request )
			&& [ 'HEAD', 'GET' ].indexOf( request.method ) !== -1;
	}

	/**
	 * Request method needs content headers?
	 *
	 * @param request        HTTP request object.
	 * @param responseStatus HTTP response status code.
	 *
	 * @returns `true` if request method needs content headers.
	 */
	public static requestNeedsContentHeaders( request : Request, responseStatus : number ) : boolean {
		return responseStatus !== 204 && $HTTP.requestMethodSupported( request )
			&& [ 'OPTIONS' ].indexOf( request.method ) === -1;
	}

	/**
	 * Request method needs content body?
	 *
	 * @param request        HTTP request object.
	 * @param responseStatus HTTP response status code.
	 *
	 * @returns `true` if request method needs content body.
	 */
	public static requestNeedsContentBody( request : Request, responseStatus : number ) : boolean {
		return responseStatus !== 204 && $HTTP.requestMethodSupported( request )
			&& [ 'OPTIONS', 'HEAD' ].indexOf( request.method ) === -1;
	}

	/**
	 * Request is coming from an identified user?
	 *
	 * @param request HTTP request object.
	 *
	 * @returns `true` if request is coming from an identified user.
	 */
	public static requestIsFromUser( request : Request ) : boolean {
		return request.headers.has( 'authorization' )
			|| ( request.headers.has( 'cookie' )
				&& /(?:^\s*|;\s*)(?:(?:wp|wordpress)[_-](?:logged[_-]in|sec|rec|activate|postpass|woocommerce)|woocommerce|logged[_-]in|comment[_-]author)[_-][^=;]+=\s*"?[^";]/ui
					.test( request.headers.get( 'cookie' ) || '' ) );
	}

	/**
	 * Request is dynamic?
	 *
	 * @param request   HTTP request object.
	 * @param parsedURL Optional pre-parsed URL.
	 *                  Default is taken from `request`.
	 *
	 * @returns `true` if request is dynamic.
	 */
	public static requestPathIsDynamic( request : Request, parsedURL : URL | null = null ) : boolean {
		return $HTTP.requestPathHasVirtualBase( request, parsedURL )
			|| $HTTP.requestPathIsPotentiallyVirtual( request, parsedURL )
			|| ! $HTTP.requestPathHasStaticExtension( request, parsedURL );
	}

	/**
	 * Request is static?
	 *
	 * @param request   HTTP request object.
	 * @param parsedURL Optional pre-parsed URL.
	 *                  Default is taken from `request`.
	 *
	 * @returns `true` if request is static.
	 */
	public static requestPathIsStatic( request : Request, parsedURL : URL | null = null ) : boolean {
		return ! $HTTP.requestPathIsDynamic( request, parsedURL );
	}

	/**
	 * Request path has a virtual base?
	 *
	 * @param request   HTTP request object.
	 * @param parsedURL Optional pre-parsed URL.
	 *                  Default is taken from `request`.
	 *
	 * @returns `true` if request path has a virtual base.
	 */
	public static requestPathHasVirtualBase( request : Request, parsedURL : URL | null = null ) : boolean {
		if ( ! $Env.isC10n() ) {
			return false; // Not applicable.
		}
		parsedURL = parsedURL || $URL.parse( request.url );

		if ( ! parsedURL || ! parsedURL.pathname || '/' === parsedURL.pathname ) {
			return false;
		}
		return /^\/?(api|wp-json|blog|feed|comments|author|discussion|shop|product|cart|checkout|account)(?:$|\/)/ui.test( parsedURL.pathname );
	}

	/**
	 * Request path is potentially virtual?
	 *
	 * @param request   HTTP request object.
	 * @param parsedURL Optional pre-parsed URL.
	 *                  Default is taken from `request`.
	 *
	 * @returns `true` if request path is potentially virtual.
	 */
	public static requestPathIsPotentiallyVirtual( request : Request, parsedURL : URL | null = null ) : boolean {
		if ( ! $Env.isC10n() ) {
			return false; // Not applicable.
		}
		parsedURL = parsedURL || $URL.parse( request.url );

		if ( ! parsedURL || ! parsedURL.pathname || '/' === parsedURL.pathname ) {
			return false;
		}
		return /(?:^|\/)(?:robots\.txt|locations\.kml|[^/]*sitemap[^/]*\.(?:xml|xsl))$/ui.test( parsedURL.pathname );
	}

	/**
	 * Request path is potentially a virtual SEO file?
	 *
	 * @param request   HTTP request object.
	 * @param parsedURL Optional pre-parsed URL.
	 *                  Default is taken from `request`.
	 *
	 * @returns `true` if request path is potentially a virtual SEO file.
	 */
	public static requestPathIsSEORelatedFile( request : Request, parsedURL : URL | null = null ) : boolean {
		parsedURL = parsedURL || $URL.parse( request.url );

		if ( ! parsedURL || ! parsedURL.pathname || '/' === parsedURL.pathname ) {
			return false;
		}
		return /(?:^|\/)(?:favicon\.ico|robots\.txt|locations\.kml|[^/]*sitemap[^/]*\.(?:xml|xsl))$/ui.test( parsedURL.pathname );
	}

	/**
	 * Request path is in `/(?:wp-)?admin`?
	 *
	 * @param request   HTTP request object.
	 * @param parsedURL Optional pre-parsed URL.
	 *                  Default is taken from `request`.
	 *
	 * @returns `true` if request path is in `/(?:wp-)?admin`.
	 */
	public static requestPathIsInAdmin( request : Request, parsedURL : URL | null = null ) : boolean {
		parsedURL = parsedURL || $URL.parse( request.url );

		if ( ! parsedURL || ! parsedURL.pathname || '/' === parsedURL.pathname ) {
			return false;
		}
		return /(?:^|\/)(?:wp-)?admin(?:$|\/)/ui.test( parsedURL.pathname )
			&& ! /(?:^|\/)wp-admin\/admin-ajax\.php$/ui.test( parsedURL.pathname );
	}

	/**
	 * Request path has a static file extension?
	 *
	 * @param request   HTTP request object.
	 * @param parsedURL Optional pre-parsed URL.
	 *                  Default is taken from `request`.
	 *
	 * @param exts      Specific extension to look for?
	 *
	 * @returns `true` if request path has a static file extension.
	 */
	public static requestPathHasStaticExtension( request : Request, parsedURL : URL | null = null, exts? : Array<string> | RegExp ) : boolean {
		parsedURL = parsedURL || $URL.parse( request.url );

		if ( ! parsedURL || ! parsedURL.pathname || '/' === parsedURL.pathname ) {
			return false;
		}
		if ( exts instanceof RegExp ) {
			return /[^.]\.[^.]+$/u.test( parsedURL.pathname ) && exts.test( parsedURL.pathname );
		}
		if ( exts instanceof Array && exts.length ) {
			return /[^.]\.[^.]+$/u.test( parsedURL.pathname )
				&& new RegExp( '[^.]\\.(?:' + exts.map( v => $Str.escRegexp( v ) ).join( '|' ) + ')$', 'ui' ).test( parsedURL.pathname );
		}
		return /[^.]\.[^.]+$/u.test( parsedURL.pathname )
			&& /[^.]\.(?:3g2|3gp|3gp2|3gpp|7z|aac|ai|apng|app|asc|asf|asx|atom|avi|bash|bat|bin|blend|bmp|c|cc|cfg|cjs|class|com|conf|css|csv|cts|dfxp|divx|dll|dmg|doc|docm|docx|dotm|dotx|dtd|ejs|eot|eps|ets|exe|fla|flac|flv|gif|gtar|gz|gzip|h|heic|hta|htaccess|htc|htm|html|htpasswd|ico|ics|ini|iso|jar|jpe|jpeg|jpg|js|json|json5|jsonld|jsx|key|kml|kmz|log|m4a|m4b|m4v|md|mdb|mid|midi|mjs|mka|mkv|mo|mov|mp3|mp4|mpe|mpeg|mpg|mpp|mts|numbers|odb|odc|odf|odg|odp|ods|odt|oga|ogg|ogv|onepkg|onetmp|onetoc|onetoc2|otf|oxps|pages|pdf|phar|phps|pict|pls|png|po|pot|potm|potx|ppam|pps|ppsm|ppsx|ppt|pptm|pptx|ps|psd|pspimage|qt|ra|ram|rar|rdf|rss|rss-http|rss2|rtf|rtx|scss|sh|sketch|sldm|sldx|so|sql|sqlite|srt|svg|svgz|swf|tar|tgz|tif|tiff|tmpl|toml|tpl|ts|tsv|tsx|ttf|txt|vtt|wav|wax|webm|webp|wm|wma|wmv|wmx|woff|woff2|wp|wpd|wri|xcf|xhtm|xhtml|xla|xlam|xls|xlsb|xlsm|xlsx|xlt|xltm|xltx|xlw|xml|xps|xsd|xsl|xslt|yaml|yml|zip|zsh)$/ui.test( parsedURL.pathname );
	}

	/**
	 * Extracts headers into object properties.
	 *
	 * @param headers Headers.
	 *
	 * @return Own enumerable string-keyed properties.
	 */
	public static extractHeaders( headers : Headers | { [ x : string ] : string } ) : { [ x : string ] : string } {
		return Object.fromEntries( Object.entries( headers ) );
	}

	/**
	 * Supported HTTP request methods.
	 */
	public static supportedRequestMethods : Array<string> = [
		'OPTIONS',
		'HEAD',
		'GET',
		'POST',
		'PUT',
		'PATCH',
		'DELETE',
	];

	/**
	 * HTTP request header names.
	 */
	public static requestHeaderNames : Array<string> = [
		'a-im',
		'accept',
		'accept-charset',
		'accept-datetime',
		'accept-encoding',
		'accept-language',
		'accept-push-policy',
		'accept-signature',
		'access-control-request-headers',
		'access-control-request-method',
		'authorization',
		'cache-control',
		'cdn-loop',
		'cf-connecting-ip',
		'cf-ipcountry',
		'cf-ray',
		'cf-visitor',
		'cf-worker',
		'client-ip',
		'connection',
		'content-encoding',
		'content-language',
		'content-length',
		'content-md5',
		'content-type',
		'cookie',
		'date',
		'device-memory',
		'dnt',
		'downlink',
		'dpr',
		'early-data',
		'ect',
		'expect',
		'forwarded',
		'from',
		'front-end-https',
		'host',
		'http2-settings',
		'idempotency-key',
		'if-match',
		'if-modified-since',
		'if-none-match',
		'if-range',
		'if-unmodified-since',
		'last-event-id',
		'max-forwards',
		'origin',
		'ping-from',
		'ping-to',
		'pragma',
		'prefer',
		'proxy-authorization',
		'proxy-connection',
		'range',
		'referer',
		'remote-addr',
		'rtt',
		'save-data',
		'sec-ch-ua',
		'sec-ch-ua-arch',
		'sec-ch-ua-bitness',
		'sec-ch-ua-full-version',
		'sec-ch-ua-full-version-list',
		'sec-ch-ua-mobile',
		'sec-ch-ua-model',
		'sec-ch-ua-platform',
		'sec-ch-ua-platform-version',
		'sec-fetch-dest',
		'sec-fetch-mode',
		'sec-fetch-site',
		'sec-fetch-user',
		'sec-websocket-extensions',
		'sec-websocket-key',
		'sec-websocket-protocol',
		'sec-websocket-version',
		'service-worker',
		'service-worker-navigation-preload',
		'signature',
		'signed-headers',
		'te',
		'trailer',
		'transfer-encoding',
		'true-client-ip',
		'upgrade',
		'upgrade-insecure-requests',
		'user-agent',
		'via',
		'viewport-width',
		'want-digest',
		'warning',
		'width',
		'x-att-deviceid',
		'x-cluster-client-ip',
		'x-correlation-id',
		'x-csrf-token',
		'x-forwarded-for',
		'x-forwarded-host',
		'x-forwarded-path',
		'x-forwarded-proto',
		'x-forwarded-ssl',
		'x-http-method-override',
		'x-nonce',
		'x-real-ip',
		'x-request-id',
		'x-requested-by',
		'x-requested-with',
		'x-uidh',
		'x-wap-profile',
		'x-wp-nonce',
	];

	/**
	 * HTTP response header names.
	 */
	public static responseHeaderNames : Array<string> = [
		'accept-ch',
		'accept-patch',
		'accept-post',
		'accept-ranges',
		'access-control-allow-credentials',
		'access-control-allow-headers',
		'access-control-allow-methods',
		'access-control-allow-origin',
		'access-control-expose-headers',
		'access-control-max-age',
		'age',
		'allow',
		'alt-svc',
		'cache-control',
		'cdn-cache-control',
		'cf-cache-status',
		'cf-ray',
		'clear-site-data',
		'cloudflare-cdn-cache-control',
		'connection',
		'content-disposition',
		'content-dpr',
		'content-encoding',
		'content-language',
		'content-length',
		'content-location',
		'content-md5',
		'content-range',
		'content-security-policy',
		'content-security-policy-report-only',
		'content-transfer-encoding',
		'content-type',
		'cross-origin-embedder-policy',
		'cross-origin-opener-policy',
		'cross-origin-resource-policy',
		'date',
		'delta-base',
		'digest',
		'etag',
		'expect-ct',
		'expires',
		'feature-policy',
		'im',
		'keep-alive',
		'large-allocation',
		'last-modified',
		'link',
		'location',
		'lsc-cookie',
		'nel',
		'p3p',
		'permissions-policy',
		'pragma',
		'preference-applied',
		'proxy-authenticate',
		'public-key-pins',
		'public-key-pins',
		'public-key-pins-report-only',
		'push-policy',
		'referrer-policy',
		'refresh',
		'report-to',
		'retry-after',
		'sec-websocket-accept',
		'sec-websocket-accept',
		'server',
		'server-timing',
		'service-worker-allowed',
		'set-cookie',
		'signature',
		'signed-headers',
		'sourcemap',
		'status',
		'strict-transport-security',
		'surrogate-control',
		'timing-allow-origin',
		'tk',
		'trailer',
		'transfer-encoding',
		'upgrade',
		'vary',
		'via',
		'want-digest',
		'warning',
		'www-authenticate',
		'x-content-duration',
		'x-content-security-policy',
		'x-content-type-options',
		'x-correlation-id',
		'x-dns-prefetch-control',
		'x-download-options',
		'x-firefox-spdy',
		'x-frame-options',
		'x-litespeed-cache',
		'x-litespeed-cache-control',
		'x-litespeed-purge',
		'x-litespeed-tag',
		'x-litespeed-vary',
		'x-mod-pagespeed',
		'x-permitted-cross-domain-policies',
		'x-pingback',
		'x-powered-by',
		'x-redirect-by',
		'x-request-id',
		'x-robots-tag',
		'x-server-debug',
		'x-sourcemap',
		'x-turbo-charged-by',
		'x-ua-compatible',
		'x-webkit-csp',
		'x-wp-total',
		'x-wp-totalpages',
		'x-xss-protection',
	];

	/**
	 * HTTP response status codes.
	 */
	public static responseStatusCodes : { [ x : string ] : string } = {
		'100' : 'Continue',
		'101' : 'Switching Protocols',
		'102' : 'Processing',
		'103' : 'Early Hints',

		'200' : 'OK',
		'201' : 'Created',
		'202' : 'Accepted',
		'203' : 'Non-Authoritative Information',
		'204' : 'No Content',
		'205' : 'Reset Content',
		'206' : 'Partial Content',
		'207' : 'Multi-Status',
		'226' : 'IM Used',

		'300' : 'Multiple Choices',
		'301' : 'Moved Permanently',
		'302' : 'Found',
		'303' : 'See Other',
		'304' : 'Not Modified',
		'305' : 'Use Proxy',
		'306' : 'Reserved',
		'307' : 'Temporary Redirect',
		'308' : 'Permanent Redirect',

		'400' : 'Bad Request',
		'401' : 'Unauthorized',
		'402' : 'Payment Required',
		'403' : 'Forbidden',
		'404' : 'Not Found',
		'405' : 'Method Not Allowed',
		'406' : 'Not Acceptable',
		'407' : 'Proxy Authentication Required',
		'408' : 'Request Timeout',
		'409' : 'Conflict',
		'410' : 'Gone',
		'411' : 'Length Required',
		'412' : 'Precondition Failed',
		'413' : 'Request Entity Too Large',
		'414' : 'Request-URI Too Long',
		'415' : 'Unsupported Media Type',
		'416' : 'Requested Range Not Satisfiable',
		'417' : 'Expectation Failed',
		'418' : 'I\'m a teapot',
		'421' : 'Misdirected Request',
		'422' : 'Unprocessable Entity',
		'423' : 'Locked',
		'424' : 'Failed Dependency',
		'426' : 'Upgrade Required',
		'428' : 'Precondition Required',
		'429' : 'Too Many Requests',
		'431' : 'Request Header Fields Too Large',
		'451' : 'Unavailable For Legal Reasons',

		'500' : 'Internal Server Error',
		'501' : 'Not Implemented',
		'502' : 'Bad Gateway',
		'503' : 'Service Unavailable',
		'504' : 'Gateway Timeout',
		'505' : 'HTTP Version Not Supported',
		'506' : 'Variant Also Negotiates',
		'507' : 'Insufficient Storage',
		'510' : 'Not Extended',
		'511' : 'Network Authentication Required',
	};
}
