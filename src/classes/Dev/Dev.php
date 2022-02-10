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
namespace Clever_Canyon\Utilities\Dev;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Dev utilities.
 *
 * @since 2021-12-15
 */
final class Dev extends U\A6t\Stc_Utilities {
	/**
	 * Parses `~/.dev.json`.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|null $dir               Default is {@see U\Env::var() 'HOME')}.
	 *
	 * @param string|null $namespace         Optional trusted top-level namespace. Default is `null`.
	 *                                       If set, conduct special operations on trusted top-level namespace.
	 *
	 * @param bool        $extract_namespace Optional. Default is `true`. If a trusted top-level `$namespace` is given, it is
	 *                                       extracted, thus the object returned will consist of only the `$namespace` properties.
	 *
	 * @return object Object with `~/.dev.json` properties from the given `$dir` parameter.
	 *
	 * @throws U\Fatal_Exception On any failure, except if file does not exist, that's ok.
	 */
	public static function json(
		/* string|null */ ?string $dir = null,
		/* string|null */ ?string $namespace = null,
		bool $extract_namespace = true
	) : object {
		if ( null !== $dir ) {
			$dir = U\Fs::normalize( $dir );
		} else {
			$dir = U\Env::var( 'HOME' );
		}
		$cache_key_parts = [ __FUNCTION__, $dir, $namespace, $extract_namespace ];
		$cache           = &static::cls_cache( $cache_key_parts );

		if ( null !== $cache ) {
			return $cache; // Saves time.
		}
		$file = U\Dir::join( $dir, '/.dev.json' );

		if ( ! $dir || ! $file ) {
			throw new U\Fatal_Exception( 'Missing dir: `' . $dir . '` or file: `' . $file . '`.' );
		}
		if ( ! is_file( $file ) ) {      // Special case, we allow this to slide.
			return $cache = (object) []; // Not possible. Consistent with {@see D\Composer::json()}.
		}
		if ( ! is_readable( $file ) ) {
			throw new U\Fatal_Exception( 'Unable to read file: `' . $file . '`.' );
		}
		if ( ! is_object( $json = U\File::read_json( $file, false ) ) ) {
			throw new U\Fatal_Exception( 'Unable to decode file: `' . $file . '`.' );
		}
		if ( $namespace ) {
			$json->{$namespace} = is_object( $json->{$namespace} ?? null ) ? $json->{$namespace} : (object) [];
			$json->{$namespace} = U\Bundle::super_merge( $json->{$namespace} );
			$json->{$namespace} = U\Bundle::resolve_env_vars( $json->{$namespace} );

			if ( $extract_namespace ) {
				$json = $json->{$namespace};
			}
		}
		return $cache = $json;
	}
}
