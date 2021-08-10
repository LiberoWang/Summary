let isMount = true; // 区分组件是didMount还是didUpdate
let workInprogreseeHook = null; // 当前正在执行的hook

const fiber = {
  stateNode: App, // 保存组件本身
  // 保存hooks对应的数据
  // 可能有很多个hooks,useState顺序执行
  memoizedState: null // 链表
};

// 运行APP，mini版的调度器
function schedule() {
  workInprogreseeHook = fiber.memoizedState;
  const app = fiber.stateNode();  // 每次更新都会触发一次调度，组件都会重新render
  isMount = false; // 接下来调用都属于didUpdate的情况
  return app;
}

function useState(initialState) {
  // 当前的useState对应的是哪一个hook
  let hook;
  if (isMount) { // 首次渲染
    hook = { // 一个链表
      memoizedState: initialState,
      next: null,
      queue: { // 队列。保存改变的状态
        pending: null
      }
    }

    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else { // 调用第二个hook
      workInprogreseeHook.next = hook;
    }
    workInprogreseeHook = hook;
  } else {
    hook = workInprogreseeHook;
    workInprogreseeHook = workInprogreseeHook.next;
  }

  // 计算新的状态 dispatchAction = updateNum

  let baseState = hook.memoizedState;

  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do { // 环形链表操作
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while(firstUpdate !== hook.queue.next)

    hook.queue.pending = null; // 执行还之后清空环形链表
  }

  hook.memoizedState = baseState;
  return [baseState, dispatchAction.bind(null, hook.queue)];
}

// action： callback: num => num + 1
function dispatchAction(queue, action) {
  // 一种数据结构代表一次更新
  const update = { // 环状链表,更新有优先级
    action,
    next: null
  };

  if (queue.pending === null) { // 还没有触发更新
    update.next = update;
  } else { // 多次调用useState,插入环状链表
    update.next = queue.pending.next;
    queue.pending.next = update;
  }

  queue.pending = update; // 每次调用update都会放到环状链表的最后一位
  schedule();
}

function App() {
  const [num, updateNum] = useState(0);
  const [count, updateCount] = useState(10);

  console.log('num:', num);
  console.log('count:', count);

  return {
    onClik() {
      updateNum(num => num + 1); // 某种机制会让组件重新render，并且更新num
    },
    onFocus() {
      updateCount(count => count + 10);
    }
  };
}

window.app = schedule(); // app变量主要是为了模拟浏览器点击


// 运行该文件在chrome浏览器，可以执行一下输出结果

app.onClik();
app.onFocus();