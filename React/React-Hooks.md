#### 前言

`React Hooks`是React在2019年2月发布的16.8版本中引入的。

[Dan作者的 - 函数式组件与类组件有何不同](https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/)


> 全面拥抱React Hooks,让前端代码结构更加清晰

引入Hooks之后，函数组件具备了状态管理和生命周期管理等能力，几乎可以实现原来的Class组件具备的所有能力。

![images](https://static001.geekbang.org/resource/image/a4/93/a4089b1acf12d52575ebfc89dd6b7593.png)

> React Hooks的好处
 
  - 相比较于高阶组件，更容易代码复用 -可自定义Hooks
  - 代码量更少
  - 好的代码结构
  - 生命周期淡化
  - 不考虑`this`的问题
  
  但是Hooks不擅长处理异步的代码(必包引起的旧的引用的问题)

### 基础

`React`核心原理：**当数据发生变化时，UI能够自动把变化反映出来。**

在React组件中，任何一个state发生变化时，整个函数组件其实会被完全执行一遍。

> 思考题
> 在你看来，React最打动你的特性是什么？或者你认为它的最大优点有哪些？

JSX是React最亮眼的创新之一，类似模版语言而本质是JavaScript。

#### Hooks是如何产生的？

在React中，Hooks就是**把某个目标结果钩到某个可能会发生变化的数据或者事件源上，那么当被钩到的数据或者发生变化时，产生这个目标结果的代码就会重新执行，产生更新之后的结果。**

Hooks中被钩的对象，不仅可以是某个独立的数据源，也可以是另一个hook执行的结果，这样就带来了Hooks的最大的好处：逻辑的复用。

ps：Hooks可以实现逻辑复用的本质：hooks可以是另一个hook执行的返回值。

对于函数组件，这个结果就是最终的DOM树。对于`useCallback`,`useMemo`这样与缓存相关的组件，则是在依赖项发生变化的时候去更新缓存。

> Hook的逻辑复用说明

如果是Class的组件要实现复用，必须要是一个公共组件或者高阶组件。在Hooks中，可以把公共逻辑抽离成hook返回一个结果公用。类似一个公共的helper,不再是一个公共的组件。


#### 如何保存组件状态和使用生命周期？

[关于React Hooks的官方文档](https://zh-hans.reactjs.org/docs/hooks-faq.html)

React提供的Hooks: 一共10个

![image](https://user-images.githubusercontent.com/25894364/128672099-a6f28c8a-def5-413c-a804-9cb4c5b100fb.png)

核心hooks: `useState`, `useEffect`

> useState

```js
let _state = [], _index = 0;
function useState(initialState) {
  let curIndex = _index; // 记录当前操作的索引
  _state[curIndex] = _state[curIndex] === undefined ? initialState : _state[curIndex];
  const setState = (newState) => {
    _state[curIndex] = newState;
    ReactDOM.render(<App />, rootElement);
    _index = 0; // 每更新一次都需要将_index归零，才不会不断重复增加_state
  }
  _index += 1; // 下一个操作的索引
  return [_state[curIndex], setState];
}
```

提问: 为什么不能在循环、判断内部使用Hooks，必须在顶级作用域使用？

A: 因为`useState`内部使用的是一对一的注册表，在判断内部使用可能会跳过`useState`的执行，导致内部表顺序的混乱。（因为我们是根据调用hook的顺序依次将值存入数组中，如果在判断逻辑循环嵌套中，就有可能导致更新时不能获取到对应的值，从而导致取值混乱。）

> useEffect

[Dan作者关于useEffect的完整使用指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)


```js
useEffect(callback, dependencies)

// useEffect 的 callback 要避免直接的 async 函数，需要封装一下

// dependencies类似于componentDidUpdate

// useEffect 还允许你返回一个函数，用于在组件销毁的时候做一些清理的操作。比如移除事件的监听。这个机制就几乎等价于类组件中的 componentWillUnmount。

```

依赖项内部是通过`Object.is`进行浅比较。

`useEffect`涵盖了`ComponentDidMount`, `componentDidUpdate`, `componentWillUnmount`三个生命周期方法。

1. 每一次渲染都有它自己的事件处理函数

```js
function Counter() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

2. 每次渲染都有它自己的Effects

```js
  useEffect(() => {
    setTimeout(() => {
      console.log(`You clicked ${count} times`);
    }, 3000);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
```

在组件内什么时候去读取props或者state是无关紧要的。因为它们不会改变。在单次渲染的范围内，props和state始终保持不变。

**组件内的每一个函数（包括事件处理函数，effects，定时器或者API调用等等）会捕获定义它们的那次渲染中的props和state。**


当然，有时候你可能想在effect的回调函数里读取最新的值而不是捕获的值。最简单的实现方法是使用refs.
[这篇文章](https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/)的最后一部分介绍了相关内容。


> 理解Hooks的依赖

React会使用浅比较来对比依赖项是否发生了变化，所以要特别注意数组或者对象类型。如果是每次创建一个新对象，即使和之前的值是等价的，也会被认为是依赖想发生了变化。

> Hooks的使用规则

[hooks使用规则 - npm插件检查](eslint-plugin-react-hooks)

1. 只能在函数组件的顶级作用域使用
2. 只能在函数组件或者其他Hooks中使用

##### 函数组件的顶级作用域

所谓顶级作用域，就是Hooks不能在循环、条件判断或者潜逃函数内执行，而必须是在顶层。同时Hooks在组件的多次渲染直接，必须按照顺序执行。

因为在React组件内部，其实是维护一个对应组件的固定Hooks执行列表的，以便在多次渲染直接保持Hooks的状态，并做对比。

##### 避免函数重复被定义

> useCallback: 缓存回调函数

```js
useCallback(fn, deps)
```

只有当某个依赖变量发生变化时，才会重新声明`fn` 这个回调函数。

> useMemo: 缓存计算结果

```js
useMemo(fn, deps);
```

```js
const handleIncrement = useCallback( () => setCount(count + 1), [count]);
// 只有当 count 发生变化时，才会重新创建回调函数
```

如果某个数据是通过其它数据计算得到的，那么只有当用到的数据，也就是依赖的数据发生变化的时候，才应该需要重新计算。

```js
//...
// 使用 userMemo 缓存计算的结果
const usersToShow = useMemo(() => {
    if (!users) return null;
    return users.data.filter((user) => {
      return user.first_name.includes(searchKey));
    }
  }, [users, searchKey]);
//...
```

> useCallback 的功能其实是可以用 useMemo 来实现的

```js
 const myEventHandler = useMemo(() => {
  // 返回一个函数作为缓存结果
  return () => {
    // 在这里进行事件处理
  }
}, [dep1, dep2]);
```

> useRef: 再多次渲染之间共享数据

> useContext: 定义全局状态



#### React 17

> 新的jsx编译机制

在过去，如果我们要在 React 组件中使用 JSX，那么就需要使用 import 语句引入 React。这么做的原因就在于，在编译时 JSX 会被翻译成 React.createElement 这样的 API，所以就需要引入 React。

```js
import React from 'react';
function App() {
  return <h1>Hello World</h1>;
}

// 编译机制
import React from 'react';
function App() {
  return React.createElement('h1', null, 'Hello world');
}
```

新的编译机制：

```js
function App() {
  return <h1>Hello World</h1>;
}

// 编译之后

// 由编译器自动引入
import {jsx as _jsx} from 'react/jsx-runtime';
function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

[React技术揭秘](https://react.iamkasong.com/)

#### Hooks的理念

> 代数效应：把副作用从函数式编程中给剥离出去

```js

function getTotalCommentNum(id1, id2) {
  const num1 = getCommentNum(id1);
  const num2 = getCommentNum(id2);
  return num1 + num2;
}

function getCommentNum(id) {
  const num = perform id;
  return num;
}

// 如果是异步请求就是有副作用的
// Q: 最小的改动支持异步
// A: async/await - 具有传染性调用getTotalCommentNum函数也需要异步

```

`React Server Componet`: 

#### Hooks的实现 - useState
[模拟实现useState](mockUseState.js)

#### Hooks的源码
[ReactHooks.js](https://github.com/facebook/react/blob/main/packages/react/src/ReactHooks.js)



#### 参考链接

[阅读源码后，来讲讲React Hooks是怎么实现的](https://juejin.cn/post/6844903704437456909)

[React Hooks的原理实现 - 掘金](https://juejin.cn/post/6844903975838285838)

[React Hooks的原理实现 - 知乎](https://zhuanlan.zhihu.com/p/75146261)

