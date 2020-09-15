/*
 * @Description: vue.config.js
 * @Version: 2.0.0
 * @Autor: lax
 * @Date: 2020-04-01 12:54:53
 * @LastEditors: lax
 * @LastEditTime: 2020-09-15 16:45:56
 */
const tinypngPlugin = require("./packages/index.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
module.exports = {
	/* ##################################
	 * test view path for the local debug
	 * ##################################
	 */
	pages: {
		index: {
			entry: "./examples/main.js",
			template: "./public/index.html",
			filename: "index.html"
		}
	},
	/* ##################################
	 * js css version like: xx.js?v=xxxxx
	 * ##################################
	 */
	configureWebpack: config => {
		config.devtool = "source-map";
		return {
			output: {
				filename: "js/[name].js?v=[hash:6]",
				chunkFilename: "js/[name].js?v=[hash:6]"
			},
			plugins: [
				new MiniCssExtractPlugin({
					filename: `css/[name].css?v=[hash:6]`,
					chunkFilename: `css/[name].css?v=[hash:6]`
				}),
				new tinypngPlugin()
			]
		};
	},
	/* 设置build的引用文件路径 */

	publicPath: "./",
	/* 生产环境sourcemap 清除 */
	productionSourceMap: false,
	/* 取消文件名hash值 */
	filenameHashing: false,
	/**
	 * 自定义file-loader
	 * html图片访问格式调整：[name].[ext]?v=[hash:6]
	 * like: content.png?v=s2421a
	 */
	chainWebpack: config => {
		config.module
			.rule("js")
			.include.add("/packages/")
			.end()
			.use("babel")
			.loader("babel-loader");
		config.module
			.rule("images")
			.use("url-loader")
			.loader("file-loader")
			.options({
				name: "img/[name].[ext]?v=[hash:6]",
				useRelativePath: true
			});
		/* ##################################
		 * @ use pro core @ex use to test
		 * ##################################
		 */
		config.resolve.alias
			.set("@", path.join(__dirname, "./packages"))
			.set("@ex", path.join(__dirname, "./examples"));
	}
};
