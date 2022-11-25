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
import phpDate                         from 'locutus/php/datetime/date';
import phpGmDate                       from 'locutus/php/datetime/gmdate';
import phpStrToTime                    from 'locutus/php/datetime/strtotime';

// </editor-fold>

/**
 * Time utilities.
 *
 * @since 2022-04-25
 */
export default class uTime extends uA6tStcUtilities {
	/**
	 * Gets current time (UTC timezone).
	 *
	 * @since 2022-04-25
	 *
	 * @param {string=U}   format Optional format. Default is `U` (timestamp).
	 * @param {string=now} str    Optional string to convert to time. Default is `now`.
	 *
	 * @returns {string} Current time (UTC timezone).
	 */
	public static utc( format : string = 'U', str : string = 'now' ) : string {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call -- OK.
		return phpGmDate( format, phpStrToTime( str ) ) as string;
	}

	/**
	 * Gets current time (local timezone).
	 *
	 * @since 2022-04-25
	 *
	 * @param {string=U}   format Optional format. Default is `U` (timestamp).
	 * @param {string=now} str    Optional string to convert to time. Default is `now`.
	 *
	 * @returns {string} Current time (local timezone).
	 */
	public static local( format : string = 'U', str : string = 'now' ) : string {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call -- OK.
		return phpDate( format, phpStrToTime( str ) ) as string;
	}
}
