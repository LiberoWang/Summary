[Fiber](https://febook.hzfe.org/awesome-interview/book2/frame-react-fiber)

> 关键词

`调度`, `深度优先遍历`

主要目标是支持虚拟 DOM 的渐进式渲染。

- 对大型复杂任务的分片。
- 对任务划分优先级，优先调度高优先级的任务
- 调度过程中，可以对任务进行挂起、恢复、终止等操作

> 开始Fiber

从React.16开始，核心算法，基于Fiber的调度

React.render(),

--> createElement() {
  ref, key两个特殊的属性
}

--->
legacyRenderSubtreeIntoContainer() {
  
}

--> 创建一个ReactRoot实例：

调用ReactRoot.render()
---> 创建createContainer() {
  return createFiberRoot()
}

----> createFiberRoot() {
   FiberRoot:
   
   创建一Fiber
   
   return createFiber()
}

[createFiber源码](https://github.com/facebook/react/blob/b680174841bf13b233fef74cd600cf76ba5faf99/packages/react-reconciler/src/ReactFiber.new.js)

=======

RootFiber与FiberRoot就是一个循环引用

======

reactRoot.render() {

  updateContainer(children, root, null, work._onCommit)
  // children是组件， root是保存了很多信息的FiberRoot
}

======================================================

创建更新的方式

ReactDOM.render || hydrate
setState
forceUpdate

#### ReactDom.render

1. 创建一个ReactRoot
2. 创建一个FilberRoot和RootFilber（Filber）
3. 创建更新 -> 进入调和和调度（调度器管理）

render: { // 接收三个参数
  element: ReactElement
  container: DOMContainer,
  callback: function
}

render 和 hydrate不同的就是forceHydrate的boolean的默认值不同。

render的forceHydrate是false。
hydrate的forceHydrate是true。

主要是在渲染的时候提高性能。

DOMRenderer.UnbatcheUpdates // 批量更新的机制

##### FiberRoot （重要）

1. 整个应用的起点
2. 包含应用挂载的目标节点
3. 记录整个应用更新的各种信息 (callback)

在ReactRoot中通过DOMRenderer.createContainer(container, isConcurrent, hydrate)

createContainer() {
  ...
  ...
  
  return createFiberRoot(containerInfo, isConcurrent, hydrate)
}


FiberRoot : {
  current: Fiber （是一个对象，我们叫做RootFiber）
}


##### Fiber： 是一个对象

1. 每一个ReactElement对应一个Fiber对象
2. 记录节点的各种状态. （class Component的state和props其实是记录在Fiber中的。在Fiber更新之后才会去更新state和props。 这是实现react Hooks的一个条件，因为不是去更新class Component的this上的对象.）
3. 串联整个应用形成树结构。

FiberRoot ---> current ---> RootFiber（Fiber） ---> child ---> <APP />

Fiber: {
  child: 子节点
  sibling: 兄弟节点
  return: 返回一个Fiber对象，指向父节点
  
  pendingProps: 新的渲染完的props
  memoizedProps: 上一次渲染完的props
  
}


##### Update && UpdateQueue

什么是 Update?

1. 用于记录组件状态的改变
2. 存放于UpdateQueue.（Fiber对象的UpdateQueue里面，是一个单向链表）
3. 多个Update可以同时存在 （一个事件中调用了3次setState，会创建3个Update放在Queue中）

scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeLists,
  exprationTime: ExprationTime,
  callback: function
) {
....
  const update = createUpdate(expirationTime);
....
 // 调用enqueueUpdate(curent, update)
 enqueueUpdate(current, update)
 scheduleWork(current, expirationTime);
 
 return expirationTime;
}

createUpdate() {
 
}

enqueueUpdate(fiber, update) {
  const alternate = fiber.alternate;
  // 回去创建一个updatequeue
  
  queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
  queue2 = alternate.updateQueue;
  
 // 处理queue1，然后会比较queue1和queue2
}

* * *

Update : {
 // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
// 我们称他为`current <==> workInProgress`
// 在渲染完成之后他们会交换位置
  alternate: Fiber || null
}

updateQueue: {
  // 每次操作完更新之后的新的state
  baseState: State,
}


##### exprationTime

使用到exprationTime的地方是在

光年： 数值越大，距离越大
exprationTime： 数值越大，优先级越高


```js
function updateContainer() {
// container.current 其实是一个Filber
 const current = container.current;
 const currentTime = requestCurrentTime();
  const expratioonTime =    computeExprationForFiber(curentTime, current);
  
  return updateContainerAtExprationTime();
}

function updateContainerAtExprationTime() {
  return scheduleRootUpdate();
}

function scheduleRootUpdate() {
   const update = createUpdate();
   enqueueUpdate();
   scheduleWork();
}
```

##### setState && forceUpdate

核心：
1. 给节点的Fiber创建更新
在执行reactDOM.render的时候，它的创建的update是放在router上面的，是一个整体的渲染，初始化的渲染。而setState是针对某个class Component节点的更新。

2. 更新的类型不同

tag: 0、1、2、3表示不同的类型


[React Fiber是什么](https://juejin.cn/post/6844903700717109261)