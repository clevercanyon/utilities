<?php
/**
 * Clever Canyon™ {@see https://clevercanyon.com}
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
trait Sys_Helper_Members {
	/**
	 * Helps get a readable & writable system directory.
	 *
	 * @since 2022-02-02
	 *
	 * @param string|array $base_dir Base directory to attempt creation in.
	 *                               This can be passed as a string, or as an array.
	 *
	 *                               * If passed as an array, key `0` must be the `$base_dir`.
	 *                                 Other valid keys include `autocreate`, and possibly others in the future.
	 *
	 * @param string|null  $nsc_fqn  Namespace crux or FQN. Default is this package's `__NAMESPACE__`.
	 *                               Pass a `__NAMESPACE__`, `__CLASS__`, `::class`, `__TRAIT__`, `__METHOD__`,
	 *                               or `__FUNCTION__` (outside of a class). Or anything else that is a FQN.
	 *
	 * @param string       $basename Desired subdirectory basename; e.g., `tmp`, `cache`, `config`, `data`, `state`.
	 *
	 * @return string Readable & writable system directory; else empty string on failure.
	 */
	protected static function sys_dir_helper( /* string|array */ $base_dir, /*string|null */ ?string $nsc_fqn, string $basename ) : string {
		// Validate `$base_dir` & `$basename`.
		assert( is_string( $base_dir ) || is_array( $base_dir ) );

		$base       = (array) $base_dir;
		$base_dir   = (string) ( $base[ 0 ] ?? '' );
		$base_dir   = $base_dir ? U\Fs::normalize( $base_dir ) : '';
		$autocreate = ! empty( $base[ 'autocreate' ] );

		if ( ! $base_dir || ! $basename ) {
			return ''; // Not possible.
		}
		// Check if `$base_dir` exists. Maybe autocreate.
		// But first, look at previous failures to save time.

		// This method is used by several system directory generators.
		// The goal here is to cache failed attempts across those callers.
		// That's why cache keys are limited to just two parameters.

		$is_dir_autocreate_cache_keys = [ __FUNCTION__, $base_dir, $autocreate ];
		$is_dir_autocreate_cache      = &static::cls_cache( $is_dir_autocreate_cache_keys );

		if ( null !== $is_dir_autocreate_cache ) {
			return $is_dir_autocreate_cache; // Saves time across callers.
		}
		if ( ! is_dir( $base_dir ) && ( ! $autocreate || ! U\Dir::make( $base_dir, [], true, false ) ) ) {
			return $is_dir_autocreate_cache = ''; // Failure.
		}
		// Try to acquire private directory now.
		/** {@see U\Dir::private()} has its own cache. */

		return U\Dir::private( $base_dir, $nsc_fqn, $basename );
	}

	/**
	 * Gets exception message.
	 *
	 * - For a system temp directory failure.
	 *   - For WordPress context.
	 *
	 * @since 2022-02-08
	 *
	 * @return string Exception message.
	 */
	protected static function sys_temp_dir_exception_message_helper_for_wp() : string {
		return 'Unable to locate a private readable & writable system temp directory.' . "\n\n" .

			' EASY SOLUTION: Create a `wp-content/temp` directory and set (i.e., chmod) permissions to' . "\n" .
			' `700` or higher — until this message goes away. Once the web server gains read & write access,' . "\n" .
			' a private subdirectory structure will be configured automatically.' . "\n\n" .

			' Or, add the `C10N_SYS_TEMP_DIR` constant to your `wp-config.php` file (good alternative).' . "\n" .
			' Or, add a new `c10n.sys_temp_dir` setting to your `php.ini` file (good alternative).' . "\n" .
			' Or, configure the `sys_temp_dir` setting in your `php.ini` file (good alternative).' . "\n\n" .

			' To clarify further. The goal is to create a private readable & writable system temp directory.' . "\n" .
			' Please configure one or more of these options by pointing to a directory you’ve created.';
	}

	/**
	 * Gets exception message.
	 *
	 * - For a system temp directory failure.
	 *   - For default context.
	 *
	 * @since 2022-02-08
	 *
	 * @return string Exception message.
	 */
	protected static function sys_temp_dir_exception_message_helper_default() : string {
		return 'Unable to locate a private readable & writable system temp directory.' . "\n\n" .

			' EASY SOLUTION: Create a `/temp` directory in a location of your choosing.' . "\n" .
			' Add a new `c10n.sys_temp_dir` setting to your `php.ini` file. The value being an absolute' . "\n" .
			' directory path. Then, set (i.e., chmod) directory permissions to `700` or higher — until this' . "\n" .
			' message goes away. Once this application gains read & write access, a private' . "\n" .
			' subdirectory structure will be configured automatically.' . "\n\n" .

			' Or, add the `C10N_SYS_TEMP_DIR` constant to a PHP startup or auto-append file (good alternative).' . "\n\n" .

			' To clarify further. The goal is to create a private readable & writable system temp directory.' . "\n" .
			' Please configure one or more of these options by pointing to a directory you’ve created.';
	}

	/**
	 * Gets exception message.
	 *
	 * - For a system private directory failure.
	 *   - For WordPress context.
	 *
	 * @since 2022-02-08
	 *
	 * @return string Exception message.
	 */
	protected static function sys_private_dir_exception_message_helper_for_wp() : string {
		return 'Unable to locate a private readable & writable system data directory.' . "\n\n" .

			' EASY SOLUTION: Create a `wp-content/private` data directory and set (i.e., chmod) permissions to' . "\n" .
			' `700` or higher — until this message goes away. Once the web server gains read & write access,' . "\n" .
			' a private subdirectory structure will be configured automatically.' . "\n\n" .

			' Or, add the `C10N_SYS_PRIVATE_DIR` constant to your `wp-config.php` file (good alternative).' . "\n" .
			' Or, add a new `c10n.sys_private_dir` setting to your `php.ini` file (good alternative).' . "\n\n" .

			' To clarify further. The goal is to create a private readable & writable system data directory.' . "\n" .
			' Please configure one or more of these options by pointing to a directory you’ve created.';
	}

	/**
	 * Gets exception message.
	 *
	 * - For a system private directory failure.
	 *   - For default context.
	 *
	 * @since 2022-02-08
	 *
	 * @return string Exception message.
	 */
	protected static function sys_private_dir_exception_message_helper_default() : string {
		return 'Unable to locate a private readable & writable system data directory.' . "\n\n" .

			' EASY SOLUTION: Create a `/private` data directory in a location of your choosing.' . "\n" .
			' Add a new `c10n.sys_private_dir` setting to your `php.ini` file. The value being an absolute' . "\n" .
			' directory path. Then, set (i.e., chmod) directory permissions to `700` or higher — until this' . "\n" .
			' message goes away. Once this application gains read & write access, a private' . "\n" .
			' subdirectory structure will be configured automatically.' . "\n\n" .

			' Or, add the `C10N_SYS_PRIVATE_DIR` constant to a PHP startup or auto-append file (good alternative).' . "\n\n" .

			' To clarify further. The goal is to create a private readable & writable system data directory.' . "\n" .
			' Please configure one or more of these options by pointing to a directory you’ve created.';
	}
}
