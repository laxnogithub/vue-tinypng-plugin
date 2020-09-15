/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-09-14 16:58:38
 * @LastEditors: lax
 * @LastEditTime: 2020-09-15 17:53:04
 */
const tinify = require("tinify");

class Tinypng {
	constructor(p = {}) {
		this.p = p;
		tinify.key = this.p.key;
	}
	apply(compiler) {
		compiler.hooks.emit.tapAsync("tinypngPlugin", (compilation, callback) => {
			const REG = /\.(png|jpe?g|bmp|gif)/i;
			const imgs = Object.keys(compilation.getAssets()).filter(path =>
				REG.test(path)
			);
			if (!imgs.length) return;

			callback(compilation);
		});
	}

	tinypng(file) {
		tinify.fromBuffer(file).toBuffer((err, result) => {
			if (err) throw err;
		});
	}
}
module.exports = Tinypng;
// https://tinypng.com/developers/reference/nodejs
// https://github.com/JowayYoung/tinyimg-webpack-plugin/blob/master/src/index.js
// https://webpack.js.org/api/compilation-object/#getassets
