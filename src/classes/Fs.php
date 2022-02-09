<?php
/**
 * CLEVER CANYON™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Strict types, namespace, use statements, and other headers.">

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Filesystem utilities.
 *
 * @since 2021-12-15
 */
final class Fs extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Fs\Members;

	/**
	 * Reserved FSCs (filesystem components).
	 *
	 * @since 2021-12-15
	 *
	 * @see   https://en.wikipedia.org/wiki/Filename
	 */
	public const RESERVED_FSCS = [
		'$',
		'$attrdef',
		'$badclus',
		'$bitmap',
		'$boot',
		'$extend',
		'$extend/$objid',
		'$extend/$quota',
		'$extend/$reparse',
		'$idle$',
		'$logfile',
		'$mft',
		'$mftmirr',
		'$secure',
		'$upcase',
		'$volume',
		'aux',
		'clock$',
		'com1',
		'com2',
		'com3',
		'com4',
		'config$',
		'keybd$',
		'lpt1',
		'lpt2',
		'lpt3',
		'lpt4',
		'lst',
		'nul',
		'prn',
		'screen$',
		'con',
		'null',
		'pagefile.sys',
	];
}
