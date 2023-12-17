/**
 * Preact component.
 *
 * This depends on our consent API, which is web-only. For that reason, this component must be loaded and introduced
 * only by effects, and not inserted into DOM via SSR, or initial hydration, which would case diffing issues.
 *
 * @requiredEnv web
 */

import '#@initialize.ts';

import { $app, $dom, $is, $obj, $preact, $time, type $type } from '#index.ts';
import { default as As } from '#preact/components/as.tsx';

// Various icons needed for consent dialog interface.
import Fa6SolidArrowUpRightFromSquare from '~icons/fa6-solid/arrow-up-right-from-square';
import Fa6SolidCircleCheck from '~icons/fa6-solid/circle-check';
import Fa6SolidCircleChevronUp from '~icons/fa6-solid/circle-chevron-up';
import Fa6SolidCircleQuestion from '~icons/fa6-solid/circle-question';
import FluentEmojiFlatCookie from '~icons/fluent-emoji-flat/cookie';
import HeroiconsXMark from '~icons/heroicons/x-mark';

// These are explicit imports of stateless utilities in our consent API.
import { cookieData, updateCookieData, type Data, type OpenDialogEvent } from '#@preact/apis/web/consent.ts';

/**
 * Defines types.
 */
export type State = $preact.State<{
    isInitial: boolean;
    open: boolean;
    closing: boolean;
    data: Data;
}>;
export type Props = $preact.NoProps;
export type UpdateEvent = CustomEvent<{ data: Data }>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note `z-index` for consent dialog uses `103`, `104`, which sits right on top of our consent icon at `102`.
 *       Also, it sits on top of a site’s header and navigation dialog, which should be at `100`, `101`.
 */
export default function ConsentDialog(/* props: Props = {} */): $preact.VNode<Props> {
    // Acquires consent, brand, state.

    const brand = $app.brand(),
        consent = $preact.useConsent(),
        [state, updateState] = $preact.useReducedState((): State => {
            return $preact.initialState({
                isInitial: true,
                open: false,
                closing: false,
                data: cookieData(),
            });
        }),
        { prefs } = state.data;

    // Holds a reference to current state.

    const stateRef = $preact.useRef(state);
    stateRef.current = state; // Current state.

    // Holds a reference to our render counter.

    const renderCounter = $preact.useRef(0);
    renderCounter.current++; // Increments counter.

    // Holds a reference to our closing timeout.

    const closingTimeout = $preact.useRef() as $preact.Ref<$type.Timeout>;

    // Configures a few working variables.

    const isAnyPrefTrue = $preact.useMemo((): boolean => {
        return Object.entries({ ...prefs.optIn, ...prefs.optOut }).some(([, value]) => value || false);
    }, [prefs]);

    // Tracks a snapshot of prior preferences; i.e., before dialog opens.

    const prefsPriorToOpen = $preact.useRef($obj.cloneDeep(prefs) as Data['prefs']);
    if (!state.isInitial && !state.open) prefsPriorToOpen.current = $obj.cloneDeep(prefs) as Data['prefs'];

    // Defines prefixes for HTML IDs.

    const htmlIdPrefix = 'consent-dialog-',
        htmlIdPrefixForOptInPrefs = htmlIdPrefix + 'prefs-opt-in-',
        htmlIdPrefixForOptOutPrefs = htmlIdPrefix + 'prefs-opt-out-';

    // Opens dialog w/ optional preconfigured data.

    const openDialog = $preact.useCallback((data?: $type.PartialDeep<Data>): void => {
        clearTimeout(closingTimeout.current as $type.Timeout);
        updateState({ open: true, closing: false, data: data || {} });
    }, []);

    // Closes dialog w/ delay for fade-out animation.

    const closeDialog = $preact.useCallback((): void => {
        clearTimeout(closingTimeout.current as $type.Timeout);
        updateState({ closing: true }); // Allowing time for fade-out animation.
        closingTimeout.current = setTimeout((): void => updateState({ open: false, closing: false }), 150);
    }, []);

    // Gets all prefs as a boolean value.

    const allPrefsAs = $preact.useCallback(
        (value: boolean): Data['prefs'] => ({
            optIn: {
                acceptFunctionalityCookies: value,
                acceptAnalyticsCookies: value,
                acceptAdvertisingCookies: value,
            },
            optOut: {
                doNotSellOrSharePII: !value, // Inverse.
            },
        }),
        [],
    );
    // Queries current preferences.

    const queryPrefs = $preact.useCallback((): Data['prefs'] => {
        return {
            optIn: {
                acceptFunctionalityCookies: $dom.query('#' + htmlIdPrefixForOptInPrefs + 'accept-functionality-cookies:checked') ? true : false,
                acceptAnalyticsCookies: $dom.query('#' + htmlIdPrefixForOptInPrefs + 'accept-analytics-cookies:checked') ? true : false,
                acceptAdvertisingCookies: $dom.query('#' + htmlIdPrefixForOptInPrefs + 'accept-advertising-cookies:checked') ? true : false,
            },
            optOut: {
                doNotSellOrSharePII: $dom.query('#' + htmlIdPrefixForOptOutPrefs + 'do-not-sell-or-share-pii:checked') ? true : false,
            },
        };
    }, []);

    // Updates preferences.

    const updatePrefs = $preact.useCallback((prefs: Data['prefs']): void => {
        void consent.then(({ state: consentState }) => {
            // State updates.
            const updates = {
                data: {
                    prefs,
                    version: consentState.dataVersion,
                    lastUpdated: $time.stamp(),
                    lastUpdatedFrom: {
                        country: consentState.ipGeoData.country,
                        regionCode: consentState.ipGeoData.regionCode,
                    },
                },
            };
            // Computes next data, updates cookie data, state, and closes.
            const nextData = $preact.reduceState(stateRef.current, updates).data;
            updateCookieData(nextData), updateState(updates), closeDialog();

            // This fires an update event and then potentially reloads immediately.
            // Event listeners should assume no reload will occur, but its entirely possible.
            $dom.trigger(document, 'x:consentDialog:update', { data: nextData } as UpdateEvent['detail']);

            // This reloads the page, such that we honor critical preference updates immediately.
            // e.g., Something was true before, and now falsey. Or falsey before, and now true.
            if (
                Object.entries(prefsPriorToOpen.current.optIn).some(([key, oldValue]) => {
                    const newValue = (nextData.prefs.optIn as $type.Object)[key];
                    return oldValue && !newValue ? true : false;
                }) ||
                Object.entries(prefsPriorToOpen.current.optOut).some(([key, oldValue]) => {
                    const newValue = (nextData.prefs.optOut as $type.Object)[key];
                    return !oldValue && newValue ? true : false;
                })
            ) {
                location.reload(); // Reloads current location.
            }
        });
    }, []);

    // Defines various event handlers.

    const onSave = $preact.useCallback((): void => updatePrefs(queryPrefs()), []),
        onAcceptAll = $preact.useCallback((): void => updatePrefs(allPrefsAs(true)), []),
        onDeclineAll = $preact.useCallback((): void => updatePrefs(allPrefsAs(false)), []),
        onClose = $preact.useCallback((): void => updatePrefs(prefsPriorToOpen.current), []);

    const onCheckboxChange = $preact.useCallback((): void => updateState({ data: { prefs: queryPrefs() } }), []),
        onInadvertentSubmit = $preact.useCallback((event: Event): void => event.preventDefault(), []);

    const onOpenDialog = $preact.useCallback((event: OpenDialogEvent): void => openDialog(event.detail.data), []);
    $preact.useEffect((): (() => void) => $dom.on(document, 'x:consent:openDialog', onOpenDialog).cancel, []);
    // ↑ The `cancel` function is returned as the effect on teardown.

    // Checks if consent state needs the consent dialog open at first render.
    // This handles the case in which the consent dialog was not yet listening to DOM events.
    // Only relevent with initial state/render, because now we *are* listening to DOM events.

    if (state.isInitial && 1 === renderCounter.current) {
        void consent.then(({ state: consentState }): void => {
            if (!consentState.needsOpenDialog) return;
            const needsPrefconfiguredData = $is.object(consentState.needsOpenDialog);
            const preconfiguredData = needsPrefconfiguredData ? consentState.needsOpenDialog : {};
            if (!state.open) openDialog(preconfiguredData as $type.PartialDeep<Data>);
        });
    }
    // ---
    // VNode / JSX element tree.

    return (
        <As tag='x-preact-app-consent-dialog'>
            <dialog open={state.open} aria-label='Consent Dialog'>
                <div
                    style={{ zIndex: 103 }}
                    class='pointer-events-none fixed inset-0 h-screen w-screen bg-color-basic opacity-95 backdrop-blur-sm data-[open=false]:animate-fade-out data-[open=true]:animate-fade-in'
                    data-open={!state.closing && state.open}
                />
                <div
                    style={{ zIndex: 104 }}
                    class='fixed inset-1/2 h-min max-h-[calc(100vh_-_3rem)] w-[calc(100%_-_3rem)] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-none rounded border border-color-basic-fg/30 bg-color-basic p-6 text-color-basic-fg data-[open=false]:animate-fade-out data-[open=true]:animate-fade-in lte-tablet:p-4 lte-phone:max-h-[calc(100vh_-_1.5rem)] lte-phone:w-[calc(100%_-_1.5rem)] lte-phone:p-3'
                    data-open={!state.closing && state.open}
                >
                    <section aria-label='Consent Preferences'>
                        <button
                            type='button'
                            onClick={onClose}
                            title='Close Consent Dialog'
                            class='float-right -mr-2 -mt-2 ml-4 opacity-70 hover:opacity-100 lte-tablet:-mr-1 lte-tablet:-mt-1'
                        >
                            <span class='sr-only'>Close Consent Dialog</span>
                            <HeroiconsXMark class='inline h-auto w-4' aria-hidden='true' />
                        </button>
                        <div class='text-sm'>
                            <h2 class='-mt-2 text-lg text-color-basic-heading lte-tablet:-mt-1'>
                                <FluentEmojiFlatCookie class='-ml-1 mr-1 inline-block h-auto w-6' aria-hidden='true' />
                                Cookie Preferences
                            </h2>
                            <p class='mt-2 opacity-50'>
                                By using our website you consent to essential cookies in accordance with our{' '}
                                <a class='_ underline' href={brand.policies.privacy} target='_blank' title='Privacy Policy'>
                                    privacy&nbsp;policy <Fa6SolidArrowUpRightFromSquare class='inline h-auto w-2' aria-hidden='true' />
                                </a>{' '}
                                . If you click "Accept All", you are choosing to accept all cookies, including non-essential cookies. If you click "Decline All", you are choosing
                                to decline all non-essential cookies.
                            </p>
                            <form onSubmit={onInadvertentSubmit} class='mt-2' novalidate>
                                <div class='flex flex-wrap'>
                                    <div class='w-1/2 lte-tablet:w-full'>
                                        <div>
                                            <Checkbox
                                                label='Essential Cookies (always on)'
                                                labelProps={{ class: 'font-semibold' }}
                                                //
                                                id={htmlIdPrefixForOptInPrefs + 'always-on-essential-cookies'}
                                                class='accent-color-success'
                                                //
                                                disabled={true}
                                                checked={true}
                                            />{' '}
                                            <HelpIconToggle title='Learn More About Essential Cookies'>
                                                <p class='my-1 ml-2'>
                                                    <span class='opacity-50'>
                                                        Essential cookies are always enabled. They’re necessary for our site to function; e.g., account access, consent settings,
                                                        preferences. To learn more, please review our
                                                    </span>{' '}
                                                    <a href={brand.policies.privacy} target='_blank' title='Privacy Policy'>
                                                        privacy policy <Fa6SolidArrowUpRightFromSquare class='inline h-auto w-2' aria-hidden='true' />
                                                    </a>
                                                </p>
                                            </HelpIconToggle>
                                        </div>
                                        <div>
                                            <Checkbox
                                                label='Accept Functionality Cookies'
                                                labelProps={{ class: prefs.optOut.doNotSellOrSharePII ? 'opacity-50 line-through' : '' }}
                                                //
                                                id={htmlIdPrefixForOptInPrefs + 'accept-functionality-cookies'}
                                                class='accent-color-success'
                                                //
                                                disabled={prefs.optOut.doNotSellOrSharePII ? true : false}
                                                checked={!prefs.optOut.doNotSellOrSharePII && prefs.optIn.acceptFunctionalityCookies ? true : false}
                                                onChange={onCheckboxChange}
                                            />{' '}
                                            <HelpIconToggle title='Learn More About Functionality Cookies'>
                                                <p class='my-1 ml-2 opacity-50'>
                                                    Functionality cookies are similar to essential cookies. They remember preferences and improve user experience. However, unlike
                                                    essential cookies, they are not strictly necessary.
                                                </p>
                                            </HelpIconToggle>
                                        </div>
                                        <div>
                                            <Checkbox
                                                label='Accept Analytics Cookies'
                                                labelProps={{ class: prefs.optOut.doNotSellOrSharePII ? 'opacity-50 line-through' : '' }}
                                                //
                                                id={htmlIdPrefixForOptInPrefs + 'accept-analytics-cookies'}
                                                class='accent-color-success'
                                                //
                                                disabled={prefs.optOut.doNotSellOrSharePII ? true : false}
                                                checked={!prefs.optOut.doNotSellOrSharePII && prefs.optIn.acceptAnalyticsCookies ? true : false}
                                                onChange={onCheckboxChange}
                                            />{' '}
                                            <HelpIconToggle title='Learn More About Analytics Cookies'>
                                                <p class='my-1 ml-2 opacity-50'>
                                                    Analytics cookies measure user experience, traffic volume, traffic source, clicks, etc. We use these to optimize performance by
                                                    collecting information about how users interact with our site.
                                                </p>
                                            </HelpIconToggle>
                                        </div>
                                        <div>
                                            <Checkbox
                                                label='Accept Advertising Cookies'
                                                labelProps={{ class: prefs.optOut.doNotSellOrSharePII ? 'opacity-50 line-through' : '' }}
                                                //
                                                id={htmlIdPrefixForOptInPrefs + 'accept-advertising-cookies'}
                                                class='accent-color-success'
                                                //
                                                disabled={prefs.optOut.doNotSellOrSharePII ? true : false}
                                                checked={!prefs.optOut.doNotSellOrSharePII && prefs.optIn.acceptAdvertisingCookies ? true : false}
                                                onChange={onCheckboxChange}
                                            />{' '}
                                            <HelpIconToggle title='Learn More About Advertising Cookies'>
                                                <p class='ml-2 mt-1 opacity-50'>
                                                    Advertising cookies are used to identify visitors across sites; e.g., content partners, ad networks. We and our partners use
                                                    these to provide relevant ad content and to understand its effectiveness.
                                                </p>
                                            </HelpIconToggle>
                                        </div>
                                        <h3 class='mt-3 border-t border-color-basic-line pt-2 text-base text-color-basic-heading'>Opt-Out Preferences</h3>
                                        <div>
                                            <Checkbox
                                                label='Do Not Sell or Share My Personal Information'
                                                labelProps={{}}
                                                //
                                                id={htmlIdPrefixForOptOutPrefs + 'do-not-sell-or-share-pii'}
                                                class='accent-color-danger'
                                                //
                                                disabled={false}
                                                checked={prefs.optOut.doNotSellOrSharePII ? true : false}
                                                onChange={onCheckboxChange}
                                            />{' '}
                                            <HelpIconToggle title='Learn More About Opting Out'>
                                                <p class='ml-2 mt-1 opacity-50'>
                                                    Opting out declines all non-essential cookies &amp; disables selling or sharing of your personal data.
                                                </p>
                                            </HelpIconToggle>
                                        </div>
                                    </div>
                                    <div class='flex w-1/2 items-end justify-end gap-2.5 lte-tablet:mt-4 lte-tablet:w-full'>
                                        {isAnyPrefTrue ? (
                                            <Button onClick={onSave} class='bg-color-primary text-color-primary-fg' title='Save &amp; Close'>
                                                Save &amp; Close
                                            </Button>
                                        ) : (
                                            <Button withIcon={true} onClick={onAcceptAll} class='bg-color-primary text-color-primary-fg' title='Accept All Cookies'>
                                                <Fa6SolidCircleCheck class='-ml-0.5 inline-block h-auto w-5' aria-hidden='true' />
                                                Accept All
                                            </Button>
                                        )}
                                        <Button onClick={onDeclineAll} class='bg-color-dark text-color-dark-fg/70' title='Decline All Non-Essential Cookies'>
                                            Decline All
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </dialog>
        </As>
    );
}

// ---
// UI components.

/**
 * Defines types.
 */
type CheckboxProps = $preact.Props<
    Omit<Partial<$preact.Intrinsic['input']>, 'type'> & {
        id: string;
        label?: string;
        labelProps?: $preact.Props<Omit<Partial<$preact.Intrinsic['label']>, 'for'>>;
    }
>;
type HelpIconToggleState = { open: boolean };
type HelpIconToggleProps = $preact.Props<
    Omit<Partial<$preact.Intrinsic['button']>, 'type' | 'title' | 'aria-pressed' | 'onClick'> & {
        title: string;
        onClick?: (event: Event, setState: $preact.StateUpdater<HelpIconToggleState>) => void;
    } & { children: $preact.Children }
>;
type ButtonProps = $preact.Props<Partial<$preact.Intrinsic['button']> & { withIcon?: boolean }>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
function Checkbox(props: CheckboxProps): $preact.VNode<CheckboxProps> {
    const cursorClass = props.disabled //
            ? 'cursor-not-allowed'
            : 'cursor-pointer',
        pointerEventsClass = props.disabled //
            ? 'pointer-events-none'
            : '';
    return (
        <span class={cursorClass}>
            <label
                for={props.id}
                title={props.labelProps?.title || props.title}
                class={$preact.classes(pointerEventsClass, props.labelProps)}
                {...$preact.omitProps(props.labelProps || {}, ['title', 'class', 'children'])}
            >
                <input
                    type='checkbox'
                    tabIndex={props.tabIndex || 0}
                    class={$preact.classes('select-none rounded', pointerEventsClass, props)}
                    {...(props.disabled ? { 'aria-disabled': 'true', onClick: (e): void => e.preventDefault() } : {})}
                    {...$preact.omitProps(props, ['disabled', 'tabIndex', 'label', 'labelProps', 'class', 'children'])}
                />{' '}
                {props.label}
                {props.children}
            </label>
        </span>
    );
}

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
function HelpIconToggle(props: HelpIconToggleProps): $preact.VNode<HelpIconToggleProps> {
    type State = HelpIconToggleState; // Shorter internal alias.
    const [state, setState] = $preact.useState({ open: false } as State);

    const onClick = $preact.useCallback(
        (event: Event): void => {
            event.preventDefault();
            setState((state: State) => ({ ...state, open: !state.open }));
            if (props.onClick) props.onClick(event, setState);
        },
        [props.onClick],
    );
    return (
        <>
            <button
                type='button'
                onClick={onClick}
                aria-pressed={state.open}
                tabIndex={props.tabIndex || 0}
                class={$preact.classes('opacity-70 hover:opacity-100', props)}
                {...$preact.omitProps(props, ['onClick', 'tabIndex', 'class', 'children'])}
            >
                <span class='sr-only'>{props.title}</span>
                {state.open ? (
                    <Fa6SolidCircleChevronUp class='inline-block h-auto w-3' aria-hidden='true' />
                ) : (
                    <Fa6SolidCircleQuestion class='inline-block h-auto w-3' aria-hidden='true' />
                )}
            </button>
            <div class={state.open ? '' : 'hidden'}>{props.children}</div>
        </>
    );
}

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
function Button(props: ButtonProps): $preact.VNode<ButtonProps> {
    return (
        <button
            type={props.type || 'button'}
            tabIndex={props.tabIndex || 0}
            style={{
                padding: '.375em .625em',
                ...(props.withIcon ? { columnGap: '.375em' } : {}),
            }}
            class={$preact.classes(
                'select-none rounded font-semibold',
                props.withIcon ? 'inline-flex items-center' : '', // + `columnGap` above.
                props.disabled ? 'cursor-not-allowed opacity-50' : 'opacity-90 hover:opacity-100',
                props, // Any classes in props.
            )}
            {...$preact.omitProps(props, ['type', 'tabIndex', 'withIcon', 'class', 'children'])}
        >
            {props.children}
        </button>
    );
}
