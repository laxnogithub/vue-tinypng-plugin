/*
 * @Description:
 * tinypng: https://tinypng.com/developers/reference/nodejs
 * webpack: https://webpack.js.org/api/compilation-object/#getassets
 * @Version: 1.0.0
 * @Author: lax
 * @Date: 2020-09-14 16:58:38
 * @LastEditors: lax
 * @LastEditTime: 2022-01-07 13:20:56
 */
const log = console.log;
const path = require("path");
const fs = require("fs-extra");
const tinify = require("tinify");
const { md5, mapToJson } = require("./tools");
const { success, warn, ERROR, STATE } = require("./message");
const { RawSource } = require("webpack-sources");
const DEFAULT_REG = /\.(png|jpe?g|bmp|gif)/i;
const PLUGIN_NAME = "tinypngPlugin";
const CONFIG_NAME = "tinypng";
const CACHE_PATH = ".tinypng";
const CACHE_NAME = "hash";
class TinypngPlugin {
	constructor(p = {}) {
		this.p = p;
		this.name = PLUGIN_NAME;
		this.workspace = "";
		this.REG = p.reg || DEFAULT_REG;
		this.use = p.use !== undefined ? p.use : true;
	}
	_init(comp) {
		// project root
		this.workspace = comp.context;
		// asset record
		this.getCache();
		// config
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
		if (!this.setKey()) return;
		this._start();

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
						this.addCache(asset);
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
			Promise.all(promises).then(() => {
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
					warn(ERROR.accountError);
					reject(err);
				}
				if (err) {
					warn(err);
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
		const hash = mapToJson(this.hash);
		fs.writeJSONSync(`${CACHE_ROOT}/${CACHE_NAME}.json`, hash);
	}
	addCache(img) {
		this.hash.set(img.name, md5(img.source._value));
	}
	getCache() {
		const CACHE_ROOT = path.resolve(this.workspace, CACHE_PATH);
		fs.ensureFileSync(`${CACHE_ROOT}/${CACHE_NAME}.json`);
		let file;
		try {
			file = require(`${CACHE_ROOT}/${CACHE_NAME}.json`);
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
		const assets = _assets.filter(
			(asset) => this.REG.test(asset.name) && asset.source._value !== undefined
		);
		return assets;
	}
	setKey() {
		const key = this.config.key;
		if (!key) {
			log("");
			warn("can`t find key in tinypng.js or options.key");
			warn("skip tinypng...");
			return false;
		}
		tinify.key = key;
		return true;
	}
	/**
	 * @function __getOptions
	 * @description get options by plugin({config}) > tinypng.js > default
	 * @returns {object} config
	 */
	__getOptions() {
		const LOCAL_PATH = path.join(this.workspace, `./${CONFIG_NAME}`);
		fs.ensureFileSync(LOCAL_PATH + ".js");
		const LOCAL_OPTIONS = require(`${LOCAL_PATH}.js`);
		return Object.assign({}, LOCAL_OPTIONS, this.p.config || {});
	}
	_start() {
		success(STATE.start());
	}
	_end() {
		success(STATE.end(this.getTinyCount()));
	}
	_compressed(name, is) {
		if (is) success(STATE.compressed(name));
		if (!is) warn(STATE.notCompressed(name));
	}
	_jump(name) {
		log("");
		success(STATE.skip(name));
	}
}
module.exports = TinypngPlugin;
