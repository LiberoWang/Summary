#### 编程题

1. promise最大并发数请求限制
2. 千分位格式化
   
#### 网络和浏览器

1. 简单请求和非简单请求
2. 跨域
3. cookie的属性
4. 浏览器缓存
5. requsetAnimationFrame
6. 渲染流程
   [渲染流程](https://segmentfault.com/a/1190000014520786)
7. history和hash的区别

  hash是url中#后面部分(不会被发送到浏览器)，可以通过`hashchange`监听页面的变化
  history：html5提出来的api。是通过`pushState`，`replaceState`和事事件监听函数`popstate`实现

#### 框架

  1. React的生命周期
  2. React组件之间的通信
  3. useState的参数(普通值和回调函数，回调函数是惰性函数)
  4. dva的`connect`和react-redux的`connect`
      高阶组件：connect把React组件和redux的store真正连接起来
  5. 受控组件和非受控组件
      受控组件：表单元素数据自己控制； 非受控组件：表单数据就由`DOM`本身处理
  6. 高阶组件
     高阶组件就是一个函数，传给它一个组件，它返回一个新的组件
  7. React事件机制
   
    原生事件和合成事件（需要先了解前置知识-浏览器的事件机制）
  
    合成事件的特点：（React17之后改版了，不再绑定到document上，而是React树的根DOM容器中）
    - React 上注册的事件最终会绑定在document这个 DOM 上，而不是 React 组件对应的 DOM(减少内存开销就是因为所有的事件都绑定在`document` 上，其他节点没有绑定事件)
    - React 自身实现了一套事件冒泡机制，所以这也就是为什么我们 event.stopPropagation() 无效的原因。
    - React 通过队列的形式，从触发的组件向父组件回溯，然后调用他们 JSX 中定义的 callback
    - React 有一套自己的合成事件 SyntheticEvent，不是原生的
    - React 通过对象池的形式管理合成事件对象的创建和销毁，减少了垃圾的生成和新对象内存的分配，提高了性能

    [合成事件](https://zh-hans.reactjs.org/docs/events.html)

    [更改事件委托](https://zh-hans.reactjs.org/blog/2020/08/10/react-v17-rc.html#changes-to-event-delegation)

    [原生DOM事件模型](https://javascript.ruanyifeng.com/dom/event.html)

  8. usecallback和useMemo
  9. React Fiber

   [深入React fiber架构及源码](https://zhuanlan.zhihu.com/p/57346388)


#### JS基础

1. ES的新特性
  bigInt(ES10) / symbol(ES6)
  普通number的最大长度限制

  bigInt:表示任意大的数，不用担心精度问题。
  声明方式：在整数字面量后边加一个字符"n"- let nnn = 9007199254740991n; 或者let nnn = BigInt(9007199254740991)。
  bigInt不能使用Math对象，不能与Number类型进行混合运算

  `Number`类型只能安全地表示`-9007199254740991 (-(2^53-1)) 和9007199254740991(2^53-1)`之间的整数，任何超出此范围的整数值都可能失去精度。

  JS 提供`Number.MAX_SAFE_INTEGER`常量来表示 最大安全整数，`Number.MIN_SAFE_INTEGER`常量表示最小安全整数

  symbol: const s = Symbol();

  使用场景：
  - 消除魔法字符 
  - 作为对象属性 当一个复杂对象中含有多个属性的时候，很容易将某个属性名覆盖掉，利用 Symbol 值作为属性名可以很好的避免这一现象。
  - 模拟类的私有方法

  [symbol的理解](https://zhuanlan.zhihu.com/p/183874695)

2. 迭代器 / 异步迭代器

3. 判断数据的类型
  typeof | instanceof | Object.prototype.toString.call()

  > typeof

  ```
  000: 对象
  010: 浮点数
  100：字符串
  110：布尔
  1：整数
  ```
  只能检测基本类型，复杂类型和`null`都会被检测成`object`，因为`null`和`object`在内存当中存储的都是以`000xxx`开头的

  > instanceof

  只能检查复杂类型，使用过判断左值的`_proto_`有没有在右值的`prototype`上

  > Object.prototype.toString

  `toString()` 是 `Object` 的原型方法，调用该方法，默认返回当前对象的 `[[Class]]`（内部的分类） 。这是一个内部属性，其格式为 `[object Xxx]` ，其中 `Xxx` 就是对象的类型。 对于 `Object` 对象，直接调用 `toString()` 就能返回 `[object Object]` 。而对于其他对象，则需要通过 `call / apply` 来调用才能返回正确的类型信息。

  > constructor

  只能检测是某个构造函数， null和undefined是不能检测的
  ```js
    '22'.constructor === String // true
    true.constructor === Boolean // true
    [].constructor === Array // true
  ```

  **当开发者重写 prototype 后，原有的 constructor 引用会丢失，constructor 会默认为 Object。**

  [JS数据类型检测](https://juejin.cn/post/7068178018891464718)

4. 什么是变量提升
  
  [变量对象](https://github.com/mqyqingfeng/Blog/issues/5)

5. var的变量提升，let和const为什么不存在变量提升

  JS会经历编译和执行，在编译的时候，并将变量声明提前到变量当前所在作用域的顶部，也就是说，变量声明在编译阶段已经执行，而赋值则在执行阶段执行到对应语句时才会执行。所以才会出现所谓的“变量提升”。

  同名函数和变量之前提升的优先级顺序

  ```js
   console.log(foo); // [Function: foo]
   var foo = 10;
   function foo () {}
   console.log(foo); // 10
   ///////////分割线///////
   console.log(foo); // [Function: foo]
   var foo = 10;
   function foo () {}
   console.log(foo); // 10
  ```
  词法环境： 环境记录（分为声明式环境记录和变量式环境记录）和 对外部环境的引用
  变量环境： LexicalEnvironment(函数声明和let以及const的绑定)，VariableEnvironment(存储变量var的绑定)

[理解var,let和const从规范出发](https://juejin.cn/post/6860021906653839368)

[let和const](https://zhuanlan.zhihu.com/p/28140450)

[let和const有没有提升](https://juejin.cn/post/6993676334635417614)

[JS执行上下文和执行栈](https://juejin.cn/post/6844903704466833421)

6. 箭头函数this的指向

箭头函数没有自己的`this`,`arguments`，`super`, `prototype`或`new.target`,不能通过`new`调用，
没有`[[construct]]`内置属性，不能通过`call`, `apply`等改变`this`的指向。

**箭头函数不会创建自己的this,它只会从自己的作用域链(执行上下文)的上一层继承this**

特别：`React`中的`this`

7. ES中的数组去重和扁平化
8. 深拷贝和浅拷贝

> JSON.parse(JSON.stringify(x))

弊端：会忽略`undefined`和`symbol`,不能序列化函数,不能解决循环引用问题

其中X只能是Number, String, Boolean, Array, 扁平对象，即那些能够被 JSON 直接表示的数据结构.

![image](https://user-images.githubusercontent.com/25894364/156202732-e4259df6-b4e4-4f40-bf8f-6f7af5a7ae62.png)

[JSON.stringify()的问题](https://segmentfault.com/q/1010000040622953)

9. 闭包(JS垃圾回收机制)

 - 为什么需要垃圾回收？
    内存泄漏
 - 回收算法
    ～标记清理法(最常用): 缺点，清除之后内存变量还在原来的位置，留存的变量在内存中不是连续的，内存空间不是连续的。
    ～引用计数算法
 - 如何避免内存泄漏
    少使用必包
    清除不使用的定时器
    移除不用的事件监听

[V8引擎的垃圾回收 - 1](https://juejin.cn/post/6844904016325902344)

[V8引擎的垃圾回收 - 2](https://juejin.cn/post/6981588276356317214)

#### CSS

1. 伪类和伪元素
2. CSS3
3. 盒子模型
4. flex布局：属性含义
5. position
6. 重绘和重排
7. sass,less和css的区别
   
  `CSS-in-JS(style-component)` | `PostCSS`

  [css预处理器](https://febook.hzfe.org/awesome-interview/book2/css-preprocessor)

8. 开启css硬件加速 - GPU 加速
   - `transform: translateZ(0)`
   - `transform: translate3d(0, 0, 0)`
   - `will-change: transform` // 创建新的渲染层
   - `filter`

#### 构建

1. webpack构建流程，优化
2. webpack中plugin的工作原理
3. 前端性能优化常用的手段

#### 其他

1. webview和JS之间的通信
  JSBridge的原理