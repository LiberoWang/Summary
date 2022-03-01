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

### 写一个校验值类型的

```js
Object.prototype.toString.call(1)
"[object Number]"

Object.prototype.toString.call(NaN);
"[object Number]"

Object.prototype.toString.call("1");
"[object String]"

Object.prototype.toString.call(true)
"[object Boolean]"

Object.prototype.toString.call(null)
"[object Null]"

Object.prototype.toString.call(undefined)
"[object Undefined]"

Object.prototype.toString.call(function a() {});
"[object Function]"

Object.prototype.toString.call([]);
"[object Array]"

Object.prototype.toString.call({});
"[object Object]"
```

`call()`方法可以改变`this`的指向，那么把`Object.prototype.toString()`方法指向不同的数据类型上面，返回不同的结果.

```js
function instanceType(con) {
  const s = Object.prototype.toString.call(con);
  // s.match(/\[object (.*?)\]/) => ['[object Object]', 'Object']
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
}
```


`call`, `apply`, `bind`是用来绑定`this`的指向

### call

语法： fun.call(thisArg, arg1, arg2, ...)

demo1:

```javascript
  const Person = {
    name: 'Tom',
    say() {
      console.log(this);
      console.log(`我叫${this.name}`)
    }
  }

 Person.say(); // 我叫Tom
 
 const Person1 = { name: 'Jon' };
 Person.say.call(Person1); // 我叫Jon
```

实现：

```javascript
Function.prototype.myCall = function(context) {
  // context 就是我们传进来的Person1
  context = context ? Object(context) : window;
 // 给context添加一个方法fn指向调用myCall的say方法为this， myCall里面的this就是我们虚拟的say方法
  context.fn = this; 
  const args = [];
  for(let i = 1, len = arguments.length; i < len; i ++ ) {
    args.push('arguments[' + i + ']');
  }
  const result = eval('context.fn(' + args + ')');
  delete context.fn;
  return result;
}
```

或者：

```javascript
Function.prototype.myCall = function(context) {
   context = context ? Object(context) : window;
   context.fn = this;
   let args = [...arguments].slice(1);
   let r = context.fn(args);
   delete context.fn;
   return r;
}
```

### apply

语法： `func.apply(thisArg, [argsArray])`

实现：

```js
Function.prototype.myApply = function(context) {
  context = context || window;
    context.fn = this;
    let args = [...arguments][1];
    if (!args) {
        return context.fn();
    }
    let r = context.fn(args);
    delete context.fn;
    return r;
 }
```

### bind

bind会创建一个新的函数。语法： `function.bind(thisArg, [arg1[, arg2[, ...]]])`

例子：
```javascript
his.x = 9;    // 在浏览器中，this指向全局的 "window" 对象
const module = {
  x: 81,
  getX: function() { return this.x; }
};
module.getX(); // 81
const retrieveX = module.getX;
retrieveX(); // 返回9 - 因为函数是在全局作用域中调用的

const boundGetX = retrieveX.bind(module);  // 创建一个新函数，把 'this' 绑定到 module 对象
boundGetX(); // 81
```

实现：

```javascript
  Function.prototype.myBind = function(context) {
    const self = this; // 保存原函数
    // 从bind函数的第二个参数到最后一个参数
    const args = [].slice.call(argumnets, 1);
    return function() {
       const bindArgs = [].slice.call(arguments);
       self.apply(context, args.concat(bindArgs));
    }
  }
```

### new

语法： `const f1 = new Foo()`

1.  f1是构造函数Foo的实例，`_proto_`指向构造函数的原型Foo.prototype
2.  Foo.prototype.constructor指向构造函数Foo，Foo的prototype指向它的原型
3.  Foo的原型的_proto_始终指向Object

实现：

```javascript
// example1
function newOperator(fn) {
   const obj = new Object();
   obj._proto_ = fn.prototype;
   const args = [...arguments].slice(1);
   const ret = fn.apply(obj, args);
   return (ret instanceof Object) ? ret : obj;
}

// example2
function newOperator(fn) {
   newOperator.target = fn;
   const obj = Object.create(fn.prototype);
   const ret = fn.apply(obj, args);
   return (ret instanceof Object) ? ret : obj;
}

// example3
function newOperator() {
   const obj = new Object();
   const Constructor = [].shift.call(arguments);
   const ret = Constructor.apply(obj, arguments);
   return (ret instanceof Object) ? ret : obj;
}
```

### instanceof

`instanceof`的工作原理：在表达式` x instanceof Foo` 中，如果 `Foo` 的原型（即 `Foo.prototype`）出现在` x `的原型链中，则返回 `true`，不然，返回`false`

```javascript
function new_instance_of(leftValue, rightValue) {
  // 取左表达式的__proto__值
  const left = leftValue._proto_;
  // 取右表达式的 prototype 值
  const right = rightValue.prototype;

  while(left) {
    if (left === null) {
      return false;
    }
    if (left === right) {
       return true;
    }
    left = left._proto_;
  }
}
```