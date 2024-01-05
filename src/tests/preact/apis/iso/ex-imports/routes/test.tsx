/**
 * Preact component.
 */

import { $json, $preact } from '#index.ts';
import { Body, HTML, Head, type RoutedProps } from '#preact/components.tsx';

/**
 * Defines types.
 */
export type Props = RoutedProps;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Test(unusedꓺprops: Props): $preact.VNode<Props> {
    return (
        <HTML>
            <Head title={'test'} />
            <Body>
                <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
            </Body>
        </HTML>
    );
}
