### setState的更新是同步还是异步的

[React-setState的API](https://zh-hans.reactjs.org/docs/react-component.html#setstate)

[setState-do](https://zh-hans.reactjs.org/docs/faq-state.html#what-does-setstate-do)

[state-and-lifecycle](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html)

> 结论：

1. 由`React`控制的事件处理程序，以及生命周期内调用`setState`是异步更新`state`;
2. `React`控制之外的事件中调用`setState`是同步更新`state`，比如原生js绑定事件、`setTimeout/setInrerval`等。


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
```

[参考链接1](https://zhuanlan.zhihu.com/p/366781311)