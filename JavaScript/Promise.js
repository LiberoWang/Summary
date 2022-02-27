
// 简单粗暴版本 - v0：不支持promise.then返回promise对象
class Promise {
  constructor(executor) {
    this.state = 'pending';
    this.value = '';
    this.reason = '';

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
    // 当resolve在setTomeout时state还是pending等待状态
    // 我们就需要在then调用的时候，将成功和失败存到各自的数组，一旦reject或者resolve，就调用它们
    if (this.state === 'pending') {
      this.onResolveCallbacks.push(() => onFulfilled(this.value));
      this.onRejectedCallbacks.push(() => onRejected(this.reason));
    }
  }
}

/**
 * Promise的完整版本,then方法返回一个promise函数 + resolvePromise函数实现
 */

class Promise {
  constructor(executor) {
    this.state = 'pending';
    this.value = '';
    this.reason = '';

    this.onResolveCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    };

    const reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    };

    try{
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    // 返回一个新的promise  
    const promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        // 异步：模拟微任务(异步方式执行，用以保证一致可靠的执行顺序)
        // 因为规范中表示: onFulfilled or onRejected must not be called until the execution context stack contains only platform code。使用setTimeout只是模拟异步，原生Promise并非是这样实现的。
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch(e) {
            reject(e);
          }
        }, 0);
      }

      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch(e) {
            reject(e);
          }
        }, 0);
      }

      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });

    // 返回promise2,完成链式
    return promise2;
  }
}


function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  // 防止多次调用
  let called;
  // 如果x不是null, 且x是对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // A+规定，声明then = x.then
      let then = x.then;
      if (typeof then === 'function') {
        // 执行then:把x当作this来调用它,第一个参数为 resolvePromise，第二个参数为rejectPromise,
        then.call(x, y => {
          if (called) return;
          called = true;
          // resolve的结果依旧是promise 那就继续解析
          resolvePromise(promise2, y, resolve, reject);
        }, r => {
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        // 直接成功即可
        resolve(x);
      }
    } catch(e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}


/**
 * Promise其他的API实现
 */

// Promise.resolve
Promise.prototype.resolve = function(params) {
  if (params instanceof Promise) {
    return params;
  }

  return new Promise((resolve, reject) => {
    if (params && params.then && typeof params.then === 'function') {
      setTimeout(() => {
        param.then(resolve, reject);
      });
    } else {
      resolve(params);
    }
  });
}

// 测试Promise.resole
let p = Promise.resolve(20);
p.then((data) => {
  console.log(data); // 20
});

let p2 = Promise.resolve({
  then: function(resolve) {
    resolve(30);
  }
});
p2.then((data)=> {
  console.log(data); // 30
});

let p3 = Promise.resolve(new Promise((resolve) => {
  resolve(400);
}));
p3.then((data) => {
  console.log(data); // 400
});


// Promise.reject
Promise.prototype.reject = function(reason) {
  return new Promise((_, reject) => {
    reject(reason);
  });
};


// Promise.catch
```
  catch是特殊的then方法，catch之后可以继续then
```
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
}


// Promise.finally
```
不管成功还是失败，都会走到finally中,并且finally之后，还可以继续then.
并且会将值原封不动的传递给后面的then.
```
Promise.prototype.finally = function(callback) {
  return this.then(value => {
    return Promise.resolve(callback()).then(() => {
      return value;
    })
  }, err => {
    return Promise.resolve(callback()).then(() => {
      throw err;
    });
  })
}

// Promise.all
```
  1. promises可以不是一个数组，是一个迭代器就行，迭代器就能进行遍历
  2. Promise.all接收一个数组[P1, P2, P3],每一个都是一个Promise的实例。
     如果不是Promise实例, Promise.all会通过Promise.resolve()包装成一个Promise对象
  3. 当数组里面所有Promise实例的状态都为fulfilled 时，调用then返回每一个实例的结果合成的数组，有一个失败返回的都是reject
```
Promise.prototype.all = function(promises) {
  const res = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    // 可以用forEach循环的下标作为计数器，只有当用var引用的时候不能用下标，for循环，let声明i也可以作为计数器
    promises.forEach(promise => {
      // Promise.resolve(promise)将promise实例包装成Promise对象，如果promise本来就是Promise对象，可直接promise.then
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
      }, reject);
    })
  })
}

// Promise.race
```
返回最先完成的状态(resolve或者rejected)
```
Promise.prototype.race = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(data => resolve(data)).catch((error) => reject(error))
    })
  })
}

// Promise.allSettled
```
Promise.allSettled()方法返回一个promise，该promise在所有给定的promise已被解析或被拒绝后解析，并且每个对象都描述每个promise的结果。
```
Promise.prototype.allSettled = function(promises) {
  const result = [];
  let count = 0;
  return new Promise(resolve => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(data => {
        result[count] = data;
        count++;
        if (count === promises.length) {
          resolve(result);
        }
      }, reason => {
        result[count] = reason;
        count++;
        if (count === promises.length) {
          resolve(result);
        }
      });
    });
  });
}
