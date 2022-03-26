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
namespace Clever_Canyon\Utilities\Traits\HTML\Utilities;

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
use League\CommonMark\Environment\Environment as Common_Mark_Environment;
use League\CommonMark\Normalizer\TextNormalizerInterface as Common_Mark_Text_Normalizer_Interface;

use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension as Common_Mark_Core_Extension;
use League\CommonMark\Extension\InlinesOnly\InlinesOnlyExtension as Common_Mark_Inlines_Only_Extension;

use League\CommonMark\Extension\Autolink\AutolinkExtension as Common_Mark_Autolink_Extension;
use League\CommonMark\Extension\DisallowedRawHtml\DisallowedRawHtmlExtension as Common_Mark_Disallowed_Raw_Html_Extension;
use League\CommonMark\Extension\Strikethrough\StrikethroughExtension as Common_Mark_Strikethrough_Extension;
use League\CommonMark\Extension\Table\TableExtension as Common_Mark_Table_Extension;
use League\CommonMark\Extension\TaskList\TaskListExtension as Common_Mark_Task_List_Extension;

use League\CommonMark\Extension\Attributes\AttributesExtension as Common_Mark_Attributes_Extension;
use League\CommonMark\Extension\DescriptionList\DescriptionListExtension as Common_Mark_Description_List_Extension;
use League\CommonMark\Extension\ExternalLink\ExternalLinkExtension as Common_Mark_External_Link_Extension;
use League\CommonMark\Extension\Footnote\FootnoteExtension as Common_Mark_Footnote_Extension;
use League\CommonMark\Extension\HeadingPermalink\HeadingPermalinkExtension as Common_Mark_Heading_Permalink_Extension;
use League\CommonMark\Extension\Mention\MentionExtension as Common_Mark_Mention_Extension;
use League\CommonMark\Extension\Mention\Mention as Common_Mark_Mention;
use League\CommonMark\Extension\TableOfContents\TableOfContentsExtension as Common_Mark_Table_Of_Contents_Extension;
use League\CommonMark\Extension\SmartPunct\SmartPunctExtension as Common_Mark_Smart_Punct_Extension;

use League\CommonMark\MarkdownConverter as Common_Mark_Markdown_Converter;
use League\CommonMark\MarkdownConverter as Converter;

// </editor-fold>

/**
 * Utility members.
 *
 * @since 2021-12-15
 *
 * @see   U\HTML
 */
trait Markup_Members {
	/**
	 * Markdown to HTML markup.
	 *
	 * @since 2022-02-12
	 *
	 * @param string         $markdown  Markdown. Any existing <HTML> <tags>
	 *                                  are preserved when converting to markup.
	 *
	 * @param Converter|null $converter Optional custom converter.
	 *                                  {@see U\HTML::markdown_converter()}.
	 *
	 * @return string Markdown converted to HTML markup.
	 *
	 * @throws U\Fatal_Exception In debug mode; on any failure.
	 */
	public static function markup(
		string $markdown,
		/* Common_Mark_Markdown_Converter|null */ ?Converter $converter = null
	) : string {
		static $default_converter; // Memoize.
		$default_converter ??= U\HTML::markdown_converter();
		$converter         ??= $default_converter;

		try { // Catch runtime exceptions.
			return trim( $converter->convert( $markdown )->__toString() );

		} catch ( \Throwable $throwable ) {
			if ( U\Env::in_debug_mode() ) {
				throw new U\Fatal_Exception( $throwable->getMessage() );
			}
			return $markdown;
		}
	}

	/**
	 * Markdown to HTML markup (inlines only).
	 *
	 * @since 2022-02-12
	 *
	 * @param string $markdown Markdown. Any existing <HTML> <tags>
	 *                         are preserved when converting to markup.
	 *
	 * @return string Markdown converted to HTML markup.
	 *
	 *                * Only inline markdown is converted to markup;
	 *                  e.g., bold, italic, links, code, etc.
	 *
	 * @throws U\Fatal_Exception In debug mode; on any failure.
	 */
	public static function markup_io( string $markdown ) : string {
		static $converter; // Memoize.
		$converter ??= U\HTML::markdown_converter( [ 'inlines_only' => true ] );

		try { // Catch runtime exceptions.
			return trim( $converter->convert( $markdown )->__toString() );

		} catch ( \Throwable $throwable ) {
			if ( U\Env::in_debug_mode() ) {
				throw new U\Fatal_Exception( $throwable->getMessage() );
			}
			return $markdown;
		}
	}

	/**
	 * Markdown to safe HTML markup.
	 *
	 * @since 2022-02-12
	 *
	 * @param string $markdown Markdown. Any existing <HTML> <tags>
	 *                         are stripped before converting to markup.
	 *
	 * @return string Markdown converted to safe HTML markup.
	 *
	 * @throws U\Fatal_Exception In debug mode; on any failure.
	 */
	public static function markup_safe( string $markdown ) : string {
		static $converter; // Memoize.
		$converter ??= U\HTML::markdown_converter( [ 'safe' => true ] );

		try { // Catch runtime exceptions.
			return trim( $converter->convert( $markdown )->__toString() );

		} catch ( \Throwable $throwable ) {
			if ( U\Env::in_debug_mode() ) {
				throw new U\Fatal_Exception( $throwable->getMessage() );
			}
			return $markdown;
		}
	}

	/**
	 * Markdown to safe HTML markup (inlines only).
	 *
	 * @since 2022-02-12
	 *
	 * @param string $markdown Markdown. Any existing <HTML> <tags>
	 *                         are stripped before converting to markup.
	 *
	 * @return string Markdown converted to safe HTML markup.
	 *
	 *                * Only inline markdown is converted to markup;
	 *                  e.g., bold, italic, links, code, etc.
	 *
	 * @throws U\Fatal_Exception In debug mode; on any failure.
	 */
	public static function markup_safe_io( string $markdown ) : string {
		static $converter; // Memoize.
		$converter ??= U\HTML::markdown_converter( [ 'safe' => true, 'inlines_only' => true ] );

		try { // Catch runtime exceptions.
			return trim( $converter->convert( $markdown )->__toString() );

		} catch ( \Throwable $throwable ) {
			if ( U\Env::in_debug_mode() ) {
				throw new U\Fatal_Exception( $throwable->getMessage() );
			}
			return $markdown;
		}
	}

	/**
	 * Gets markdown converter.
	 *
	 * @since 2022-02-12
	 *
	 * @param array $config Optional configuration overrides.
	 *
	 * @return Converter Markdown converter.
	 *
	 * @see   https://commonmark.thephpleague.com/2.2/extensions/overview/
	 */
	public static function markdown_converter( array $config = [] ) : Converter {
		$safe       = $inlines_only = false;
		$extensions = []; // Empty = all applicable.

		if ( isset( $config[ 'safe' ] ) ) {
			$safe = ! empty( $config[ 'safe' ] );
		}
		if ( isset( $config[ 'inlines_only' ] ) ) {
			$inlines_only = ! empty( $config[ 'inlines_only' ] );
		}
		if ( isset( $config[ 'extensions' ] ) ) {
			$extensions = (array) $config[ 'extensions' ];
		}
		unset( $config[ 'safe' ], $config[ 'inlines_only' ], $config[ 'extensions' ] );

		if ( $safe ) {
			$default_config = [
				'html_input'         => 'strip',
				'allow_unsafe_links' => false,
				'max_nesting_level'  => 50,
			];
		} else {
			$default_config = [
				'html_input'         => 'allow',
				'allow_unsafe_links' => true,
				'max_nesting_level'  => 50,
			];
		}
		$default_config[ 'slug_normalizer' ] = [
			'instance' => new class implements Common_Mark_Text_Normalizer_Interface {
				/**
				 * Slug normalizer.
				 *
				 * @since 2022-02-12
				 *
				 * @param string     $text    Text to normalize.
				 * @param array|null $context Additional context (optional).
				 *
				 * `$context` may include (but is not required to include) the following:
				 *   - `prefix` - A string prefix to prepend to each normalized result.
				 *   - `length` - The requested maximum length.
				 *   - `node`   - The node we're normalizing text for.
				 *
				 * Implementations do not have to use or respect any information within `$context`.
				 */
				public function normalize( string $text, array $context = null ) : string {
					static $used_already = []; // Memoize.

					$slug = U\Crypto::x_sha( U\Str::to_slug( $text ), 12 );
					$slug = U\Arr::maybe_prefix_key( $slug, $used_already, 'o' );

					$used_already[ $slug ] = 0;

					return $slug;
				}
			},
		];
		if ( $safe || in_array( 'disallowed-raw-html', $extensions, true ) ) {
			// {@see https://commonmark.thephpleague.com/2.2/extensions/disallowed-raw-html/}.
			$default_config[ 'disallowed_raw_html' ] = [
				'disallowed_tags' => [
					'title',
					'textarea',
					'style',
					'xmp',
					'iframe',
					'noembed',
					'noframes',
					'script',
					'plaintext',
				],
			];
		}
		if ( ! $extensions || in_array( 'external-link', $extensions, true ) ) {
			// {@see https://commonmark.thephpleague.com/2.2/extensions/external-links/}.
			$default_config[ 'external_link' ] = [
				'internal_hosts'     => [
					U\URL::current_host( false ), // Faster matching.
					'/^(?:.*\.)?' . U\Str::esc_regexp( U\URL::current_root_host( false ) ) . '(?:\:[0-9]+)?$/ui',
				],
				'html_class'         => 'm6d-x-link',
				'nofollow'           => 'external',
				'noopener'           => 'external',
				'noreferrer'         => 'external',
				'open_in_new_window' => true,
			];
		}
		if ( ! $extensions || in_array( 'mention', $extensions, true ) ) {
			// {@see https://commonmark.thephpleague.com/2.2/extensions/mentions/}.
			$default_config[ 'mentions' ] = [
				'twitter_usernames' => [
					'prefix'    => '@',
					'pattern'   => '[A-Za-z0-9_]{1,15}\b',
					'generator' => function ( Common_Mark_Mention $mention ) : ?Common_Mark_Mention {
						if ( $username = $mention->getIdentifier() ) {
							$mention->setUrl( 'https://twitter.com/' . $username );
							return $mention;
						} else {
							return null; // No match.
						}
					},
				],
				'github_issues'     => [
					'prefix'    => '&',
					'pattern'   => '\/[A-Za-z0-9]+#[0-9]+\b',
					'generator' => function ( Common_Mark_Mention $mention ) : ?Common_Mark_Mention {
						if ( preg_match( '/^&\/([A-Za-z0-9]+)#([0-9]+)$/u', $mention->getPrefix() . $mention->getIdentifier(), $m ) ) {
							$mention->setUrl( 'https://github.com/clevercanyon/' . $m[ 1 ] . '/issues/' . $m[ 2 ] );
							return $mention;
						} else {
							return null; // No match.
						}
					},
				],
			];
		}
		if ( ! $safe && ! $inlines_only && ( ! $extensions || in_array( 'heading-permalink', $extensions, true ) ) ) {
			// {@see https://commonmark.thephpleague.com/2.2/extensions/heading-permalinks/}.
			$default_config[ 'heading_permalink' ] = [
				'html_class'        => 'm6d-heading-permalink hidden',
				'id_prefix'         => 'm6d-a4r',
				'fragment_prefix'   => 'm6d-a4r',
				'insert'            => 'after',
				'min_heading_level' => 1,
				'max_heading_level' => 6,
				'title'             => 'Permalink',
				'symbol'            => '', // Use CSS icon.
				'aria_hidden'       => true,
			];
		}
		if ( ! $safe && ! $inlines_only && ( ! $extensions || in_array( 'table-of-contents', $extensions, true ) ) ) {
			// {@see https://commonmark.thephpleague.com/2.2/extensions/table-of-contents/}.
			$default_config[ 'table_of_contents' ] = [
				'html_class'        => 'm6d-table-of-contents',
				'position'          => 'placeholder',
				'placeholder'       => '[table-of-contents]',
				'normalize'         => 'relative',
				'style'             => 'bullet',
				'min_heading_level' => 2,
				'max_heading_level' => 4,
			];
		}
		if ( ! $safe && ! $inlines_only && ( ! $extensions || in_array( 'footnote', $extensions, true ) ) ) {
			// {@see https://commonmark.thephpleague.com/2.2/extensions/footnotes/}.
			$default_config[ 'footnote' ] = [
				'backref_class'      => 'm6d-footnote-backref',
				'backref_symbol'     => '↩',
				'container_add_hr'   => true,
				'container_class'    => 'm6d-footnotes',
				'ref_class'          => 'm6d-footnote-ref',
				'ref_id_prefix'      => 'm6d-fnref:',
				'footnote_class'     => 'm6d-footnote',
				'footnote_id_prefix' => 'm6d-fn:',
			];
		}
		$config      = U\Bundle::super_merge( $default_config, $config );
		$environment = new Common_Mark_Environment( $config );

		if ( $inlines_only ) { // Inlines-only parser.
			// {@see https://commonmark.thephpleague.com/2.2/extensions/inlines-only/}.
			$environment->addExtension( new Common_Mark_Inlines_Only_Extension() );
		} else {
			$environment->addExtension( new Common_Mark_Core_Extension() );
		}
		if ( $safe || in_array( 'disallowed-raw-html', $extensions, true ) ) {
			$environment->addExtension( new Common_Mark_Disallowed_Raw_Html_Extension() );
		}
		if ( ! $extensions || in_array( 'autolink', $extensions, true ) ) {
			$environment->addExtension( new Common_Mark_Autolink_Extension() );
		}
		if ( ! $extensions || in_array( 'external-link', $extensions, true ) ) {
			$environment->addExtension( new Common_Mark_External_Link_Extension() );
		}
		if ( ! $extensions || in_array( 'mention', $extensions, true ) ) {
			$environment->addExtension( new Common_Mark_Mention_Extension() );
		}
		if ( ! $extensions || in_array( 'strikethrough', $extensions, true ) ) {
			$environment->addExtension( new Common_Mark_Strikethrough_Extension() );
		}
		if ( ! $extensions || in_array( 'smart-punct', $extensions, true ) ) {
			$environment->addExtension( new Common_Mark_Smart_Punct_Extension() );
		}
		if ( ! $safe && ( ! $extensions || in_array( 'attributes', $extensions, true ) ) ) {
			$environment->addExtension( new Common_Mark_Attributes_Extension() );
		}
		if ( ! $inlines_only && ( ! $extensions || in_array( 'table', $extensions, true ) ) ) {
			$environment->addExtension( new Common_Mark_Table_Extension() );
		}
		if ( ! $inlines_only && ( ! $extensions || in_array( 'task-list', $extensions, true ) ) ) {
			$environment->addExtension( new Common_Mark_Task_List_Extension() );
		}
		if ( ! $inlines_only && ( ! $extensions || in_array( 'description-list', $extensions, true ) ) ) {
			$environment->addExtension( new Common_Mark_Description_List_Extension() );
		}
		if ( ! $safe && ! $inlines_only && ( ! $extensions || in_array( 'heading-permalink', $extensions, true ) ) ) {
			$environment->addExtension( new Common_Mark_Heading_Permalink_Extension() );
		}
		if ( ! $safe && ! $inlines_only && ( ! $extensions || in_array( 'table-of-contents', $extensions, true ) ) ) {
			$environment->addExtension( new Common_Mark_Table_Of_Contents_Extension() );
		}
		if ( ! $safe && ! $inlines_only && ( ! $extensions || in_array( 'footnote', $extensions, true ) ) ) {
			$environment->addExtension( new Common_Mark_Footnote_Extension() );
		}
		return new Common_Mark_Markdown_Converter( $environment );
	}
}
