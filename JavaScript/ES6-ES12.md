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

***************************

#### polyfill

`preset-env`，它实现了按需引入 `polyfill`

```js
{ 
   "presets": [
        ["@babel/preset-env", { 
            "targets": "> 0.25%, not dead" 
        }]
   ]
}
```

#### ES6

1. let 和 const
2. 函数默认参数

```js
function fn (name = '林三心', age = 18) {
  console.log(name, age)
}
```
3. 扩展运算符 和 剩余参数
4. 模版字符串
5. Object.keys
获取object对象所有key的集合，进而获得所有key对应的value

6. 箭头函数 （箭头函数和普通函数的区别）
7. 新增数组方法
```js
Array.prototype.forEach
Array.prototype.map
Array.prototype.filter
Array.prototype.some
Array.prototype.every
Array.prototype.reduce
Array.prototype.from
```

8. 对象属性同名简写
```js
const name = '林三心'
const age = '22'

// 属性同名可简写
const obj = { name, age };
// ES5的写法
const obj = { name: name, age: age }
```

9. Promise
10. class
11. 解构赋值
12. find 和 findIndex
13. for of 和 for in
14. 迭代器与生成器
15. Set 和 Map
16. Symbol
17. Proxy 与 Reflect
18. ES Module(模块化)

#### ES7

1. includes
2. 求幂运算符 (**)

```js
// ES5
const num = Math.pow(3, 2) // 9

// ES7 
const num = 3 ** 2 // 9
```

#### ES8

1. Object.values
2. Object.entries
3. async/await

#### ES9

1. for await of

```js
function fn (time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`${time}毫秒后我成功啦！！！`)
    }, time)
  })
}

async function asyncFn () {
  const arr = [fn(3000), fn(1000), fn(1000), fn(2000), fn(500)]
  for await (let x of arr) {
    console.log(x)
  }
}

asyncFn()
// 3000毫秒后我成功啦！！！
// 1000毫秒后我成功啦！！！
// 1000毫秒后我成功啦！！！
// 2000毫秒后我成功啦！！！
// 500毫秒后我成功啦！！！
```

2. Promise.finally

#### ES10

1. Array.flat
2. Array.flatMap
3. BigInt
4. Object.fromEntries
5. String.prototype.matchAll
5. String.trimStart && String.trimEnd

#### ES11

1. Promise.allSettled
2. 可选链(?. 和 ??)

#### ES12

1. Promise.any
2. String.protype.replaceAll
3. ||= 和 &&=


[参考链接](https://xjl271314.github.io/docs/es/)

