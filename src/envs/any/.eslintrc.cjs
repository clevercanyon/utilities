/* eslint-env es2021, node */

const path      = require( 'path' );
const assetsDir = __dirname; // This directory.
const rootDir   = path.resolve( __dirname, '../../../' );

module.exports = {
	root    : true,
	extends : [ rootDir + '/.eslintrc.cjs' ],

	parserOptions : {
		babelOptions : require( rootDir + '/dev/.files/webpack/babel.cjs' )(
			'./' + path.relative( rootDir, assetsDir ),
		),
	},
	overrides     : [
		{
			files         : [ '*.{ts,tsx}', '**/*.{ts,tsx}' ],
			parserOptions : { tsconfigRootDir : assetsDir },
		},
	],
};
