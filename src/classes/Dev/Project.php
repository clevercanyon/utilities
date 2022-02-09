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
 * Project.
 *
 * @since 2021-12-15
 *
 * @property-read $dir
 * @property-read $file
 *
 * @property-read $json
 * @property-read $dev_json
 *
 * @property-read $type
 * @property-read $layout
 *
 * @property-read $version
 * @property-read $stable_tag
 *
 * @property-read $pkg_name
 * @property-read $pkg_name_hash
 *
 * @property-read $namespace_scope
 * @property-read $namespace_crux
 *
 * @property-read $brand_n7m
 * @property-read $brand_name
 *
 * @property-read $brand_slug
 * @property-read $brand_var
 *
 * @property-read $brand_slug_prefix
 * @property-read $brand_var_prefix
 *
 * @property-read $name
 * @property-read $slug
 * @property-read $var
 *
 * @property-read $slug_prefix
 * @property-read $var_prefix
 *
 * @property-read $unbranded_slug
 * @property-read $unbranded_var
 */
final class Project extends U\A6t\Base {
	/**
	 * OOP traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\A6t\Base\Magic\Readable_Members;

	/**
	 * Directory.
	 *
	 * @since 2021-12-15
	 */
	protected string $dir;

	/**
	 * `composer.json` file.
	 *
	 * @since 2021-12-15
	 */
	protected string $file;

	/**
	 * JSON props.
	 *
	 * @since 2021-12-15
	 */
	protected object $json;

	/**
	 * Dev.json props.
	 *
	 * @since 2021-12-15
	 */
	protected object $dev_json;

	/**
	 * Type; e.g., `library`.
	 *
	 * @since 2021-12-15
	 */
	protected string $type;

	/**
	 * Layout; e.g., `library`.
	 *
	 * @since 2021-12-15
	 */
	protected string $layout;

	/**
	 * Version; e.g., `1.0.0`.
	 *
	 * @since 2021-12-15
	 */
	protected string $version;

	/**
	 * Stable tag; e.g., `1.0.0`.
	 *
	 * @since 2021-12-15
	 */
	protected string $stable_tag;

	/**
	 * Pkg name; e.g., `clevercanyon/my-brand-my-project`.
	 *
	 * @since 2021-12-15
	 */
	protected string $pkg_name;

	/**
	 * Pkg name hash; e.g., `xae3c7c368fe2e3c`
	 *
	 * @since 2021-12-15
	 */
	protected string $pkg_name_hash;

	/**
	 * Namespace scope; e.g., `Xae3c7c368fe2e3c`
	 *
	 * @since 2021-12-15
	 */
	protected string $namespace_scope;

	/**
	 * Namespace crux; e.g., `My_Brand\My_Product`
	 *
	 * @since 2021-12-15
	 */
	protected string $namespace_crux;

	/**
	 * Brand n7m; e.g., `m5d`.
	 *
	 * @since 2021-12-15
	 */
	protected string $brand_n7m;

	/**
	 * Brand name; e.g., `My Brand`.
	 *
	 * @since 2021-12-15
	 */
	protected string $brand_name;

	/**
	 * Brand slug; e.g., `my-brand`.
	 *
	 * @since 2021-12-15
	 */
	protected string $brand_slug;

	/**
	 * Brand var; e.g., `my_brand`.
	 *
	 * @since 2021-12-15
	 */
	protected string $brand_var;

	/**
	 * Brand slug prefix (i.e., my-brand-).
	 *
	 * @since 2021-12-15
	 */
	protected string $brand_slug_prefix;

	/**
	 * Brand var prefix (i.e., my_brand_).
	 *
	 * @since 2021-12-15
	 */
	protected string $brand_var_prefix;

	/**
	 * Name; e.g., `My Project`.
	 *
	 * @since 2021-12-15
	 */
	protected string $name;

	/**
	 * Slug; e.g., `my-brand-my-project`.
	 *
	 * @since 2021-12-15
	 */
	protected string $slug;

	/**
	 * Var; e.g., `my_brand_my_project`.
	 *
	 * @since 2021-12-15
	 */
	protected string $var;

	/**
	 * Slug prefix (e.g., my-brand-my-project-x-).
	 *
	 * @since 2021-12-15
	 */
	protected string $slug_prefix;

	/**
	 * Var prefix (e.g., my_brand_my_project_x_).
	 *
	 * @since 2021-12-15
	 */
	protected string $var_prefix;

	/**
	 * Unbranded slug; e.g., `my-project`.
	 *
	 * @since 2021-12-15
	 */
	protected string $unbranded_slug;

	/**
	 * Unbranded var; e.g., `my_project`.
	 *
	 * @since 2021-12-15
	 */
	protected string $unbranded_var;

	/**
	 * Constructor.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $dir Directory.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	public function __construct( string $dir ) {
		parent::__construct();

		// Validate directory & file.

		$this->dir  = U\Fs::abs( $dir );
		$this->file = U\Dir::join( $this->dir, '/composer.json' );

		if ( ! $this->dir || ! is_dir( $this->dir ) ) {
			throw new U\Fatal_Exception( 'Missing `Project->dir`.' );
		}
		if ( ! $this->file || ! is_file( $this->file ) ) {
			throw new U\Fatal_Exception( 'Missing `Project->file`.' );
		}
		// Validate JSON properties.

		$this->dev_json = U\Dev\Dev::json( null, 'clevercanyon' );
		$this->json     = U\Dev\Composer::json( $this->dir, 'clevercanyon' );

		if ( ! isset( $this->json->name, $this->json->extra ) ) {
			throw new U\Fatal_Exception( 'Missing or extremely incomplete `Project->json` file.' );
		}
		if ( ! $this->json->name || ! is_string( $this->json->name )
			|| ! preg_match( U\Dev\Composer::PACKAGE_NAME_REGEXP, $this->json->name ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid data type for `Project->json->name`.' );
		}
		if ( ! $this->json->extra || ! is_object( $this->json->extra ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid data type for `Project->json->extra`.' );
		}
		// Validate type and layout properties.

		$this->type   = u\if_string_ne( $this->json->type ?? '', 'library' );
		$this->layout = u\if_string_ne( $this->extra_json_prop( '&.project.data.layout' ), 'library' );

		if ( ! $this->type || ! U\Str::is_slug( $this->type ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->type`.' );
		}
		if ( ! $this->layout || ! U\Str::is_slug( $this->layout ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->layout`.' );
		}
		// Validate version and stable tag properties.

		$this->version    = u\if_string( $this->extra_json_prop( '&.project.data.version' ), '' );
		$this->stable_tag = u\if_string( $this->extra_json_prop( '&.project.data.stable_tag' ), '' );

		if ( ! $this->version || ! U\Str::is_version( $this->version ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->version`.' );
		}
		if ( ! $this->stable_tag || ! U\Str::is_version( $this->stable_tag ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->stable_tag`.' );
		}
		// Validate package name properties.

		$this->pkg_name      = $this->json->name;
		$this->pkg_name_hash = U\Crypto::x_sha( $this->pkg_name );

		$this->namespace_scope = U\Str::uc_first( $this->pkg_name_hash );
		$this->namespace_crux  = ''; // Initialize; worked out below.

		if ( is_object( $this->json->autoload ?? null )
			&& is_object( $this->json->autoload->{'psr-4'} ?? null ) ) {
			$this->namespace_crux = array_key_first( (array) $this->json->autoload->{'psr-4'} );
			$this->namespace_crux = trim( u\if_string( $this->namespace_crux, '' ), '\\' );
		}
		if ( ! $this->pkg_name || ! preg_match( U\Dev\Composer::PACKAGE_NAME_REGEXP, $this->pkg_name ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->pkg_name`.' );
		}
		if ( ! $this->pkg_name_hash || ! preg_match( U\Dev\Composer::PACKAGE_NAME_HASH_REGEXP, $this->pkg_name_hash ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->pkg_name_hash`.' );
		}
		if ( ! $this->namespace_scope || ! preg_match( U\Pkg::NAMESPACE_SCOPE_REGEXP, $this->namespace_scope ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->pkg_namespace_scope`.' );
		}
		if ( ! $this->namespace_crux || ! preg_match( U\Pkg::NAMESPACE_CRUX_REGEXP, $this->namespace_crux ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->pkg_namespace_crux`.' );
		}
		// Validate brand properties.

		// @todo Update utilities and remove the `php-js-` prefix.

		$this->brand_n7m // Numeronym; e.g., `m5d`, `c10n`.
			= u\if_string( $this->extra_json_prop( '&.brand.data.n7m' ), '' );

		$this->brand_name = U\Brand::get( $this->brand_n7m, 'name' );
		$this->brand_slug = U\Brand::get( $this->brand_n7m, 'slug' );
		$this->brand_var  = U\Brand::get( $this->brand_n7m, 'var' );

		$this->brand_slug_prefix = U\Brand::get( $this->brand_n7m, 'slug_prefix' );
		$this->brand_var_prefix  = U\Brand::get( $this->brand_n7m, 'var_prefix' );

		if ( ! $this->brand_n7m || ! U\Str::is_n7m( $this->brand_n7m ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->brand_n7m`.' );
		}
		if ( ! $this->brand_name || ! U\Str::is_name( $this->brand_name ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->brand_name`.' );
		}
		if ( ! $this->brand_slug || ! U\Str::is_brand_slug( $this->brand_slug ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->brand_slug`.' );
		}
		if ( ! $this->brand_var || ! U\Str::is_brand_var( $this->brand_var ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->brand_var`.' );
		}
		if ( ! $this->brand_slug_prefix || ! U\Str::is_brand_slug_prefix( $this->brand_slug_prefix, $this->brand_slug ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->brand_slug_prefix`.' );
		}
		if ( ! $this->brand_var_prefix || ! U\Str::is_brand_var_prefix( $this->brand_var_prefix, $this->brand_var ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->brand_var_prefix`.' );
		}
		if ( U\Str::to_brand_slug( $this->brand_var ) !== $this->brand_slug ) {
			throw new U\Fatal_Exception( '`Project->brand_var` (as a brand slug) doesn’t match `Project->brand_slug`.' );
		}
		if ( U\Str::to_brand_slug( $this->brand_var ) !== U\Str::to_brand_slug( $this->brand_slug ) ) {
			throw new U\Fatal_Exception( '`Project->brand_var` and `Project->brand_slug` (as brand slugs) do not match.' );
		}
		if ( U\Str::to_brand_slug_prefix( $this->brand_var_prefix ) !== $this->brand_slug_prefix ) {
			throw new U\Fatal_Exception( '`Project->brand_var_prefix` (as a brand slug prefix) doesn’t match `Project->brand_slug_prefix`.' );
		}
		if ( U\Str::to_brand_slug_prefix( $this->brand_var_prefix ) !== U\Str::to_brand_slug_prefix( $this->brand_slug_prefix ) ) {
			throw new U\Fatal_Exception( '`Project->brand_var_prefix` and `Project->brand_slug_prefix` (as brand slug prefixes) do not match.' );
		}
		// Now, let's validate project name, slug, and var properties.

		$this->name = u\if_string( $this->extra_json_prop( '&.project.data.name' ), '' );
		$this->slug = basename( $this->pkg_name ); // Derived from Composer package name.
		$this->slug = // Fall back on full package name. See `README.md` in this directory.
			! U\Str::is_lede_slug( $this->slug, $this->brand_slug_prefix )
				? U\Str::to_lede_slug( $this->pkg_name ) : $this->slug;
		$this->var  = U\Str::to_lede_var( $this->slug );

		$this->slug_prefix = U\Str::to_lede_slug_prefix( $this->slug );
		$this->var_prefix  = U\Str::to_lede_var_prefix( $this->var );

		if ( ! $this->name || ! U\Str::is_name( $this->name ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->name`.' );
		}
		if ( ! $this->slug || ! U\Str::is_lede_slug( $this->slug, $this->brand_slug_prefix ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->slug`.' );
		}
		if ( ! $this->var || ! U\Str::is_lede_var( $this->var, $this->brand_var_prefix ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->var`.' );
		}
		if ( ! $this->slug_prefix || ! U\Str::is_lede_slug_prefix( $this->slug_prefix, $this->brand_slug_prefix ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->slug_prefix`.' );
		}
		if ( ! $this->var_prefix || ! U\Str::is_lede_var_prefix( $this->var_prefix, $this->brand_var_prefix ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->var_prefix`.' );
		}
		if ( U\Str::to_lede_slug( $this->var ) !== $this->slug ) {
			throw new U\Fatal_Exception( '`Project->var` (as a lede slug) doesn’t match `Project->slug`.' );
		}
		if ( U\Str::to_lede_slug( $this->var ) !== U\Str::to_lede_slug( $this->slug ) ) {
			throw new U\Fatal_Exception( '`Project->var` and `Project->slug` (as lede slugs) do not match.' );
		}
		if ( U\Str::to_lede_slug( $this->namespace_crux ) !== $this->slug || U\Str::to_lede_var( $this->namespace_crux ) !== $this->var ) {
			throw new U\Fatal_Exception( '`Project->namespace_crux` (as a lede slug|var) doesn’t match `Project->slug|var`.' );
		}
		if ( U\Str::to_lede_slug_prefix( $this->var_prefix ) !== $this->slug_prefix ) {
			throw new U\Fatal_Exception( '`Project->var_prefix` (as a lede slug prefix) doesn’t match `Project->slug_prefix`.' );
		}
		if ( U\Str::to_lede_slug_prefix( $this->var_prefix ) !== U\Str::to_lede_slug_prefix( $this->slug_prefix ) ) {
			throw new U\Fatal_Exception( '`Project->var_prefix` and `Project->slug_prefix` (as lede slug prefixes) do not match.' );
		}
		// Validate unbranded slug & var properties.

		$this->unbranded_slug = mb_substr( $this->slug, mb_strlen( $this->brand_slug_prefix ) );
		$this->unbranded_var  = mb_substr( $this->var, mb_strlen( $this->brand_var_prefix ) );

		if ( ! $this->unbranded_slug || ! U\Str::is_lede_slug( $this->unbranded_slug ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->unbranded_slug`.' );
		}
		if ( ! $this->unbranded_var || ! U\Str::is_lede_var( $this->unbranded_var ) ) {
			throw new U\Fatal_Exception( 'Missing or invalid characters in `Project->unbranded_var`.' );
		}
		if ( U\Str::to_lede_slug( $this->unbranded_var ) !== $this->unbranded_slug ) {
			throw new U\Fatal_Exception( '`Project->unbranded_var` (as a slug) doesn’t match `Project->unbranded_slug`.' );
		}
		if ( U\Str::to_lede_slug( $this->unbranded_var ) !== U\Str::to_lede_slug( $this->unbranded_slug ) ) {
			throw new U\Fatal_Exception( '`Project->unbranded_var` and `Project->unbranded_slug` (as lede slugs) do not match.' );
		}
		// Validate WordPress plugin & theme data.

		if ( $this->is_wp_plugin() && ! $this->wp_plugin_data() ) {
			throw new U\Fatal_Exception( 'Missing or incomplete `Project->wp_plugin_data()`.' );

		} elseif ( $this->is_wp_theme() && ! $this->wp_theme_data() ) {
			throw new U\Fatal_Exception( 'Missing or incomplete `Project->wp_theme_data()`.' );
		}
	}

	/**
	 * Has directory?
	 *
	 * @since 2021-12-15
	 *
	 * @param string $subpath Directory subpath.
	 *
	 * @return bool True if has directory.
	 */
	public function has_dir( string $subpath ) : bool {
		return is_dir( U\Dir::join( $this->dir, '/' . $subpath ) );
	}

	/**
	 * Has file?
	 *
	 * @since 2021-12-15
	 *
	 * @param string $subpath File subpath.
	 *
	 * @return bool True if has file.
	 */
	public function has_file( string $subpath ) : bool {
		return is_file( U\Dir::join( $this->dir, '/' . $subpath ) );
	}

	/**
	 * Distro library?
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if distro lib.
	 */
	public function is_distro_lib() : bool {
		return 'library' === $this->type
			&& 'distro-lib' === $this->layout;
	}

	/**
	 * WordPress project?
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if WordPress project.
	 */
	public function is_wp_project() : bool {
		return $this->is_wp_plugin() || $this->is_wp_theme();
	}

	/**
	 * WordPress plugin?
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if WordPress plugin.
	 */
	public function is_wp_plugin() : bool {
		return 'library' === $this->type
			&& 'wp-plugin' === $this->layout
			&& $this->has_file( 'trunk/plugin.php' );
	}

	/**
	 * WordPress theme?
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if WordPress theme.
	 */
	public function is_wp_theme() : bool {
		return 'library' === $this->type
			&& 'wp-theme' === $this->layout
			&& $this->has_file( 'trunk/theme.php' );
	}

	/**
	 * Gets `composer.json` extra property value, by path.
	 *
	 * @since 2022-01-11
	 *
	 * @param string $prop Prop path to query.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 */
	public function extra_json_prop( string $prop ) /* : mixed */ {
		return U\Obj::get_prop( $this->json->extra, preg_replace( '/^clevercanyon\./u', '&.', $prop ) );
	}

	/**
	 * Gets `.dev.json` property value, by path.
	 *
	 * @since 2022-01-11
	 *
	 * @param string $prop Prop path to query.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 */
	public function dev_json_prop( string $prop ) /* : mixed */ {
		return U\Obj::get_prop( $this->dev_json, preg_replace( '/^clevercanyon\./u', '&.', $prop ) );
	}

	/**
	 * Gets WordPress plugin data.
	 *
	 * @since 1.0.0
	 *
	 * @return object|false Plugin data.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 *
	 * @see   \WP_Groove\Framework\A6t\Plugin
	 */
	public function wp_plugin_data() /* : object|false */ {
		if ( null !== ( $cache = &$this->ins_cache( __FUNCTION__ ) ) ) {
			return $cache; // Cached already.
		}
		if ( ! $this->is_wp_plugin() ) {
			return $cache = false; // Not possible.
		}
		$data = (object) []; // Initialize.

		$data->dir         = U\Dir::join( $this->dir, '/trunk' );
		$data->file        = U\Dir::join( $this->dir, '/trunk/plugin.php' );
		$data->readme_file = U\Dir::join( $this->dir, '/trunk/readme.txt' );

		if ( ! is_dir( $data->dir )
			|| ! is_readable( $data->dir )

			|| ! is_file( $data->file )
			|| ! is_readable( $data->file )

			|| ! is_file( $data->readme_file )
			|| ! is_readable( $data->readme_file )
		) {
			throw new U\Fatal_Exception(
				'Missing or unreadable file in `' . $data->dir . '`.' .
				' Must have `plugin.php` and `readme.txt`.'
			);
		}
		$data->headers = $this->wp_plugin_file_headers();

		return $cache = $data;
	}

	/**
	 * Gets WordPress plugin file headers.
	 *
	 * @since 1.0.0
	 *
	 * @return object|null Plugin file headers.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 *
	 * @see   https://developer.wordpress.org/reference/functions/get_plugin_data/
	 */
	protected function wp_plugin_file_headers() /* : object|null */ : ?object {
		if ( ! $this->is_wp_plugin() ) {
			return null; // Not possible.
		}
		$data = (object) [
			'_map' => [
				'name' => 'Plugin Name',
				'url'  => 'Plugin URI',

				'description' => 'Description',
				'tags'        => 'Tags',

				'version'    => 'Version',
				'stable_tag' => 'Stable tag', // Custom addition.
				// ^ This header is not part of {@see \get_plugin_data()}, but here for consistency.

				'author'       => 'Author',
				'author_url'   => 'Author URI',
				'donate_url'   => 'Donate link',
				'contributors' => 'Contributors', // Custom addition.
				// ^ This header is not part of {@see \get_plugin_data()}, but here for consistency.

				'license'     => 'License',     // Custom addition.
				'license_url' => 'License URI', // Custom addition.
				// ^ These headers are not part of {@see \get_plugin_data()}, but here for consistency.

				'text_domain' => 'Text Domain',
				'domain_path' => 'Domain Path',

				'network' => 'Network',

				'requires_php_version'    => 'Requires PHP',
				'requires_wp_version'     => 'Requires at least',
				'tested_up_to_wp_version' => 'Tested up to', // Custom addition.
				// ^ This header is not part of {@see \get_plugin_data()}, but here for consistency.

				'update_url' => 'Update URI',
			],
		];
		$file = U\Dir::join( $this->dir, '/trunk/plugin.php' );

		$first_8kbs = U\File::read( $file, true, 8192 );
		$first_8kbs = str_replace( "\r", "\n", $first_8kbs );

		foreach ( $data->_map as $_prop => $_header ) {
			if ( preg_match( '/^(?:[ \t]*\<\?php)?[ \t\/*#@]*' . U\Str::esc_reg( $_header ) . '\:(.*)$/mi', $first_8kbs, $_m ) && $_m[ 1 ] ) {
				$data->{$_prop} = trim( preg_replace( '/\s*(?:\*\/|\?\>).*/', '', $_m[ 1 ] ) );
			} else {
				$data->{$_prop} = '';
			}
			if ( ! $data->{$_prop} && ! in_array( $_prop, [ 'network', 'update_url' ], true ) ) {
				throw new U\Fatal_Exception( 'Missing `' . $_header . '` in plugin file headers.' );
			}
		}
		return $data;
	}

	/**
	 * Gets a theme's data.
	 *
	 * @since 1.0.0
	 *
	 * @return object|false Theme data.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 *
	 * @see   \WP_Groove\Framework\A6t\Theme
	 */
	public function wp_theme_data() /* : object|false */ {
		if ( null !== ( $cache = &$this->ins_cache( __FUNCTION__ ) ) ) {
			return $cache; // Cached already.
		}
		if ( ! $this->is_wp_theme() ) {
			return $cache = false; // Not possible.
		}
		$data = (object) []; // Initialize.

		$data->dir            = U\Dir::join( $this->dir, '/trunk' );
		$data->file           = U\Dir::join( $this->dir, '/trunk/theme.php' );
		$data->functions_file = U\Dir::join( $this->dir, '/trunk/functions.php' );
		$data->style_file     = U\Dir::join( $this->dir, '/trunk/style.css' );
		$data->readme_file    = U\Dir::join( $this->dir, '/trunk/readme.txt' );

		if ( ! is_dir( $data->dir )
			|| ! is_readable( $data->dir )

			|| ! is_file( $data->file )
			|| ! is_readable( $data->file )

			|| ! is_file( $data->functions_file )
			|| ! is_readable( $data->functions_file )

			|| ! is_file( $data->style_file )
			|| ! is_readable( $data->style_file )

			|| ! is_file( $data->readme_file )
			|| ! is_readable( $data->readme_file )
		) {
			throw new U\Fatal_Exception(
				'Missing or unreadable file in `' . $data->dir . '`.' .
				' Must have `theme.php`, `functions.php`, `style.css`, and `readme.txt`.'
			);
		}
		$data->headers = $this->wp_theme_file_headers();

		return $cache = $data;
	}

	/**
	 * Gets theme file headers.
	 *
	 * @since 1.0.0
	 *
	 * @return object|null Theme file headers.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 *
	 * @see   https://developer.wordpress.org/reference/classes/wp_theme/
	 */
	protected function wp_theme_file_headers() /* : object|null */ : ?object {
		if ( ! $this->is_wp_theme() ) {
			return null; // Not possible.
		}
		$data = (object) [
			'_map' => [
				'name' => 'Theme Name',
				'url'  => 'Theme URI',

				'description' => 'Description',
				'tags'        => 'Tags',

				'template' => 'Template',

				'version'    => 'Version',
				'stable_tag' => 'Stable tag', // Custom addition.
				// ^ This header is not part of {@see \WP_Theme}, but here for consistency.
				'status'     => 'Status',     // Deprecated? Defaults to `publish` in core <https://git.io/JMwZo>.

				'author'       => 'Author',
				'author_url'   => 'Author URI',
				'donate_url'   => 'Donate link',  // Custom addition.
				// ^ This header is not part of {@see \WP_Theme}, but here for consistency.
				'contributors' => 'Contributors', // Custom addition.
				// ^ This header is not part of {@see \WP_Theme}, but here for consistency.

				'license'     => 'License',     // Custom addition.
				'license_url' => 'License URI', // Custom addition.
				// ^ These headers are not part of {@see \WP_Theme}, but here for consistency.

				'text_domain' => 'Text Domain',
				'domain_path' => 'Domain Path',

				'requires_php_version'    => 'Requires PHP',
				'requires_wp_version'     => 'Requires at least',
				'tested_up_to_wp_version' => 'Tested up to', // Custom addition.
				// ^ This header is not part of {@see \WP_Theme}, but here for consistency.

				'update_url' => 'Update URI', // Custom addition.
				// ^ This header is not part of {@see \WP_Theme}, but here for consistency.
			],
		];
		$file = U\Dir::join( $this->dir, '/trunk/theme.php' );

		$first_8kbs = U\File::read( $file, true, 8192 );
		$first_8kbs = str_replace( "\r", "\n", $first_8kbs );

		foreach ( $data->_map as $_prop => $_header ) {
			if ( preg_match( '/^(?:[ \t]*\<\?php)?[ \t\/*#@]*' . U\Str::esc_reg( $_header ) . '\:(.*)$/mi', $first_8kbs, $_m ) && $_m[ 1 ] ) {
				$data->{$_prop} = trim( preg_replace( '/\s*(?:\*\/|\?\>).*/', '', $_m[ 1 ] ) );
			} else {
				$data->{$_prop} = '';
			}
			if ( ! $data->{$_prop} && ! in_array( $_prop, [ 'template', 'status', 'update_url' ], true ) ) {
				throw new U\Fatal_Exception( 'Missing `' . $_header . '` in theme file headers.' );
			}
		}
		return $data;
	}

	/**
	 * Gets s3 bucket name.
	 *
	 * @since 2021-12-15
	 *
	 * @return string AWS S3 bucket name.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	public function s3_bucket() : string {
		$bucket_prop = '&.brand.aws.s3.bucket';

		if ( ! $bucket = strval( $this->extra_json_prop( $bucket_prop ) ) ) {
			throw new U\Fatal_Exception( 'Missing extra prop: `' . $bucket_prop . '` in: `' . $this->file . '`.' );
		}
		return $bucket;
	}

	/**
	 * Gets s3 bucket config.
	 *
	 * @since 2021-12-15
	 *
	 * @return array Bucket config suitable for {@see \Aws\S3\S3Client}.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	public function s3_bucket_config() : array {
		$access_key_prop = $this->brand_var . '.aws.credentials.access_key';
		$access_key      = $this->dev_json_prop( $access_key_prop );

		$secret_key_prop = $this->brand_var . '.aws.credentials.secret_key';
		$secret_key      = $this->dev_json_prop( $secret_key_prop );

		if ( ! $access_key || ! $secret_key ) {
			throw new U\Fatal_Exception(
				'Missing prop: `' . $access_key_prop . '` and/or `' . $secret_key_prop . '` in: `~/.dev.json`.' .
				' Please contact support for help with AWS access. ' .
				' We’ll also help you set up `~/.dev.json`.'
			);
		}
		return [
			'version'           => '2006-03-01',
			'region'            => 'us-east-1',
			'signature_version' => 'v4',
			'credentials'       => [
				'key'    => $access_key,
				'secret' => $secret_key,
			],
		];
	}

	/**
	 * Gets an HMAC SHA256 keyed hash.
	 *
	 * @param string $string String to hash.
	 *
	 * @return string HMAC SHA256 keyed hash. 64 bytes in length.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	public function s3_hash_hmac_sha256( string $string ) : string {
		$hash_hmac_key_prop = $this->brand_var . '.aws.s3.hash_hmac_key';
		$hash_hmac_key      = $this->dev_json_prop( $hash_hmac_key_prop );

		if ( ! $hash_hmac_key ) {
			throw new U\Fatal_Exception( 'Missing prop: `' . $hash_hmac_key_prop . '` in: `~/.dev.json`.' );
		}
		return hash_hmac( 'sha256', $string, $hash_hmac_key );
	}

	/**
	 * Gets local WordPress public HTML directory.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Local WordPress public HTML directory,
	 *                else empty string if not available in `~/.dev.json`.
	 */
	public function local_wp_public_html_dir() : string {
		$public_html_dir_prop = '&.local.wordpress.public_html_dir';
		$public_html_dir      = $this->dev_json_prop( $public_html_dir_prop );
		$public_html_dir      = U\Fs::normalize( $public_html_dir ?: '' );

		if ( ! $public_html_dir || ! is_dir( $public_html_dir ) ) {
			return ''; // Let this pass, as it's not vital to our needs right now.
		}
		return $public_html_dir;
	}

	/**
	 * Gets local WordPress versions.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Local WordPress version, else empty string if not available in `.dev.json`.
	 *
	 * @throws U\Fatal_Exception When it fails in unexpected ways; e.g., unreadable file.
	 */
	public function local_wp_version() : string {
		$public_html_dir = $this->local_wp_public_html_dir();
		$___version_file = U\Dir::join( $public_html_dir, '/wp-includes/version.php' );

		if ( ! $public_html_dir || ! is_dir( $public_html_dir ) ) {
			return ''; // Let this pass, as it's not vital to our needs right now.
		}
		if ( ! is_readable( $___version_file ) ) {
			throw new U\Fatal_Exception( 'Missing or unreadable local WP core file: `' . $___version_file . '`.' );
		}
		return ( function () use ( $___version_file ) : string {
			include $___version_file;

			if ( empty( $wp_version ) || ! is_string( $wp_version ) ) {
				throw new U\Fatal_Exception( 'Missing or unexpected local `$wp_version` in: `' . $___version_file . '`.' );
			}
			return $wp_version;
		} )();
	}

	/**
	 * Gets comp directory copy configuration.
	 *
	 * @since 2021-12-15
	 *
	 * @return array Comp directory copy configuration.
	 */
	public function comp_dir_copy_config() : array {
		return [
			'ignore'     => [
				U\Fs::gitignore_regexp_lookahead( 'positive' ),
			],
			'exceptions' => [],
		];
	}

	/**
	 * Gets comp directory prune configuration.
	 *
	 * @since 2021-12-15
	 *
	 * @return array Comp directory prune configuration.
	 */
	public function comp_dir_prune_config() : array {
		$config = [
			'prune'      => [
				// `.gitignore`, except `/vendor`, which we keep in final distros.
				U\Fs::gitignore_regexp_lookahead( 'positive', null, [ 'vendor' => false ] ),

				// All dotfiles.
				'/(?:^|.+?\/)\./ui',

				// All of these project config paths.
				'/(?:^|.+?\/)[^\/]+?\.(?:cjs|cts|xml|yml|yaml|json5?|neon|dist|lock)$/ui',
				'/(?:^|.+?\/)(?:babel|gulpfile|gruntfile)(?:\.(?:esm))?\.(?:jsx?|tsx?)$/ui',
				'/(?:^|.+?\/)[^\/]+?\.(?:cfg|config|babel)\.(?:jsx?|tsx?)$/ui',

				// All of these project source-only paths.
				'/(?:^|.+?\/)[^\/]+?\.(?:jsx|tsx?)$/ui',

				// All of these project bin paths.
				'/(?:^|.+?\/)(?:bin)$/ui',
				'/(?:^|.+?\/)[^\/]+?\.(?:exe|bat|sh|bash|zsh)$/ui',

				// All of these arbitrary archive paths.
				'/(?:^|.+?\/)[^\/]+?\.(?:iso|dmg|bz2|7z|zip|sketch|app|tar|tgz|gz|phar)$/ui',

				// All of these project test paths.
				'/(?:^|.+?\/)(?:tests?|test[_\-]files?|phpunit([_\-]tests?)?)$/ui',

				// All of these project doc paths.
				'/(?:^|.+?\/)(?:docs?|api[_\-]docs?|examples?|benchmarks?)$/ui',

				// All of these project build paths.
				'/(?:^|.+?\/)(?:builds?|make(files?)?)$/ui',

				// All of these project devop paths.
				'/(?:^|.+?\/)(?:ci|dev|dev[_\-]ops?|dev[_\-]?only)$/ui',

				// All of these project package paths.
				'/(?:^|.+?\/)(?:node[_\-]modules|jspm[_\-]packages|bower[_\-]components)$/ui',
			],
			'exceptions' => [
				'/(?:^|.+?\/)\.htaccess$/ui',
			],
		];
		if ( $this->is_wp_project() ) {
			$config[ 'prune' ] = array_merge( $config[ 'prune' ], [
				// The root directory of a WP project is dev-only.
				// We still keep `trunk/vendor`; i.e., this is a root exclusion only.
				'/^(?:vendor)$/ui',
				'/^(?:readme)\.(?:md|txt|rtf)$/ui',
			] );
		}
		return $config;
	}
}
