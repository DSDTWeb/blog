# React 组件 & 渲染

- React组件的实现形式： `函数组件`、 `class组件`；**不管何种形式声明的组件，组件名称必须以大写字母开头**
- React组件使用方式：`组合组件`、`提取组件`、`继承组件`

## 函数组件

函数组件接收唯一带有数据的`props`对象参数，并返回一个`React`元素，如下：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

## class组件

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

## 函数组件和class组件的区别

- `函数组件`编写简单，`class组件`需要继承 `React.Component` 相对复杂
- `函数组件`的`props`是在参数上读取，而`class组件`则是在组件实例化对象中取`this.props`
- `class组件`可以监听完整的生命周期过程，并可以进行相应的需求处理

## 组件组合

`React`中组件一般只返回一个根元素，如无需向DOM添加额外节点可以使用`React.Fragment`代替

```js
function App(props) {
    return (
        <React.Fragment>
            <Welcome name="Li Lei" />
            <Welcome name="Han Meimei" />
        </React.Fragment>
    )
}
```

## 提取组件

`提取组件`就是利用`组件组合`特性对业务场景进行合理的组件封装的一个概念。如：实现一个评论展示组件，有评论者、评论内容、评论时间几个维度去拆分封装组件

```js
function Avatar(props) { // 评论者头像
  return (
    <img className="Avatar"
      src={props.avatarUrl}
      alt={props.name}
    />
  );
}

function UserInfo(props) { // 评论者基本信息组件
  return (
    <div className="UserInfo">
      <Avatar avatarUrl={props.avatarUrl} name={props.name} />
      <div className="UserInfo-name">{props.name}</div>
    </div>
  );
}

function Comment(props) { // 评论组件
  return (
    <div className="Comment">
      <UserInfo {...props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {props.date}
      </div>
    </div>
  );
}

<Comment author={{avatarUrl: '评论者头像路径', name: '评论者名称'}} text="评论内容" date="2019-11-15" />
```

## 继承组件

`class组件`必须继承到`React.Component`，如果你继承的`class组件`有继承到`React.Componet`也可以。官方建议不要继承自己的组件基类。

```js
class BaseComponet extends React.Componet {
    unmount (container) {
        unmount(container)
    }
}

class App extends BaseComponet {
    render () {
        return <button click={e => this.alert('提示')}>提示</button>
    }
}
```

## React渲染

`React`是由`react-dom`提供渲染的方法，分别有：`ReactDOM.render`、`ReactDOM.hydrate`、`ReactDOM.createPortal`、`ReactDOMServer.renderToString`、`ReactDOMServer.renderToStaticMarkup`、`ReactDOMServer.renderToNodeStream`、`ReactDOMServer.renderToStaticNodeStream`

```js
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
ReactDOM.render(element, container[, callback]); // 在提供的 container 里渲染一个 React 元素，并返回对该组件的引用
ReactDOM.hydrate(element, container[, callback]); // 用于在 ReactDOMServer 渲染的容器中对 HTML 的内容进行 hydrate 操作
ReactDOM.createPortal(child, container); // 将子节点渲染到存在于父组件以外的 DOM 节点
ReactDOMServer.renderToString(element); // 将 React 元素渲染为初始 HTML。React 将返回一个 HTML 字符串
ReactDOMServer.renderToStaticMarkup(element); // 此方法与 renderToString 相似，但此方法不会在 React 内部创建的额外 DOM 属性
ReactDOMServer.renderToNodeStream(element); // 将一个 React 元素渲染成其初始 HTML。返回一个可输出 HTML 字符串的可读流（在浏览器中是不可用）
ReactDOMServer.renderToStaticNodeStream(element); // 此方法与 renderToNodeStream 相似，但此方法不会在 React 内部创建的额外 DOM 属性（在浏览器中是不可用）
```

## React卸载

```js
ReactDOM.unmountComponentAtNode(container)
```
