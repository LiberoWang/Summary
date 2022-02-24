> 几大核心API

```js
models.export = {
  entery, // 入口文件，多个入口配置多个文件
  output: {
    filename, // 打包出来的名字
    path // 打包出来的路径(必须是绝对路径,使用node.js的path)
  },
  plugins,
  mode, // 开发环境 ｜ 生产环境 ("production" | "development" | "none")

  module: { //模块配置相关
    rules: {
      // 模块规则（配置 loader、解析器等选项）
      loader, //让 webpack 能够去处理那些非 JavaScript 文件，（webpack 自身只理解 JavaScrip）
      // babel-loader,ts-loader,image-loader,sass-loader,css-loader,postcss-loader,eslint-loader,svg-inline-loader,source-map-loader, ....等
    }
  },
  resolve: { // 配置解析策略, 解决一些模块的引入
    extensions, // 使用的扩展名
    alias, // 别名
  }
  optimization: {  // 优化配置项
    splitChunks, // 提取公共模块
  },

}
```

> Webpack构建流程简单说一下

1. 初始化合并参数得到一个对象config
2. `webpack(config).run()`, 执行run开始编译
3. 确定入口
4. 编译模块
5. 输出资源

简单来说：

·初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
·编译：从 `Entry` 出发，针对每个 `Module` 串行调用对应的 `Loader` 去翻译文件的内容，再找到该 `Module` 依赖的 `Module`，**递归**地进行编译处理
·输出：将编译后的 `Module` 组合成 `Chunk`，将 `Chunk` 转换成文件，输出到文件系统中

> 说一说Loader和Plugin的区别

`loader`: 是一个函数，对其他类型的资源进行转译的预处理工作，把JS不认识的翻译成JS能够解析的。

`Plugin`: 是插件，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。配置类型为数组。

> 使用webpack开发时，你用过哪些可以提高效率的插件

> source map是什么

**`source map` 是将编译、打包、压缩后的代码映射回源代码的过程**。打包压缩后的代码不具备良好的可读性，想要调试源码就需要 soucre map。

> webpack热更新的原理

Webpack 的热更新又称热替换（Hot Module Replacement），缩写为 HMR。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

![image](https://user-images.githubusercontent.com/25894364/155524413-e8f7e0bb-48d4-4dcf-8363-9ffeca8800e8.png)

https://pic1.zhimg.com/80/v2-f7139f8763b996ebfa28486e160f6378_1440w.jpg

关键词: `HotModulePlugin`插件, `websocket` 和 `webpack-dev-server` 进行通信的

> 监听bundle打包体积

BundleAnalyzerPlugin插件：
`new BundleAnalyzerPlugin({ analyzerMode: 'static' })`

> webpack性能优化

减少打包时间：`缩减范围、缓存副本、定向搜索、提前构建、并行构建、可视结构`
减少打包体积：`分割代码、摇树优化、动态垫片、按需加载、作用提升、压缩资源`

// 时间上
- 缩减范围

 babel-loader只打包`src`目录，忽略`node-modules`的

- 缓存副本

配置cache缓存Loader对文件的编译副本,再次编译时只编译修改过的文件.
大部分`Loader/Plugin`都会提供一个可使用编译缓存的选项，通常包含cache字眼

```js
import EslintPlugin from "eslint-webpack-plugin";

export default {
  // ...
  module: {
    rules: [{
      // ...
      test: /\.js$/,
      use: [{
        loader: "babel-loader",
        options: { cacheDirectory: true }
      }]
    }]
  },
  plugins: [
    new EslintPlugin({ cache: true })
  ]
};
```

- 定向搜索

配置resolve提高文件的搜索速度。
`alias`映射模块路径，`extensions`表明文件后缀，`noParse`过滤无依赖文件。通常配置alias和extensions就足够。

- 提前构建（🀄️💊）

`DefinePlugin`, `DllPlugin`插件

```js
  plugins: [
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development") // DLL模式下覆盖生产环境成开发环境(启动第三方依赖调试模式)
    }),
    new DllPlugin({
      name: "[name]", // 全局变量名称：减小搜索范围，与output.library结合使用
      path: AbsPath("dist/static/[name]-manifest.json") // 输出目录路径
    })
  ]
```

- 并行构建

开启`thread-loader`loader，单进程转换为多进程，好处是释放CPU多核并发的优势。

```js
  module: {
    rules: [{
      // ...
      test: /\.js$/,
      use: [{
          loader: "thread-loader",
          options: { workers: Os.cpus().length }
      }, {
          loader: "babel-loader",
          options: { cacheDirectory: true }
      }]
    }]
  }
```
- 可视结构

BundleAnalyzerPlugin可以可视化找出体积过大原因

`import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";`

// 体积上
- 代码分割

`splitChunks`

```js
  optimization: {
    runtimeChunk: { name: "manifest" }, // 抽离WebpackRuntime函数
    splitChunks: {
      cacheGroups: {
        common: {
            minChunks: 2,
            name: "common",
            priority: 5,
            reuseExistingChunk: true, // 重用已存在代码块
            test: AbsPath("src")
        },
        vendor: {
          chunks: "initial", // 代码分割类型
          name: "vendor", // 代码块名称
          priority: 10, // 优先级
          test: /node_modules/ // 校验文件正则表达式
        }
      }, // 缓存组
      chunks: "all" // 代码分割类型：all全部模块，async异步模块，initial入口模块
    } // 代码块分割
  }
```

- 摇树优化(tree-sharking)

删除项目中未被引用代码

- 动态垫片

- 按需加载

将路由页面/触发性功能单独打包为一个文件，使用时才加载，好处是减轻首屏渲染的负担。因为项目功能越多其打包体积越大，导致首屏渲染速度越慢。

```js
// 代码按需加载
const Login = () => import( /* webpackChunkName: "login" */ "../../views/login");
const Logon = () => import( /* webpackChunkName: "logon" */ "../../views/logon");

```

```js
// webpack配置
{
  // ...
  "babel": {
    // ...
    "plugins": [
      // ...
      "@babel/plugin-syntax-dynamic-import"
    ]
  }
}
```

- 作用提升

- 压缩资源

压缩`HTML/CSS/JS`代码，`压缩字体/图像/音频/视频`，好处是更有效减少打包体积。极致地优化代码都有可能不及优化一个资源文件的体积更有效。
针对`HTML`代码，使用`html-webpack-plugin`开启压缩功能。

JS/CSS或者图片/视频等都有对应的`optimization`或者loader和plugin



[webpack优化配置](https://github.com/sisterAn/blog/issues/68)

[webpack中文官网](https://webpack.docschina.org/configuration/optimization/)

[写给中高级前端关于性能优化的9大策略和6大指标 | 网易四年实践](https://juejin.cn/post/6981673766178783262)

[webpack整理](https://juejin.cn/post/6844904094281236487)

[webpack HMR热更新](https://zhuanlan.zhihu.com/p/30669007)
