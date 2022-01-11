### let 和 const 
let和const的出现主要是为了解决什么问题？

### 解构赋值
1. 数组解构
2. 对象解构

### 箭头函数

箭头函数的特殊：
1. 不能使用`arguments`参数
2. 不能使用`call`,`apply`,`bind`改变`this`，没有`this`的绑定
3. 没有原型，不能通过`new`关键字调用

### 数组功能

1. 数组的创建：`Array.of()`和`Array.form()`
2. 数组方法：`find()`与`findIndex()`，`fill()`, `copyWithin()`，`reduce()`,`map()`,`forEach()`,`filter()`,`some()`, `every()`不知道是不是新增的

### 对象功能

1. Object.keys()用于获取用户自身的所有的属性
2. Object.defineProperty()定义对象新属性或者修改原有属性
3. Object.is()用于比较，主要是弥补全等运算符的不准确
4. Object.assign()浅拷贝

### Set集合和Map集合

### Symbol和Symbol属性

### 迭代器(Iterator)和生成器(Generator)

### Promise和异步编程(async/await主要是ES7)
`Promise`更优雅的处理异步请求，其实就是回调函数另一种写法，可以帮助我们避免回调地狱。
回调地狱：比如第二个请求依赖第一个请求的结果进行请求，第三个请求依赖第二个，这样一层一层嵌套.........。

`async/await`返回的是一个`Promise`对象。
`Promise`链式调用是异步的，`async/await`看起来是同步的。
`Promise`是同样通过`catch`方法捕获reject的异常，`async/await`可以通过.then的方式或者`try-catch`捕获

### 代理(Proxy)和反射(Reflection)

### Class类

### 模块化
模块化：就是把单独的一个功能封装到一个模块中，模块之间相互隔离，但是可以通过特定的接口公开内部成员，也可以依赖别的模块。
好处：方便代码重用，从而提升开发的效率，并且方便后期的维护。





