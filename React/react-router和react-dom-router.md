## 关系：
`react-router`实现了路由的基础核心功能。
`react-router-dom`是基于`react-router`上的扩展。加入了浏览器运行环境下的一些功能，如`Link `组件，`BrowserRouter `组件和`HashRouter `组件。

1. `BrowserRouter `使用`pushState `和`popState `构建。
2. `HashRouter `使用`window.location.hash`和`hashchange `事件构建。
3. 另外：`react-router-dom`的`Router`，`Route`，`Switch `其实就是`react-router`里面`Router`，`Route`，`Switch `组件的导出。


写法一：
```
import {Switch, Route, Router, HashHistory, Link} from 'react-router-dom';
```

写法二：
```
import {Switch, Route, Router} from 'react-router';
import {HashHistory, Link} from 'react-router-dom';
```

## history
首先需要了解`history`的相关知识。`history`提供了`react-router`的核心功能。

> 属性

`length`: `history.length`表示当前标签页浏览历史的长度。

> 方法

`back `: 返回到上一个访问的页面，等同于浏览器的后退键。
`foward `:  移动到下一个访问的页面，等同于浏览器的前进键。
`go`: 接受一个整数为参数，移动到该整数指定的页面，比如go(1)相当于forward(), go(-1)相当于back()， go(0)相当于刷新页面。

如果移动的位置超出了访问历史的边界，这三个方法不会报错，而是默默的失败。

HTML5新方法：添加和替换历史记录的条目
只支持http(s)协议，不支持本地协议(files:///home)

`pushState`: `history.pushState(state, title, url);`
   `state`: 一个与指定网页相关的状态对象， `popstate`事件触发时，该对象会传入回调函数，如果不需要这个对象，此处可以填null.
   `title`: 新页面的标题，但是目前所有浏览器都忽略这个值，所有这里可以填null.
    `url`：新的网址，必须和当前页面处于同一个域。

`replaceState`: 用法和`pushState`一样，只是不同的是，它会修改浏览器历史栈中当前的记录。

注意： `pushState`和`replaceState`调用之后，地址浏览器的url会发生变化，但是页面不会刷新，只是在路由栈中增加一条记录，随后点击浏览器前进后退箭头，地址栏会有变化。

> 事件

`popState`: 每当同一个文档的浏览历史(history)出现变化时，就会触发popstate事件。仅仅调用`pushState`和`replaceState`方法，并不会触发该事件，只有当用户点击浏览器的前进或者后退箭头，或者调用back,go,forward时才会触发。
它的state属性指向pushState和replaceState方法为当前url所提供的state对象.这个state也可以通过`history.state`直接获取

```javascript
  window.onpopstate = function(event) {
     console.log('location' + document.location);
     console.log('state' + JSON.stringify(event.state));
  }

  // 或者

   window.addEventLister('popstate', function(event) {
      console.log('location' + document.location);
      console.log('state' + JSON.stringify(event.state));
   });

   window.onpopstate = function(event) {
  alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
};

// 实践
//绑定事件处理函数. 
history.pushState({page: 1}, "title 1", "?page=1");    //添加并激活一个历史记录条目 http://example.com/example.html?page=1,条目索引为1
history.pushState({page: 2}, "title 2", "?page=2");    //添加并激活一个历史记录条目 http://example.com/example.html?page=2,条目索引为2
history.replaceState({page: 3}, "title 3", "?page=3"); //修改当前激活的历史记录条目 http://ex..?page=2 变为 http://ex..?page=3,条目索引为3
history.back(); // 弹出 "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back(); // 弹出 "location: http://example.com/example.html, state: null
history.go(2);  // 弹出 "location: http://example.com/example.html?page=3, state: {"page":3}

```
`hashChange`：监听hash的变化，作出相应的操作，通过浏览器的前进后退，a标签，location这种情况改变url的hash都会触发hashchange。
```javascript
  window.addEventLister('hashChange', function() {
     console.log('location' + location.hash);
  });
```
> 另外：html页面声明周期

`DOMContentLoaded `： 浏览器已完成加载HTML，并构建了DOM树，但<img>和样式表之外的外部资源尚未加载.DOM已经处理完成，程序可以查找DOM节点，并初始化接口。
`load`： 浏览器不仅加载了HTML，还完成了所有外部资源的(图片和样式)。
`beforeunload`：用户正要离开页面，我们可以检查用户是否保存了更改，并且询问是否真的要离开/
`unload`： 用户已经离开页面，但是我们仍然可以启动一些操作，例如发送统计数据。

## react-router

react-router是基于history库的基础上，实现URL和UI的同步。
react-router中最主要的component是`Router`，`RouterContext`，`Link`, history只是中间桥接的作用。

![image](https://user-images.githubusercontent.com/25894364/90530802-e0787480-e1a7-11ea-801b-2ab4d251309b.png)

API层描述browserHistory的实现：

![image](https://user-images.githubusercontent.com/25894364/90531208-5b418f80-e1a8-11ea-8ab3-7ea0a368e626.png)

### hashRouter实现

在页面DOM加载完之后进行事件监听
```javascript
  window.addEventLister('DOMContentLoaded', load);
  window.addEventLister('hashchange', changeView);

  function load() {
     .......
     changeView();
  }

  function changeView() {
     switch(location.hash) {
        case: '#/home':
           // 渲染component
           break；
        case: '#/about':
          // 渲染component
          break；
     }
  }
```

### historyRouter实现

```javascript
  window.addEventLister('DOMContentLoaded', load);
  window.addEventLister('popstate', changeView);

  function load() {
     .......
     changeView();
  }

  function changeView() {
     switch(location.hash) {
        case: '/home':
           // 渲染component
           break；
        case: '/about':
          // 渲染component
          break；
     }
  }
```

### react-router-dom
> BrowserRouter组件

主要是将当前路径往下传，并监听popstate事件，所以要用`Consumer `, `Provider `跨组件通信。
```
const { Consumer, Provider } = React.createContext();
```

> Rouer组件

Router组件主要做的是通过BrowserRouter传过来的当前值，与Route通过props传进来的path对比，然后决定是否执行props传进来的render函数.

> Link组件

Link组件主要做的是，拿到prop,传进来的to,通过`PushState()`改变路由状态，然后拿到`BrowserRouter`传过来的`onChangeView`手动刷新视图

参考：

[react-router v4源码分析](https://github.com/fi3ework/blog/issues/21)

[前端路由和react-router实现详解](https://juejin.im/post/6844904094772002823)

[pushState与replaceState](https://juejin.im/post/6844903558576341000)

[彻底搞懂react-router](https://juejin.cn/post/6886290490640039943)