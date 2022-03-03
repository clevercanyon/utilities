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
	 * @since 2022-03-02
	 *
	 * @param string $message Message.
	 * @param array  $args    Optional arguments.
	 *
	 *     string emoji    Optional emoji. Default is static environment var `SLACK_NOTIFY_EMOJI`.
	 *     string username Optional username. Default is static environment var `SLACK_NOTIFY_EMOJI`.
	 *     string channel  Optional channel ID. Default is static environment var `SLACK_NOTIFY_CHANNEL`.
	 *     string token    Optional bot API token. Default is static environment var: `SLACK_NOTIFY_TOKEN`.
	 *
	 * @return bool True on success.
	 *
	 * @throws U\Fatal_Exception If missing required arguments.
	 */
	public static function notify( string $message, array $args = [] ) : bool {
		$defaults = [
			'emoji'    => U\Env::static_var( 'SLACK_NOTIFY_EMOJI' ) ?: '',
			'username' => U\Env::static_var( 'SLACK_NOTIFY_USERNAME' ) ?: '',
			'channel'  => U\Env::static_var( 'SLACK_NOTIFY_CHANNEL' ) ?: '',
			'token'    => U\Env::static_var( 'SLACK_NOTIFY_TOKEN' ) ?: '',
		];
		$args     += $defaults;

		if ( ! $message || ! $args[ 'emoji' ] || ! $args[ 'username' ] || ! $args[ 'channel' ] || ! $args[ 'token' ] ) {
			throw new U\Fatal_Exception( 'Missing required arguments.' );
		}
		if ( 0 !== mb_strpos( $args[ 'emoji' ], ':' ) ) {
			$args[ 'emoji' ] = ':' . $args[ 'emoji' ] . ':';
		}
		$request_data = [
			'text'       => $message,
			'icon_emoji' => $args[ 'emoji' ],
			'username'   => $args[ 'username' ],
			'channel'    => $args[ 'channel' ],
			'parse'      => 'none',
			'mrkdwn'     => true,
		];
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
