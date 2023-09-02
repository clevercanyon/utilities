/**
 * Preact component.
 */

import { $to, $preact } from '../../../../../../index.js';
import $preactꓺcomponentsꓺHTML from '../../../../../../preact/components/html.js';
import $preactꓺcomponentsꓺHead from '../../../../../../preact/components/head.js';
import $preactꓺcomponentsꓺBody from '../../../../../../preact/components/body.js';
import { useRoute as $preactꓺcomponentsꓺrouterꓺuseRoute } from '../../../../../../preact/components/router.js';

/**
 * Renders component.
 *
 * @returns VNode / JSX element tree.
 */
export default (): $preact.VNode => {
	return (
		<$preactꓺcomponentsꓺHTML>
			<$preactꓺcomponentsꓺHead title={'lazy'} />
			<$preactꓺcomponentsꓺBody>
				<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
			</$preactꓺcomponentsꓺBody>
		</$preactꓺcomponentsꓺHTML>
	);
};
