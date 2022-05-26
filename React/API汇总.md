## React API

### React的生命周期

> 挂载

`constructor()`
`static getDerivedStateFromProps()`
`render()`
`componentDidMount()`

即将过时:

`UNSAFF_componentWillmount()`

> 更新

`static getDerivedStateFromProps()`
`shouldComponentUpdate()`
`render()`
`getSnapshotBeforeUpdate()`
`componentDidUpdate()`

即将过时：

`UNSAFF_componentWillUpdate()`
`UNSAFF_componentReceiveProps()`

> 卸载

`componentWillUnmount()`

> 错误处理

当渲染过程中，生命周期或子组件的构造函数中跑出错误时，会调用：
`static getDerivedStateFromError()`
`componentDidCatch()`


### 组件
`React.Component`
`React.PureComponent`

`React.memo`

**********

`React.Component`与`React.PureComponent`区别在于，`React.PureComponent`实现了`shouldComponentUpdate`，浅比较的方式比较`props`和`state`实现了该函数。仅在`state`和`props`比较简单的时候，才使用`React.PureComponent`,同时`shouldComponentUpdate`会跳过子组件树的props的更新。

### Fragments
`React.Fragments`

### Refs
`React.createRef`
`React.forwardRef`

### Suspense
`React.lazy`
`React.Suspense`


## Context

`React.createContext`
`Context.Provider`
`Class.contextType`
`Context.Consumer`
`Context.displayName`

## React Hooks

### 基础
`useState`
`useEffect`
`useContext`

**********

`useContext`：接收一个context对象，这个对象必须是`React.createContext`的返回值。

```javascript
const context = {
  light: {
    background: '#eee'
  },
  dark: {
    background: '#000'
  }
};

const ThemContext = React.createContext(context.light);

function App() {
   return (
      <ThemContext.Provider  value={context.dark}>
          <ToolBar />
      </ThemContext.Provide>
   )
}

function ToolBar() {
   return (
     <div>
        <ThemedButton />
     </div>
   )
}

function ThemButton() {
   const theme = useContext(ThemContext);
   return (
     <div style={{ background: theme.background }}>
        this is styled by theme Context!
     </div>
   )
}
```

### 额外的Hooks
`useReducer`
`useCallback`
`useMemo`
`useRef`
`useImperativeHandle`
`useLayoutEffect`
`useDebugValue`

**********

1. `useReducer`: `useState`的替代方案，它接收一个形如`(state, action) => newState`的reducer。
```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init);
```
在某些场景下，`useReducer`会比`useState`更适用，例如state的逻辑较复杂且包含了多个子值，或者下一个state依赖与之前的state。并且，使用`useReducer`还能给哪些会触发深更新组件做性能优化，因为[你可以向子组件传递`dispatch`而不会回调函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)

2. `useMemo`和`useCallback`的区别：一个返回值，一个返回回调函数

`useCallback`：返回的是一个`memoized`回调函数.该回调函数仅在某个依赖改变时才会更新。当把回调函数传递给经过优化的并引用相等性去避免非必要渲染(例如使用`shouldComponentUpdate`)的子组件时，是非常有用的。

```javascript
const memoizedCallback = useCallback(() => {
   doSomething(a, b);
}, [a, b]);
```

`useMemo`: 返回一个`memoized`值.传入`useMemo`的函数会在渲染期间执行。如果没有提供依赖项数组，`useMemo`在每次渲染时都会计算新的值。

```javascript
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

useCallback和useMemo

`useCallback`和`useMemo`是React内置的用于性能优化的hooks。

`useCallback`返回的是一个缓存的函数；`useMemo`返回的是一个缓存的结果.

`useCallback(fn, inputs) === useMemo(() => fn, inputs))`

fn 能不受闭包限制，访问到这个函数式组件内部最新的状态

问题：
- 为什么要使用`useCallback`和`useMemo`
- 什么时候要使用`useCallback`和`useMemo`

// when?
- 引用相等
- 昂贵的计算

[什么时候用useCallback和useMemo](https://jancat.github.io/post/2019/translation-usememo-and-usecallback/)

[useCallback](https://zhuanlan.zhihu.com/p/56975681)

[React useCallback源码](https://github.com/facebook/react/blob/0e100ed00fb52cfd107db1d1081ef18fe4b9167f/packages/react-server/src/ReactFizzHooks.js#L445)

#### 关于React的性能优化

1. 使用React.memo来缓存组件
2. useMemo和useCallback
3. 使用React.PureComponent
4. 避免使用内联对象，避免使用匿名函数
5. 延迟加载不是立即需要的组件：const Component = React.lazy(() => import('./Tooltip'));
6. 使用React.Fragment添加不必要的外层

[React Hooks与组件关联底层原理](https://zh-hans.reactjs.org/docs/hooks-faq.html#under-the-hood)