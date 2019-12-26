# ECMAScript 6

ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了。它的目标，是使得 JavaScript 语言可以用来编写复杂的大型应用程序，成为企业级开发语言。
ES6声明变量有六种方法`var`、`function`、`let`、`const`、`import`、`class`。

## let 和 const 块级作用域

- ES6 新增`let`和`const`命令来声明变量
- `let`与`var`用法类似，不同的是`let`和`const`是一个**块级作用域**变量
- `const`定义的是一个常量定义的时候就要赋初始值并不能再修改
- `let`和`const`不存在**变量提升**现象，即变量可以再声明之前使用。
- 在代码块内使用`let`和`const`声明变量之前，都不可使用该变量，这就是**暂时性死区**
- `let`和`const`不允许在相同作用域内，重复声明同一个变量，即**不允许重复声明**，但内层作用域可以定义外层作用域的同名变量。

```js
{ // ES6 允许块级作用域的任意嵌套。
  let a = [];
  for (let i = 0; i < 10; i++) {
    a[i] = function () {
      console.log(i);
    };
  }
  a[6](); // 6
}
```

## 解构

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于`undefined`和`null`无法转为对象，所以无法对她们进行解构。等号左边的变量会被赋予等号右边对应的值。还可以使用嵌套解构。如解构不成功，变量的值就等于`undefined`。解构赋值允许指定默认值。对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。具体如下例子：

```js
let [a, b, c] = [1, 2, 3]; // 数组解构 a=1, b=2, c=3
let [foo, [[bar], baz]] = [1, [[2], 3]]; //嵌套解构 foo=1, bar=2, baz=3
let [foo] = []; // 解构不成功 foo=undefind
let [foo = true] = []; // 指定默认值(当数组成员严格等于(===)`undefined`，默认值才会生效) foo=true
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr; // 对数组对象属性的解构 first=1, last=3
let { bar, foo } = { foo: 'aaa', bar: 'bbb' }; // 对象解构
let { foo: baz } = { foo: 'aaa', bar: 'bbb' }; // 变量名与属性名称不一致 baz='aaa'
let { p, p: [x, { y }] } = {p: ['Hello', {y: 'World'}]} // 对象多层级解构 p=['Hello', {y: 'World'}], x='Hello', y='World'
// 圆括号使用注意事项 -> 错误示例（变量声明语句，模式不能使用圆括号）
let [(a)] = [1];
let {x: (c)} = {};
let ({x: c}) = {};
let {(x: c)} = {};
let {(x): c} = {};
let { o: ({ p: p }) } = { o: { p: 2 } };
function f([(z)]) { return z; };
function f([z,(x)]) { return x; };
// 圆括号使用注意事项 -> 正确（注意将变量提前声明好）
[(b)] = [3]; // 正确
({ p: (d) } = {}); // 正确
[(parseInt.prop)] = [3]; // 正确
```

## Symbol

`Symbol`是ES6引入的一种新的原始数据类型，它表示独一无二的值。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

```js
let s1 = Symbol('foo');
let s2 = Symbol('foo');
s1 // Symbol(foo)
s1 == s2 // false

let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');
s1 === s2 // true
Symbol.keyFor(s1) // "foo"
```

## Set 和 Map 数据结构

### Set

ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。属性： `size`返回`Set`实例的成员总数。实例方法有：

- `Set.prototype.add(value)` 添加某个值，并返回`Set`实例（所以可以链式写法）。
- `Set.prototype.delete(value)` 删除某个值，返回一个布尔值表示是否删除成功。
- `Set.prototype.has(value)` 返回一个布尔值，表示该值是否存在。
- `Set.prototype.clear()` 清除所有成员，没有返回值。
- `Set.prototype.keys()` 返回键名的遍历器
- `Set.prototype.values()` 返回键值的遍历器
- `Set.prototype.entries()` 返回键值对的遍历器
- `Set.prototype.forEach()` 使用回调函数遍历每个成员

```js
const s = new Set();
const set = new Set([1, 2, 3, 4, 4]);

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```

### WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 的区别具体如下几点。

1. WeakSet 的成员只能是对象，而不能是其他类型的值。
2. WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
3. WeakSet 没有`size`、`forEach`等属性和遍历方法。只有`add(value)`、`delete(value)`、`has(value)`三个实例方法。

```js
const ws = new WeakSet([1, 2]); // 错误，因为WeakSet的成员只能是对象
const ws = new WeakSet([[1,2], [3, 4]]); // 正确
```

### Map

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。`Map`的“键”范围不限于字符串，各种类型的值（包括对象）都可以当作键。

```js
const m = new Map();
const o = {p: 'Hello World'};
m.set(o, 'content')
m.get(o) // "content"
m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

## Proxy

```js
var obj = {};
var proxy = new Proxy(obj, {
  get (target, propKey, receiver) { // 拦截对象属性的读取，比如proxy.foo和proxy['foo']。
    return Reflect.get(target, propKey, receiver);
  },
  set (target, propKey, value, receiver) {}, // 拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
  has (target, propKey) {}, // 拦截propKey in proxy的操作，返回一个布尔值。
  deleteProperty (target, propKey) {}, // 拦截delete proxy[propKey]的操作，返回一个布尔值。
  ownKeys (target) {}, // 拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
  getOwnPropertyDescriptor (target, propKey) {}, // 拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
  defineProperty (target, propKey, propDesc) {}, // 拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
  preventExtensions (target) {}, // 拦截Object.preventExtensions(proxy)，返回一个布尔值。
  getPrototypeOf (target) {}, // 拦截Object.getPrototypeOf(proxy)，返回一个对象。
  isExtensible (target) {}, // 拦截Object.isExtensible(proxy)，返回一个布尔值。
  setPrototypeOf (target, proto) {}, // 拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
  apply (target, object, args) {}, // 拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
  construct (target, args) {return new target(...args)}, // 拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)
});
```

## Reflect

## Promise
