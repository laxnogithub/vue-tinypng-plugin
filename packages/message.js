/*
 * @Description:
 * @Version: 1.0.0
 * @Author: lax
 * @Date: 2020-09-15 21:53:55
 * @LastEditors: lax
 * @LastEditTime: 2022-01-10 16:38:19
 */
const Chalk = require("chalk");
const log = console.log;
module.exports = {
	success: (msg) => {
		log(Chalk.greenBright(msg));
	},
	warn: (msg) => {
		log(Chalk.redBright(msg));
	},
	ERROR: {
		keyError: "can`t find key in tinypng.js or options.key skip ...",
		accountError:
			"There was a problem with your API key or with your API account. Your request could not be authorized. If your compression limit is reached, you can wait until the next calendar month or upgrade your subscription. After verifying your API key and your account status, you can retry the request.",
		clientError:
			"The request could not be completed because of a problem with the submitted data. The exception message will contain more information. You should not retry the request.",
		serverError:
			"The request could not be completed because of a temporary problem with the Tinify API. It is safe to retry the request after a few minutes. If you see this error repeatedly for a longer period of time, please contact us.",
		connectionError:
			"The request could not be sent because there was an issue connecting to the Tinify API. You should verify your network connection. It is safe to retry the request.",
	},
	STATE: {
		compressed: (name) => `* filename: ${name}  compressed!`,
		notCompressed: (name) => `* filename: ${name}  not compressed!`,
		skip: (name) => `* filename: ${name} not change, skip!`,
		start: () =>
			`\n##############################################\n######### tinypng compress start... ##########\n##############################################`,
		end: (count) =>
			`\n##############################################\n## success: all imgs compressed by tinypng! ##\n##############################################\n* this key compressed count:" + ${count}`,
	},
};
