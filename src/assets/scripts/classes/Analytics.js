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
 * @since 2022-04-26
 */
import { default as uA6tBase } from './a6t/Base.js';
import { default as uEnv }     from './Env.js';
import { default as uCookie }  from './Cookie.js';
import { default as uDOM }     from './DOM.js';
import { default as uURL }     from './URL.js';

// </editor-fold>

export default class uAnalytics extends uA6tBase {
	/**
	 * Requires browser.
	 *
	 * @since 2022-04-25
	 */
	static {
		if ( ! uEnv.isBrowser() ) {
			throw new Error( 'Not in browser.' );
		}
	}

	/**
	 * Gtag instance.
	 *
	 * @since 2022-04-26
	 *
	 * @type {Function}
	 */
	#gtag;

	/**
	 * Enable debug mode?
	 *
	 * @since 2022-04-26
	 *
	 * @type {boolean}
	 */
	#debug;

	/**
	 * GA4 gtag ID; e.g., `G-8K3F2ZYNYX`.
	 *
	 * @since 2022-04-26
	 *
	 * @type {string}
	 */
	#ga4GtagId;

	/**
	 * Cookie Script GDPR script ID; e.g., `ecf9ba42a3e03d5dd3894e6e`.
	 *
	 * @since 2022-04-26
	 *
	 * @type {string}
	 */
	#csGDPRScriptId;

	/**
	 * Context; e.g., `web`.
	 *
	 * @since 2022-04-26
	 *
	 * @type {string}
	 */
	#context;

	/**
	 * Sub-context; e.g., `site`.
	 *
	 * @since 2022-04-26
	 *
	 * @type {string}
	 */
	#subContext;

	/**
	 * User ID hash; e.g., SHA-256.
	 *
	 * @since 2022-04-26
	 *
	 * @type {string}
	 */
	#userId;

	/**
	 * Geolocation data.
	 * {
	 *     'colo'       : 'ATL',
	 *     'country'    : 'US',
	 *     'city'       : 'Alpharetta',
	 *     'continent'  : 'NA',
	 *     'latitude'   : '34.02400',
	 *     'longitude'  : '-84.23960',
	 *     'postalCode' : '30022',
	 *     'metroCode'  : '524',
	 *     'region'     : 'Georgia',
	 *     'regionCode' : 'GA',
	 *     'timezone'   : 'America/New_York',
	 * }
	 * @since 2022-04-26
	 *
	 * @type {Object}
	 */
	#geoData;

	/**
	 * Constructor.
	 *
	 * @since 2022-04-26
	 *
	 * @param {Object.<boolean|string>} config Configuration.
	 */
	constructor( config ) {
		super(); // Parent constructor.

		config = Object.assign( {
			debug          : false,
			csGDPRScriptId : '',
			ga4GtagId      : '',
			context        : 'web',
			subContext     : 'site',
			userId         : '',
		}, config );

		this.#debug          = config.debug;
		this.#csGDPRScriptId = config.csGDPRScriptId;
		this.#ga4GtagId      = config.ga4GtagId;
		this.#context        = config.context;
		this.#subContext     = config.subContext;
		this.#userId         = config.userId;

		if ( ! this.#ga4GtagId ) {
			throw new Error( 'Missing required property: `ga4GtagId`.' );
		}
		window.dataLayer = window.dataLayer || [];
		window.gtag      = window.gtag || function () { window.dataLayer.push( arguments ); };
		this.#gtag       = window.gtag; // Private reference.

		uDOM.onWinLoaded( () => this.#loadThenInitialize() );
	}

	/**
	 * Gets user ID hash.
	 *
	 * @since 2022-04-26
	 *
	 * @return {Promise<string>} User ID hash.
	 */
	async userId() {
		return this.#userId; // Async = uniformity.
	}

	/**
	 * Gets client ID.
	 *
	 * @since 2022-04-26
	 *
	 * @return {Promise<string>} Client ID; e.g., `826737564.1651025377`.
	 */
	async clientId() {
		return new Promise( resolve => {
			this.#gtag( 'get', this.#ga4GtagId, 'client_id', resolve );
		} );
	}

	/**
	 * Gets session ID.
	 *
	 * @since 2022-04-26
	 *
	 * @return {Promise<string>} Session ID; e.g., `1651031160`.
	 */
	async sessionId() {
		return new Promise( resolve => {
			this.#gtag( 'get', this.#ga4GtagId, 'session_id', resolve );
		} );
	}

	/**
	 * Gets geolocation data.
	 *
	 * @since 2022-04-26
	 *
	 * @return {Promise<Object>} Geolocation data.
	 */
	async geoData() {
		if ( this.#geoData ) {
			return this.#geoData;
		}
		return fetch( 'https://wobots.com/api/ip-geo/v1' )
			.then( response => response.json() )
			.then( json => this.#geoData = json );
	}

	/**
	 * Tracks a `page_view` event.
	 *
	 * @since 2022-04-26
	 *
	 * @param {Object} props Optional event props.
	 *
	 * @return {Promise<boolean>} `true` on success.
	 */
	async trackPageView( props = {} ) {
		if ( uURL.getQueryVar( 'utm_source' ) ) {
			uCookie.set( 'utx_touch', JSON.stringify( this.#utmXQueryVars(), null, 2 ) );
		}
		return this.trackEvent( 'page_view', props );
	}

	/**
	 * Tracks an `x_click` event.
	 *
	 * @since 2022-04-26
	 *
	 * @param {Event}  event Click event.
	 * @param {Object} props Optional event props.
	 *
	 * @return {Promise<boolean>} `true` on success.
	 */
	async trackClick( event, props = {} ) {
		const { target : element } = event;
		const idAttr               = element.getAttribute( 'id' ) || '';
		const classAttr            = element.getAttribute( 'class' ) || '';

		return this.trackEvent( 'x_click', {
			x_flex_id     : idAttr || ( /(?:^|\s)click-id=([a-z0-9_-]+)(?:$|\s)/ui.exec( classAttr ) || [] )[ 1 ] || null,
			x_flex_sub_id : element.getAttribute( 'href' ), // In the case of `<a>` tags.

			x_flex_value     : element.getAttribute( 'title' )
				|| ( element.innerText || '' ).replace( /\s+/ug, ' ' ).trim()
				|| element.getAttribute( 'value' ),
			x_flex_sub_value : element.tagName.toLowerCase(),

			...props,
		} );
	}

	/**
	 * Tracks an event.
	 *
	 * @since 2022-04-26
	 *
	 * @param {string} name  A standard or custom event name.
	 *                       Please prefix custom event names with `x_`.
	 *
	 * @param {Object} props Optional event props.
	 *
	 * @return {Promise<boolean>} `true` on success.
	 */
	async trackEvent( name, props = {} ) {
		return Promise.all( [ this.userId(), this.clientId(), this.sessionId() ] )
			.then( ( [ userId, clientId, sessionId ] ) => {
				this.#gtag( 'event', name, {
					send_to : [ this.#ga4GtagId ],

					x_client_id  : clientId,
					x_session_id : sessionId,
					...( userId ? { user_id : userId } : null ),
					...( userId ? { user_properties : { x_user_id : userId } } : null ),

					x_context     : this.#context,
					x_sub_context : this.#subContext,
					x_hostname    : uURL.currentHost( false ),

					...this.#utmXQueryVarDimensions(),
					...props,
				} );
				return true;
			} );
	}

	/**
	 * DNT header indicates 'Do Not Track'?
	 *
	 * @return {boolean} `true` is DNT header exists.
	 *
	 * @see https://o5p.me/Fg9eaO
	 */
	userHasDoNotTrackHeader() {
		return '1' === window.doNotTrack
			|| ( window.navigator && '1' === window.navigator.doNotTrack );
	}

	/**
	 * Loads analytics.
	 *
	 * @since 2022-04-26
	 */
	async #loadThenInitialize() {
		this.geoData().then( geoData => {
			if ( 'US' !== geoData.country || this.userHasDoNotTrackHeader()
				|| /^\/(?:privacy|cookies?)(?:[_-]policy)?(?:$|\/)/ui.test( uURL.currentPath() ) ) {
				this.#gtag( 'consent', 'default', {
					wait_for_update         : 500,
					ad_storage              : 'denied',
					analytics_storage       : 'denied',
					functionality_storage   : 'denied',
					personalization_storage : 'denied',
					security_storage        : 'denied',
				} );
				if ( this.#csGDPRScriptId ) {
					// {@see https://cookie-script.com/web-cookie-types}.
					// {@see https://support.google.com/analytics/answer/9976101?hl=en}.
					uDOM.attachScript( 'https://cdn.cookie-script.com/s/' + uURL.encode( this.#csGDPRScriptId ) + '.js', {
						onload : () => this.#initialize(),
					} );
				}
			} else {
				this.#initialize();
			}
		} );
	}

	/**
	 * Initializes analytics.
	 *
	 * @since 2022-04-26
	 */
	async #initialize() {
		// GA4 initialize, configuration, and load JS.

		// This must fire *after* `gtag( 'consent', ...` setup.
		// {@see https://o5p.me/Dc5cKA} {@see https://o5p.me/mW2tgB}.
		this.#gtag( 'js', new Date() ); // Fires `gtm.js` event and sets `gtm.start` timer.

		this.#gtag( 'config', this.#ga4GtagId, {
			groups                           : [ 'default' ],
			ads_data_redaction               : true,
			send_page_view                   : false,
			url_passthrough                  : false,
			allow_google_signals             : false,
			allow_ad_personalization_signals : false,
			debug_mode                       : this.#debug,
		} );
		uDOM.attachScript( 'https://www.googletagmanager.com/gtag/js?id=' + uURL.encode( this.#ga4GtagId ) );

		// Initialize trackers.

		this.trackPageView(); // Initial page view.
		uDOM.on( 'click', 'a, button, input[type="button"], input[type="submit"]', event => this.trackClick( event ) );
	}

	/**
	 * Gets `ut[mx]_*` query variables.
	 *
	 * @since 2022-04-26
	 *
	 * @return {Object} `ut[mx]_*` query variables.
	 */
	#utmXQueryVars() {
		return uURL.getQueryVars( [ 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utx_ref' ] );
	}

	/**
	 * Gets `x_ut[mx]_*` query variable dimensions.
	 *
	 * @since 2022-04-26
	 *
	 * @return {Object} `x_ut[mx]_*` query variable dimensions.
	 */
	#utmXQueryVarDimensions() {
		const dimensions = {}; // Initialize.
		const queryVars  = this.#utmXQueryVars();

		for ( const [ name, value ] of Object.entries( queryVars ) ) {
			dimensions[ 'x_' + name ] = value;
		}
		return dimensions;
	}
}
