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
namespace Clever_Canyon\Utilities\Traits\Slack\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

/**
 * File-specific.
 *
 * @since 2021-12-15
 */
use GuzzleHttp as Guzzle;

// </editor-fold>

/**
 * Utility members.
 *
 * @since 2021-12-15
 *
 * @see   U\Slack
 */
trait Notify_Members {
	/**
	 * Slack notifier.
	 *
	 * Required Slack app permissions:
	 * - `chat:write`
	 * - `chat:write.customize`
	 * - `chat:write.public`
	 *
	 * @since 2022-03-02
	 *
	 * @param string $message Markdown message.
	 * @param array  $args    Optional arguments.
	 *
	 *     string emoji    Optional emoji. Overrides default for Slack app.
	 *                     Default is value of static env var `C10N_SLACK_NOTIFY_EMOJI`.
	 *                     If empty, Slack will fall back on the icon configured for the app.
	 *
	 *     string username Optional username. Overrides default for Slack app.
	 *                     Default is value of static env var `C10N_SLACK_NOTIFY_USERNAME`.
	 *                     If empty, Slack will fall back on the username configured for the app.
	 *
	 *     string channel  Optional channel ID; i.e., where to send the message.
	 *                     Default is value of static env var `C10N_SLACK_NOTIFY_CHANNEL`.
	 *                     Required if static env var is not set. Must have one way or the other.
	 *
	 *     string token    Optional bot API token with adequate permissions.
	 *                     Default is value of static env var: `C10N_SLACK_NOTIFY_TOKEN`.
	 *                     Required if static env var is not set. Must have one way or the other.
	 *
	 * @return bool True on success.
	 *
	 * @throws U\Fatal_Exception If missing required arguments.
	 */
	public static function notify( string $message, array $args = [] ) : bool {
		$defaults = [
			'emoji'    => U\Env::static_var( 'C10N_SLACK_NOTIFY_EMOJI' ) ?: '',
			'username' => U\Env::static_var( 'C10N_SLACK_NOTIFY_USERNAME' ) ?: '',
			'channel'  => U\Env::static_var( 'C10N_SLACK_NOTIFY_CHANNEL' ) ?: '',
			'token'    => U\Env::static_var( 'C10N_SLACK_NOTIFY_TOKEN' ) ?: '',
		];
		$args     += $defaults; // Merge with defaults.

		if ( $args[ 'emoji' ] && ':' !== $args[ 'emoji' ][ 0 ] ) {
			$args[ 'emoji' ] = ':' . $args[ 'emoji' ] . ':';
		}
		if ( ! $message || ! $args[ 'channel' ] || ! $args[ 'token' ] ) {
			throw new U\Fatal_Exception( 'Missing required arguments.' );
		}
		$request_data = [
			'text'    => $message,
			'channel' => $args[ 'channel' ],
			'parse'   => 'none',
			'mrkdwn'  => true,
		];
		if ( $args[ 'emoji' ] ) {
			$request_data[ 'icon_emoji' ] = $args[ 'emoji' ];
		}
		if ( $args[ 'username' ] ) {
			$request_data[ 'username' ] = $args[ 'username' ];
		}
		try {
			$guzzle   = new Guzzle\Client();
			$endpoint = 'https://slack.com/api/chat.postMessage';

			$response      = $guzzle->post( $endpoint, [
				Guzzle\RequestOptions::CONNECT_TIMEOUT => 2,
				Guzzle\RequestOptions::TIMEOUT         => 2,
				Guzzle\RequestOptions::ALLOW_REDIRECTS => false,
				Guzzle\RequestOptions::HEADERS         => [
					'authorization' => 'Bearer ' . $args[ 'token' ],
					'content-type'  => 'application/json; charset=utf-8',
				],
				Guzzle\RequestOptions::BODY            => U\Str::json_encode( $request_data ),
			] );
			$response_data = U\Str::json_decode( $response->getBody()->getContents() );
			return is_object( $response_data ) && ! empty( $response_data->ok );

		} catch ( \Throwable $throwable ) {
			return false;
		}
	}
}
