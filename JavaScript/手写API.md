### bind,call,apply的区别

```js
const a = { value: 'hhh' };
function foo(name, age) {
  return {
    name,
    age,
    value: this.value
  };
}
// call直接执行
foo.call(a, 'wang', 26); // 输出： { name: 'wang', 26, value: 'hhh' }

// apply直接执行
foo.apply(a, ['wang', 26]); // 输出： { name: 'wang', 26, value: 'hhh' }

// bind返回一个新的函数再执行
const bar = foo.bind(a, 'wang', 26);
bar(); // 输出： { name: 'wang', 26, value: 'hhh' }

// bind还可以
const bar1 = foo.bind(a, 'wang');
bar1(26); // 输出： { name: 'wang', 26, value: 'hhh' }
```

> bind

**特殊的bind的指向**

如果使用`new`运算符构造绑定函数，则忽略该值, 也就是说当`bind`返回的新函数作为构造函数使用的时候，`bind()`时指定的`this`会失效，但是参数依然有效。

```js
const a = { value: 'hhh'};
function foo(name, age) {
  return {
    name,
    age,
    value: this.value
  };
}

const bar = foo.bind(a, 'wang', 26);
bar(); // { name: 'wang', age: 26, value: 'hhh' }

// new构造函数调用
const ret = new bar();
console.log('ret', ret); // { name: 'wang', age: 26, value: undefined }
```

> 手动实现一个bind函数

```js
Function.prototype.myBind = function(context) {
  // 只能是函数才能调用myBind
  if (typeof this !== 'function') return;
  const _this = this;
  context = context || window; // 没有传或者传null时默认指向window
  const args = [...arguments].slice(1); // bind函数传入的参数

  return function() {
    // 返回的匿名函数的arguments是bind返回的新函数调用时传入的参数
    if (new.target) { // 被new构造函数调用时不去改变this的指向
      return new _this(...args, ...arguments);
    }

    return _this.apply(context, args.concat(...arguments))
  }
}
```

> 手动实现一个call函数

// ES5
```js
Function.prototype.myCall = function(context) {
  context = context || window;
  var args = [];

  for (var i = 1; i < arguments; i++) {
    args.push('arguments[' + i + ']');
  }

  context.fn = this;
  var result = eval('context.fn(' + args + ')');
  delete result fn;
  return result;
}
```

// ES6
`arguments`的扩展运算符
```js
Function.prototype.myCall = function(context) {
  if (typeof this !== 'function') return;
  context = context || window;
  const key = Symbol(); // 保证内部的函数名时唯一的，不会覆盖window上的方法
  context[key] = this;
  const args = [...arguments].slice(1);
  const result = context[key](...args); // 执行函数
  delete context[key];
  return result;
}
```

> 手动实现一个apply函数

`apply`和`call`的区别在于，`apply`的传参是一个包含多个参数的数组，`call`的传参是若干个参数的列表

```js
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') return;
  context = context || window;
  const key = Symbol();
  context[key] = this;
  const args = [...arguments].slice(1); // const args = arguments[1];

  const result = context[key](...args);
  delete context[key];
  return result;
}
```