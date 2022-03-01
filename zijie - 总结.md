1. 受控组件与非受控组件

// React官网
[受控组件](https://zh-hans.reactjs.org/docs/forms.html#controlled-components)

简单说，在HTML表单元素中，他们通常自己维护一套的‘state’，并随着用户的输入，自行的在UI上更新，这种行为是不被我们所控制的。如果将`React`中的`state`属性和表单元素的值建立依赖关系，再通过`onChange`和`setState`事件更新`state`属性，能达到控制用户输入过程中表单值的改变，被React以这种方式控制取值的叫做`受控组件`.


[非受控组件](https://zh-hans.reactjs.org/docs/uncontrolled-components.html)

简单说，就是表单数据就由`DOM`本身处理.input标签它实际也是一个DOM元素，那么我们是不是可以用获取DOM元素信息的方式来获取表单元素的值呢？也就是使用ref。

[受控组件与非受控组件](https://juejin.cn/post/6858276396968951822)


2. React的事件机制

> 关键词：是什么？ /  执行顺序  /  总结 

`合成事件`: React基于浏览器的事件机制自己实现了一套自己的事件机制，包括事件的注册，监听，合成，冒泡，派发等。

问题：
- 我们写的事件是绑定在dom上么，如果不是绑定在哪里？
- 为什么我们的事件不能绑定给组件？
- 为什么我们的事件手动绑定this(不是箭头函数的情况)
- react怎么通过dom元素，找到与之对应的 fiber对象的？


[React事件机制](https://developer.51cto.com/article/668958.html)

[最全React事件机制详解](https://www.jianshu.com/p/41776f2f4d8b)

3. useState的参数

```js
const [state, setState] = useState(initialState);
```

React重新渲染时，每次渲染都会执行`useState`,`initialState`是一个原始值，则不会有性能问题。

状态的延迟初始化:（如下）入参是一个callback

```js
function MyComponent({ bigJsonData }) {
  const [value, setValue] = useState(function getInitialState() {
    const object = JSON.parse(bigJsonData); // expensive operation
    return object.initialValue;
  });

  // ...
}
```
当初始状态需要昂贵的性能方面的操作时，可以通过为`useState(computeInitialState)`提供一个函数来使用状态的延迟初始化。

**`getInitialState()`仅在初始渲染时执行一次，以获得初始状态。在以后的组件渲染中，不会再调用`getInitialState()`，从而跳过昂贵的操作.**

[React Hook useState指南](https://juejin.cn/post/6844903999083118606)

4. useCallback和useMemo

`useCallback`和`useMemo`是React内置的用于性能优化的hooks。

`useCallback`返回的是一个缓存的函数；`useMemo`返回的是一个缓存的结果.

`useCallback(fn, inputs) === useMemo(() => fn, inputs))`

问题：
- 为什么要使用`useCallback`和`useMemo`
- 什么时候要使用`useCallback`和`useMemo`

// when?
- 引用相等
- 昂贵的计算

[什么时候用useCallback和useMemo](https://jancat.github.io/post/2019/translation-usememo-and-usecallback/)

[useCallback](https://zhuanlan.zhihu.com/p/56975681)

[React useCallback源码](https://github.com/facebook/react/blob/0e100ed00fb52cfd107db1d1081ef18fe4b9167f/packages/react-server/src/ReactFizzHooks.js#L445)

5. Redux中的connect函数

关键引用：

```js
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise';
import { createStore, applyMiddleware } from 'redux';
```

// connect函数 -- 连接React组件与Redux store -> 返回一个新的已与 Redux store 连接的组件类.

```js
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
```

[connect - API](https://www.redux.org.cn/docs/react-redux/api.html)

[connect解释](https://segmentfault.com/a/1190000015042646)

6. webpack的作用以及webpack中loader与plugin的区别 / plugin的工作原理

![image](https://user-images.githubusercontent.com/25894364/156019804-6e9048d5-7ea6-46b5-8120-63e795f2c31e.png)

`loader` 用于转换某些类型的模块，而`plugin`插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

loader: 作用是让webpack拥有了加载和解析非JavaScript文件的能力。
plugin: 直译为"插件"。plugin可以扩展webpack的功能，让webpack具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。


[webpack中文文档](https://webpack.docschina.org/concepts/#plugins)

[plugin工作原理](https://segmentfault.com/a/1190000023016347)

[深入webpack打包原理，loader和plugin的实现](https://juejin.cn/post/6844904146827476999#heading-14)

7. SSO单点登录 (cookie)

同域名 / 不同域名

中间登录跳转系统 - SSO
SSO: 用户填写用户名、密码，SSO系统进行认证后，将登录状态写入SSO的session，浏览器（Browser）中写入SSO域下的Cookie。

域名1app1访问时跳转至SSO登录系统，没有登录就进行登录验证，SSO系统登录完成后会生成一个ST（Service Ticket），然后跳转到app系统，同时将ST作为参数传递给app系统。
app系统利用SSO返回的ST进行验证是否有效。验证通过后，app系统将登录状态写入session并设置app域下的Cookie。

[SSO单点登录 - 参考](https://zhuanlan.zhihu.com/p/66037342)

[单点登录（SSO)](https://juejin.cn/post/6945277725066133534)

