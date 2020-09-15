/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-09-15 23:02:33
 * @LastEditors: lax
 * @LastEditTime: 2020-09-15 23:11:51
 */
const tinify = require("tinify");
const fs = require("fs");
module.exports = (() => {
	tinify.key = "tTBY19j4Szg9dnx3Nf6NCtZkWPKN4m4V";
	fs.readFile("./examples/assets/img/bg.png", (err, data) => {
		tinify.fromBuffer(data).toBuffer(function (err, result) {
			if (err) throw err;
			fs.writeFile("./examples/assets/img/bg-small.png", result, () => {});
		});
	});
})();
