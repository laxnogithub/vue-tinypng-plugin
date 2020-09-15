/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-09-14 16:58:38
 * @LastEditors: lax
 * @LastEditTime: 2020-09-16 00:04:08
 */
const tinify = require("tinify");
const Chalk = require("chalk");
const errorHandler = require("./error");
const { RawSource } = require("webpack-sources");
module.exports = class Tinypng {
	constructor(p = {}) {
		this.p = p;
		tinify.key = this.p.key;
		// img:png/jpg/jpeg/bmp/gif
		this.REG = p.reg || /\.(png|jpe?g|bmp|gif)/i;
	}
	apply(compiler) {
		const self = this;
		compiler.hooks.emit.tapAsync("tinypngPlugin", (compilation, callback) => {
			// assets
			const assets = compilation.assets;
			// img name list
			const imgs = Object.keys(assets).filter((asset) => self.REG.test(asset));
			if (!imgs.length) callback();
			// img promise
			const promises = imgs.map((img) =>
				(async (img) => {
					// img source
					const source = compilation.assets[img].source();
					// compressed by tinypng
					const tiny = await self.tinypng(source);
					// update img source
					assets[img] = new RawSource(tiny);
					return Promise.resolve();
				})(img)
			);
			return Promise.all(promises).then(() => {
				Chalk.greenBright("img all compressed!");
				callback();
			});
		});
	}
	tinypng(file) {
		return new Promise((resolve) => {
			tinify.fromBuffer(file).toBuffer((err, result) => {
				if (err instanceof tinify.AccountError) {
					Chalk.redBright(errorHandler.accountError);
				}
				if (err) throw err;
				resolve(result);
			});
		});
	}
};
// https://tinypng.com/developers/reference/nodejs
// https://github.com/JowayYoung/tinyimg-webpack-plugin/blob/master/src/index.js
// https://webpack.js.org/api/compilation-object/#getassets
