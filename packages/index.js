/*
 * @Description:
 * tinypng: https://tinypng.com/developers/reference/nodejs
 * webpack: https://webpack.js.org/api/compilation-object/#getassets
 * @Version: 1.0.0
 * @Author: lax
 * @Date: 2020-09-14 16:58:38
 * @LastEditors: lax
 * @LastEditTime: 2022-01-06 18:21:01
 */
const path = require("path");
const fs = require("fs-extra");
const tinify = require("tinify");
const md5 = require("./md5");
const Chalk = require("chalk");
const log = console.log;
const errorHandler = require("./error");
const { RawSource } = require("webpack-sources");
const DEFAULT_REG = /\.(png|jpe?g|bmp|gif)/i;
const PLUGIN_NAME = "tinypngPlugin";
const CONFIG_NAME = "tinypng";
const CACHE_PATH = ".tinypng";
class TinypngPlugin {
	constructor(p = {}) {
		this.p = p;
		this.name = PLUGIN_NAME;
		this.workspace = "";
		this.REG = p.reg || DEFAULT_REG;
		this.use = p.use !== undefined ? p.use : true;
	}
	_init(comp) {
		this.workspace = comp.context;
		this._getCache();
		this.config = this.__getOptions();
	}
	// webpack hook
	apply(compiler) {
		const self = this;
		// this plugin not use
		if (!this.use) return;
		// init generate tinypng properties
		this._init(compiler);
		// can`t find key or something error
		if (!this._start()) return;

		compiler.hooks.emit.tapAsync(this.name, (compilation, callback) => {
			const assets = this.getAssets(compilation);
			// skip it when can`t find asset
			if (!assets.length) callback();

			const promises = assets.map(async (asset) => {
				// asset not exist,
				if (!this.exist(asset)) {
					try {
						// compressed by tinypng
						const tiny = await self.tinypng(asset);
						tiny && compilation.updateAsset(asset.name, new RawSource(tiny));
						// add record
						this._addCache(asset);
						this._compressed(asset.name, true);
						return Promise.resolve();
					} catch (error) {
						this._compressed(asset.name, false);
						return Promise.resolve();
					}
				}
				// asset exist, skip
				this._jump(asset.name);
				return Promise.resolve();
			});
			return Promise.all(promises).then(() => {
				this.updateCache();
				self._end();
				callback();
			});
		});
	}
	// compress assets by tinypng
	tinypng(rawSource) {
		return new Promise((resolve, reject) => {
			const source = tinify.fromBuffer(rawSource.source._value);
			// upload from tinypng
			source.toBuffer((err, result) => {
				// error with key
				if (err instanceof tinify.AccountError) {
					log(Chalk.redBright(errorHandler.accountError));
					reject(err);
				}
				if (err) {
					log(Chalk.redBright(err));
					reject(err);
				}
				resolve(result);
			});
		});
	}
	getTinyCount() {
		return tinify.compressionCount;
	}
	updateCache() {
		const CACHE_ROOT = path.resolve(this.workspace, CACHE_PATH);
		const map = (() => {
			let result = {};
			for (let [key, value] of this.hash.entries()) {
				result[key] = value;
			}
			return result;
		})();
		fs.writeJSONSync(`${CACHE_ROOT}/hash.json`, map);
	}
	_addCache(img) {
		this.hash.set(img.name, md5(img.source._value));
	}
	_getCache() {
		const CACHE_ROOT = path.resolve(this.workspace, CACHE_PATH);
		fs.ensureFileSync(CACHE_ROOT + "/hash.json");
		let file;
		try {
			file = require(`${CACHE_ROOT}/hash.json`);
		} catch (error) {
			file = {};
		}
		this.hash = new Map(Object.entries(file));
	}
	exist(asset) {
		const newAssetHash = md5(asset.source._value);
		const oldAssetHash = this.hash.get(asset.name);
		return oldAssetHash === newAssetHash;
	}
	getAssets(compilation) {
		// get all assets
		const _assets = compilation.getAssets();
		// img list by reg
		const assets = _assets.filter((asset) => this.REG.test(asset.name));
		return assets;
	}
	_setKey() {
		const key = this.config.key;
		if (!key) {
			log("");
			log(Chalk.redBright("can`t find key in tinypng.js or options.key"));
			log(Chalk.redBright("skip tinypng..."));
			return false;
		}
		tinify.key = key;
		return true;
	}
	__getOptions() {
		const LOCAL_PATH = path.join(this.workspace, `./${CONFIG_NAME}`);
		fs.ensureFileSync(LOCAL_PATH + ".js");
		const LOCAL_OPTIONS = require(`${LOCAL_PATH}.js`);
		return Object.assign({}, LOCAL_OPTIONS, this.p.config || {});
	}
	_start() {
		const can = this._setKey();
		if (!can) return false;
		log("");
		log(Chalk.greenBright("##############################################"));
		log(Chalk.greenBright("######### tinypng compress start... ##########"));
		log(Chalk.greenBright("##############################################"));
		return true;
	}
	_end() {
		log("");
		log(Chalk.greenBright("##############################################"));
		log(Chalk.greenBright("## success: all imgs compressed by tinypng! ##"));
		log(Chalk.greenBright("##############################################"));
		log(
			Chalk.greenBright("* this key compressed count:" + this.getTinyCount())
		);
	}
	_compressed(name, is) {
		log("");
		if (is) log(Chalk.greenBright("* filename: " + name + " compressed!"));
		if (!is) log(Chalk.redBright("* filename: " + name + " not compressed!"));
	}
	_jump(name) {
		log("");
		log(Chalk.greenBright("* filename: " + name + " not change, skip!"));
	}
}
module.exports = TinypngPlugin;
