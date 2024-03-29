/**
 * Preact component.
 */

import { $json, $preact } from '#index.ts';
import { Body, HTML, Head, type RoutedProps } from '#preact/components.tsx';

/**
 * Defines types.
 */
export type Props = RoutedProps;
export type ComponentProps = $preact.Props<{
    a: string;
    b: string;
    c: string;
}>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree (promise).
 *
 * @note Global {@see fetch()} is stubbed out in the main test file.
 */
export const Component = $preact.lazyComponent(async (props: ComponentProps): Promise<$preact.VNode<ComponentProps>> => {
    const { fetch } = $preact.useFetcher();

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
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Lazy(unusedꓺprops: Props): $preact.VNode<Props> {
    const route = $preact.useRoute();

    return (
        <HTML>
            <Head title={'lazy'} />
            <Body>
                <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify(route) }}></script>
                <Component a={'_a'} b={'_b'} c={'_c'} />
            </Body>
        </HTML>
    );
}
