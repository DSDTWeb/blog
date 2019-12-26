### React 生命周期 & 状态
`React`生命周期分为 `挂载` -> `更新` -> `卸载` 三个阶段

#### 挂载
`constructor()` -> `static getDerivedStateFromProps()` -> `render()` -> `componentDidMount()`

#### 更新
`static getDerivedStateFromProps()` -> `shouldComponentUpdate()` -> `render()` -> `getSnapshotBeforeUpdate()` -> `componentDidUpdate()`

#### 卸载
`componentWillUnmount()`

#### 错误处理
- static getDerivedStateFromError()
- componentDidCatch()

#### 将废弃方法
- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

#### state

#### props

#### 状态提升