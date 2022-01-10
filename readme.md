<!--
 * @Description: 
 * @Version: 1.0.0
 * @Author: lax
 * @Date: 2020-09-16 11:51:36
 * @LastEditors: lax
 * @LastEditTime: 2022-01-10 20:52:04
-->
# 介绍/info
auto compress img by tinypng when used webpack or vue
This plugin can record the compression and will not recompress the file if it is not updated

适用于vue和webpack的tinypng插件，支持调整图片尺寸
能够根据记录判断资源是否发生改变，未改变时不会重复进行压缩

[npm地址](https://www.npmjs.com/package/vue-tinypng-plugin)

# 使用/how to use

## 设置key/set key

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

## import/导入

### webpack
```
module.exports = {
    plugins: [
        new tinypngPlugin()
    ]
};
```

### vue
``` 
configureWebpack: (config) => {
    return {
        plugins: [
            new tinypngPlugin()
        ]
    }
}
```

# 配置属性/options

## option.configName
config file name , no suffix
default "tinypng"

配置文件名称
默认为"tinypng"

```
configName: ""
```

## option.cachePath
cache path
default ".tinypng"

压缩记录缓存路径
默认为".tinypng",基于根目录

```
cachePath: ""
```

## option.cacheName
cache name
default "hash.json"

压缩记录缓存文件名
默认为"hash.json"

```
cacheName: ""
```

## option.reg
compress img reg
default: /\.(png|jpe?g|bmp)/i

需要压缩资源后缀的正则效验
默认: /\.(png|jpe?g|bmp)/i

```
reg: XXXX
```

## option.use
true/false run this plugin
default: true

是否启动插件
默认: true

```
use: true/false,
```

## option.cache
Whether to record compressed cache
default: true

是否启用缓存记录
默认: true

```
cache: true/false,
```

## option.config
## option.config.key
your key

tinypng的key

``` 
key:XXX,
``` 
## option.config.method
resize method scale/fit/cover/thumb
[look](https://tinypng.com/developers/reference/nodejs)

图片调整模式 支持:scale/fit/cover/thumb
[详情参考](https://tinypng.com/developers/reference/nodejs)

```
method: ""
```


## option.config.width
resize asset width

调整图片的宽度尺寸

```
width: ""
```

## option.config.height
resize asset height

调整图片的高度尺寸

```
height: ""
```
