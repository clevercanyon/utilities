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
import minimatch               from 'minimatch';
import { default as uA6tBase } from './a6t/Base';

// </editor-fold>

/**
 * String utilities.
 *
 * @since 2022-04-25
 */
export default class uStr extends uA6tBase {
	/**
	 * Cache.
	 *
	 * @since 2022-04-25
	 *
	 * @type {object} Cache.
	 */
	protected static cache : { [ $ : string ] : unknown } = {};

	/**
	 * Text encoder.
	 *
	 * @since 2022-04-25
	 *
	 * @type {TextEncoder} Encoder.
	 */
	protected static encoder : TextEncoder = new TextEncoder();

	/**
	 * Gets size in bytes.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} str String.
	 *
	 * @return {number} Size in bytes.
	 */
	public static bytes( str : string ) : number {
		return uStr.encoder.encode( str ).length;
	}

	/**
	 * Escapes regexp dynamics.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} str String to escape.
	 *
	 * @returns {string} Escaped string.
	 */
	public static escRegexp( str : string ) : string {
		return str.replace( /[.*+?^${}()|[\]\\-]/ug, '\\$&' );
	}

	/**
	 * Escapes an element selector.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} str String to escape.
	 *
	 * @returns {string} Escaped string.
	 */
	public static escSelector( str : string ) : string {
		return str.replace( /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/ug, '\\\\$&' );
	}

	/**
	 * Escapes a string for use in HTML.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} str String to escape.
	 *
	 * @returns {string} Escaped string.
	 */
	public static escHtml( str : string ) : string {
		const entityMap : { [ $ : string ] : string } = {
			'&'  : '&amp;',
			'<'  : '&lt;',
			'>'  : '&gt;',
			'"'  : '&quot;',
			'\'' : '&#39;',
		};
		return str.replace( /[&<>"']/ug, ( char ) => {
			return entityMap[ char ];
		} );
	}

	/**
	 * String matches the given pattern?
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} str     String to test.
	 * @param {string} pattern Pattern to look for.
	 *
	 * @returns {boolean} True if matches given pattern.
	 */
	public static matches( str : string, pattern : string ) : boolean {
		return minimatch( str, pattern );
	}
}
