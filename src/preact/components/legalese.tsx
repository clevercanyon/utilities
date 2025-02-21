/**
 * Preact component.
 */

import '#@initialize.ts';

import { $app, $preact } from '#index.ts';
import Fa6SolidArrowUpRightFromSquare from '~icons/fa6-solid/arrow-up-right-from-square';

/**
 * Defines types.
 */
export type Props = $preact.NoProps;

/**
 * Defines tokens.
 *
 * Why are there so many crazy variables here? The intention is to optimize for minification. i.e., By using as many
 * variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome. Remember,
 * variable names can be minified, so variable name length is not an issue.
 */
const tꓺrel = 'rel',
    tꓺhref = 'href',
    tꓺtitle = 'title',
    tꓺ_blank = '_blank',
    tꓺtarget = 'target',
    tꓺonClick = 'onClick',
    tꓺexternal = 'external',
    tꓺvꓺundefined = undefined,
    tꓺcꓺopacityᱼ50 = 'opacity-50',
    tꓺprivacyᱼpolicy = 'privacy-policy',
    tꓺtermsᱼofᱼservice = 'terms-of-service',
    tꓺcꓺwhitespaceᱼnowrap = 'whitespace-nowrap',
    tꓺcꓺfontAllSmallCapsClasses = tꓺcꓺwhitespaceᱼnowrap + ' leading-3',
    tꓺsꓺfontAllSmallCapsStyles = { fontVariantCaps: 'all-small-caps', fontSize: '1.3em' };

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Legalese(/* props: Props */): $preact.VNode<Props> {
    const brand = $app.brand(),
        consent = $preact.useConsent(),
        { state: layoutState } = $preact.useLayout();

    const { statusURL, policies } = brand,
        // Selects brand logo image based on layout context; i.e., on dark or light bg.
        brandLogoKey = ('on' + (layoutState?.themeIsDark ? 'Dark' : 'Light') + 'Bg') as 'onDarkBg' | 'onLightBg';

    const { org: brandOrg } = brand,
        { legalName: brandOrgLegalName } = brandOrg,
        brandOrgLogo = brandOrg.logo, // For width/height ratio.
        brandOrgLogoRatio = brandOrgLogo.width.toString() + '/' + brandOrgLogo.height.toString(),
        brandOrgLogoSVG = brandOrgLogo[brandLogoKey].svg;

    const { org: brandOrgOrg } = brandOrg,
        { legalName: brandOrgOrgLegalName } = brandOrgOrg,
        brandOrgOrgLogo = brandOrgOrg.logo, // For width/height ratio.
        brandOrgOrgLogoRatio = brandOrgOrgLogo.width.toString() + '/' + brandOrgOrgLogo.height.toString(),
        brandOrgOrgLogoSVG = brandOrgOrgLogo[brandLogoKey].svg;

    const onClickOpenConsentDialog = $preact.useCallback((event: Event): void => {
        event.preventDefault(), void consent.then(({ openDialog }) => openDialog());
    }, []);

    const legalLinks = $preact.useMemo(
            () => [
                {
                    [tꓺtitle]: 'Terms',
                    [tꓺhref]: policies.terms,
                    [tꓺtarget]: brandOrgOrg === brand ? tꓺvꓺundefined : tꓺ_blank,
                    [tꓺrel]: tꓺtermsᱼofᱼservice + (brandOrgOrg === brand ? '' : ' ' + tꓺexternal),
                },
                {
                    [tꓺtitle]: 'Cookies',
                    [tꓺhref]: policies.cookies,
                    [tꓺtarget]: brandOrgOrg === brand ? tꓺvꓺundefined : tꓺ_blank,
                    [tꓺrel]: brandOrgOrg === brand ? tꓺvꓺundefined : tꓺexternal,
                },
                {
                    [tꓺtitle]: 'Privacy',
                    [tꓺhref]: policies.privacy,
                    [tꓺtarget]: brandOrgOrg === brand ? tꓺvꓺundefined : tꓺ_blank,
                    [tꓺrel]: tꓺprivacyᱼpolicy + (brandOrgOrg === brand ? '' : ' ' + tꓺexternal),
                },
                {
                    [tꓺtitle]: 'My Privacy Choices',
                    [tꓺhref]: policies.privacy,
                    [tꓺtarget]: brandOrgOrg === brand ? tꓺvꓺundefined : tꓺ_blank,
                    [tꓺrel]: brandOrgOrg === brand ? tꓺvꓺundefined : tꓺexternal,
                    [tꓺonClick]: onClickOpenConsentDialog,
                },
                {
                    [tꓺtitle]: 'Do Not Sell or Share My Personal Information',
                    [tꓺhref]: policies.dsar, // Data subject access request.
                    [tꓺtarget]: brandOrgOrg === brand ? tꓺvꓺundefined : tꓺ_blank,
                    [tꓺrel]: brandOrgOrg === brand ? tꓺvꓺundefined : tꓺexternal,
                },
                {
                    [tꓺtitle]: 'Network Status',
                    [tꓺhref]: statusURL, // Network system status page.
                    [tꓺtarget]: tꓺ_blank, // Must be hosted by a third party.
                    [tꓺrel]: tꓺexternal, // Not `nofollow` — we want it indexed.
                },
            ],
            [],
        ),
        currentYear = $preact.useMemo(() => new Date().getFullYear().toString(), []);

    return (
        <section class='mt-12 text-xs leading-none lte-tablet:mt-6 lte-phone:mt-4' aria-label='Legalese'>
            {brandOrg !== brand && (
                <div class='mb-2'>
                    <span class='lte-phone:block'>
                        <span class={tꓺcꓺopacityᱼ50}>Brought to you by</span>{' '}
                        <a href={brandOrg.url} target='_blank'>
                            <img
                                class={'-mt-0.5 inline ' + (brandOrgOrg !== brandOrg ? 'h-3.5' : 'h-4')}
                                style={{ aspectRatio: brandOrgLogoRatio }}
                                src={brandOrgLogoSVG}
                                alt={brandOrgLegalName}
                                title={brandOrgLegalName}
                                loading='lazy'
                            />
                        </a>
                        {brandOrgOrg === brandOrg ? <span class={tꓺcꓺopacityᱼ50}>.</span> : ''}
                    </span>
                    {brandOrgOrg !== brandOrg && (
                        <span class='ml-2 inline-block lte-phone:ml-0 lte-phone:mt-1 lte-phone:block'>
                            <span class={tꓺcꓺopacityᱼ50}>… a</span>{' '}
                            <a href={brandOrgOrg.url} target='_blank'>
                                <img
                                    class='-mt-0.5 inline h-4'
                                    style={{ aspectRatio: brandOrgOrgLogoRatio }}
                                    src={brandOrgOrgLogoSVG}
                                    alt={brandOrgOrgLegalName}
                                    title={brandOrgOrgLegalName}
                                    loading='lazy'
                                />
                            </a>{' '}
                            <span class={tꓺcꓺopacityᱼ50}>production.</span>
                        </span>
                    )}
                </div>
            )}
            <div>
                <span class={tꓺcꓺopacityᱼ50}>
                    <span class={tꓺcꓺfontAllSmallCapsClasses} style={tꓺsꓺfontAllSmallCapsStyles}>
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
                                <>{brandOrg.name}™ is a&nbsp;trademark&nbsp;of&nbsp;</>
                            )}
                            {/* Circular reference allows this to work for both cases. */}
                            <span class={tꓺcꓺfontAllSmallCapsClasses} style={tꓺsꓺfontAllSmallCapsStyles}>
                                {brandOrgOrg.legalName}
                            </span>
                            .
                        </>
                    )}
                </span>
            </div>
            <div class='mx-auto mt-2 flex flex-wrap justify-center gap-2 divide-x divide-color-footer-fg/30 leading-tight lte-tablet:gap-x-4 lte-tablet:divide-x-0'>
                {legalLinks.map(({ title, href, target, rel, onClick }, key) => {
                    return (
                        <a
                            key={key}
                            title={title}
                            target={target}
                            href={href}
                            rel={rel}
                            onClick={onClick}
                            class={$preact.classes(
                                'text-color-footer-fg',
                                'pl-2 lte-tablet:pl-0',
                                onClick ? 'decoration-dotted' : '',
                                tꓺ_blank === target ? tꓺcꓺwhitespaceᱼnowrap : '',
                            )}
                            {...(onClick ? { 'data-no-location-change': '' } : {})}
                        >
                            {title}
                            {tꓺ_blank === target && <Fa6SolidArrowUpRightFromSquare class='ml-1 inline-block h-2 w-2' aria-hidden='true' />}
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
