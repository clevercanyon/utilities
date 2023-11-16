/**
 * Preact component.
 */

import Fa6SolidArrowUpRightFromSquare from '~icons/fa6-solid/arrow-up-right-from-square';
import { $env, $preact, type $type } from '../../index.ts';

/**
 * Defines types.
 */
export type Props = $preact.BasicPropsNoKeyRefChildren<object>;

/**
 * Defines (t)ext, (v)alue, (c)lass, and (s)tyle tokens.
 *
 * Why are there so many crazy variables here? The intention is to optimize for minification. i.e., By using as many
 * variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome. Remember,
 * variable names can be minified, so variable name length is not an issue.
 */
const tꓺ_href = 'href',
    tꓺ_title = 'title',
    tꓺ_blank = '_blank',
    tꓺ_target = 'target',
    tꓺ_onClick = 'onClick',
    vꓺundefined = undefined,
    cꓺopacity50 = 'opacity-50',
    cꓺwhitespaceNoWrap = 'whitespace-nowrap',
    cꓺopacity90Hover100 = 'opacity-90 hover:opacity-100',
    cꓺallSmallCaps = cꓺwhitespaceNoWrap + ' text-base leading-3',
    sꓺallSmallCaps = { fontVariantCaps: 'all-small-caps' };

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Legalese(/* props: Props */): $preact.VNode<Props> {
    const consent = $preact.useConsent();
    const { state: layoutState } = $preact.useLayout();
    const brand = $env.get('APP_BRAND') as $type.Brand;

    const { policies } = brand;
    const { terms, privacy } = policies;
    // Selects brand logo image based on layout context; i.e., on dark or light bg.
    const brandLogoKey = ('on' + (layoutState?.themeIsDark ? 'Dark' : 'Light') + 'Bg') as 'onDarkBg' | 'onLightBg';

    const { org: brandOrg } = brand;
    const { legalName: brandOrgLegalName } = brandOrg;
    const brandOrgLogoSVG = brandOrg.logo[brandLogoKey].svg;

    const { org: brandOrgOrg } = brandOrg;
    const { legalName: brandOrgOrgLegalName } = brandOrgOrg;
    const brandOrgOrgLogoSVG = brandOrgOrg.logo[brandLogoKey].svg;

    const onClickOpenConsentDialog = $preact.useCallback((event: Event): void => {
        event.preventDefault();
        void consent.then(({ openDialog }) => openDialog());
    }, []);
    const legalLinks = $preact.useMemo(
        () => [
            {
                [tꓺ_title]: 'My Privacy Choices',
                [tꓺ_onClick]: onClickOpenConsentDialog,
                [tꓺ_href]: privacy,
            },
            {
                [tꓺ_title]: 'Do Not Sell or Share My Personal Information',
                [tꓺ_onClick]: onClickOpenConsentDialog,
                [tꓺ_href]: privacy,
            },
            {
                [tꓺ_title]: 'Terms',
                [tꓺ_href]: terms,
                [tꓺ_target]: brandOrgOrg === brand ? vꓺundefined : tꓺ_blank,
            },
            {
                [tꓺ_title]: 'Privacy',
                [tꓺ_href]: privacy,
                [tꓺ_target]: brandOrgOrg === brand ? vꓺundefined : tꓺ_blank,
            },
        ],
        [],
    );
    const currentYear = $preact.useMemo(() => new Date().getFullYear().toString(), []);

    return (
        <section class='mt-12 text-xs leading-none lte-tablet:mt-6 lte-phone:mt-4' aria-label='Legalese'>
            {brandOrg !== brand && (
                <div class='mb-2'>
                    <span class='lte-phone:block'>
                        <span class={cꓺopacity50}>Brought to you by</span>{' '}
                        <a class={cꓺopacity90Hover100} href={brandOrg.url} target='_blank'>
                            <img class='-mt-0.5 inline h-3.5 w-auto' src={brandOrgLogoSVG} alt={brandOrgLegalName} title={brandOrgLegalName} />
                        </a>
                        {brandOrgOrg === brandOrg ? <span class={cꓺopacity50}>.</span> : ''}
                    </span>
                    {brandOrgOrg !== brandOrg && (
                        <span class='ml-2 inline-block lte-phone:ml-0 lte-phone:mt-1 lte-phone:block'>
                            <span class={cꓺopacity50}>… a</span>{' '}
                            <a class={cꓺopacity90Hover100} href={brandOrgOrg.url} target='_blank'>
                                <img class='-mt-0.5 inline h-4 w-auto' src={brandOrgOrgLogoSVG} alt={brandOrgOrgLegalName} title={brandOrgOrgLegalName} />
                            </a>{' '}
                            <span class={cꓺopacity50}>production.</span>
                        </span>
                    )}
                </div>
            )}
            <div>
                <span class={cꓺopacity50}>
                    <span class={cꓺallSmallCaps} style={sꓺallSmallCaps}>
                        © {currentYear}
                    </span>{' '}
                    All Rights Reserved.{' '}
                    {(brandOrg !== brand || 'corp' === brand.type) && (
                        <>
                            {brandOrgOrg !== brandOrg ? (
                                <>
                                    {brandOrg.name}™ and {brandOrgOrg.name}™ are&nbsp;trademarks&nbsp;of&nbsp;
                                </>
                            ) : (
                                <>{brandOrg.name}™ is a &nbsp;trademark&nbsp;of&nbsp;</>
                            )}
                            {/* Circular reference allows this to work for both cases. */}
                            <span class={cꓺallSmallCaps} style={sꓺallSmallCaps}>
                                {brandOrgOrg.legalName}
                            </span>
                            .
                        </>
                    )}
                </span>
            </div>
            <div class='mx-auto mt-2 leading-tight lte-tablet:max-w-sm'>
                {legalLinks.map(({ title, target, href, onClick }, key) => (
                    <a
                        key={key}
                        title={title}
                        target={target}
                        href={href}
                        onClick={onClick}
                        class={$preact.classes(
                            'text-color-footer-fg opacity-75',
                            onClick ? 'decoration-dotted' : '',
                            tꓺ_blank === target ? cꓺwhitespaceNoWrap : '',
                            0 === key ? '' : 'ml-2 border-l border-color-footer-fg/30 pl-2',
                        )}
                    >
                        {title}
                        {tꓺ_blank === target && <Fa6SolidArrowUpRightFromSquare class='ml-1 inline-block h-auto w-2' aria-hidden='true' />}
                    </a>
                ))}
            </div>
        </section>
    );
}
