#### 编程题

1. promise最大并发数请求限制
2. 千分位格式化
   
#### 网络和浏览器

1. 简单请求和非简单请求
2. 跨域
3. cookie的属性
4. 浏览器缓存
5. requsetAnimationFrame

#### 框架

  1. React的生命周期
  2. React组件之间的通信
  3. useState的参数(普通值和回调函数)
  4. dva的`connect`和react-redux的`connect`
  5. 受控组件和非受控组件
  6. 高阶组件
  7. React事件机制
  8. usecallback和useMemo


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

  `toString()` 是 `Object` 的原型方法，调用该方法，默认返回当前对象的 `[[Class]]` 。这是一个内部属性，其格式为 `[object Xxx]` ，其中 `Xxx` 就是对象的类型。 对于 `Object` 对象，直接调用 `toString()` 就能返回 `[object Object]` 。而对于其他对象，则需要通过 `call / apply` 来调用才能返回正确的类型信息。

  > constructor

  只能检测是某个构造函数， null和undefined是不能检测的
  ```js
    '22'.constructor === String // true
    true.constructor === Boolean // true
    [].constructor === Array // true
  ```

4. 什么是变量提升
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

#### CSS

1. 伪类和伪元素
2. CSS3
3. 盒子模型
4. flex布局：属性含义
5. position
6. 重绘和重排
7. sass,less和css的区别


#### 构建

1. webpack构建流程，优化
2. webpack中plugin的工作原理
3. 前端性能优化常用的手段

#### 其他

1. webview和JS之间的通信
  JSBridge的原理