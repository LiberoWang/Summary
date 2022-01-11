### setState的更新是同步还是异步的

[React-setState的API](https://zh-hans.reactjs.org/docs/react-component.html#setstate)

[setState-do](https://zh-hans.reactjs.org/docs/faq-state.html#what-does-setstate-do)

[state-and-lifecycle](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html)

> 结论：

1. 由`React`控制的事件处理程序，以及生命周期内调用`setState`是异步更新`state`;
2. `React`控制之外的事件中调用`setState`是同步更新`state`，比如原生js绑定事件、`setTimeout/setInrerval`等。

**异步回调函数的都是同步更新的**

**这是`React 18`之前的逻辑，在`React 18`的版本异步回调函数可以异步去更新.**


`setState`本身并不是一个异步的方法，之所以会体现出一个异步的形式，是`React`框架本身的一种性能优化机制。因为每次调用`setState`都会触发更新，异步操作是为了提高性能，将多个状态合并一起更新，减少`re-render`调用。

> 为什么不能直接使用赋值的方式修改state的值呢？

必须通过`setState`方法来告诉`React state`的数据已经变化,从而更新页面。直接赋值的方式并不能让`React`监听到`state`的变化。
`setState`内部是非常复杂的，更新`state`，创建新的`VNode`，再经过`diff`算法对比差异，决定渲染哪一部分以及怎么渲染，最终形成最新的`UI`。

```js
1. shouComponentUpdate
2. componentWillUpdate
3. render
4. componentDidUpdate
5. componentWillReceiveProps??
```

> React 是如何控制异步更新的

在`React`中调用`setState`会根据一个`isBatchingUpdates`来判断是直接更新`this.state`还是放入队列中延时更新。

而`isBatchingUpdates`默认是`false`，标识`setState`是同步更新`this.state`。
但是有一个函数`batchedUpdates`会把`isBatchingUpdates`修改为`true`，而当`React`在调用事件处理函数之前就会先调用这个函数将`isBatchingUpdates`修改为true。这样由`React`控制的事件处理过程`setState`就不会同步更新`this.state`。

> setState更新

```js
this.state = { count: 0 };
componentDidMount() {
  const { count } = this.state;
  this.setState({ count: count + 1 });
  this.setState({ count: count + 1 });
  this.setState({ count: count + 1 });
  // this.state.count = 0;
}

// 后调用的 setState() 将覆盖同一周期内先调用 setState 的值，因此商品数仅增加一次。
// 同步调用的时候只会执行最后一次更新
Object.assign(
  previousState,
  { count: state.count + 1 },
  { count: state.count + 1 },
  { count: state.count + 1 },
  ...
)
```

```js
componentDidMount() {
  // count: 0
 setTimeout(() => {
   this.setState({ count: this.state.count + 1 });
   console.log(this.state.count);  // 1
   
   this.setState({ count: this.state.count + 1 });
   console.log(this.state.count);  // 2
 }, 0);
}

componentDidMount() {
  // count: 0
  load().then(() => {
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);  // 1

    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);  // 2
  });
}

function load() {
  return Promise.resolve();
}

componentDidMount() {
  this.setState({ count: this.state.count + 1 });
  console.log("state 1: ", this.state.count);  // 0

  this.setState({ count: this.state.count + 1 }, () => {
    console.log("state 2: " + this.state.count); // 2
  });

  this.setState(prevState => {
    console.log("state 3: " + prevState.count); // 1
    return {  count: prevState.count + 1 };
  }, () => {
    console.log('state 4: '+ this.state.count);// 2
  });
}

componentDidMount() {
  this.setState({ count: this.state.count + 1 });
  console.log("state 1: ", this.state.count);  // 0

  this.setState({ count: this.state.count + 1 }, () => {
    console.log("state 2: " + this.state.count); // 1
  });

  this.setState(prevState => {
    console.log("state 3: " + prevState.count); // 1
    return {  count: prevState.count + 1 };
  }, () => {
    console.log('state 4: '+ this.state.count); // 1
  });

  this.setState({ count: this.state.count + 1 });
  console.log("state 5: ", this.state.count);  // 0

  // 打印顺序：
  // state 1: 0
  // state 5: 0
  // state 3: 1
  // state 2: 1
  // state 4: 1
}

componentDidMount() {
  this.setState({ count: this.state.count + 1 });
  console.log("state 1: ", this.state.count);  // 0

  this.setState({ count: this.state.count + 3 }, () => {
    console.log("state 2: " + this.state.count); // 4
  });

  this.setState(prevState => {
    console.log("state 3: " + prevState.count); // 3
    return {  count: prevState.count + 1 };
  }, () => {
    console.log('state 4: '+ this.state.count); // 4
  });
}

componentDidMount() {
  this.setState({ count: this.state.count + 3 });
  console.log("state 1: ", this.state.count);  // 0

  this.setState({ count: this.state.count + 1 }, () => {
    console.log("state 2: " + this.state.count); // 2
  });

  this.setState(prevState => {
    console.log("state 3: " + prevState.count); // 1
    return {  count: prevState.count + 1 };
  }, () => {
    console.log('state 4: '+ this.state.count); // 2
  });
}

componentDidMount() {
  this.setState({ count: this.state.count + 1 });
  console.log("state 1: ", this.state.count);  // 0

  this.setState({ count: this.state.count + 3 }, () => {
    console.log("state 2: " + this.state.count); // 4
  });

  this.setState(prevState => {
    console.log("state 3: " + prevState.count); // 3
    return {  count: prevState.count + 1 };
  }, () => {
    console.log('state 4: '+ this.state.count); // 4
  });

  this.setState({ count: this.state.count + 4 });
  console.log("state 5: ", this.state.count);  // 0
}
```

[参考链接1](https://zhuanlan.zhihu.com/p/366781311)


****************************

##### 一道题感受一下

```
  class Example extends React.Component {
     constructor() {
       super();
       this.state = { val: 0 };
     }

     componentDidMount() {
        this.setState({ val: this.state.val + 1 });
        console.log(this.state.val);  // 第一次log

        this.setState({ val: this.state.val + 1 });
        console.log(this.state.val);  // 第二次log

        setTimeout(() => {
            this.setState({ val: this.state.val + 1 });
            console.log(this.state.val);  // 第三次log
           
           this.setState({ val: this.state.val + 1 });
           console.log(this.state.val);  // 第四次log
        }, 0);
     }

     render() {
        return null;
     }
  };
```

<img width="505" alt="截屏2020-08-12 下午5 54 20" src="https://user-images.githubusercontent.com/25894364/90002232-faf0b080-dcc4-11ea-997d-5d588b0d013a.png">

我得到的答案是 **0,0,2,3**

#### setState什么时候是同步的，什么时候是异步的？

> 说法1:  由React控制的事件处理程序，以及生命周期函数调用的setState不会同步更新state.由React控制之外的事件中调用的setState是同步更新的。比如原生js绑定的事件，`addEventListener`, `setTimeout`, `setInterval`等事件。

> 说法2：  react的setState本身并不是异步的，是因为批量处理机制给人一种异步的感觉：
setState会表现出同步和异步的现象，但本质上是同步的，是其批量机制造成的一种假象。（在开发的过程中，在合成事件和生命周期函数里，完全可以视其为异步的）


【React的更新机制】

生命周期函数和合成事件中：

  1.  无论调用多少次setState,都不会立即执行更新。而是将要更新的state存入`_pendingStateQuene`，将要更新的组件存入`dirtyComponent`;
  2.  当跟组件didMount后，批量处理机制更新为false.此时再取出'_pendingStateQuene'和`dirtyComponent`中的state和组件进行合并更新；

原生事件和异步代码中：

  1.  原生事件不会触发react的批量处理机制，因而调用setState会直接更新；
  2.  异步代码中调用setState，由于js的异步处理机制，异步代码会暂存，等待同步代码执行完毕仔执行，此时react的批量机制已经结束，因而直接更新。


```javascript
  // 假设 count = 0;
  this.setState({ count: this.state.count + 1 });
  this.setState({ count: this.state.count + 1 });
  this.setState({ count: this.state.count + 1 });
 // state.count === 1;
```

本质上是：

```javascript
  Object.assign(
     state,
    { count: state.count + 1 },
    { count: state.count + 1 },
    { count: state.count + 1 }
  )
// { count: 1 }
```

如果多次调用 setState 方法时传入的对象有相同的 key，那么最后一次调用时所传入的对象的那个 key 的值将成为最终的更新值，在最后一次调用前的值都将被覆盖。

**解释：**

在React的setState的函数实现中，会根据一个变量`isBatchingUpdate`来判断是直接同步更新this.state还是放到队列异步更新。React使用了事物机制，React的每个生命周期函数和合成事件都处在一个大的事务中。在事务的前置钩子中调用batchedUpdates方法修改isBatchingUpdates变量为true，在后置钩子中将变量设置为false.原生绑定事件和setTimeout异步的函数没有进入到React的事务中，或者当他们执行时，刚刚的事务已近结束，后置钩子触发了，所以此时的setState会直接进入非批量更新模式，表现在我们看来是同步执行了setState。


```javasctipt
  this.setState({ count: this.state.count + 1}, () => {
     console.log(this.state.count); // 1
  });
```

**解释：**

该回调函数的执行时机是在于state合并处理之后。


```javascript
    // count: 0
    this.setState({ count: this.state.count + 1 });
    console.log("console: " + this.state.count);  // 0

    this.setState({ count: this.state.count + 1 }, () => {
      console.log("console from callback: " + this.state.count); // 2
    });

    this.setState(prevState => {
      console.log('state count:', this.state.count); // 0
      console.log("console from func: " + prevState.count); // 1
      return {  count: prevState.count + 1 };
    }, () => {
      console.log('last console: '+ this.state.count)
    });
```

执行结果：

```javascript
  console: 0 
  state count: 0
  console from func: 1 
  console from callback: 2
  last console: 2 

```

React其实会维护一个state的更新队列，每次调用setState都会先把当前修改的state推进这个队列，在最后，React会对这个队列进行合并处理，然后去执行回调函数。根据最终的合并结果再去走下面的流程。

#### setState的第二种形式

`setState(nextState, callback)`：`nextState`会浅合并到当前state中，这是在事件处理函数和服务器请求回调函数中触发UI更新方法。不保证`setState`调用会同步执行，考虑性能问题会对多次调用批量处理。

也可以传递一个签名为`function(state, props) => newState`的函数作为参数。这会将一个原子性的更新操作价格更新队列，在设置任何值之前，此操作会查询前一刻的state和props. `...setState()`并不会立即改变this.state,而是会创建一个待执行的变动。调用此方法后访问this.state有可能会得到当前已存在的state。(指state尚未来得及改变)。

```javascript
  // 正确用法
  this.setState((preState, props) => ({
      count: preState.count + props.increment
  }));
```

这种函数是setState工作机制类似：

```javascript
  [
    { inrement: 1},
    { inrement: 1},
    { inrement: 1},
  ].reduce((prevState, props) => ({
    count: preState.count + props.inrement
  }), { count: 0 })
```
setState更新机制：

![image](https://user-images.githubusercontent.com/25894364/121316295-c036c380-c93b-11eb-88c2-3f239aba241b.png)

[参考链接1](https://juejin.cn/post/6844904015524790279)
[参考链接2](https://juejin.cn/post/6844903730035294216)
