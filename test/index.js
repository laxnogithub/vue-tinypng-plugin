/*
 * @Description:
 * @Version: 1.0.0
 * @Author: lax
 * @Date: 2022-01-06 17:27:25
 * @LastEditors: lax
 * @LastEditTime: 2022-01-06 18:06:19
 * @FilePath: \tinypng\test\index.js
 */
const a = { a: 1, b: 2, c: 3 };
const map = new Map(Object.entries(a));
console.log(JSON.stringify(map));
