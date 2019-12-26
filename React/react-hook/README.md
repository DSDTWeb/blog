# 10分钟学会React Hook

`Hook`是`React 16.8`的新增特性，让你在不编写`class`的情况下使用`state`以及其他的`React`特性。目前官方没有计划从`React`中移除`class`，但建议再新的组件中尽量使用`Hook`。

```js
import React, { useState } from 'react';
function Example() {
  // State Hook -> 声明一个新的叫做 “count” 的 state 变量
  const [count, setCount] = useState(0);
  // Effect Hook -> 用于执行副作用操作
  useEffect(function persistForm() {
    document.title = `你点击了${count}次按钮`;
  }, [count]);
  const scorllTop = useScorllTop();
  return (
    <div>
      <p>你点击了{count}次按钮</p>
      <button onClick={() => setCount(count + 1)}>点击</button>
      <p>当前滚动条所在的位置：{scorllTop}</p>
    </div>
  );
}
// 自定义Hook
function useScorllTop() {
  const [scorllTop, setScorllTop] = useState(0);
  // 执行副作用操作的Hook
  useEffect(function persistForm() {
    function onScroll () {
      setScorllTop(document.documentElement.scrollTop)
    }
    document.documentElement.addEventListener('scroll', onScroll);
    return () => document.documentElement.removeEventListener('scroll', onScroll);
  }, []); // 只绑定一次
  return scorllTop
}
```

## 规则和注意事项

- **不要在普通的JavaScript 函数中调用 Hook！！！**
- **只在 React 的函数组件最顶层中直接调用 Hook！！！**
- 可以自定义`Hook`，但调用规则还是要遵循上面这两个规则！！！
- 自定义`Hook`是一个函数，其名称以 “`use`” 开头，函数内部可以调用其他的`Hook`！！！
- 只有Hook的调用顺序在多次渲染之间保持一致，`React`才能正确地将内部`state`和对应的`Hook`进行关联

## ESlint检验插件

```js
// 安装插件
npm install eslint-plugin-react-hooks --save-dev

// ESLint 配置
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn" // 检查 effect 的依赖
  }
}
```

## API说明

### useState

```js
// initialState 初始state， 返回一个数组，数组的第一项为当前state，第二项为更新state的`setState`函数
const [state, setState] = useState(initialState);
```

### useEffect

`Effect`让你在函数组件中执行副作用操作，可以看做`componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个生命周期函数的组合。如果某些特定值在两次重渲染之间没有发生变化，你可以通知`React`跳过对`effect`的调用，只要传递数组作为`useEffect`的第二个可选参数即可（不传则每次都会执行，空数组为只执行一次，否则就会用`Object.is`和前一次比较是否有更新来判断是否执行）

```js
const [scorllTop, setScorllTop] = useState(0);
useEffect(() => {
  function onScroll () {
    setScorllTop(document.documentElement.scrollTop)
  }
  document.documentElement.addEventListener('scroll', onScroll);
  return () => document.documentElement.removeEventListener('scroll', onScroll);
}, []);
```

### useContext

接收一个`context`对象（`React.createContext` 的返回值）并返回该`context`的当前值。当组件上层最近的 `<MyContext.Provider>` 更新时，该`Hook`会触发重渲染。

```js
const ThemeContext = React.createContext({
  foreground: "#000000",
  background: "#eeeeee"
});
function App(props) {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext); // 参数必须是 context 对象本身!!!
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

### useReducer

`useState`的替代方案。它接收一个形如`(state, action) => newState`的`reducer`，并返回当前的`state`以及与其配套的`dispatch`方法。可以选择惰性地创建初始`state`。将`init`函数作为 `useReducer`的第三个参数传入，这样初始`state`将被设置为`init(initialArg)`。

```js
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'reset', payload: initialCount})}>Reset</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

### useCallback

把内联回调函数及依赖项数组作为参数传入`useCallback`，它将返回该回调函数的[`memoized`](https://en.wikipedia.org/wiki/Memoization)版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

什么场景需要用`uesCallback`？ 在父组件需要向子组件传递一个操作函数，但又有不想关的状态可能变动的时候，为了减少子组件的更新，而使用。具体如下：

```js
// 自定义Callback Hook
function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('未准备好无法调用');
  });
  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback((...arg) => {
    const fn = ref.current;
    return fn.apply(null, arg);
  }, [ref]);
}

function CallbackHook ({location}) {
  const [text, updateText] = useState('');
  const handleSubmit = useEventCallback((expensiveName) => {
    console.info('提交数据', {expensiveName, text})
  }, [text])
  return (
    <div>
      <h2>CallbackHook</h2>
      <input value={text} onChange={e => updateText(e.target.value)} />
      {useMemo(() => <ExpensiveTree handleSubmit={handleSubmit} />, [handleSubmit])}
    </div>
  );
}
// 套餐选择
function ExpensiveTree ({handleSubmit}) {
  const [name, setName] = useState('套餐A');
  return (
    <div>
      <div>
        <label><input type="radio" defaultChecked name="name" onChange={e => e.target.checked && setName('套餐A')} /> 套餐A</label>
        <label><input type="radio" name="name" onChange={e => e.target.checked && setName('套餐B')} /> 套餐B</label>
      </div>
      <div><button onClick={e => handleSubmit({name})}>提交</button></div>
    </div>
  );
}
```

### useMemo

接收`nextCreate`和`deps`两个参数，`nextCreate`返回需要渲染的组件。仅在`deps`的项有更新的时候会更新。**你可以把 useMemo 作为性能优化的手段，但不要把它当成语义上的保证。**

```js
useMemo(() => <ExpensiveTree handleSubmit={handleSubmit} />, [handleSubmit])
```

### useRef

`useRef`返回一个可变的`ref`对象，其`.current`属性被初始化为传入的参数（`initialValue`）。返回的`ref`对象在组件的整个生命周期内保持不变。

```js
const refContainer = useRef(initialValue);
```

### useImperativeHandle

`useImperativeHandle`可以让你在使用`ref`时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用`ref`这样的命令式代码。

```js
function ImperativeHandleHook(props) {
  const inpRef = useRef();
  return (
    <div>
      <FancyInput ref={inpRef} />
      <button onClick={e=> inpRef.current.focus()}>设置光标</button>
    </div>
  );
}
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} />;
}
FancyInput = forwardRef(FancyInput);
```

### useLayoutEffect

其函数签名与`useEffect`相同，但它会在所有的`DOM`变更之后同步调用`effect`。可以使用它来读取`DOM`布局并同步触发重渲染。在浏览器执行绘制之前，`useLayoutEffect`内部的更新计划将被同步刷新。尽使用标准的`useEffect`以避免阻塞视觉更新。

### useDebugValue

`useDebugValue`可用于在`React开发者工具`中显示自定义`hook`的标签。

```js
useDebugValue(value)
```
