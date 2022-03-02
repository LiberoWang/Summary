#### 先看一个面试题
```javascript
 console.log(1);
 setTimeout(() => {
   console.log(2);
   Promise.resolve().then(() => {
     console.log(3);
   });
 });
 new Promise((resolve) => {
  resolve();
  console.log(4);
 }).then(() => {
   console.log(5);
   setTimeout(() => {
     console.log(6);
   });
 }).then(() => console.log(7));
 console.log(8);
 
 // 1,4,8,5,7,2,3,6
```

### 前言

JavaScript是一门单线程语言，事件循环是JS实现异步的一种方式，也是JS的执行机制

### 同步任务和异步任务

比如，当我们打开网站的时候，网页的渲染过程就是一堆同步任务，比如页面骨架和页面元素的渲染。
像加载图片音乐之类占用资源大，耗时久的任务，就是异步任务。

![image](https://user-images.githubusercontent.com/25894364/90977190-0ae67b00-e576-11ea-8b02-d92fe0a26e42.png)

### Event Loop的执行顺序

- 首先执行同步代码，这属于宏任务
- 当执行完所有同步代码后，清空执行栈，查询是否有异步代码需要执行
- 执行所有微任务
- 当执行完所有微任务，如果有必要渲染页面
- 然后进行下一轮的Event Loop，执行宏任务中的异步代码，也就是`setTimeout`中的回到函数

> macro-task任务

包括整体代码script, setTimeout, setInterval

> micro-task任务

Promise, process.nextTick, MutaionObserver

`process.nextTick`注册的函数优先级高于`Promise`
process.nextTick 是一个独立于 eventLoop 的任务队列，在每一个Event Loop阶段完成之后，就会去检查nextTick队列，如果里面有任务，就会让这部分代码优先于微任务执行。

![image](https://user-images.githubusercontent.com/25894364/90977466-5a2dab00-e578-11ea-9995-2044ecc9b603.png)


### async/await执行顺序

`async`会隐式的返回Promise作为结果，那么可以简单的理解为,`await`后面的函数执行完毕时，`await`会产生一个微任务(Promise.then是微任务)。但是我们要注意微任务产生的时机，它是执行完`await`之后，直接跳出`async`函数，执行其他代码，其他代码执行完毕后，再回到`async`函数去执行剩下的代码。

```javascript
  function A() {
    return Promise.resolve(Data.now())
  }

  async function B() {
    console.log(Math.random());
    const now = await A();
  }

  console.log(1);
  B();
  console.log(2);

 ----------
 //  改写

function B() {
    console.log(Math.random());
    A().then(function(now) {
        console.log(now);
    })
}
console.log(1);
B();
console.log(2);

// 输出： 1, 0.374786(随机数), 2, 157648934（时间戳）
```


```javascript
console.log('script start')

async function async1() {
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2 end')
    return Promise.resolve().then(()=>{
        console.log('async2 end1')
    })
}
async1()

setTimeout(function() {
    console.log('setTimeout')
}, 0)

new Promise(resolve => {
    console.log('Promise')
    resolve()
})
.then(function() {
    console.log('promise1')
})
.then(function() {
    console.log('promise2')
})

console.log('script end')

// 输出：script start, async2 end, Promise, script end, promise1, promise2, async1 end, setTimeout
```

分析：
- 执行代码，输出：`script start`
- 执行async1(), 调用async2(),然后输出: `async2 end`，此时会保留async1函数的上下文，然后跳出async1函数
- 遇到setTimeout函数，分发到宏任务中
- 执行new Promise()的构造函数，输出:`Promise`
- 遇到then，分发到微任务中
- 执行代码，输出: `script end`

第一轮宏任务执行完毕，开始执行微任务队列
- 第一个微任务then, 输出: `promise1`;该微任务遇到第二个then，产生一个新的微任务
- 执行第二个微任务，输出：`promise2`,当前微任务执行完毕，执行权回到async1
- 执行await，实现会产生一个promise的返回：
```
  const _promise = new Promise((resolve, reject) => resolve(undefined));
```
- 执行完成，执行await后面的语句，输出:`async1 end`

- 第二轮Event Loop，第一个宏任务setTimeout, 输出：`setTimeout`

> 变形

```javascript
console.log('script start')

async function async1() {
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2 end')
    return Promise.resolve().then(()=>{
        console.log('async2 end1')
    })
}
async1()

setTimeout(function() {
    console.log('setTimeout')
}, 0)

new Promise(resolve => {
    console.log('Promise')
    resolve()
})
.then(function() {
    console.log('promise1')
})
.then(function() {
    console.log('promise2')
})

console.log('script end')
// 输出： async script, async 2 end, Promise, script end, async2 end1, promise1, promise2, async1 end, setTimeout
```

分析：
此时，执行完await会**`并不会`**把await后面的代码注册到微任务队列中，而是执行完await之后，直接跳出async1函数，执行其他代码，然后遇到Promise，把Promise.then注册为微任务，其他代码执行完毕之后，需要回到async1函数，执行剩下的代码，然后把await后面的代码，注册到微任务中，注意此时微任务队列中是有之前注册的微任务的。


### 练习

```javascript
console.log(1)

setTimeout(() => {
    console.log(2)
    new Promise(resolve => {
        console.log(4)
        resolve()
    }).then(() => {
        console.log(5)
    })
})

new Promise(resolve => {
    console.log(7)
    resolve()
}).then(() => {
    console.log(8)
})

setTimeout(() => {
    console.log(9)
    new Promise(resolve => {
        console.log(11)
        resolve()
    }).then(() => {
        console.log(12)
    })
})

// 1,7,8,2,4,5,9,11,12
```

分析：

- 同步运行的代码首先输出：`1, 7`
- 接着清空microtask队列：`8`
- 第一个task执行：`2, 4`
- 接着清空microtask：`5`
- 第二个task执行：`9,11`
- 接着，清空microtask队列： `12`

![image](https://user-images.githubusercontent.com/25894364/90977714-fc01c780-e579-11ea-94df-24349517a547.png)


```javascript
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})

// 1，7，6，8，2，4，3，5，9，11，10，12
```
分析：

- 整体script作为一个宏任务进入主线程，遇到`console.log`，输出：`1`
- 遇到setTimeout，其回调函数被分发到宏任务Event Queue中，我们暂且记为`setTimeout1`
- 遇到process.nextTick()，其回调函数被分发到微任务Event Queue中，我们暂且记为`process1`
- 遇到Promise，new Promise()的构造函数直接执行，输出: `7`
- Promise.then回调函数被分发到微任务Event Queue，我们记为`then1`
- 又遇到setTimeout，其回调函数被分到宏任务Event Queue，我们记为`setTimeout2`

第一轮循环宏任务结束，输出：`1, 7`

现在table中的任务栈有：

宏任务 Event Queue：`setTimeout1`, `setTimeout2`
微任务 Event Queue：`process1`, `then1`

发现两个微任务，执行`process1`输出: `6`; 执行`then1`输出：`8`

**第一轮Event Loop结束，输出：`1, 7, 6, 8`**

第二轮事件循环从`setTimeout1`开始:

- 首先输出：`2`
- 遇到process.nextTick()，将其分发到微任务Event Queue中，记为`process2`
- 遇到 new Promise,构造函数立即执行，输出：`4`，
- Promise.then分发到微任务Event Queue中，记为`then2`

现在的table任务栈：

宏任务 Event Queue：`setTimeout2`
微任务 Event Queue：`process2`, `then2`

第二轮事件宏任务结束，发现`process2`和`then2`两个微任务，执行两个微任务输出：`3, 5`

第二轮Event Loop结束输出：`2, 4, 3, 5`

第三轮执行宏任务`setTimeout2`

- 直接输出：`9`
- 遇到process.nextTick()分发到微任务Event Queue，记为：`process3`
- 直接执行new Promise的构造函数输出：`11`
- 将`then`分发到微任务Event Queue，记为`then3`

第三轮宏任务结束遇到两个微任务，执行`process3`和`then3`，输出：`10, 12`
第三轮Event Loop事件循环结束，输出: `9, 11, 10, 12`

整段代码，共进行了三次Event Loop，完整的输出是: `1，7，6，8，2，4，3，5，9，11，10，12`


参考：

[这一次，彻底弄懂JavaScript执行机制](https://juejin.im/post/6844903512845860872)

[Event Loop的规范和实现](https://zhuanlan.zhihu.com/p/33087629)

[说说事件循环机制](https://juejin.im/post/6844904079353708557?utm_source=gold_browser_extension)

[前端中的事件循环eventloop机制](https://juejin.im/post/6844904035770695693)

> 关键词：

0. 起因(缘由)
1. 任务机制(宏任务/微任务)


> 问题

1. 为什么会有事件循环机制

`单线程`， `同步阻塞`

因为JS是单线程，会阻塞后面的进程，于是出现了`异步任务`（回调函数）

主线程需要频繁的和多个线程协调任务、调度任务，于是`浏览器`又进一步引入了事件循环(EventLoop)的机制，来协调多个线程多个事件之间的工作。


这里首先要明确一点：浏览器是一个进程，其有多个线程

```
一般情况下, 浏览器有如下五个线程:

GUI 渲染线程
JavaScript 引擎线程
浏览器事件触发线程
定时器触发线程
异步 HTTP 请求线程
```

2. 任务机制

宏任务：诸如 整个script、各种事件回调（dom 事件、I/O）、setTimeout、setInterval 等任务。
微任务：诸如 Promise.[then/finally/catch]、MutationObserver (dom变化监听/前端回溯) 等任务。

3. 为什么要引入微任务

关键词：事件循环机制中任务的`优先级、时效性`

4. 执行流程

[精简版]： 调用栈为空 -> 执行宏任务队列中最早的一个宏任务 x -> 执行 x 关联的微任务队列中的所有微任务 -> 调用栈为空 -> .... (重复如上动作) 这样重复的轮询机制，被称之为事件循环。


```js
console.log('script start');

async function async1() {
  await async2()
  console.log('async1 end');
}

async function async2() {
  await async3()
  console.log('async2 end');
}

async function async3() {
  console.log('async3 end');
}

async function Myasync1() {
  await Myasync2()
  console.log('Myasync1 end');
}

async function Myasync2() {
  await Myasync3()
  console.log('Myasync2 end');
}

async function Myasync3() {
  console.log('Myasync3 end');
}

async1()
Myasync1()

setTimeout(function() {
  console.log('setTimeout');
}, 0)

new Promise(resolve => {
  console.log('Promise');
  resolve()
})
  .then(function() {
    console.log('promise1');
  })
  .then(function() {
    console.log('promise2');
  })

console.log('script end');
```

![9e1e40c59f6971f6bcbec71c0a4e8404.png](evernotecid://6E2F0541-5EBF-450A-A78B-AACE4C6306D5/appyinxiangcom/16628798/ENResource/p192)


```js
new Promise(resolve => {                  // 1
  setTimeout(()=>{                        // 2
      console.log(666);                   // 3
      new Promise(resolve => {            // 4
        resolve();                        // 5      
      })                                  // 6       
      .then(() => {console.log(777);})    // 7
  })                                      // 8       
  resolve();                              // 9
 })                                       // 10
 .then(() => {                            // 11
	     new Promise(resolve => {         // 12
	       resolve();                     // 13
	     })                               // 14
	     .then(() => {console.log(111);}) // 15
	     .then(() => {console.log(222);});// 16
 })                                       // 17
 .then(() => {                            // 18
	     new Promise((resolve) => {       // 19
	       resolve()                      // 20
	     })                               // 21
	    .then(() => {                     // 22
		     new Promise((resolve) => {   // 23
		       resolve()                  // 24
		     })                           // 25
		    .then(() => {console.log(444)})// 26
	     })                                // 27
	    .then(() => {                      // 28
	       console.log(555);               // 29
	    })                                 // 30
})                                         // 31
.then(() => {                              // 32
  console.log(333);                        // 33
})                                         // 34

```

[参考链接](https://juejin.cn/post/6977998218315431967)

[参考链接](https://juejin.cn/post/6856324679951450120)

[参考链接](https://juejin.cn/post/6856324679951450120)

[浏览器进程、JS事件循环机制、宏任务和微任务](https://juejin.cn/post/6856324679951450120#heading-0)



