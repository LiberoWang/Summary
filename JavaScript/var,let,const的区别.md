### 改造下面的代码，使之输出0 - 9，写出你能想到的所有解法。

// 初始代码 -- 隔1秒中打印10次10
```js
  for (var i = 0; i < 10; i++){
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }
```
解释：`var`声明的变量存在变量提升，再循环之外也可以访问，每次迭代都共享着变量i，循环内部创建的函数全部保留了对相同变量的引用。

// 打印 0 - 9

```js
// 每次循环let都会创建一个新的变量i,并将其初始化为i的当前值（重新绑定）。
  for (let i = 0; i < 10; i++){
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }

// setTimeout的第三个参数
  for (var i = 0; i < 10; i++){
    setTimeout(i => {
      console.log(i);
    }, 1000, i);
  }

// `立即调用函数表达式(IIFE)`
// 强制生成计数器变量的副本。函数每接受一个变量i，都会创建一个副本。
  for (var i = 0; i< 10; i++){
    (i => setTimeout(() => {
      console.log(i);
    }, 1000)(i);
  }

// try - catch
  for (var i = 0; i< 10; i++){
    try {
      throw i;
    } catch (i) {
      setTimeout(() => {
        console.log(i);
      }, 1000)
    }
  }
```

[题法详解](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/43)

> 扩展：

1. `var`, `let`, `const`的区别？

[三者的区别](https://github.com/LiberoWang/dailyBlog/issues/5)

2. `setTimeout`：

即使延迟时间设置成0，也会等同步代码执行完之后再执行`setTimeout`。
`setTimeout`有最大的延迟执行时间，如果设置了最大的延迟时间，`setTimeout`会立即执行。

原因是： Chrome、Safari、Firefox 都是以 32 个 bit 来存储延时值的，32bit 最大只能存放的数字是 2147483647 毫秒.

`setTimeout`的参数，第一个参数是需要回调的函数，必须传入的参数，第二个参数是时间间隔，毫秒数，可以省略。但其实他可以接收更多的参数，那么这些参数是干什么用的呢？从第三个参数开始，依次用来表示传入回调函数的参数。

3. 立即调用函数表达式：
   
这个匿名函数的作用就是创建独立的作用域，这不仅避免了外界访问此 IIFE 中的变量，而且又不会污染全局作用域。(和块级作用域同理)

*************************************

### 先看一个例子🌰：

```javascript
  var a = 1;
  console.log(window.a);  // 1

  let b = 2;
  console.log(window.b);  //  undefined

  const c = 3;
  console.log(window.c); // undefined
```

```javascript
  console.log(fish1, fish2, fish3);
  var fish1 = function () {
    console.log(1);
  };
  
  function fish2() {
    console.log(2);
  }
  
  var fish3 = 3;
  var fish2;
  console.log(fish1, fish2, fish3);
  // undefined, fish2() {}, undefined
  // f() {}, fish2() {}, 3
```


### 变量的生命周期

简单的说，当浏览器引擎使用变量时，它的生命周期包含以下几个阶段：

**声明阶段：**   这一阶段在作用域中注册了一个变量。
**初始化阶段：**  这一阶段分配了内存并在作用域中让内存和变量建立一个绑定关系。在这一阶段变量会被自动初始化为`undefined`。
**赋值阶段：**  这一阶段是给变量分配一个具体的值。

一个变量在通过声明阶段时，他还处于**未初始化**的状态，这时它仍然还没有到达初始化的阶段。

##### 作用域(scoped)

> 函数作用域(function scoped)

  是指属于这个函数的全部变量都在整个函数的范围内使用即复用（嵌套的作用域也可以使用）

> 块级作用域(block scoped)

  ES6引用的块级作用域其实就是词法作用域。我们的代码写在哪里就在哪里执行，这个更符合我们的编程习惯。我们通常所说的花括号之间`{ ... }`之间，每进入一次括号就生成了一个块级域。

### var 

1.  存在变量提升机制
2.  function scoped
3. 可以被重复声明
4. 会覆盖window上的原有对象

var声明的变量不管在作用域中什么位置声明都会被提升到作用域的顶部。

**解释：**

当javascript遇到一个函数作用域，包含了`var result`的语句，则在任何语句执行前，这个变量在作用域的开头就通过了声明阶段并且马上来到初始化阶段。

同时`var result`在函数作用域中的位置并不影响它的声明和初始化阶段的进行。在声明和初始化阶段之后，赋值之前，变量的值都是`undefined`，并已经可以被使用了。

在赋值阶段`result = 'value'`语句使变量接受了它的初始值。
这里的`变量提升`严格的说是指变量在函数作用域的开始位置完成了声明和初始化阶段，在这两个阶段之间没有任何缝隙。

### let

1.  有临时死区(Temporal dead zone)，不会被提升
2.  block scoped
3.  不能重复声明已近存在的变量
4.  声明的变量不会被覆盖到window上面的变量

> 临时死区

在这个作用域变量的声明到初始化之前，这个变量都是处于`临时死区`, 当中，这个时候引用他的话就回报`ReferenceError`的错误，其实这个习惯就是帮助我们养成在变量未声明之前不要使用它的习惯。

`let`声明变量的处理方式不同，主要区分点在于声明和初始化是分开的。

当解释器进入一个包含`let result`语句的块级作用域中，这个变量就立即通过了声明，并在作用域内注册了它的名称。然后解释器继续解析的时候，如果在这个阶段尝试访问`result`，会抛出`ReferenceError`的错误。此时`result`仍是处于临时死区的，当语句到达`let result`是，变量通过了初始化，访问`result`的值是`undefined`，同时变量离开临时死区。当到达语句`result = 'value'`的时候，变量通过了赋值阶段。

### const

1.   在声明的同时需要赋值
2.  有临时死区，不会被提升
3.  block scoped
4.  不能重复赋值
5.  声明的对象不是全局对象的属性(不会被覆盖到window上面的变量)


### 几个声明变形(只在谷歌浏览器实验)

> 块级作用域内的默认值
```javascript
  console.log(b);
  {
    b = 50;
  }
  //  输出 报错：ReferenceError: b is not defined
```
**b不是默认相当于var吗？**，事实是，会计==块级作用域内的变量声明不会提升到全局作用域的顶层，查看window也发现window没有这个属性。

```javascript
  {
    console.log(b);
    b = 50;
  }
 // 输出报错：ReferenceError：b is not defined

----------

  {
     b = 50;
  }
  console.log(b);
  // 输出50， 一旦b = 50执行后window上就有b这个属性了

-----------

 {
    b = 50;
    console.log(b);
 }
 console.log(b);
 // 输出：50 50，两个都输出50
```
```javascript
   console.log(`${window.a},${a}`);
   {
      console.log(`${window.a},${a}`);
       function a(){}
    }
    console.log(`${window.a},${a}`);

  //  输出：
  //  undefined, undefined
  // undefined, function a() {}
  //  function a(){}, function a() {}
```

```javascript
   console.log(`1 ${window.a},${a}`);
   {
      console.log(`2 ${window.a},${a}`);
      function a(){}
      a = 50;
      console.log(`3 ${window.a},${a}`);
   }
   console.log(`4 ${window.a},${a}`);
  //  输出：
  //  1 undefined, undefined
  //  2 undefined, function a() {}
  //  3 function a() {}, 50
  //  4 function a() {}, function a() {}
```

```javascript
    console.log(`1 ${window.a},${a}`);
     {
         console.log(`2 ${window.a},${a}`);
         function a(){}
         a = 50;
         function a(){} // 再增加个
         console.log(`3 ${window.a},${a}`);
      }
     console.log(`4 ${window.a},${a}`);
    //  输出：
   //  1 undefined, undefined
   //  2 undefined, function a() {}
   //  3 50, 50
   //  4 50, 50
```

参考：
[研究JS的块级作用域中的变量声明和函数声明](https://juejin.im/post/6844903955814694919)