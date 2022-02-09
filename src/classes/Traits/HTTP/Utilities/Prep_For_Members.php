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
namespace Clever_Canyon\Utilities\Traits\HTTP\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Utility members.
 *
 * @since 2021-12-15
 *
 * @see   U\HTTP
 */
trait Prep_For_Members {
	/**
	 * Prepares for special output via PHP.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if everything prepped successfully.
	 */
	public static function prep_for_special_output() : bool {
		$closed_session         = U\HTTP::close_session();
		$disabled_gzip          = U\HTTP::disable_gzip();
		$ended_output_buffering = U\Env::end_output_buffering();

		return $closed_session
			&& $disabled_gzip
			&& $ended_output_buffering;
	}

	/**
	 * Prepares for a file download via PHP.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if everything prepped successfully.
	 */
	public static function prep_for_file_download() : bool {
		$set_time_limit         = U\Env::set_time_limit( 900 );
		$disabled_caching       = U\HTTP::disable_caching();
		$closed_session         = U\HTTP::close_session();
		$disabled_gzip          = U\HTTP::disable_gzip();
		$disabled_robots        = U\HTTP::disable_robots();
		$ended_output_buffering = U\Env::end_output_buffering();

		return $set_time_limit
			&& $disabled_caching
			&& $closed_session
			&& $disabled_gzip
			&& $disabled_robots
			&& $ended_output_buffering;
	}
}
