/*
 * @Description:
 * @Version: 1.0.0
 * @Author: lax
 * @Date: 2022-01-06 16:42:27
 * @LastEditors: lax
 * @LastEditTime: 2022-01-06 23:54:40
 * @FilePath: \vue-tinypng-plugin\packages\tools.js
 */
const crypto = require("crypto");

function md5(data) {
	return crypto.createHash("md5").update(data).digest("hex").slice(0, 10);
}

function mapToJson(map) {
	const result = {};
	for (let [key, value] of map.entries()) {
		result[key] = value;
	}
	return result;
}

module.exports = { md5, mapToJson };
