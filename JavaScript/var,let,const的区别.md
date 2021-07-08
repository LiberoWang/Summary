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

