## 格式化上下文

> FC(Formatting Context)它指的是具有某种CSS格式化规则（布局规则）的上下文环境，在这个上下文环境内的所有子元素，都将根据其特定的CSS格式化规则来进行排列。

### 常见的内联元素

`a , b , br , em , font , img , input , label , select , small , span , textarea `

### 常见的格式化上下文

1. BFC（CSS2.1 规范）
2. IFC(Inline)（CSS2.1 规范）
3. FFC(Flex)（CSS3规范新增）
4. GFC(Grid)（CSS3规范新增）

### BFC-Block Formatting Context

BFC中的元素的布局是不受外界的影响, 是一个独立的渲染区域.

> BFC的布局规则

1. 内部的Box会在垂直方向逐个排列。
2. BFC内盒子之间的垂直距离由margin属性决定，属于同一个BFC的俩个相邻的box的margin会发生重叠。并且以最大的margin值作为最终的margin值。
3. 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
4. BFC的区域不会与float box重叠。
5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。
6. 计算BFC的高度时，浮动元素也参与计算。

### BFC和FFC的区别

1. FFC 不支持 ::first-line 和 ::first-letter 这两种伪元素
2. FFC 下的子元素不会继承父级容器的宽
3. vertical-align 对 FFC 中的子元素是没有效果的


### 概念
BFC(Box Formatting context)：块级格式化上下文。Box是CSS布局的对象和基本单位，BFC就是页面上的一个隔离独立容器，容器的子元素不会影响到外面的元素。

> 规则：

- 内部的Box会垂直方向一个接一个的放置
- 属于同一个BFC的两个相邻的Box的margin会重叠，不同的BFC就不会
- 是页面上一个隔离的独立的容器，里面的元素不会影响到外面的元素
- BFC的区域不会和float box重叠
- 计算BFC的高度，浮动元素也参与计算

### 触发的条件

 - html的根元素
 - 浮动元素,float不为none
 - position为absolute或者fixed
 - display的值为：`inline-block`, `table-cell`, `table-caption`, 或者是匿名表格元素
 - overflow为scroll, hidden, auto
 - 弹性元素, display为`flex`或者`inline-flex`
 - 网格元素, display为`grid`或者`inline-grid`

#### 应用场景

- 清除内部浮动，触发父元素的BFC属性，会包含float元素
- 分属于不同的BFC，可以阻止margin折叠
- 阻止元素被浮动元素覆盖，各自是独立区域渲染
- 自适应两栏布局


### 参考链接

1. `https://mp.weixin.qq.com/s/8eAfz_I5xIhh7oFRifxaFw`

2. `https://juejin.cn/post/6844904155203502093`