/*
 * @Description:
 * tinypng: https://tinypng.com/developers/reference/nodejs
 * webpack: https://webpack.js.org/api/compilation-object/#getassets
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-09-14 16:58:38
 * @LastEditors: lax
 * @LastEditTime: 2020-09-16 11:19:52
 */
const path = require("path");
const tinify = require("tinify");
const Chalk = require("chalk");
const log = console.log;
const errorHandler = require("./error");
const { RawSource } = require("webpack-sources");

const DEFAULT_REG = /\.(png|jpe?g|bmp|gif)/i;
class Tinypng {
	constructor(p = {}) {
		this.p = p;
		// img:png/jpg/jpeg/bmp/gif
		this.REG = p.reg || DEFAULT_REG;
	}
	apply(compiler) {
		const self = this;
		this._start(compiler);
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
					const tiny = await self.tinypng(img, source);
					if (tiny) assets[img] = new RawSource(tiny);
					return Promise.resolve();
				})(img)
			);
			return Promise.all(promises).then(() => {
				this._end();
				callback();
			});
		});
	}
	tinypng(filename, file) {
		return new Promise((resolve) => {
			let is_success = true;
			const source = tinify.fromBuffer(file);
			source.toBuffer((err, result) => {
				if (err instanceof tinify.AccountError) {
					log(Chalk.redBright(errorHandler.accountError));
				}
				if (err) {
					is_success = false;
					log(Chalk.redBright(err));
				}
				this._each(filename, is_success);
				resolve(result);
			});
		});
	}
	getTinyCount() {
		return tinify.compressionCount;
	}
	setKey(comp) {
		let key = null;
		try {
			key = require(path.join(comp.context, "./tinypng.js")).key;
		} catch (error) {
			log(Chalk.redBright("can`t find key in tinypng.js or options.key"));
		}
		tinify.key = this.p.key || key;
	}
	_start(c) {
		this.setKey(c);
		log("");
		log(Chalk.greenBright("###############################"));
		log(Chalk.greenBright("## tinypng compress strat... ##"));
		log(Chalk.greenBright("###############################"));
	}
	_end() {
		log("");
		log(Chalk.greenBright("##############################################"));
		log(Chalk.greenBright("## success: all imgs compressed by tinypng! ##"));
		log(Chalk.greenBright("##############################################"));
		log(Chalk.greenBright("* this key compressd count:" + this.getTinyCount()));
	}
	_each(name, is) {
		log("");
		if (is) log(Chalk.greenBright("* filename: " + name + " compressed!"));
		if (!is) log(Chalk.redBright("* filename: " + name + " not compressed!"));
	}
}
module.exports = Tinypng;
