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
namespace Clever_Canyon\Utilities\Traits\Dir\Utilities;

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
 * @see   U\Dir
 */
trait Name_Members {
	/**
	 * Gets directory name and does optional {@see join()}.
	 *
	 * @since 2021-12-19
	 *
	 * @param string     $path            {@see dirname()}.
	 * @param int|string ...$levels_paths Optional (int) parent levels to go up. Default is `1`. Must be `>= 1`.
	 *                                    Followed by optional (string) paths to join. Default is no join.
	 *
	 * @return string Newly formed by path, based on input parameters.
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Dir::name()
	 */
	public static function name( string $path, /* int|string */ ...$levels_paths ) : string {
		if ( $levels_paths ) {
			$is_key_0_levels = is_int( $levels_paths[ 0 ] ?? null );
			$levels          = $is_key_0_levels ? max( 1, $levels_paths[ 0 ] ) : 1;

			$paths = $is_key_0_levels ? array_slice( $levels_paths, 1 ) : $levels_paths;
			assert( array_map( 'strval', $paths ) === $paths );
		} else {
			$levels = 1; // Must be an integer >= `1`.
			$paths  = [];
		}
		$path = U\Fs::normalize( $path ); // Before passing to {@see dirname()}.

		if ( $paths ) {
			return U\Dir::join( dirname( $path, $levels ), ...$paths );
		} else {
			return U\Fs::normalize( dirname( $path, $levels ) );
		}
	}
}
