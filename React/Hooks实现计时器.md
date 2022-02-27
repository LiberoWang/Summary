
```js
import { useState, useEffect } from 'react';

const Counter = () => {
  const count = useCreateCounter();
  return <div>{count}</div>;
};

const useCreateCounter = () => {
  const [remain, setRemain] = useState(0);
  let _intv = null;

  useEffect(() => {
    count();

    return () => {
      if (_intv) {
        clearInterval(_intv);
      }
    };
  }, []);

  function count() {
    if (_intv) {
      clearInterval(_intv);
    }

    _intv = doInterval(1000, update);
  }

  function update() {
    setRemain(pre => pre + 1);
  }

  return remain;
}

function doInterval(delay, fn) {
  let start = Date.now();
  const res = { id: null };
  res.id = window.requestAnimationFrame(loop);

  return res;

  function loop() {
    res.id = window.requestAnimationFrame(loop);

    if (Date.now() - start >= delay) {
      fn();
      start = Date.now();
    }
  }
}

function clearInterval(res) {
  window.cancelAnimationFrame(res.id);
}
```

> requestAnimationFrame

屏幕的刷新频率同步重新绘制页面

我们要知道的是，`window.requestAnimationFrame(callback) `的执行时机是在浏览器下一次重绘前调用RAF里的回调函数获取最新的动画计算结果

> 区别

1. 现代浏览器的tab处于不被激活状态时，requestAnimationFrame是会停止执行的
2. setTimeout，setInterval属于JS引擎，RAF属于GUI引擎