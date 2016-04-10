var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var merge = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

var common = {
	entry: {
		path: path.resolve(APP_PATH, 'index.jsx'),
		vendors: ['react']
	},
	output: {
		path: BUILD_PATH,
		filename: 'app.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]!postcss')
			},
			{
				test: /\.jsx?$/,
				loader: 'babel',
				include: APP_PATH
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'url?limit=10000&hash=sha512&digest=hex&name=img/[hash].[ext]',
					'image-webpack?{progress:true, optimizationLevel: 7, interlaced: false, pngquant: {quality: "65-90", speed: 4}}'
				]
			}
		]
	},
	postcss: [
		require('autoprefixer')
	],
	plugins: [
		new HtmlwebpackPlugin({
			title: 'App Name',
			template: 'app/template/index.html',
			inject: 'body'
		}),
		new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
		new ExtractTextPlugin('style.css', {
			allChunks: true
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
};

if(TARGET === 'dev') {
	module.exports = merge(common, {
		devtool: 'eval-source-map',
		devServer: {
			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true,
			stats: 'errors-only',
		},
		plugin: [
			new webpack.HotModuleReplacementPlugin()
		]
	});
} else {
	module.exports = common;
}