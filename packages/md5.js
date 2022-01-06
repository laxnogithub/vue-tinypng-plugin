/*
 * @Description:
 * @Version: 1.0.0
 * @Author: lax
 * @Date: 2022-01-06 16:42:27
 * @LastEditors: lax
 * @LastEditTime: 2022-01-06 16:44:43
 * @FilePath: \tinypng\packages\md5.js
 */
const crypto = require("crypto");

function md5(data) {
	return crypto.createHash("md5").update(data).digest("hex").slice(0, 10);
}
module.exports = md5;
