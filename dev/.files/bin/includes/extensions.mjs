/**
 * Extensions.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 */

/**
 * Strips leading dot from extensions.
 *
 * @param   e Array of extensions.
 *
 * @returns   Array of extensions (not dot).
 */
const noDot = (e) => [...new Set(e)].map((e) => e.replace(/^\./u, ''));

/**
 * Converts an array of extensions into a glob pattern.
 *
 * @param   e Array of extensions.
 *
 * @returns   Extensions as a glob pattern.
 *
 * @note Don’t use these `{}` brace expansions in TypeScript config files; i.e., incompatible.
 */
const asGlob = (e) => {
	e = [...new Set(e)]; // Unique.
	return (e.length > 1 ? '{' : '') + noDot(e).join(',') + (e.length > 1 ? '}' : '');
};

/**
 * Converts an array of extensions into a regular expression fragment.
 *
 * @param   e Array of extensions.
 *
 * @returns   Extensions as a regular expression fragment.
 */
const asRegExpFrag = (e) => {
	e = [...new Set(e)]; // Unique.
	return (e.length > 1 ? '(?:' : '') + noDot(e).join('|') + (e.length > 1 ? ')' : '');
};

/**
 * Defines extensions.
 */
export default {
	noDot,
	asGlob,
	asRegExpFrag,

	md: ['.md'],
	mdx: ['.mdx'],

	xml: ['.xml'],
	html: ['.html'],

	php: ['.php'],
	sql: ['.sql'],
	ruby: ['.rb'],
	bash: ['.bash'],

	css: ['.css'],
	scss: ['.scss'],
	less: ['.less'],

	json: ['.json'],
	json5: ['.json5'],

	ini: ['.ini'],
	toml: ['.toml'],
	yaml: ['.yml', '.yaml'],
	properties: ['.properties', '.env'],

	node: ['.node'], // Compiled JavaScript module.
	wasm: ['.wasm'], // Compiled JavaScript module.

	js: ['.js', '.jsx', '.cjs', '.cjsx', '.mjs', '.mjsx'],
	ts: ['.ts', '.tsx', '.cts', '.ctsx', '.mts', '.mtsx'],
	jts: [...['.js', '.jsx', '.cjs', '.cjsx', '.mjs', '.mjsx'], ...['.ts', '.tsx', '.cts', '.ctsx', '.mts', '.mtsx']],

	sjs: ['.js', '.jsx'],
	sts: ['.ts', '.tsx'],
	sjts: [...['.js', '.jsx'], ...['.ts', '.tsx']],

	cjs: ['.cjs', '.cjsx'],
	cts: ['.cts', '.ctsx'],
	cjts: [...['.cjs', '.cjsx'], ...['.cts', '.ctsx']],

	mjs: ['.mjs', '.mjsx'],
	mts: ['.mts', '.mtsx'],
	mjts: [...['.mjs', '.mjsx'], ...['.mts', '.mtsx']],

	jsx: ['.jsx', '.cjsx', '.mjsx'],
	tsx: ['.tsx', '.ctsx', '.mtsx'],
	jtsx: [...['.jsx', '.cjsx', '.mjsx'], ...['.tsx', '.ctsx', '.mtsx']],

	content: [
		...['.js', '.jsx', '.cjs', '.cjsx', '.mjs', '.mjsx'], //
		...['.ts', '.tsx', '.cts', '.ctsx', '.mts', '.mtsx'],
		...['.md', '.mdx', '.xml', '.html', '.shtml', '.ejs'],
		...['.php', '.bash'],
	],
	onImportWithNoExtensionTry: [
		...['.ts', '.tsx', '.mts', '.mtsx', '.cts', '.ctsx'],
		...['.js', '.jsx', '.mjs', '.mjsx', '.cjs', '.cjsx'],
		...['.mdx', '.md'],
		...['.json'],
		...['.wasm'],
		...['.node'],
	],
};
