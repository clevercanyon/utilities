/**
 * Webpack config file.
 *
 * @since 1.0.0
 *
 * @note Webpack is not aware of this config file's location.
 *       Please use `--config ./dev/.libs/webpack/config.cjs`.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * This file and the contents of it are updated automatically.
 *
 * - Instead of editing this file, please configure `../../../composer.json`. See instructions below.
 * - Instead of editing this file, please review source repository {@see https://o5p.me/LevQOD}.
 */
/* eslint-env node */

/* @formatter:ignore
-----------------------------------------------------------------------------------------------------------------------
Example `extra.clevercanyon.&.webpack` using `../../../composer.json`:
-----------------------------------------------------------------------------------------------------------------------
"extra" : {
	"clevercanyon" : {
		"&" : {
			"webpack" : {
				"assetDirs" : [ "../../../src/assets" ]
			}
		}
	}
}
-----------------------------------------------------------------------------------------------------------------------
Example directory structure expected for webpack:
-----------------------------------------------------------------------------------------------------------------------
../../../src/assets (or any other location):
	- styles/index.scss
	- scripts/index.js
	- webpack/ (output directory)
------------------------------------------------------------------------------------------------- @formatter:/ignore */

const fs      = require( 'fs' );
const path    = require( 'path' );
const miniCss = require( 'mini-css-extract-plugin' );
const mc      = require( '@clevercanyon/js-object-mc' );

module.exports = ( env, argv ) => {
	const file = {
		'composer.json' : {},
		'package.json'  : {},
	};
	try { file[ 'composer.json' ] = require( '../../../composer.json' ); } catch ( e ) {}
	try { file[ 'package.json' ] = require( '../../../package.json' ); } catch ( e ) {}

	const configs = [];
	const config  = mc.merge(
		{
			assetDirs : [ '../../../src/assets' ],
			config    : {}, // Merges into all base config values.
		},
		file[ 'composer.json' ]?.extra?.clevercanyon?.[ '&' ]?.webpack || {},
		file[ 'package.json' ]?.config?.clevercanyon?.[ '&' ]?.webpack || {},
	);

	( config.assetDirs || [] ).forEach( ( assetsDir ) => {
		const entryIndexes = []; // Initialize.
		assetsDir          = path.resolve( __dirname, assetsDir );

		if ( fs.existsSync( assetsDir + '/styles/index.scss' ) ) {
			entryIndexes.push( assetsDir + '/styles/index.scss' );
		}
		if ( fs.existsSync( assetsDir + '/scripts/index.tsx' ) ) {
			entryIndexes.push( assetsDir + '/scripts/index.tsx' );

		} else if ( fs.existsSync( assetsDir + '/scripts/index.ts' ) ) {
			entryIndexes.push( assetsDir + '/scripts/index.ts' );

		} else if ( fs.existsSync( assetsDir + '/scripts/index.jsx' ) ) {
			entryIndexes.push( assetsDir + '/scripts/index.jsx' );

		} else if ( fs.existsSync( assetsDir + '/scripts/index.js' ) ) {
			entryIndexes.push( assetsDir + '/scripts/index.js' );
		}
		if ( ! entryIndexes.length ) {
			return; // No entry indexes available.
		}
		configs.push( mc.merge( {
			cache       : false,
			mode        : 'production',
			devtool     : 'source-map',
			target      : 'browserslist',
			experiments : { topLevelAwait : true },
			plugins     : [ new miniCss( { filename : '[name].min.css' } ) ],
			module      : {
				rules : [
					{
						test : /\.(?:txt|md)$/i,
						use  : [ 'raw-loader' ],
					},
					{
						test : /\.(?:html)$/i,
						use  : [ 'html-loader' ],
					},
					{
						test : /\.(?:gif|jpe?g|png|svg|eot|ttf|woff[0-9]*)$/i,
						use  : [ 'file-loader' ],
					},
					{
						test : /\.(?:css|scss)$/i,
						use  : [
							miniCss.loader,
							{ loader : 'css-loader' },
							{
								loader : 'postcss-loader', options : {
									postcssOptions : { config : path.resolve( __dirname, './postcss.cjs' ) },
								},
							},
							{ loader : 'sass-loader' },
						],
					},
					{
						test    : /\.(?:js|jsx|ts|tsx)$/i,
						exclude : [ /\/(?:node_modules\/(?:core-js|webpack\/buildin))\//i ],
						use     : [
							{
								loader : 'babel-loader', options : {
									configFile : path.resolve( __dirname, './babel.cjs' ),
								},
							},
							{ loader : '@linaria/webpack-loader' },
						],
					},
				],
			},
			entry       : {
				index : entryIndexes,
			},
			output      : {
				path     : assetsDir + '/webpack',
				filename : '[name].min.js',
			},
		}, config.config || {} ) );
	} );

	return configs;
};
