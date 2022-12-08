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
import { default as uA6tBase } from './a6t/Base';

// </editor-fold>

/**
 * Object utilities.
 *
 * @since 2022-04-25
 */
export default class uObj extends uA6tBase {
	/**
	 * Checks if object is empty.
	 *
	 * @since 2022-04-25
	 *
	 * @param {object} obj Object to check.
	 *
	 * @returns {boolean} True if empty.
	 */
	public static empty( obj : object ) : boolean {
		return 0 === Object.keys( obj ).length;
	}

	/**
	 * Polyfill for `Object.hasOwn()`.
	 *
	 * @since 2022-04-25
	 *
	 * @param {object} obj  Object to check.
	 * @param {string} prop Property to check for.
	 *
	 * @returns {boolean} True if property exists.
	 */
	public static hasOwn( obj : object, prop : string ) : boolean {
		return Object.prototype.hasOwnProperty.call( obj, prop );
	}

	/**
	 * Gets object's own enumerable string-keyed properties.
	 *
	 * @param {object} obj Object.
	 *
	 * @return object Object's own enumerable string-keyed properties.
	 */
	public static props( obj : URLSearchParams ) : { [ $ : string ] : string };
	public static props( obj : object ) : { [ $ : string ] : unknown } {
		if ( obj instanceof URLSearchParams ) {
			return Object.fromEntries( obj.entries() );
		}
		return Object.fromEntries( Object.entries( obj ) );
	}
}
