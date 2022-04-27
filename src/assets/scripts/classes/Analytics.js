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
	#userIdHash;

	/**
	 * Geolocation.
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
	#geo; // Loads async.

	/**
	 * Gtag instance.
	 *
	 * @since 2022-04-26
	 *
	 * @type {Function}
	 */
	#gtag;

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
			debug      : false,
			ga4GtagId  : '',
			context    : 'web',
			subContext : 'site',
			userIdHash : '',
		}, config );

		for ( const [ prop, value ] of Object.entries( config ) ) {
			this[ '#' + prop ] = value;
		}
		if ( ! this.#ga4GtagId ) {
			throw new Error( 'Missing required property: `ga4GtagId`.' );
		}
		window.dataLayer = window.dataLayer || [];
		window.gtag      = window.gtag || function () { window.dataLayer.push( arguments ); };
		this.#gtag       = window.gtag; // Private reference.

		uDOM.onWinLoaded( this.#load );
	}

	/**
	 * Gets user ID hash; e.g., SHA-256.
	 *
	 * @since 2022-04-26
	 *
	 * @return {Promise<string>} User ID hash; e.g., SHA-256.
	 */
	async userId() {
		return new Promise( resolve => {
			this.#gtag( 'get', this.#ga4GtagId, 'user_id', resolve );
		} );
	}

	/**
	 * Gets client ID; e.g., ``.
	 *
	 * @since 2022-04-26
	 *
	 * @return {Promise<string>} Client ID; e.g., ``.
	 */
	async clientId() {
		return new Promise( resolve => {
			this.#gtag( 'get', this.#ga4GtagId, 'client_id', resolve );
		} );
	}

	/**
	 * Gets session ID; e.g., ``.
	 *
	 * @since 2022-04-26
	 *
	 * @return {Promise<string>} Session ID; e.g., ``.
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
	async geo() {
		if ( this.#geo ) {
			return this.#geo;
		}
		return fetch( 'https://wobots.com/api/ip-geo/v1' )
			.then( response => this.#geo = response.json() );
	}

	/**
	 * Tracks a `page_view` event.
	 *
	 * @since 2022-04-26
	 *
	 * @param {Object} props Optional event props.
	 */
	trackPageView( props = {} ) {
		this.trackEvent( 'page_view', props );
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
	 */
	trackEvent( name, props = {} ) {
		this.#gtag( 'event', name, {
			send_to : this.#ga4GtagId,
			...this.#utmXQueryVarDimensions(),
			...props,
		} );
	}

	/**
	 * Tracks an `x_click` event.
	 *
	 * @since 2022-04-26
	 *
	 * @param {Event} event Click event.
	 */
	trackClick( event ) {
		const element = event.target;
		const attr    = element.getAttribute;

		this.trackEvent( 'x_click', {
			x_flex_id     : attr( 'id' ) || /(?:^|\s)click-id=([a-z0-9_-]+)(?:$|\s)/ui.exec( attr( 'class' ) || '' )[ 1 ] || null,
			x_flex_sub_id : attr( 'href' ), // In the case of `<a>` tags.

			x_flex_value     : attr( 'title' ) || ( element.innerText || '' ).replace( /\s+/ug, ' ' ).trim() || attr( 'value' ),
			x_flex_sub_value : element.tagName.toLowerCase(),
		} );
	}

	/**
	 * Loads analytics.
	 *
	 * @since 2022-04-26
	 */
	#load() {
		this.geo().then( this.#initialize );
	}

	/**
	 * Initializes analytics.
	 *
	 * @since 2022-04-26
	 */
	#initialize() {
		// GA4 consents.

		this.#gtag( 'consent', 'default', {
			ad_storage              : 'granted',
			analytics_storage       : 'granted',
			functionality_storage   : 'granted',
			personalization_storage : 'granted',
			security_storage        : 'granted',
			region                  : [ 'US' ],
		} );
		this.#gtag( 'consent', 'default', {
			ad_storage              : 'denied',
			analytics_storage       : 'denied',
			functionality_storage   : 'denied',
			personalization_storage : 'denied',
			security_storage        : 'granted',
			wait_for_update         : 2000,
		} );
		// GA4 initialize, configuration, and load JS.

		// This must fire *after* `gtag( 'consent', ...` setup.
		// {@see https://o5p.me/Dc5cKA} {@see https://o5p.me/mW2tgB}.
		this.#gtag( 'js', new Date() ); // Fires `gtm.js` event and sets `gtm.start` timer.

		this.#gtag( 'config', this.#ga4GtagId, {
			debug_mode                       : this.#debug,
			send_page_view                   : false,
			cookie_prefix                    : 'utx_ga4',
			ads_data_redaction               : true,
			url_passthrough                  : false,
			allow_google_signals             : false,
			allow_ad_personalization_signals : false,

			user_id         : this.#userIdHash || null,
			user_properties : { 'x_user_id' : this.#userIdHash || null },
			custom_map      : { 'x_client_id' : 'clientId', 'x_session_id' : 'sessionId' },

			x_context     : this.#context,
			x_sub_context : this.#subContext,
			x_hostname    : uURL.currentHost( false ),
		} );
		uDOM.attachScript( 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent( this.#ga4GtagId ) );

		// Initialize trackers.

		this.trackPageView(); // Initial page view.
		uDOM.on( 'click', 'a, button, input[type="button"], input[type="submit"]', this.trackClick );
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
		const queryVars  = uURL.getQueryVars( [ 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utx_ref' ] );

		for ( const [ name, value ] of Object.entries( queryVars ) ) {
			dimensions[ 'x_' + name ] = value;
		}
		return dimensions;
	}
}
