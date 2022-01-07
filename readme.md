<!--
 * @Description: 
 * @Version: 1.0.0
 * @Author: lax
 * @Date: 2020-09-16 11:51:36
 * @LastEditors: lax
 * @LastEditTime: 2022-01-07 15:27:09
-->
# info
auto compress img by tinypng when used webpack or vue
This plugin can record the compression and will not recompress the file if it is not updated

适用于vue和webpack的tinypng插件
能够根据记录判断资源是否发生改变，未改变时不会重复进行压缩

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

2.set key in options.config
```
new tinypngPlugin({
    config: {
        key: "XXXX",
    }
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

# options

## key
your key

tinypng的key
``` 
key:XXX,
``` 

## use
true/false run this plugin

是否启动插件


default: true
```
use: true/false,
```

## reg
compress img reg

需要压缩资源后缀的正则效验


default: /\.(png|jpe?g|bmp|gif)/i
```
reg: XXXX
```
