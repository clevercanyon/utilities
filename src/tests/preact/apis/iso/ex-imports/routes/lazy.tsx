/**
 * Preact route component.
 */

import { $json, $preact } from '#index.ts';
import { Body, HTML, Head, type RoutedProps } from '#preact/components.tsx';

/**
 * Defines types.
 */
export type Props = RoutedProps;
export type LazyProps = $preact.Props<{
    a: string;
    b: string;
    c: string;
}>;

/**
 * Renders lazy component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree (promise).
 *
 * @note {@see globalThis.fetch()} is stubbed out in the main test file.
 */
export const Lazy = $preact.lazyComponent(async (props: LazyProps): Promise<$preact.VNode<LazyProps>> => {
    await fetch('http://x.tld/a');
    await fetch('http://x.tld/b');
    await fetch('http://x.tld/c');
    await fetch('http://x.tld/d');

    await (async () => null)();
    await (async () => undefined)();
    await (async () => false)();
    await (async () => true)();
    const awaitedProps = await (async () => props)();

    return <script type='lazy-component-props' dangerouslySetInnerHTML={{ __html: $json.stringify({ ...awaitedProps }) }}></script>;
});

/**
 * Renders lazy route component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (unusedꓺ: Props): $preact.VNode<Props> => {
    return (
        <HTML>
            <Head title={'lazy'} />
            <Body>
                <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
                <Lazy a={'_a'} b={'_b'} c={'_c'} />
            </Body>
        </HTML>
    );
};
