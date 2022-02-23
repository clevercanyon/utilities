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
trait Readline_Members {
	/**
	 * Gets a y|n confirmation.
	 *
	 * @since        2021-12-15
	 *
	 * @param string $question Question.
	 *
	 * @return bool True if answer is yes.
	 */
	public static function confirm( string $question ) : bool {
		$question = rtrim( $question, U\Str::TRIM_CHARS . ':' );
		$question .= ' [y|n]: ';

		U\CLI::stdout( $question, false );

		if ( $bash = U\CLI::can_bash() ) { // Better user experience.
			$bash_cmd = 'read -n 1 -r; [[ "${REPLY:-}" =~ ^[Yy]$ ]] || exit 1;';
			$answer   = 0 === U\CLI::run( [ $bash, '-c', $bash_cmd ], null, false ) ? 'y' : 'n';
		} else {
			$answer = U\CLI::stdin_bytes( true, 1 );
		}
		U\CLI::stdout( "\n", false ); // Line break.

		return 'y' === mb_strtolower( $answer );
	}

	/**
	 * Gets an answer to a question.
	 *
	 * @since        2021-12-15
	 *
	 * @param string        $question Question.
	 * @param bool          $required Required? Default is `true`.
	 * @param callable|null $v8r      Optional validator. Default is `null` (no validation).
	 * @param string|null   $default  Default value that a user can select by simply pressing enter key.
	 *
	 * @return string Answer to the question; else empty string.
	 */
	public static function question(
		string $question,
		bool $required = true,
		?callable $v8r = null,
		?string $default = null
	) : string {
		if ( isset( $default ) ) {
			$question = rtrim( $question, U\Str::TRIM_CHARS . ':' );
			$question .= ' [' . $default . ']: ';
		}
		U\CLI::stdout( $question, false );

		$answer = null; // Initialize.

		if ( $required ) {
			while ( null === $answer ) {
				$answer = U\CLI::stdin_lines( true, 1 );
				$answer = '' === $answer && isset( $default ) ? $default : $answer;

				if ( '' === $answer || ( $v8r && ! $v8r( $answer ) ) ) {
					$answer = null; // Continue iterating.
					U\CLI::error( 'Invalid. Please try again.' );
				}
			}
			return $answer;
		}
		if ( $v8r ) {
			while ( null === $answer ) {
				$answer = U\CLI::stdin_lines( true, 1 );
				$answer = '' === $answer && isset( $default ) ? $default : $answer;

				if ( '' !== $answer && ! $v8r( $answer ) ) {
					$answer = null; // Continue iterating.
					U\CLI::error( 'Invalid. Please try again.' );
				}
			}
			return $answer;
		}
		$answer = U\CLI::stdin_lines( true, 1 );
		$answer = '' === $answer && isset( $default ) ? $default : $answer;
		return $answer;
	}
}
