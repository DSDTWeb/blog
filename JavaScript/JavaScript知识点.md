# JavaScript知识点

汇集部分常见的JavaScript知识点

## 原型和原型链

### 原型

* JavaScript中所有对象都有一个内置属性`__proto__`（部分浏览器为`[[prototype]]`），指向创建这个对象的函数（即构造函数）constructor的prototype。用来构成原型链，同样用于实现原型继承。

* JavaScript的函数对象，在创建之后除了__proto__外，都会拥有`prototype`属性，这个属性指向函数的原型对象。用来实现基于原型的继承与属性的共享。

```js
function Person() {}
let p = new Person();
console.log(Person.prototype);  // {constructor: f}
console.log(p.prototype);  // undefined
```

### 原型链

每个构造函数都有一个原型对象`prototype`，原型对象都包含一个指向构造函数的指针`constructor`，而实例都包含一个指向原型对象的内部指针`__proto__`。那么假如我们让原型对象等于另一个类型的实例，此时的原型对象将包含一个指向另一个原型的指针。如此层层递进，就构成了实例与原型的链条。这就是所谓的原型链的基本概念

![原型链](image/prototype_chain.jpg?raw=true)

## 继承

### 原型链继承

#### 介绍

原型链继承是实现继承最原始的模式，即通过`prototype`属性实现继承。

```js
// 父级-构造函数
function Father() {
  this.fatherProp = true;
}
// 父级-原型属性
Father.prototype.getFatherValue = function() {
  return this.fatherProp;
}
// 子级-构造函数
function Son() {
  this.sonProp = false;
}
// 子级-原型属性：继承父级 即__proto__指向父级的prototype
Son.prototype = new Father();
// 子级-添加原型方法
Son.prototype.getSonValue = function() {
  return this.sonProp;
}
// 创建子级的实例对象
var son = new Son();
console.log(son.getFatherValue());  // true
```

#### 弊端

* 原型链中引用类型的属性会被所有实例共享的，即所有实例对象使用的是同一份数据，会相互影响

```js
function Father() {
  this.arr = [1,2,3];
}
function Son() {}
Son.prototype = new Father();
var son1 = new Son();
console.log(son1.arr);  // 1,2,3
var son2 = new Son();
son2.arr.push(4);
console.log(son2.arr);  // 1,2,3,4
console.log(son1.arr);  // 1,2,3,4
```

* 无法向父级构造函数传参

### 借用结构函数继承

#### 介绍

核心思想是：在子级构造函数中调用父级构造函数。

* 解决数据引用问题

```js
function Father() {
  this.arr = [1,2,3];
}
function Son() {
  // call的第一个函数是this指向的对象,即构造函数的实例对象
  Father.call(this);
  /*上面代码等同于下面这段代码：
  (function() {
    this.arr = [1,2,3]
  }).call(this)
  */
}
let son1 = new Son();
console.log(son1.arr);  // 1,2,3
let son2 = new Son();
son2.arr.push(4);
console.log(son2.arr);  // 1,2,3,4
console.log(son1.arr);  // 1,2,3
```

* 解决传参问题

```js
function Father(name) {
  this.name = name;
}
function Son(name) {
  Father.call(this, name);
}
var son1 = new Son("son1");
console.log(son1.name);  // son1
var son2 = new Son("son2");
console.log(son2.name);  // son2
```

#### 弊端

这种方式是通过构造函数实现的，当然也把构造函数自身的问题带过来了——破坏了复用性。因为每个实例都创建了一份副本。

### 组合继承

#### 介绍

组合继承 = 原型链 + 借用构造函数。取其长避其短：共享的用原型链，各自的借用构造函数

```js
function Father(name) {
  this.name = name;
  this.arr = [1,2,3];
}
Father.prototype.getName = function() {
  console.log(this.name);
}
function Son(name, age) {
  Father.call(this, name);
  this.age = age;
}
Son.prototype = new Father();
Son.prototype.constructor = Son;
Son.prototype.getAge = function() {
  console.log(this.age);
}
let son1 = new Son("son1", 23);
son1.arr.push(4);
console.log(son1.arr); //1,2,3,4
son1.getName();        //son1
son1.getAge();         //23
let son2 = new Son("son2", 24);
console.log(son2.arr); //1,2,3
son1.getName();        //son2
son1.getAge();         //24
```

#### 解析

1. 借用构造函数部分：
    * `Father.call(this, name)` —— name来自Father
    * `this.age = age; Son.prototype.constructor = Son` —— age来自Son
2. 原型链部分：
    * `Father.prototype.getName` —— getName方法来自Father.prototype
    * `Son.prototype.getAge` —— getAge来自Son.prototype

### 原型式继承

#### 介绍

一个基础对象，一个新对象，把基础对象作为原型对象，新对象创建实例。

```js
// 基础对象
let person = {
  name: "person",
  arr: [1,2,3]
};
// Object.create()创建新对象，传入基础对象
let son1 = Object.create(person);
son1.name = "AAA";
son1.arr.push(4);
console.log(son1.name);    // AAA
let son2 = Object.create(person);
son2.name = "BBB";
console.log(son2.name);    // BBB
console.log(son2.arr);     // 1,2,3,4，引用类型问题依然存在
```

#### 弊端

* 引用问题依旧存在

### 寄生式继承

#### 介绍

寄生式继承可以理解为是原型式继承的增强。在原型式继承中我们创建了一个新对象，寄生式继承便是在新对象中添加方法，以增强对象

```js
let person = {
  name: "person",
  arr: [1,2,3]
};
// 增强对象
function increase(obj, prop) {
  let object = Object.create(obj, props);
  object.getName = function() {
    console.log(this.name);
  }
  return object;
}
let son1 = increase(person, {
  name: {value: "AAA"}
});
son1.arr.push(4);
console.log(son1.name);  // AAA
son1.getName();          // AAA
let son2 = increase(person, {
  name: {value: "BBB"}
});
console.log(son2.name); // BBB
console.log(son1.arr);  // 1,2,3
console.log(son2.arr);  // 1,2,3,4
son2.getName();         // BBB
```

#### 弊端

寄生式继承类似于构造函数，每个实例对象都有一个副本——破坏了复用性

### 寄生组合式继承

#### 介绍

借用构造函数来继承属性，通过原型链的方式来继承方法，而不需要为子类指定原型而调用父类的构造函数。

```js
function inheritPrototype(Son, Father) {
  // 创建一个Father.prototype的副本
  let prototype = Object.create(Father.prototype);
  prototype.constructor = Son;
  Son.prototype = prototype;
}
function Father(name) {
  this.name = name;
  this.arr = [1,2,3];
}
Father.prototype.getName = function() {
  console.log(this.name);
}
function Son(name, age) {
  Father.call(this, name);
  this.age = age;
}
inheritPrototype(Son, Father);
Son.prototype.getAge = function() {
  console.log(age);
}
let son1 = new Son("AAA", 23);
son1.getName();         // AAA
son1.getAge();          // 23
son1.arr.push(4);
console.log(son1.arr);  // 1,2,3,4
let son2 = new Son("BBB", 24);
son2.getName();         // BBB
son2.getAge();          // 24
console.log(son2.arr);  // 1,2,3
```

### 总结

>原型链继承：最原始的继承方式（引用类型值相互影响、无法向父级构造函数传参）
>借用构造函数继承：解决原型链的问题，但破坏了复用性
>组合继承：原型链+借用构造函数，但调用了两次父级构造函数
>原型式继承：解决原型链传参问题，并且无需使用构造函数，但也存在引用类型问题
>寄生式：原生式的增强
>寄生组合式：寄生式+组合，解决了各种问题，只是代码稍微复杂

## 类型判断原理

## call、apply代码实现

## new做了什么

## 作用域和作用域链

## 闭包

## JS任务轮询机制

## 严格模式

## 事件捕获和冒泡
