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
namespace Clever_Canyon\Utilities\Traits\CLI\Utilities;

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
 * @see   U\CLI
 */
trait Chalk_Members {
	/**
	 * Output style escape map.
	 *
	 * @since 2022-01-09
	 */
	protected static array $style_es_map = [
		'none'       => '0',
		'bright'     => '1',
		'dim'        => '2',
		'underlined' => '4',
		'blink'      => '5',
		'inverted'   => '7',
		'hidden'     => '8',
	];

	/**
	 * Foreground color escape map.
	 *
	 * @since 2022-01-09
	 */
	protected static array $fg_color_es_map = [
		'none'          => '39',
		'black'         => '30',
		'red'           => '31',
		'green'         => '32',
		'yellow'        => '33',
		'blue'          => '34',
		'magenta'       => '35',
		'cyan'          => '36',
		'light-gray'    => '37',
		'dark-gray'     => '90',
		'light-red'     => '91',
		'light-green'   => '92',
		'light-yellow'  => '93',
		'light-blue'    => '94',
		'light-magenta' => '95',
		'light-cyan'    => '96',
		'white'         => '97',
	];

	/**
	 * Background color escape map.
	 *
	 * @since 2022-01-09
	 */
	protected static array $bg_color_es_map = [
		'none'          => '49',
		'black'         => '40',
		'red'           => '41',
		'green'         => '42',
		'yellow'        => '43',
		'blue'          => '44',
		'magenta'       => '45',
		'cyan'          => '46',
		'light-gray'    => '47',
		'dark-gray'     => '100',
		'light-red'     => '101',
		'light-green'   => '102',
		'light-yellow'  => '103',
		'light-blue'    => '104',
		'light-magenta' => '105',
		'light-cyan'    => '106',
		'white'         => '107',
	];

	/**
	 * Chalks (i.e., stylizes) data.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed        $data  Data to chalk (i.e., stylize).
	 *
	 * @param string|array $chalk Can be passed as a simple foreground color slug; e.g., `blue`, `green`, `red`, and others.
	 *                            Or, you can pass it as an array of slugs in this order: `[ fg, bg, style, ...style ]`.
	 *
	 *                            When passing an array, only the foreground color is required at key index `0`.
	 *                            That said, if you intend to pass a style code, you must pass a background color at key index `1`.
	 *                            If you'd like to bypass any value (e.g., background color) simply set that value to `none`.
	 *
	 *                            Instead of color slugs, you can also pass 256 8-bit color codes; {@see https://o5p.me/BV06XN}.
	 *                            256 8-bit works for both foreground and background colors in terminals that support 256 colors.
	 *
	 * @return string Styled string.
	 */
	public static function chalk( /* mixed */ $data, /* string|array */ $chalk = 'none' ) : string {
		assert( is_string( $chalk ) || is_array( $chalk ) );

		if ( ! U\Env::is_cli_256c() ) {
			return U\Str::stringify( $data, true );
		}
		$esc_sequences = [];
		$res_sequences = [];

		$chalk = (array) ( $chalk ?: 'none' );
		$chalk = array_values( $chalk ); // Re-key.
		assert( array_map( 'strval', $chalk ) === $chalk );

		foreach ( $chalk as $_key => $_chalk ) {
			if ( 'none' === $_chalk ) {
				continue; // No chalk.
			}
			switch ( $_key ) {
				case ( 0 === $_key ):
					$esc_sequences[] = U\CLI::fg_color_esc_seq( $_chalk );
					$res_sequences[] = U\CLI::fg_color_esc_seq( 'none' );
					break;
				case ( 1 === $_key ):
					$esc_sequences[] = U\CLI::bg_color_esc_seq( $_chalk );
					$res_sequences[] = U\CLI::bg_color_esc_seq( 'none' );
					break;
				case ( $_key >= 2 ):
				default: // Output styles.
					$esc_sequences[] = U\CLI::style_esc_seq( $_chalk );
					$res_sequences[] = U\CLI::style_esc_seq( 'none' );
					break;
			}
		}
		return implode( $esc_sequences ) . U\Str::stringify( $data, true ) . implode( array_reverse( $res_sequences ) );
	}

	/**
	 * Gets output style escape sequence.
	 *
	 * @since 2022-01-15
	 *
	 * @param string $style Output style slug.
	 *
	 * @return string Output style escape sequence.
	 */
	protected static function style_esc_seq( string $style ) : string {
		return "\033" . '[' . ( U\CLI::$style_es_map[ $style ] ?? U\CLI::$style_es_map[ 'none' ] ) . 'm';
	}

	/**
	 * Gets foreground color escape sequence.
	 *
	 * @since 2022-01-15
	 *
	 * @param string $color Foreground color slug, or 256 8-bit codes.
	 *                      {@see https://o5p.me/BV06XN}.
	 *
	 * @return string Foreground color escape sequence.
	 */
	protected static function fg_color_esc_seq( string $color ) : string {
		if ( is_numeric( $color ) ) {
			return "\033" . '[38;5;' . $color . 'm';
		}
		return "\033" . '[' . ( U\CLI::$fg_color_es_map[ $color ] ?? U\CLI::$fg_color_es_map[ 'none' ] ) . 'm';
	}

	/**
	 * Gets background color escape sequence.
	 *
	 * @since 2022-01-15
	 *
	 * @param string $color Background color slug, or 256 8-bit codes.
	 *                      {@see https://o5p.me/BV06XN}.
	 *
	 * @return string Background color escape sequence.
	 */
	protected static function bg_color_esc_seq( string $color ) : string {
		if ( is_numeric( $color ) ) {
			return "\033" . '[48;5;' . $color . 'm';
		}
		return "\033" . '[' . ( U\CLI::$bg_color_es_map[ $color ] ?? U\CLI::$bg_color_es_map[ 'none' ] ) . 'm';
	}
}
