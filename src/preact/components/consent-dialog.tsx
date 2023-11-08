/**
 * Preact component.
 *
 * This depends on our consent API, which is web-only. For that reason, this component must be loaded and introduced
 * only by effects, and not inserted into DOM via SSR, or initial hydration, which could case diffing issues.
 *
 * @requiredEnv web
 */

import '../../resources/init.ts';

import { $dom, $env, $is, $obj, $preact, $time, type $type } from '../../index.ts';
import { RadixDialog } from '../components.tsx';
import { default as As } from './as.tsx';

// Various icons needed for consent dialog interface.
import Fa6SolidArrowUpRightFromSquare from '~icons/fa6-solid/arrow-up-right-from-square';
import Fa6SolidCircleCheck from '~icons/fa6-solid/circle-check';
import Fa6SolidCircleChevronUp from '~icons/fa6-solid/circle-chevron-up';
import Fa6SolidCircleQuestion from '~icons/fa6-solid/circle-question';
import FluentEmojiFlatCookie from '~icons/fluent-emoji-flat/cookie';
import HeroiconsXMark from '~icons/heroicons/x-mark';

// These are explicit imports of stateless utilities in our consent API.
import { cookieData, updateCookieData, type Data, type OpenDialogEvent } from '../../resources/preact/apis/web/consent.ts';

/**
 * Defines types.
 */
export type State = $preact.State<{
    debug: boolean;
    isInitial: boolean;
    open: boolean;
    data: Data;
}>;
export type Props = $preact.BasicPropsNoKeyRefChildren<object>;
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
export default function ConsentDialog(unusedꓺprops: Props = {}): $preact.VNode<Props> {
    // Acquires brand and state.

    const brand = $env.get('APP_BRAND') as $type.Brand;
    const [state, updateState] = $preact.useReducedState((): State => {
        return $preact.initialState({
            debug: $env.inDebugMode({ consent: '!!' }),
            isInitial: true,
            open: false,
            data: cookieData(),
        });
    });
    const { prefs } = state.data;

    // Holds a reference to current state.

    const stateRef = $preact.useRef(state);
    stateRef.current = state; // Current state.

    // Holds a reference to our render counter.

    const renderCounter = $preact.useRef(0);
    renderCounter.current++; // Increments counter.

    // Configures a few working variables.

    const isAnyPrefTrue = $preact.useMemo((): boolean => {
        return Object.entries({ ...prefs.optIn, ...prefs.optOut }).some(([, value]) => value || false);
    }, [prefs]);

    // Tracks a snapshot of prior preferences; i.e., before dialog opens.

    const prefsPriorToOpen = $preact.useRef($obj.cloneDeep(prefs) as Data['prefs']);
    if (!state.isInitial && !state.open) prefsPriorToOpen.current = $obj.cloneDeep(prefs) as Data['prefs'];

    // Checks if consent state needs the consent dialog open at first render.
    // This handles the case in which the consent dialog was not yet listening to DOM events.
    // Only relevent with initial state/render, because otherwise we *are* listening to DOM events.

    if (state.isInitial && 1 === renderCounter.current) {
        void $preact.useConsent().then(({ state: consentState }): void => {
            if (!consentState.needsOpenDialog) return;
            const needsPrefconfiguredData = $is.object(consentState.needsOpenDialog);
            const preconfiguredData = needsPrefconfiguredData ? consentState.needsOpenDialog : {};
            if (!state.open) updateState({ open: true, data: preconfiguredData as $type.PartialDeep<Data> });
        });
    }
    // Defines prefixes for HTML IDs.

    const htmlIdPrefix = 'consent-dialog-';
    const htmlIdPrefixForOptInPrefs = htmlIdPrefix + 'prefs-opt-in-';
    const htmlIdPrefixForOptOutPrefs = htmlIdPrefix + 'prefs-opt-out-';

    // Queries current preferences.

    const queryPrefs = $preact.useCallback((): Data['prefs'] => {
        return {
            optIn: {
                acceptFunctionalityCookies: $dom.query('#' + htmlIdPrefixForOptInPrefs + 'acceptFunctionalityCookies:checked') ? true : false,
                acceptAnalyticsCookies: $dom.query('#' + htmlIdPrefixForOptInPrefs + 'acceptAnalyticsCookies:checked') ? true : false,
                acceptAdvertisingCookies: $dom.query('#' + htmlIdPrefixForOptInPrefs + 'acceptAdvertisingCookies:checked') ? true : false,
            },
            optOut: {
                doNotSellOrSharePII: $dom.query('#' + htmlIdPrefixForOptOutPrefs + 'doNotSellOrSharePII:checked') ? true : false,
            },
        };
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
                doNotSellOrSharePII: !value,
            },
        }),
        [],
    );
    // Updates preferences.

    const updatePrefs = $preact.useCallback((prefs: Data['prefs']): void => {
        void $preact.useConsent().then(({ state: consentState }) => {
            // Formulates state updates.
            const updates = {
                open: false,
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
            // Computes next state, updates cookie data, and state.
            const nextState = $preact.reduceState(stateRef.current, updates);
            updateCookieData(nextState.data), updateState(updates);

            // This fires an update event and then potentially reloads immediately.
            // Event listeners should assume no reload will occur, but it may, at times.
            $dom.trigger(document, 'x:consentDialog:update', { data: nextState.data } as UpdateEvent['detail']);

            // This reloads the page, such that we honor critical preference updates immediately.
            // e.g., Something was true before, and now falsey. Or falsey before, and now true.
            if (
                Object.entries(prefsPriorToOpen.current.optIn).some(([key, oldValue]) => {
                    const newValue = (nextState.data.prefs.optIn as $type.Object)[key];
                    return oldValue && !newValue ? true : false;
                }) ||
                Object.entries(prefsPriorToOpen.current.optOut).some(([key, oldValue]) => {
                    const newValue = (nextState.data.prefs.optOut as $type.Object)[key];
                    return !oldValue && newValue ? true : false;
                })
            ) {
                location.reload(); // Reloads current location.
            }
        });
    }, []);

    // Defines various event handlers.

    const onSave = $preact.useCallback((): void => updatePrefs(queryPrefs()), []);
    const onAcceptAll = $preact.useCallback((): void => updatePrefs(allPrefsAs(true)), []);
    const onDeclineAll = $preact.useCallback((): void => updatePrefs(allPrefsAs(false)), []);
    const onClose = $preact.useCallback((): void => updatePrefs(prefsPriorToOpen.current), []);

    const onCheckboxChange = $preact.useCallback((): void => updateState({ data: { prefs: queryPrefs() } }), []);
    const onInadvertentSubmit = $preact.useCallback((event: Event): void => event.preventDefault(), []);
    const onInteractOutside = $preact.useCallback((event: Event): void => event.preventDefault(), []);
    const onOpenChange = $preact.useCallback((open: boolean): void => updateState({ open }), []);

    const onOpenDialog = $preact.useCallback((event: OpenDialogEvent): void => {
        updateState({ open: true, data: event.detail.data });
    }, []); // The `cancel` function is returned as the effect on teardown.
    $preact.useEffect((): (() => void) => $dom.on(document, 'x:consent:openDialog', onOpenDialog).cancel, []);

    // ---
    // VNode / JSX element tree.

    return (
        <As tag='x-preact-app-consent-dialog'>
            <RadixDialog.Root open={state.open} onOpenChange={onOpenChange}>
                <RadixDialog.Portal>
                    <RadixDialog.Overlay
                        style={{ zIndex: 103 }}
                        class='fixed inset-0 h-screen w-screen bg-color-basic/90 backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in'
                    />
                    <RadixDialog.Content
                        style={{ zIndex: 104 }}
                        class='fixed inset-1/2 h-min max-h-[calc(100vh_-_3rem)] w-[calc(100%_-_3rem)] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-none rounded border border-color-basic-fg/30 bg-color-basic p-6 lte-tablet:p-4 lte-phone:max-h-[calc(100vh_-_1.5rem)] lte-phone:w-[calc(100%_-_1.5rem)] lte-phone:p-3'
                        onInteractOutside={onInteractOutside}
                    >
                        <section aria-label='Cookie Preferences Dialog'>
                            <button
                                type='button'
                                onClick={onClose}
                                title='Close Consent Dialog'
                                class='float-right -mr-2 -mt-2 ml-4 text-color-basic-fg/70 hover:text-color-basic-fg lte-tablet:-mr-1 lte-tablet:-mt-1'
                            >
                                <span class='sr-only'>Close Consent Dialog</span>
                                <HeroiconsXMark class='inline-block h-auto w-4' aria-hidden='true' />
                            </button>
                            <div class='text-sm'>
                                <h2 class='-mt-2 text-lg text-color-basic-heading lte-tablet:-mt-1'>
                                    <FluentEmojiFlatCookie class='-ml-1 mr-1 inline-block h-auto w-6' aria-hidden='true' />
                                    Cookie Preferences
                                </h2>
                                <p class='mt-2 text-color-basic-fg/50'>
                                    Your privacy is critically important to us. By using our website you consent to essential cookies in accordance with our{' '}
                                    <a class='not-basic text-color-basic-fg/70 hover:text-color-basic-link' href={brand.policies.privacy} target='_blank' title='Privacy Policy'>
                                        privacy&nbsp;policy <Fa6SolidArrowUpRightFromSquare class='inline-block h-auto w-2' aria-hidden='true' />
                                    </a>{' '}
                                    . By clicking "Accept All", you are choosing to accept all cookies, including non-essential cookies. Or, by clicking "Decline All", you are
                                    choosing to decline all non-essential cookies.
                                </p>
                                <form class='mt-2' novalidate onSubmit={onInadvertentSubmit}>
                                    <div class='flex flex-wrap'>
                                        <div class='w-1/2 lte-tablet:w-full'>
                                            <div>
                                                <Checkbox
                                                    label='Essential Cookies (always on)'
                                                    labelProps={{}}
                                                    //
                                                    id={htmlIdPrefixForOptInPrefs + 'essentialCookies'}
                                                    class='bg-color-basic text-color-primary'
                                                    //
                                                    disabled={true}
                                                    checked={true}
                                                    onChange={onCheckboxChange}
                                                />{' '}
                                                <HelpIconToggle title='Learn More About Essential Cookies'>
                                                    <p class='my-1 ml-2 text-color-basic-fg/50'>
                                                        Essential cookies are always enabled. They’re necessary for our site to function; e.g., account access, consent settings,
                                                        preferences. To learn more, please review our{' '}
                                                        <a href={brand.policies.privacy} target='_blank' title='Privacy Policy'>
                                                            privacy policy <Fa6SolidArrowUpRightFromSquare class='inline-block h-auto w-2' aria-hidden='true' />
                                                        </a>
                                                    </p>
                                                </HelpIconToggle>
                                            </div>
                                            <div>
                                                <Checkbox
                                                    label='Accept Functionality Cookies'
                                                    labelProps={{ class: prefs.optOut.doNotSellOrSharePII ? 'text-color-basic-fg/50 line-through' : '' }}
                                                    //
                                                    id={htmlIdPrefixForOptInPrefs + 'acceptFunctionalityCookies'}
                                                    class='bg-color-basic text-color-success'
                                                    //
                                                    disabled={prefs.optOut.doNotSellOrSharePII ? true : false}
                                                    checked={!prefs.optOut.doNotSellOrSharePII && prefs.optIn.acceptFunctionalityCookies ? true : false}
                                                    onChange={onCheckboxChange}
                                                />{' '}
                                                <HelpIconToggle title='Learn More About Functionality Cookies'>
                                                    <p class='my-1 ml-2 text-color-basic-fg/50'>
                                                        Functionality cookies are similar to essential cookies. They remember preferences and improve user experience. However,
                                                        unlike essential cookies, they are not strictly necessary.
                                                    </p>
                                                </HelpIconToggle>
                                            </div>
                                            <div>
                                                <Checkbox
                                                    label='Accept Analytics Cookies'
                                                    labelProps={{ class: prefs.optOut.doNotSellOrSharePII ? 'text-color-basic-fg/50 line-through' : '' }}
                                                    //
                                                    id={htmlIdPrefixForOptInPrefs + 'acceptAnalyticsCookies'}
                                                    class='bg-color-basic text-color-success'
                                                    //
                                                    disabled={prefs.optOut.doNotSellOrSharePII ? true : false}
                                                    checked={!prefs.optOut.doNotSellOrSharePII && prefs.optIn.acceptAnalyticsCookies ? true : false}
                                                    onChange={onCheckboxChange}
                                                />{' '}
                                                <HelpIconToggle title='Learn More About Analytics Cookies'>
                                                    <p class='my-1 ml-2 text-color-basic-fg/50'>
                                                        Analytics cookies measure user experience, traffic volume, traffic source, clicks, etc. We use these to optimize performance
                                                        by collecting information about how users interact with our site.
                                                    </p>
                                                </HelpIconToggle>
                                            </div>
                                            <div>
                                                <Checkbox
                                                    label='Accept Advertising Cookies'
                                                    labelProps={{ class: prefs.optOut.doNotSellOrSharePII ? 'text-color-basic-fg/50 line-through' : '' }}
                                                    //
                                                    id={htmlIdPrefixForOptInPrefs + 'acceptAdvertisingCookies'}
                                                    class='bg-color-basic text-color-success'
                                                    //
                                                    disabled={prefs.optOut.doNotSellOrSharePII ? true : false}
                                                    checked={!prefs.optOut.doNotSellOrSharePII && prefs.optIn.acceptAdvertisingCookies ? true : false}
                                                    onChange={onCheckboxChange}
                                                />{' '}
                                                <HelpIconToggle title='Learn More About Advertising Cookies'>
                                                    <p class='ml-2 mt-1 text-color-basic-fg/50'>
                                                        Advertising cookies are used to identify visitors across sites; e.g., content partners, ad networks. We and our partners use
                                                        these to provide relevant ad content and to understand its effectiveness.
                                                    </p>
                                                </HelpIconToggle>
                                            </div>
                                            <h3 class='mt-3 border-t border-color-basic-fg/10 pt-2 text-base text-color-basic-heading'>Opt-Out Preferences</h3>
                                            <div>
                                                <Checkbox
                                                    label='Do Not Sell or Share My Personal Information'
                                                    labelProps={{}}
                                                    //
                                                    id={htmlIdPrefixForOptOutPrefs + 'doNotSellOrSharePII'}
                                                    class='bg-color-basic text-color-danger'
                                                    //
                                                    disabled={false}
                                                    checked={prefs.optOut.doNotSellOrSharePII ? true : false}
                                                    onChange={onCheckboxChange}
                                                />{' '}
                                                <HelpIconToggle title='Learn More About Opting Out'>
                                                    <p class='ml-2 mt-1 text-color-basic-fg/50'>
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
                    </RadixDialog.Content>
                </RadixDialog.Portal>
            </RadixDialog.Root>
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
    const cursorClass = props.disabled ? 'cursor-not-allowed' : 'cursor-pointer';
    return (
        <label
            for={props.id}
            title={props.labelProps?.title || props.title}
            class={$preact.classes(cursorClass, props.labelProps)}
            {...$preact.omitProps(props.labelProps || {}, ['title', 'class', 'children'])}
        >
            <input
                type='checkbox'
                tabindex={props.tabindex || 0}
                class={$preact.classes('form-checkbox select-none rounded', cursorClass, props)}
                {...$preact.omitProps(props, ['tabindex', 'label', 'labelProps', 'class', 'children'])}
            />{' '}
            {props.label}
            {props.children}
        </label>
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
                tabindex={props.tabindex || 0}
                class={$preact.classes('opacity-70 hover:opacity-100', props)}
                {...$preact.omitProps(props, ['onClick', 'tabindex', 'class', 'children'])}
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
            tabindex={props.tabindex || 0}
            style={{
                padding: '.375em .625em',
                ...(props.withIcon ? { columnGap: '.375em' } : {}),
            }}
            class={$preact.classes(
                'select-none font-semibold',
                'rounded shadow active:shadow-sm',
                'opacity-90 hover:opacity-100 focus:opacity-100 active:opacity-100',
                props.withIcon ? 'inline-flex items-center' : '', // Plus `columnGap` above.
                props.disabled ? 'cursor-not-allowed !opacity-50 !shadow' : '',
                props, // Any classes in props.
            )}
            {...$preact.omitProps(props, ['type', 'tabindex', 'withIcon', 'class', 'children'])}
        >
            {props.children}
        </button>
    );
}
