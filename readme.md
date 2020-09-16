<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-09-16 11:51:36
 * @LastEditors: lax
 * @LastEditTime: 2020-09-16 12:00:08
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
	key: "XXXX",
};
```

2.set key in options
```
new tinypngPlugin({
    key: "XXXX",
})
```

## import
``` 
configureWebpack: (config) => {
    return {
        plugins: [
            new tinypngPlugin()
        ]
    }
}
```