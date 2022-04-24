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
namespace Clever_Canyon\Utilities\Traits\A6t\Brand\Magic;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\Brand
 */
trait Constructable_Members {
	/**
	 * Constructor.
	 *
	 * @param array $props Brand properties.
	 *
	 * @throws U\Fatal_Exception On missing or invalid property values.
	 *
	 * @noinspection PhpMultipleClassDeclarationsInspection
	 */
	public function __construct( array $props ) {
		parent::__construct();

		$this->org = $props[ 'org' ] ?? $this;
		$this->n7m = $props[ 'n7m' ] ?? '';

		$this->name      = $props[ 'name' ] ?? '';
		$this->namespace = $props[ 'namespace' ] ?? '';

		$this->slug = $props[ 'slug' ] ?? '';
		$this->var  = $props[ 'var' ] ?? '';

		$this->slug_prefix = $props[ 'slug_prefix' ] ?? '';
		$this->var_prefix  = $props[ 'var_prefix' ] ?? '';

		$this->aws        = U\Arr::objectify( u\iff_array( $props[ 'aws' ], [] ) );
		$this->google     = U\Arr::objectify( u\iff_array( $props[ 'google' ], [] ) );
		$this->cloudflare = U\Arr::objectify( u\iff_array( $props[ 'cloudflare' ], [] ) );

		if ( ! $this->org instanceof U\I7e\Brand ) {
			throw new U\Fatal_Exception( 'Missing or invalid prop: `org`.' );
		}
		foreach ( [ 'n7m', 'name', 'namespace', 'slug', 'var', 'slug_prefix', 'var_prefix' ] as $_prop ) {
			if ( ! is_string( $this->{$_prop} ) || '' === $this->{$_prop} ) {
				throw new U\Fatal_Exception( 'Missing or invalid prop: `' . $_prop . '`.' );
			}
		}
		foreach ( [ 'aws', 'google', 'cloudflare' ] as $_prop ) {
			if ( ! is_object( $this->{$_prop} ) || U\Obj::empty( $this->{$_prop} ) ) {
				throw new U\Fatal_Exception( 'Missing or invalid prop: `' . $_prop . '`.' );
			}
		}
	}
}
