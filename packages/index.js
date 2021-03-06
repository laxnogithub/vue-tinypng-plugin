/*
 * @Description:
 * tinypng: https://tinypng.com/developers/reference/nodejs
 * webpack: https://webpack.js.org/api/compilation-object/#getassets
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-09-14 16:58:38
 * @LastEditors: lax
 * @LastEditTime: 2020-09-18 10:00:14
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
		this.use = p.use !== undefined ? p.use : true;
		this.name = "tinypngPlugin";
	}
	apply(compiler) {
		// options.use = false
		if (!this.use) return;
		const self = this;
		// can`t find key or something error
		if (!this._start(compiler)) return;
		compiler.hooks.emit.tapAsync(this.name, (compilation, callback) => {
			// get all assets
			const assets = compilation.getAssets();
			// img list by reg
			const imgs = assets.filter((asset) => self.REG.test(asset.name));
			// skip it when can`t find img
			if (!imgs.length) callback();
			// img promise
			const promises = imgs.map(async (img) => {
				// compressed by tinypng
				const tiny = await self.tinypng(img);
				// update asset in webpack
				if (tiny) compilation.updateAsset(img.name, new RawSource(tiny));
				return Promise.resolve();
			});
			return Promise.all(promises).then(() => {
				this._end();
				callback();
			});
		});
	}
	tinypng(rawSource) {
		return new Promise((resolve) => {
			let is_success = true;
			const source = tinify.fromBuffer(rawSource.source._value);
			// upload from tinypng
			source.toBuffer((err, result) => {
				// error with key
				if (err instanceof tinify.AccountError) {
					log(Chalk.redBright(errorHandler.accountError));
				}
				if (err) {
					is_success = false;
					log(Chalk.redBright(err));
				}
				this._each(rawSource.name, is_success);
				resolve(result);
			});
		});
	}
	getTinyCount() {
		return tinify.compressionCount;
	}
	setKey(comp) {
		const key = this.p.key || this.getKeyFromfile(comp);
		if (!key) {
			log("");
			log(Chalk.redBright("can`t find key in tinypng.js or options.key"));
			log(Chalk.redBright("skip tinypng..."));
			return false;
		}
		tinify.key = key;
		return true;
	}
	getKeyFromfile(comp) {
		let key = null;
		try {
			key = require(path.join(comp.context, "./tinypng.js")).key;
		} catch (error) {
			return key;
		}
		return key;
	}
	_start(c) {
		const can = this.setKey(c);
		if (!can) return false;
		log("");
		log(Chalk.greenBright("##############################################"));
		log(Chalk.greenBright("######### tinypng compress strat... ##########"));
		log(Chalk.greenBright("##############################################"));
		return true;
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
