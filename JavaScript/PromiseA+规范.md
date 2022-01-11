## 异步

### 前言

Javascript语言的执行环境是"单线程"。在这个线程中，JS 引擎会创建执行上下文栈，之后我们的代码就会作为执行上下文 ( 全局、函数、eval ) 像一系列任务一样在执行上下文栈中按照后进先出 ( LIFO ) 的方式依次执行。

> 同步：

> 异步：


### JavaScript中异步的实现

> 回调函数(callback)

```js
  ajax(url, () => {
    // .....
    ajax(url, () => {
      
    })
  });
```

优点：优点是简单、容易理解和实现。
缺点：容易造成回调地狱，不利于维护。各部分之间耦合度很高。

> 常用定时器函数:setTimeout, setInterval, requestAnimationFrame
> 事件监听: 常用于DOM的事件监听
> 发布/订阅 (观察者模式)
> Promise
> Generator函数
> async函数 （让异步编程简单）

### Promise

[PromiseA+规范](https://promisesaplus.com/)

#### PromiseA+规范

> 术语

`promise`: promise是一个拥有`then`方法的对象或者函数，其行为符合本规范
`thenable`: 是一个定义了`then`方法的对象或者函数
`value`: 指的是任何JavaScript的合法值(undefined , thenable 和 promise)
`exception`: 是使用thorw抛出的一个异常值
`reason`：promise被拒绝原因的值

注释：如果一个对象实现了`then`方法，那我们称之为这个对象是`thenable`对象。对所有的`Promise`都是`thenable`对象，但并非所有的`thenable`对象都是`Promise`。

> 要求
   
1. Promise的状态

一个`promise`必须处于三种状态`pending`-等待,`fulfilled`-完成,`rejected`-拒绝其中的一种
  a. 当处于`pending`状态，可能转换为`fulfilled`或者`rejected`
  b. 当处于`fulfilled`状态，无法转变为任何其他状态；必须有一个不可变的最终值；
  c. 当处于`rejected`状态，无法转变为任何其他状态；必须有一个不可变的原因(值)；

注释：这里的不可变指的是恒等（即 === ），而不是意味着其内部的不可变（即仅仅是其引用地址不变，但属性值可被更改）。

2. then方法

一个`promise`必须提供一个`then`方法以读取其当前值、终值和失败原因。
`promise`的`then`方法接收两个参数：

2.1 `promise.then(onFulfilled, onRejected)`

  a. `onFulfilled `和 `onRejected` 都是可选参数。`onFulfilled`和`onRejected`如果不是函数，其必须被忽略。
  b. 如果`onFulfilled`是函数，它必须在`promise`的状态变为`fulfilled`之后被调用，并且`promise`的值`(value)`作为它的第一个参数；在`promise`的状态变为`fulfilled`之前都不能被调用；不能被调用超过一次。
  c. 如果`onRejected`是函数，它必须在`promise`的状态变成`rejected`之后才能被调用，并且`promise`的原因`(reason)`作为它的第一个参数；在`promise`状态变为`rejected`之前都不能被调用;不能被调用超过一次。

2.2 `onFulfilled`和`onRejected`只有在执行环境堆栈仅包含平台代码时才能被调用.
2.2 `onFulfilled`和`onRejected`必须作为普通函数被调用。(即没有`this`的值).
2.3 同一个`promise`的`then`方法可以被调用多次
```js
var p = new Promise((resolve) => {
  resolve(1);
});
p.then();
p.then();
```

2.4 `then`方法必须返回一个`promise`：
`promise2 = promise1.then(onFulfilled, onRejected);`

2.4.1 如果`onFulfilled`或者`onRejected`返回的是一个值`x`,则必须执行**Promise解析程序**`[[Resolve]](promise2, x)`
2.4.2 如果`onFulfilled`或者`onRejected`抛出一个异常`e`，则`promise2`必须被拒绝`rejected`,并且将`e`作为拒绝原因(reason)

```js
var p = new Promise((resolve, reject) => {
  resolve(1);
})
p.then(() => {
    throw new Error ('error');
  })
  .then(
    value => {
      console.log('then-funfilled-1',value);
    },
    reason => {
      console.log('then-rejected-1',reason);
    }
  ).then(
    value => {
      console.log('then-funfilled-2',value);
    },
    reason => {
      console.log('then-rejected-2',reason);
    }
  );
```

2.4.3 如果`onFulfilled`不是一个函数，并且`promise1`已经变成`fulfilled`状态，`promise2`必须成功执行与`promise1`相同的值。

```js
var p = new Promise((resolve, reject) => {
  resolve(1);
})
p.then()
.then(value => {
  console.log(value);
});
```

2.4.4 如果`onRejected`不是一个函数，并且`promise1`已经变成`rejected`状态,`promise2` 必须拒绝执行并返回相同的据因.

```js
const p = new Promise((resolve, reject) => {
  resolve(1);
});
p.then(() => {
  throw new Error ('error');;
})
.then()
.then(value => {
  console.log(value); // 不会执行
},() => {
  console.log('error'); // error
});
```

then总结：

1. `then`的参数`onFulfilled`和`onRejected`可以省略，如果`onFulfilled`或者`onRejected`不是函数，将其会略，在后面的`then`中获取到之前返回的值
2. `promise`可以执行多次`then`，每次执行完`promise.then`方法之后都返回一个新的`promise`
3. 如果`then`的返回值`x`是一个普通值，那么就把这个结果作为参数传递到下一个`then`的成功回调函数中
4. 如果`then`中抛出了异常，那噩梦就会把这个异常作为参数，传递给下一个`then`的失败的回调中
5. 如果`then`的返回值`x`是一个`promise`，那么会等这个`promise`执行完，`promise`如果成功，就走下一个`then`的成功；如果失败，就走下一个`then`的失败；如果抛出异常，就走下一个`then`的失败；
6. 如果`then`的返回值`x`和`promise`是同一个引用对象，造成循环引用，则抛出异常，把异常传递给下一个`then`的失败回调中；
7. 如果`then`的返回值`x`是一个`promise`，且`x`同时调用了`resolve`函数和`reject`函数，则第一次调用优先，其他调用被忽略


8. Promise解析程序

`Promise`解析程序是一个抽象的操作，其需要输入一个`promise`和一个值。表示为`[[Resolve]](promise, x)`。

3.1 如果promise和x指向同一对象，那么用TypeError作为原因拒绝promise。
3.2 如果x是一个promise，则使用它的状态：
    a. 如果x是pending，则promise必须保留pending直到x变为fulfilled或rejected
    b. 如果(当)x是fulfilled，使用相同的值履行promise
    c. 如果(当)x是rejected，使用相同的原因拒绝promise
3.3 如果x是一个对象或者方法
    a. 让x作为`x.then`
    b. 如果`x.then`的结果是一个异常`e`,用`e`作为原因
    c. 如果`then`是一个方法，把`x`当作`this`来调用
3.4 如果x既不是对象也不是函数，则x完成`fulfilled`


### 非Promise的thenable对象
   
```js
const thenable = {
  then: function(resolve, reject) {
    setTimeout(() => {
      resolve('我是thenable对像的 resolve');
      reject('我是thenable对像的 reject');
    });
  }
};
```

### 例子🌰

> 返回一个Promise

```js
const p1 = new Promise((resolve, rejected) => {
  resolve(42);
});

const p2 = new Promise((resolve, rejected) => {
  resolve(43);
});

// onFulfilled返回一个promise
p1.then(value => {
  console.log(value); // 42
  return p2;
}).then(value => {
  console.log(value); // 43
});
```

> 循环引用

```js
const p1 = new Promise(resolve => {
  resolve(2);
});

const p2 = p1.then(() => {
  return p2; // 报TypeError的错误：Chaining cycle detected for promise
});
```

> 普通链式调用

```js
const p1 = new Promise(resolve => {
  resolve(2);
});

p1.then(value => {
  console.log('then 1:', value); // 2
  return value + 1;
}).then(value => {
  console.log('then 2:', value); // 3
});

// onFulfilled没有返回值
p1.then(value => {
  console.log('then 3:', value); // 2
}).then(value => {
  console.log('then 4:', value); // undefined
});

p1.then().then(value => {
  console.log('then 5:', value); // 2
});
```

// Chrome打印结果

![image](https://user-images.githubusercontent.com/25894364/124214246-8022c500-db24-11eb-9f60-ce447dc5b84e.png)


> 其他情况

```js
// 例1
Promise.resolve(2)
  .then(3)
  .then(Promise.resolve(4))
  .then(value => console.log(value)); // 2

// 例2
Promise.resolve(2)
  .then(() => {
    return 3;
  })
  .then(Promise.resolve(4))
  .then(value => console.log(value)); // 3

Promise.resolve(2)
  .then(() => {
    return 3;
  })
  .then(() => Promise.resolve(4))
  .then(value => console.log(value)); // 4
```

> 在复杂一点的

```js
const p1 = new Promise((resolve, reject) => {
  reject(1);
});
p1.then(value => {
  console.log('then 1 value:', value); // 没有执行
}, reason => {
  console.log('then 1 reason:', reason); // then 1 reason: 1
})
.then(value => {
  console.log('then 2 value:', value); // then 2 value: undefined
}, reason => {
  console.log('then 2 reason:', reason); // 没有执行
});
// 由于第一个then里面没有抛出Error，所有第二个then状态还是resolve
```



### Promise

```javascript
  class Promise {
     constructor(executor) {
       this.state = 'pending';
       this.reason = '';
       this.value = '';

       this.onResolveCallbacks = [];
       this.onRejectedCallbacks = [];

       const resolve = value => {
         if (this.state === 'pending') {
           this.state = 'fulfilled';
           this.value = value;
           this.onResolveCallbacks.forEach(fn => fn());
         }
       };

       const reject = reason => {
         if (this.state === 'pending') {
            this.state = 'rejected';
            this.reason = reason;
            this.onRejectedCallbacks.forEach(fn => fn());
         }
       };

       try {
         executor(resolve, reject);
       } catch (err) {
         reject(err);
       }
     }

    // then方法
    then(onFulfilled, onRejected) {
      if (this.state === 'fulfilled') {
         onFulfilled(this.value);
      }
      if (this.state === 'rejected') {
        onRejected(this.reason);
      }
      if (this.state === 'pending') {
         this.onResolveCallbacks.push(() => onFulfilled(this.value));
         this.onRejectedCallbacks.push(() => onRejected(this.reason));
      }
    }
  }
```



### Promise.all

`Promise.all`接收一个数组`[P1, P2, P3]`,每一个都是一个`Promise`的实例。(如果不是Promise实例, `Promise.all`会通过`Promise.resolve()包装成一个Promise对象`)返回的是一个Promise对象。当数组里面所有Promise实例的状态都为`fulfilled `时，调用then返回每一个实例的结果合成的数组，有一个失败返回的都是`reject `

```javascript
  // promises可以不是一个数组，是一个迭代器就行，迭代器就能进行遍历
  Promise.all = function(promises) {
    const res = [];
    let count = 0;
    return new Promise((resolve, reject) => {
       // 可以用forEach循环的下标作为计数器，只有当用var引用的时候不能用下标，for循环，let声明i也可以作为计数器
       promises.forEach(promise => {
           //  Promise.resolve(promise)将promise实例包装成Promise对象，如果promise本来就是Promise对象，可直接promise.then
           Promise.resolve(promise).then(data => {
              // 使用下标赋而不是直接push是为了保证返回数组顺序和传入数组顺序一一对应
              // Promise是异步的，可能第一个结果还没有返回，第二个返回了，push可能会导致顺序不一致
              res[count] = data;
              count++;
              // 这里使用count计数器和传入的数组比较看处理完没有，而不是用res的长度和传入的promise进行比较
              //  是因为Promise是异步返回的
              if (count === promises.length) {
                resolve(res);
              }
           }, reject)
       })
    })
  }
```
示例
```javascript
const p1 = new Promise(resolve => resolve(1));
const p2 = new Promise(resolve => resolve(2));
const p3 = new Promise(resolve => resolve(3));

Promise.all([p1, p2, p3]).then(data => console.log(data)); // [1, 2,3]
```

### Promise.allSettled

```javascript
  Promise.allSettled = function(promises) {
    const result = [];
    let count = 0;
    return new Promise((resolve, reject) => {
       promises.forEach(promise => {
          Promise.resolve(promise).then(data => {
             result[count] = data;
             count++;
             if (count === promises.length) {
                 resolve(result);
             }
          }, (reason) => {
             result[count] = data;
             count++;
             if (count === promises.length) {
                resolve(result);
             }
          })
       })
    })
  }
```

### Promise.race

```javascript
   Promise.race = function(promises) {
     return new Promise((resolve, reject) => {
       promises.forEach(promise => {
           Promise.resolve(promise).then(data => resolve(data)).catch((error) => reject(error))
       })
     })
   }
```

### Promise.resolve

```javascript
  Promise.resolve = function(val) {
     return new Promise((resolve, reject) => {
        resolve(val);
     })
  }
```

### Promise.reject 

```javascript
Promise.reject = function(val) {
  return new Promise((resolve, reject) => {
     reject(val);
  })
}
```


参考：

[史上最全手写Promise](https://juejin.im/post/5b2f02cd5188252b937548ab)
[45道Promise面试题](https://juejin.im/post/5e58c618e51d4526ed66b5cf)
[手写Promise](https://github.com/xieranmaya/Promise3/blob/master/Promise3.js)
[yck的Promise](https://juejin.im/post/6869573288478113799?utm_source=gold_browser_extension)


关于Promise.then的：

[Promise的then](https://www.zhihu.com/question/408642623/answer/1376646801)


### 参考链接

0. https://juejin.cn/post/6844903625769091079
1. https://juejin.cn/post/6844903512845860872
2. https://github.com/ljianshu/Blog/issues/53
3. https://zhuanlan.zhihu.com/p/62403414
4. https://github.com/YvetteLau/Blog/issues/2

