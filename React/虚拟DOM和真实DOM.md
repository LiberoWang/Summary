
#### 虚拟DOM（Virtual DOM）

虚拟DOM其实是一个JS对象（React.createElement函数创建的）。本质就是JS和DOM之间做了一个缓存。

diff算法 - 递归

[Real DOM和 Virtual DOM](https://github.com/febobo/web-interview/issues/181)

> 虚拟DOM

```js
{
  type: 'div',
  props: {
    classname: 'foo',
    children: {
      type: 'h1',
      props: {
        children: 'hello word'
      }
    }
  }
}
```

> 真实DOM

```html
<div class="foo">
  <h1>hello word</h1>
</div>
```

> 区别

1. 虚拟DOM不会进行重绘和重排，而真实DOM会频繁重排与重绘
2. 虚拟DOM的总损耗是“虚拟DOM增删改+真实DOM差异增删改+排版与重绘”，真实DOM的总损耗是“真实DOM完全增删改+排版与重绘”

> 虚拟DOM转成真实DOM

`ReactDOM.render`函数

`ReactDOM.render`将生成好的`虚拟DOM`渲染到指定容器上，其中采用了批处理、事务等机制并且对特定浏览器进行了性能优化，最终转换为真实DOM.首次渲染会全部渲染，后面会根据React的diff算法进行优化更新。


```js
class Element{
  constructor(type,attr,children){
    this.type=type;
    this.attr=attr;
    this.children=children;
  }
  render(){
     // 这个方法将虚拟的DOM转成真实的DOM；
    let ele = document.createElement(this.type);
     // 2. 设置行间属性
    for(let key in this.attr){
      let _key = key;
      if(key==="className"){
         _key="class"
      }
      if(key==="htmlFor"){
         _key="for"
      }
      ele.setAttribute(_key,this.attr[key]);
    }
     // 3.children
    this.children.forEach(item=>{
      // 如果数组中的成员是Element的实例,需要继续调用render方法；将虚拟的DOM转成真实的DOM；
      // 循环子节点，都放入ele中；
      let curEle = item instanceof Element?item.render():document.createTextNode(item);
      ele.appendChild(curEle);
    });
    return ele;// 将创建的元素转成DOM返回；
  }
}

let obj = {
  createElement(type,attr,...children){
    // type: 元素类型
    // attr：行间属性
    // children : 子节点 ... 把多余的参数放进一个数组中；
    return new Element(type,attr,children)
  }
}

let objDOM ={
  render(element,container){
    // container : 容器，根元素；
    // element: 虚拟的DOM对象；当render执行时，让这个虚拟的DOM转成真实的DOM；
    container.appendChild(element.render())
  }
}

let y = obj.createElement("div",{ a:1,className:12 },"中国北京")
objDOM.render(y,document.getElementById("root"))
```

// 伪代码
```js
function render(vnode, container) {
  console.log("vnode", vnode); // 虚拟DOM对象
  // vnode _> node
  const node = createNode(vnode, container);
  container.appendChild(node);
}

// 创建真实DOM节点
function createNode(vnode, parentNode) {
    let node = null;
    const {type, props} = vnode;
    if (type === TEXT) {
        node = document.createTextNode("");
    } else if (typeof type === "string") {
        node = document.createElement(type);
    } else if (typeof type === "function") {
        node = type.isReactComponent
            ? updateClassComponent(vnode, parentNode)
        : updateFunctionComponent(vnode, parentNode);
    } else {
        node = document.createDocumentFragment();
    }
    reconcileChildren(props.children, node);
    updateNode(node, props);
    return node;
}

// 遍历下子vnode，然后把子vnode->真实DOM节点，再插入父node中
function reconcileChildren(children, node) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (Array.isArray(child)) {
            for (let j = 0; j < child.length; j++) {
                render(child[j], node);
            }
        } else {
            render(child, node);
        }
    }
}
function updateNode(node, nextVal) {
    Object.keys(nextVal)
        .filter(k => k !== "children")
        .forEach(k => {
        if (k.slice(0, 2) === "on") {
            let eventName = k.slice(2).toLocaleLowerCase();
            node.addEventListener(eventName, nextVal[k]);
        } else {
            node[k] = nextVal[k];
        }
    });
}

// 返回真实dom节点
// 执行函数
function updateFunctionComponent(vnode, parentNode) {
    const {type, props} = vnode;
    let vvnode = type(props);
    const node = createNode(vvnode, parentNode);
    return node;
}

// 返回真实dom节点
// 先实例化，再执行render函数
function updateClassComponent(vnode, parentNode) {
    const {type, props} = vnode;
    let cmp = new type(props);
    const vvnode = cmp.render();
    const node = createNode(vvnode, parentNode);
    return node;
}
export default {
    render
};
```