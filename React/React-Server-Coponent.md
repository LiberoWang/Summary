[React Server Components的md](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md)


#### 演讲Demo

// 需要安装数据库

[server-components-demo Database](https://github.com/reactjs/server-components-demo)

// 不需要安装数据库

[server-components-demo no-Database](https://github.com/pomber/server-components-demo/)

### React Server Component

  主要解决的问题：

  1. Good user experience (好的用户体验)
  2. Cheap maintenance (易维护)
  3. Fast perfomance (性能好)

// 现在的模式

![images](https://segmentfault.com/img/remote/1460000038623448)

// RSC

![images](https://segmentfault.com/img/remote/1460000038623454)

// 组件模式

![images](https://segmentfault.com/img/remote/1460000038623466)

// RSC组件模式

![images](https://segmentfault.com/img/remote/1460000038623461)


// 具体

![images](https://pic3.zhimg.com/80/v2-34cee792920af9737648241e63d72cc6_1440w.jpg)

红色为服务端组件，绿色为客户端组件

### server.js 和 .client.js

[detailed-design](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#detailed-design)


### Zero-Bundle-Size (0体积打包) 

`scripts > build`

> `react-server-dom-webpack`插件 !important

1. 只打包编译了`Client Components`的组件

2. 把结果序列化成特殊的格式返回给Client
  M: Client组件 (引用路径)
  J: Server组件 (在Server执行React.createElement(Server组件)的JSON序列化结果)
  S：symbol，比如suspense等
3. Client拿到数据之后通过`react-server-dom-webpack`反序列化，然后渲染

// react-server-dom-webpack 与 Next.js

### RSC和SSR

SSR是在Server进行渲染，然后把渲染得到的HTML返回给Client；而这个Server Component，所有组件，不管Server组件还是Client组件，都是在Client进行渲染。只不过Server组件会自带一些在Server端获取的数据放在props里，这样就不用在Client再进行请求了。

### 参考链接

[Server Component讲解1](https://zhuanlan.zhihu.com/p/340816128)

[Server Component讲解2](https://segmentfault.com/a/1190000038623434)

[Server Component讲解3](https://www.zhihu.com/question/435921124)

[Server Component讲解4](https://zhuanlan.zhihu.com/p/352848874)