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
 * Lint configuration.
 *
 * @since 2022-08-13
 */
/* eslint-disable */
// @ts-nocheck Not necessary.

/**
 * Imports.
 *
 * @since 2022-04-25
 */
import * as utilities from './web/index';

// </editor-fold>

/**
 * Browser utilities.
 *
 * @since 2022-04-25
 */
if ( typeof window !== 'object' || typeof window.document !== 'object' ) {
	throw new Error( 'Not in browser.' );
} else {
	window.clevercanyon               = window.clevercanyon || {};
	window.clevercanyon.web           = window.clevercanyon.web || {};
	window.clevercanyon.web.utilities = window.clevercanyon.web.utilities || utilities;
}
