<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-09-16 11:51:36
 * @LastEditors: lax
 * @LastEditTime: 2020-09-16 11:57:01
-->
# info
auto compress img by tinypng when used webpack and vue

# how to use

## set key

1.create tinypng.js 
path: {your workspace}/tinypng.js

tinypng.js:
```
module.exports = {
	key: "tTBY19j4Szg9dnx3Nf6NCtZkWPKN4m4V",
};
```


``` configureWebpack: (config) => {
        return {
            plugins: [
                new tinypngPlugin()
            ]
        }
    }
```