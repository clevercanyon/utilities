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
 * Composer utilities.
 *
 * @since 2021-12-15
 */
final class Composer extends U\A6t\Stc_Utilities {
	/**
	 * Packages directory regexp.
	 *
	 * @since 2021-12-15
	 */
	public const PACKAGES_DIR_REGEXP = '/^(vendor|node_modules)$/u';

	/**
	 * Composer package name max bytes.
	 *
	 * @since 2021-12-15
	 *
	 * @note  Composer seemingly doesn't have or document a limit.
	 *        We'll use the same limit as NPM does, which is 214 characters.
	 */
	public const PACKAGE_NAME_MAX_BYTES = 214;

	/**
	 * Composer package name regexp.
	 *
	 * @since 2021-12-15
	 *
	 * @see   https://getcomposer.org/doc/04-schema.md#name
	 */
	public const PACKAGE_NAME_REGEXP = '/^([a-z0-9](?:[_.-]?[a-z0-9]+)*)\/([a-z0-9](?:(?:[_.]?|-{0,2})[a-z0-9]+)*)$/u';

	/**
	 * Parses a `composer.json` file.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $dir                     Directory path.
	 *
	 * @param string|null $extra_namespace         Optional trusted extra namespace. Default is `null`.
	 *                                             If set, conduct special operations on trusted extra namespace.
	 *
	 * @param bool        $extract_extra_namespace Optional. Default is `true`. If a trusted `$extra_namespace` is given, it is
	 *                                             extracted, thus the object’s `extra` property will consist of only namespaced properties.
	 *
	 * @param object|null $_r                      Internal use only — do not pass.
	 *
	 * @throws U\Fatal_Exception On any failure, except if file does not exist. That's ok ... unless the file is associated with an `$extends-packages`
	 *                         directive, in which case an exception *will* be thrown, as that would be unexpected behavior and likely problematic.
	 *
	 * @return object Object with `composer.json` properties from the given `$dir` parameter.
	 */
	public static function json(
		string $dir,
		/* string|null */ ?string $extra_namespace = null,
		bool $extract_extra_namespace = true,
		/* object|null */ ?object $_r = null
	) : object {
		// Setup variables.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		$dir  = U\Fs::normalize( $dir );
		$file = U\Dir::join( $dir, '/composer.json' );

		if ( ! $is_recursive ) {
			$_r->dir = $dir; // Top-level project dir.
		}
		// Checks STC cache.

		if ( ! $is_recursive ) {
			if ( // A few cache keys here.
				null !== ( $cache = &static::stc_cache( [
					__FUNCTION__,
					$dir,
					$extra_namespace,
					$extract_extra_namespace,
				] ) ) ) {
				return $cache;
			}
		}
		// Validate, setup, early returns.

		if ( ! $dir || ! $file ) {
			throw new U\Fatal_Exception( 'Missing dir: `' . $dir . '` or file: `' . $file . '`.' );
		}
		if ( ! is_file( $file ) ) {      // Special case, we allow this to slide.
			return $cache = (object) []; // Not possible. Consistent with {@see dev_json()}.
		}
		if ( ! is_readable( $file ) ) {
			throw new U\Fatal_Exception( 'Unable to read file: `' . $file . '`.' );
		}
		if ( ! is_object( $json = U\Str::json_decode( file_get_contents( $file ) ) ) ) {
			throw new U\Fatal_Exception( 'Unable to decode file: `' . $file . '`.' );
		}
		if ( ! is_object( $json->extra ?? null ) ) {
			$json->extra = (object) [];
		}
		if ( $extra_namespace && ! is_object( $json->extra->{$extra_namespace} ?? null ) ) {
			$json->extra->{$extra_namespace} = (object) [];
		}
		// Maybe handles `$extends-packages` directive(s) recursively.

		if ( $extra_namespace && property_exists( $json->extra->{$extra_namespace}, '$extends-packages' ) ) {
			// Validate `$extends-packages` directive.

			if ( ! is_array( $json->extra->{$extra_namespace}->{'$extends-packages'} ) ) {
				throw new U\Fatal_Exception( 'Unexpected `$extends-packages` directive in: `' . $file . '`. Must be array.' );
			}
			// Compile packages that we need to extend, recursively.

			$_extends_json_extra_namespace = (object) []; // Initialize.

			foreach ( $json->extra->{$extra_namespace}->{'$extends-packages'} as $_package_name ) {
				if ( ! $_package_name
					|| ! is_string( $_package_name )
					|| ! preg_match( U\Dev\Composer::PACKAGE_NAME_REGEXP, $_package_name )
					|| strlen( $_package_name ) > U\Dev\Composer::PACKAGE_NAME_MAX_BYTES
				) {
					throw new U\Fatal_Exception(
						'Unexpected `$extends-packages` entry: `' . $_package_name . '` in: `' . $file . '`.' .
						' Must match pattern: `' . U\Dev\Composer::PACKAGE_NAME_REGEXP . '`' .
						' and be <= `' . U\Dev\Composer::PACKAGE_NAME_MAX_BYTES . '` bytes in length.'
					);
				}
				$_package_dir  = U\Dir::join( $_r->dir, '/vendor/' . $_package_name );
				$_package_file = U\Dir::join( $_package_dir, '/composer.json' );

				if ( ! is_file( $_package_file ) ) { // Report the case of missing dependency.
					throw new U\Fatal_Exception(
						'Missing `composer.json` file for `$extends-packages` entry: `' . $_package_name . '`' .
						' in: `' . $file . '`. The missing location is: `' . $_package_file . '`.'
					);
				}
				$_package_json = U\Dev\Composer::json( $_package_dir, $extra_namespace, $extract_extra_namespace, $_r );

				if ( is_object( $_package_json->extra ?? null ) && is_object( $_package_json->extra->{$extra_namespace} ?? null ) ) {
					$_extends_json_extra_namespace = U\Ctn::super_merge( $_extends_json_extra_namespace, $_package_json->extra->{$extra_namespace} );
				}
			}
			// Merge into everything we're extending.

			if ( $_extends_json_extra_namespace ) {
				$json->extra->{$extra_namespace} = U\Ctn::super_merge( $_extends_json_extra_namespace, $json->extra->{$extra_namespace} );
			}
			// Drop the `$extends-packages` directive now.

			unset( $json->extra->{$extra_namespace}->{'$extends-packages'} );
		}
		// Maybe bump namespace up into extra props.

		if ( ! $is_recursive && $extra_namespace ) {
			$extra_env_vars = [
				'PROJECT_DIR'      => $dir,
				'PROJECT_PKG_NAME' => $json->name ?? '',
			];
			$extra_env_vars = array_map( 'strval', $extra_env_vars );

			$json->extra->{$extra_namespace} = U\Ctn::super_merge( $json->extra->{$extra_namespace} );
			$json->extra->{$extra_namespace} = U\Ctn::resolve_env_vars( $json->extra->{$extra_namespace}, $extra_env_vars );

			if ( $extract_extra_namespace ) {
				$json->extra = $json->extra->{$extra_namespace};
			}
		}
		// Return cache.

		return $cache = $json;
	}
}
