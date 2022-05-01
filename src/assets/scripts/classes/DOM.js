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
 * DOM utilities.
 *
 * @since 2022-04-25
 */
export default class uDOM extends uA6tStcUtilities {
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
	 * Fires a callback on document ready state.
	 *
	 * @since 2022-04-25
	 *
	 * @param {Function} callback Callback.
	 */
	static onDocReady( callback ) {
		if ( 'loading' !== document.readyState ) {
			callback(); // Fires callback immediately.
		} else {
			document.addEventListener( 'DOMContentLoaded', () => callback() );
		}
	}

	/**
	 * Fires a callback on window loaded state.
	 *
	 * @since 2022-04-25
	 *
	 * @param {Function} callback Callback.
	 */
	static onWinLoaded( callback ) {
		if ( 'complete' === document.readyState ) {
			callback(); // Fires callback immediately.
		} else {
			window.addEventListener( 'load', () => callback() );
		}
	}

	/**
	 * Fires a callback on an event.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string}   eventName Event name.
	 *
	 * @param {string}   selector  Optional selector for delegated events.
	 *                             This parameter can be bypassed by simply excluding it.
	 *
	 * @param {Function} callback  Callback.
	 */
	static on( eventName, selector, callback ) {
		if ( 2 === arguments.length ) {
			callback = arguments[ 1 ]; // No `selector`.
			document.addEventListener( eventName, callback );
		} else {
			document.addEventListener( eventName, event => {
				let target = event.target;
				do {
					if ( target.matches( selector ) ) {
						callback.call( target, event );
					}
				} while ( ( target = target.parentNode ) && target != event.currentTarget );
			} );
		}
	}

	/**
	 * Debounce handler.
	 *
	 * @since 2022-04-25
	 *
	 * @param {Function} callback  Callback.
	 * @param {number}   delay     Optional delay. Default is `100`.
	 * @param {boolean}  immediate Immediate? Default is `false`.
	 *
	 * @returns {Function} Debouncer.
	 */
	static debounce( callback, delay = 100, immediate = false ) {
		let timeout;

		return function () {
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

	/**
	 * Attaches an element to `<head>`.
	 *
	 * @since 2022-04-25
	 *
	 * @param {Element} element Element to attach.
	 */
	static attachToHead( element ) {
		document.getElementsByTagName( 'head' )[ 0 ].appendChild( element );
	}

	/**
	 * Attaches an element to `<body>`.
	 *
	 * @since 2022-04-25
	 *
	 * @param {Element} element Element to attach.
	 */
	static attachToBody( element ) {
		document.getElementsByTagName( 'body' )[ 0 ].appendChild( element );
	}

	/**
	 * Attaches a `<script>` to `<body>`.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} src   Script source.
	 * @param {Object} attrs Optional attributes. Default is `{}`.
	 */
	static attachScript( src, attrs = {} ) {
		uDOM.attachToBody( uDOM.createElement( 'script', Object.assign( {}, attrs, { src : src, async : true } ) ) );
	}

	/**
	 * Create a new HTML element.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} tag   Tag name.
	 * @param {Object} attrs Optional attributes. Default is `{}`.
	 *
	 * @return {Element} HTML element.
	 */
	static createElement( tag, attrs = {} ) {
		const element = document.createElement( tag );

		if ( typeof attrs.onload !== 'undefined' ) {
			// This must be set as a property and not as an attribute.
			element.onload = attrs.onload; // Set first, before anything else.
		}
		for ( let attr in attrs ) {
			if ( 'onload' !== attr ) {
				element.setAttribute( attr, attrs[ attr ] );
			}
		}
		return element;
	}
}
