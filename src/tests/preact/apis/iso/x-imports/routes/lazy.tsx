/**
 * Preact route component.
 */

import { $json, $preact } from '../../../../../../index.ts';
import { lazyComponent as $preactꓺapisꓺisoꓺlazyComponent } from '../../../../../../preact/apis/iso.tsx';
import $preactꓺcomponentsꓺBody from '../../../../../../preact/components/body.tsx';
import $preactꓺcomponentsꓺHead from '../../../../../../preact/components/head.tsx';
import $preactꓺcomponentsꓺHTML from '../../../../../../preact/components/html.tsx';
import type { RouteContextAsProps as $preactꓺcomponentsꓺrouterꓺRouteContextAsProps } from '../../../../../../preact/components/router.tsx';
import { useRoute as $preactꓺcomponentsꓺrouterꓺuseRoute } from '../../../../../../preact/components/router.tsx';

/**
 * Defines types.
 */
export type Props = $preact.Props<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps>;
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
export const Lazy = $preactꓺapisꓺisoꓺlazyComponent(async (props: LazyProps): Promise<$preact.VNode<LazyProps>> => {
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
export default (unusedꓺprops: Props): $preact.VNode<Props> => {
    return (
        <$preactꓺcomponentsꓺHTML>
            <$preactꓺcomponentsꓺHead title={'lazy'} />
            <$preactꓺcomponentsꓺBody>
                <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
                <Lazy a={'_a'} b={'_b'} c={'_c'} />
            </$preactꓺcomponentsꓺBody>
        </$preactꓺcomponentsꓺHTML>
    );
};
