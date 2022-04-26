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

// </editor-fold>

/**
 * Time utilities.
 *
 * @since 2022-04-25
 */
export default class uTime extends uA6tStcUtilities {
	/**
	 * Gets current unix timestamp.
	 *
	 * @since 2022-04-25
	 *
	 * @returns {number} Current unix timestamp.
	 */
	static utc() {
		return Math.round( new Date().getTime() / 1000 );
	}

	/**
	 * Converts `YYYY-MM-DD` into a unix timestamp.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} ymd `YYYY-MM-DD` date.
	 *
	 * @returns {number} Unix timestamp.
	 */
	static utcFromYmd( ymd ) {
		return uTime.utcFromYmdHis( ymd );
	}

	/**
	 * Converts `YYYY-MM-DD HH:II::SS` into a unix timestamp.
	 *
	 * @since 2022-04-25
	 *
	 * @param {string} ymdHis `YYYY-MM-DD HH:II::SS` date & time.
	 *
	 * @returns {number} Unix timestamp.
	 */
	static utcFromYmdHis( ymdHis ) {
		const parts = ymdHis.split( ' ', 2 );

		parts[ 0 ] = parts[ 0 ] || '1970-01-01';
		parts[ 1 ] = parts[ 1 ] || '00:00:00';

		return Math.round( Date.parse( parts[ 0 ] + 'T' + parts[ 1 ] + '.000Z' ) / 1000 );
	}
}
