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
namespace Clever_Canyon\Utilities\Traits\Env\Utilities;

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
 * @see   U\Env
 */
trait Can_Use_Extension_Members {
	/**
	 * Can use extension(s)?
	 *
	 * This function should also check INI settings to see if they've disabled an extension.
	 * So far, `session`, `posix`, `fileinfo`, `zip`, `igbinary`, and `memcached` do not have INI settings that disable them.
	 * So not all extensions require the additional check. Recommendation is to check on a case-by-case basis.
	 *
	 * @future-review Care should be taken to update calls to {@see U\Env::can_use_extension()} whenever there are
	 *                new releases of PHP. If popular extensions are later added to core, they are no longer a 'loaded' extension.
	 *                Note: There is a special {@see C10N_LOADED_EXTENSIONS} constant that is picked up below, just in case
	 *                a hotfix is needed on customer sites due to a new release of PHP causing issues.
	 *
	 * @since         2021-12-18
	 *
	 * @param string ...$extensions Extension(s).
	 *
	 * @return bool True if all extensions are useable.
	 *
	 * @see           https://www.php.net/manual/en/extensions.membership.php
	 * @see           https://www.php.net/manual/en/function.get-loaded-extensions.php
	 */
	public static function can_use_extension( string ...$extensions ) : bool {
		static $cache; // Memoize.

		if ( ! $extensions ) {
			return true; // Nothing to check.
		}
		if ( null === $cache ) { // Initialize.
			$cache                    = (object) [ 'can' => [] ];
			$cache->loaded_extensions = array_merge( get_loaded_extensions( true ), get_loaded_extensions( false ) );
			$cache->loaded_extensions = defined( 'C10N_LOADED_EXTENSIONS' ) && is_array( C10N_LOADED_EXTENSIONS )
				? array_merge( $cache->loaded_extensions, C10N_LOADED_EXTENSIONS ) : $cache->loaded_extensions;
			$cache->loaded_extensions = array_map( 'mb_strtolower', array_unique( $cache->loaded_extensions ) );
		}
		foreach ( array_map( 'mb_strtolower', $extensions ) as $_extension ) {
			if ( ! $_extension ) {
				continue; // Nothing to check.
			}
			if ( isset( $cache->can[ $_extension ] ) ) {
				if ( false === $cache->can[ $_extension ] ) {
					return $cache->can[ $_extension ];
				} else {
					continue; // Cached already.
				}
			}
			if ( ! in_array( $_extension, $cache->loaded_extensions, true ) ) {
				return $cache->can[ $_extension ] = false;
			} else {
				$cache->can[ $_extension ] = true;
			}
		}
		return true;
	}
}
