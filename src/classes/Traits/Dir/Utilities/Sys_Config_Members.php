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
trait Sys_Config_Members {
	/**
	 * Gets system config directory.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|null $nsc_fqn Namespace crux or FQN. Default is this package's `__NAMESPACE__`.
	 *                             Pass a `__NAMESPACE__`, `__CLASS__`, `::class`, `__TRAIT__`, `__METHOD__`,
	 *                             or `__FUNCTION__` (outside of a class). Or anything else that is a FQN.
	 *
	 * @return string System config directory.
	 *
	 * @throws U\Fatal_Exception On failure to locate.
	 *
	 * @see   U\Dir::sys_dir_helper()
	 * @see   U\Dir::sys_config_generator()
	 */
	public static function sys_config( /*string|null */ ?string $nsc_fqn = null ) : string {
		$this_fqn_crux  = U\Pkg::fqn_crux( __METHOD__ );
		$namespace_crux = U\Pkg::namespace_crux( $nsc_fqn );

		$basename                = 'config'; // Systems directory basename.
		$mem_cache_key_part_args = [ $this_fqn_crux, [ $namespace_crux, $basename ] ];
		$mem_cache               = U\Mem::cache( ...$mem_cache_key_part_args );

		if ( null !== $mem_cache && is_dir( $mem_cache ) ) {
			return $mem_cache; // Saves time.
		}
		foreach ( U\Dir::sys_config_generator() as $_base_dir ) {
			if ( $_dir = U\Dir::sys_dir_helper( $_base_dir, $nsc_fqn, $basename ) ) {
				U\Mem::cache( ...$mem_cache_key_part_args, ...[ $_dir ] );
				return $_dir;
			}
		}
		if ( U\Env::is_wordpress() ) {
			throw new U\Fatal_Exception( U\Dir::sys_private_dir_exception_message_helper_for_wp() );
		} else {
			throw new U\Fatal_Exception( U\Dir::sys_private_dir_exception_message_helper_default() );
		}
	}

	/**
	 * System base config directory generator.
	 *
	 * @since 2022-02-03
	 *
	 * @return \Generator|string[]|array[] Potential base directories for a system config sub-directory.
	 *                                     To clarify further. Directories returned by this generator will serve
	 *                                     as a potential base directory for a system config sub-directory
	 *                                     — to be created by {@see U\Dir::sys_dir_helper()}.
	 *
	 * @see   U\Dir::sys_config()
	 * @see   U\Dir::sys_dir_helper()
	 *
	 * @see   https://o5p.me/E3reZU
	 * @see   https://o5p.me/1Rgbqa
	 * @see   https://wiki.archlinux.org/title/XDG_Base_Directory
	 * @see   https://www.gnu.org/prep/standards/html_node/Directory-Variables.html
	 */
	protected static function sys_config_generator() : \Generator {
		if ( $_this_dir = U\Env::static_var( 'C10N_SYS_PRIVATE_DIR' ) ) {
			yield [ $_this_dir, 'autocreate' => true ];
		}
		if ( defined( 'C10N_SYS_PRIVATE_DIR' ) && ( $_this_dir = C10N_SYS_PRIVATE_DIR ) ) {
			yield [ $_this_dir, 'autocreate' => true ];
		}
		if ( U\Env::can_use_function( 'get_cfg_var' ) && ( $_this_dir = get_cfg_var( 'c10n.sys_private_dir' ) ) ) {
			yield [ $_this_dir, 'autocreate' => true ];
		}
		if ( U\Env::is_wordpress() && ( $_this_dir = U\Dir::join( WP_CONTENT_DIR, '/private' ) ) ) {
			yield [ $_this_dir, 'autocreate' => true ];
		}
		if ( U\Env::is_web() && ! U\Env::is_wordpress() && ( $_this_dir = U\Env::var( 'DOCUMENT_ROOT' ) ) ) {
			yield [ U\Dir::join( $_this_dir, '/private' ), 'autocreate' => true ];
		}
		if ( U\Env::is_mac() ) {
			if ( $home_dir ??= U\Env::var( 'HOME' ) ) {
				yield U\Dir::join( $home_dir, '/Library/Preferences' );

			} elseif ( $user ??= U\Env::var( 'USER' ) ) {
				yield '/Users/' . $user . '/Library/Preferences';
			}
		} elseif ( U\Env::is_windows() ) {
			if ( $_this_dir = U\Env::var( 'APPDATA' ) ) {
				yield $_this_dir; // Roaming.
			}
			if ( $_this_dir = U\Env::var( 'LOCALAPPDATA' ) ) {
				yield $_this_dir; // Local; secondary.
			}
			if ( $home_dir ??= U\Env::var( 'HOME' ) ) {
				yield U\Dir::join( $home_dir, '/AppData/Roaming' );
				yield U\Dir::join( $home_dir, '/AppData/Local' );

			} elseif ( $user ??= U\Env::var( 'USER' ) ) {
				if ( $home_drive ??= U\Env::var( 'HOMEDRIVE' ) ) {
					yield $home_drive . '/Users/' . $user . '/AppData/Roaming';
					yield $home_drive . '/Users/' . $user . '/AppData/Local';
				}
				yield 'c:/Users/' . $user . '/AppData/Roaming';
				yield 'c:/Users/' . $user . '/AppData/Local';
			}
		}
		if ( U\Env::is_unix_based() || U\Env::is_unknown_os() ) {
			/**
			 * XDG specification:
			 *
			 * @see https://o5p.me/bCHwhe
			 * @see https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
			 *
			 * > If, when attempting to write a file, the destination directory is non-existent an
			 * > attempt should be made to create it with permission 0700. If the destination directory
			 * > exists already the permissions should not be changed. The application should be prepared
			 * > to handle the case where the file could not be written, either because the directory
			 * > was non-existent and could not be created, or for any other reason. In such case
			 * > it may choose to present an error message to the user.
			 */
			if ( $_this_dir = U\Env::var( 'XDG_CONFIG_HOME' ) ) {
				yield [ $_this_dir, 'autocreate' => true ]; // XDG location.
			}
			if ( ( $home_dir ??= U\Env::var( 'HOME' ) ) && is_dir( $home_dir ) ) {
				yield [ U\Dir::join( $home_dir, '/.config' ), 'autocreate' => true ];

			} elseif ( ( $user ??= U\Env::var( 'USER' ) ) && is_dir( '/home/' . $user ) ) {
				yield [ '/home/' . $user . '/.config', 'autocreate' => true ];
			}
			if ( $_this_dirs = U\Env::var( 'XDG_CONFIG_DIRS' ) ) {
				foreach ( explode( ':', $_this_dirs ) as $_this_dir ) {
					if ( 0 === mb_strpos( $_this_dir, '/usr/local/' ) ) {
						yield $_this_dir; // XDG location.
					}
				}
			}
			yield '/usr/local/etc/xdg';
			yield '/usr/local/etc';
		}
	}
}
