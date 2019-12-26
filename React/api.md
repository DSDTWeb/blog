# React 所有API

React库对外暴露[`源码`](https://github.com/facebook/react/blob/master/packages/react/src/React.js)对象如下：

```js
const React = {
  Children: { // 用于处理 this.props.children 不透明数据结构的实用方法。
    map, // 用于遍历React children并返回新的数组，children为null或undefined时不返回数组，而是null或者undefined
    forEach, // 与map类似，但不会返回数组
    count, // 返回 children 中的组件总数量，等同于通过 map 或 forEach 调用回调函数的次数
    toArray, // 将 children 这个复杂的数据结构以数组的方式扁平展开并返回，并为每个子节点分配一个 key
    only, // 验证 children 是否只有一个子节点（一个 React 元素），如果有则返回它，否则此方法会抛出错误。
  },

  createRef, // 创建一个能够通过 ref 属性附加到 React 元素的 ref。
  Component, // React 组件的基类
  PureComponent, // 在shouldComponentUpdate生命周期中实现了prop 和 state浅层对比的基类

  createContext, // 创建一个Context.Provider组件，value值为context的值
  forwardRef, // 创建一个React组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中
  lazy, // 允许你定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。
  memo, // 这是一个高阶组件函数，与PureComponent类似，但只对props进行浅比较，适用于函数组件，但不适用于class组件

  useCallback, // callback Hook ref callback
  useContext, // context Hook 获取 Provider 传入的context值
  useEffect, // 使用 Effect Hook 处理“副作用”组件
  useImperativeHandle, // 给父组件暴露方法的 Hook
  useDebugValue, // 用于在React开发者工具中显示自定义hook的标签。
  useLayoutEffect, // 其函数签名与useEffect相同，但在所有的DOM变更之后同步调用effect
  useMemo, // 接收nextCreate和deps两个参数，nextCreate返回需要渲染的组件。仅在deps的项有更新的时候会更新。你可以把 useMemo 作为性能优化的手段
  useReducer, // useState的替代方案。它接收一个形如(state, action) => newState的reducer，并返回当前的state以及与其配套的dispatch方法
  useRef, // 返回一个可变的ref对象，在Hook中可以用来缓存一些随着状态改变而改变的数据
  useState, // 初始化一个state， 返回一个数组，数组的第一项为当前state，第二项为更新state的`setState`函数

  Fragment: REACT_FRAGMENT_TYPE, // 在不额外创建 DOM 元素的情况下，让 render() 方法中返回多个元素。 可以使用简写语法 <></>
  Profiler: REACT_PROFILER_TYPE, // 测量渲染一个 React 应用多久渲染一次以及渲染一次的“代价”
  StrictMode: REACT_STRICT_MODE_TYPE, // 用来突出显示应用程序中潜在问题的工具
  Suspense: REACT_SUSPENSE_TYPE, // 可以指定加载指示器（loading indicator），某些子组件尚未具备渲染条件时展示

  createElement: __DEV__ ? createElementWithValidation : createElement, // 创建并返回指定类型的新 React 元素
  cloneElement: __DEV__ ? cloneElementWithValidation : cloneElement, // 克隆并返回新的 React 元素
  createFactory: __DEV__ ? createFactoryWithValidation : createFactory, // 用于生成指定类型的React.createElement工厂函数
  isValidElement: isValidElement, // 验证对象是否为 React 元素，返回值为 true 或 false

  version: ReactVersion, // 当前React版本信息 16.12.0

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals,
};

if (exposeConcurrentModeAPIs) {
  React.useTransition = useTransition;
  React.useDeferredValue = useDeferredValue;
  React.SuspenseList = REACT_SUSPENSE_LIST_TYPE;
  React.unstable_withSuspenseConfig = withSuspenseConfig;
}

if (enableFlareAPI) {
  React.unstable_useResponder = useResponder;
  React.unstable_createResponder = createResponder;
}

if (enableFundamentalAPI) {
  React.unstable_createFundamental = createFundamental;
}

if (enableScopeAPI) {
  React.unstable_createScope = createScope;
}

// Note: some APIs are added with feature flags.
// Make sure that stable builds for open source
// don't modify the React object to avoid deopts.
// Also let's not expose their names in stable builds.

if (enableJSXTransformAPI) {
  if (__DEV__) {
    React.jsxDEV = jsxWithValidation;
    React.jsx = jsxWithValidationDynamic;
    React.jsxs = jsxWithValidationStatic;
  } else {
    React.jsx = jsx;
    // we may want to special case jsxs internally to take advantage of static children.
    // for now we can ship identical prod functions
    React.jsxs = jsx;
  }
}
export default React;
```

## Component

使用 ES6 classes 方式定义 React 组件的基类

```js
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

## PureComponent

与`React.Component`很相似。`PureComponent`在`shouldComponentUpdate`生命周期中实现了`prop`和`state`浅层对比的基类。

```js
class Greeting extends React.PureComponent {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

## memo

这是一个高阶组件函数，与PureComponent类似，但只对props进行浅比较，适用于函数组件，但不适用于class组件

```js
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```

## createElement

创建并返回指定类型的新`React元素`。其中的类型参数既可以是标签名字符串（如`'div'`或`'span'`），也可以是`React 组件`类型（`class 组件`或`函数组件`），或是`React fragment`类型。

```js
React.createElement(
  type,
  [props],
  [...children]
)
```

## cloneElement

以 element 元素为样板克隆并返回新的 React 元素。返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。新的子元素将取代现有的子元素，而来自原始元素的 key 和 ref 将被保留。

```js
React.cloneElement(
  element,
  [props],
  [...children]
)
```

## createFactory

用于生成指定类型`React元素`的工厂函数

```js
React.createFactory(type);
let Div = React.createFactory('div');
Div({}, 'Factory') = React.createElement('div', {}, 'Factory')
```

## isValidElement

验证对象是否为`React 元素`，返回值为`true`或`false`。

```js
React.isValidElement(object)
```

## createContext

创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。

```js
const MyContext = React.createContext(defaultValue);
```

## Children

React.Children 提供了用于处理 this.props.children 不透明数据结构的实用方法。

### React.Children.map

用于遍历React children并返回新的数组，children为null 返回null, undefined时返回undefined。

```js
React.Children.map(children, function[(thisArg)])
```

### React.Children.forEach

与 React.Children.map() 类似，但它不会返回一个数组。

```js
React.Children.forEach(children, function[(thisArg)])
```

### React.Children.count

返回 children 中的组件总数量，等同于通过 map 或 forEach 调用回调函数的次数。

```js
React.Children.count(children)
```

### React.Children.only

验证 children 是否只有一个子节点（一个 React 元素），如果有则返回它，否则此方法会抛出错误。

```js
React.Children.only(children)
```

### React.Children.toArray

将 children 这个复杂的数据结构以数组的方式扁平展开并返回，并为每个子节点分配一个 key

```js
React.Children.toArray(children)
```

## React.Fragment

在不额外创建 DOM 元素的情况下，让 render() 方法中返回多个元素。

```js
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

## React.createRef

React.createRef 创建一个能够通过 ref 属性附加到 React 元素的 ref。

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  render() {
    return <input type="text" ref={this.inputRef} />;
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }
}
```

## React.forwardRef

React.forwardRef 会创建一个React组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

## React.lazy

定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。

```js
// 这个组件是动态加载的
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

## React.Suspense

React.Suspense 可以指定加载指示器（loading indicator），以防其组件树中的某些子组件尚未具备渲染条件。

```js
// 该组件是动态加载的
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // 显示 <Spinner> 组件直至 OtherComponent 加载完成
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

## Profiler

Profiler 测量渲染一个 React 应用多久渲染一次以及渲染一次的“代价”。 它的目的是识别出应用中渲染较慢的部分，或是可以使用类似 memoization 优化的部分，并从相关优化中获益。

```js
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

## StrictMode

StrictMode 是一个用来突出显示应用程序中潜在问题的工具。与 Fragment 一样，StrictMode 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告。

```js
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

## React Hook

[`useState`](https://github.com/ztMin/notes/tree/master/React/react-hook#usestate)、[`useEffect`](https://github.com/ztMin/notes/tree/master/React/react-hook#useEffect)、[`useContext`](https://github.com/ztMin/notes/tree/master/React/react-hook#useContext)、[`useReducer`](https://github.com/ztMin/notes/tree/master/React/react-hook#useReducer)、[`useCallback`](https://github.com/ztMin/notes/tree/master/React/react-hook#useCallback)、[`useMemo`](https://github.com/ztMin/notes/tree/master/React/react-hook#useMemo)、[`useRef`](https://github.com/ztMin/notes/tree/master/React/react-hook#useRef)、[`useImperativeHandle`](https://github.com/ztMin/notes/tree/master/React/react-hook#useImperativeHandle)、[`useLayoutEffect`](https://github.com/ztMin/notes/tree/master/React/react-hook#useLayoutEffect)、[`useDebugValue`](https://github.com/ztMin/notes/tree/master/React/react-hook#useDebugValue) 都是[`React Hook`](https://github.com/ztMin/notes/tree/master/React/react-hook)相关的Api
