# JavaScript知识点

汇集部分常见的JavaScript知识点

## 原型和原型链

### 原型

* JavaScript的函数对象，在创建之后除了__proto__外，都会拥有`prototype`属性，这个属性指向函数的原型对象。用来实现基于原型的继承与属性的共享。

* JavaScript中所有对象都有一个内置属性`__proto__`（部分浏览器为`[[prototype]]`），指向创建这个对象的函数（即构造函数）constructor的prototype。用来构成原型链，同样用于实现原型继承。

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
let son = new Son();
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
let son1 = new Son();
console.log(son1.arr);  // 1,2,3
let son2 = new Son();
son2.arr.push(4);
console.log(son2.arr);  // 1,2,3,4
console.log(son1.arr);  // 1,2,3,4
```

* 无法向父级构造函数传参

### 借用构造函数继承

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
let son1 = new Son("son1");
console.log(son1.name);  // son1
let son2 = new Son("son2");
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

### 从设计思想上谈谈继承本身的问题

假如现在有不同品牌的车，每辆车都有drive、music、addOil这三个方法。

```js
class Car{
  constructor(id) {
    this.id = id;
  }
  drive(){
    console.log("drive");
  }
  music(){
    console.log("music")
  }
  addOil(){
    console.log("addOil")
  }
}
class otherCar extends Car{}
```

现在可以实现车的功能，并且以此去扩展不同的车。但是问题来了，新能源汽车也是车，但是它并不需要addOil(加油)。如果让新能源汽车的类继承Car的话，也是有问题的，俗称"大猩猩和香蕉"的问题。大猩猩手里有香蕉，但是我现在明明只需要香蕉，却拿到了一只大猩猩。也就是说加油这个方法，我现在是不需要的，但是由于继承的原因，也给到子类了。

> 继承的最大问题在于：无法决定继承哪些属性，所有属性都要继承

一方面父类是无法描述所有子类的细节情况的，为了不同的子类特性去增加不同的父类，`代码势必会大量重复`，另一方面一旦子类有所变动，父类也要进行相应的更新，`代码的耦合性太高`，维护性不好。

如何来解决继承的诸多问题呢？

用组合，这也是当今编程语法发展的趋势，比如golang完全采用的是面向组合的设计方式。顾名思义，面向组合就是先设计一系列零件，然后将这些零件进行拼装，来形成不同的实例或者类。

```js
function drive(){
  console.log("drive");
}
function music(){
  console.log("music")
}
function addOil(){
  console.log("addOil")
}
let car = compose(drive, music, addOil);
let newEnergyCar = compose(drive, music);
```

## 类型判断原理

### typeof

一般用来判断基本数据类型，typeof目前只能返回八种判断类型：string、number、boolean、undefined、object、function、symbol、bigint。

```js
typeof '123'          // string
typeof 123            // number
typeof true           // boolean
typeof Symbol(1)      // symbol
typeof 111n           // bigint
typeof undefined      // undefined
typeof null           // object
typeof {a: 1, b: 2}   // object
typeof function() {}  // function
```

>为什么用typeof判断null会返回object？  
>JavaScript在底层存储变量的时候，会在变量的机器码的低位1-3位置存储其类型信息。但是对于undefined和null来说，这两个值的信息存储有点特殊。其中undefined用-2^30整数来表示，null的所有机器码都为0。所以typeof在判断null的时候被当作对象。

### instanceof

主要的作用是判断一个实例是否属于某种类型，或者判断一个实例是否是其父类型或者祖先类型的实例。

```js
/s/g instanceof RegEXP                     // true
new Date('2019/12/30') instanceof Date     // true
[1,2,3] instanceof Array                   // true
[1,2,3] instanceof Object                  // true 数组的原型指向对象的原型对象
let person = function() {};
let programmer = function() {};
programmer.prototype = new person();
let nicole = new programmer();
nicole instanceof person                   // true
nicole instanceof programmer               // true
```

代码实现instanceof的主要原理是要右边变量的`prototype`在左边变量的原型链上即可。因此，在查找的过程中会遍历左边变量的原型链，直到找到右边变量的prototype，如果查找失败，则会返回false。

```js
function new_instance_of(leftVaule, rightVaule) {
  let rightProto = rightVaule.prototype; // 取右表达式的prototype值
  leftVaule = leftVaule.__proto__;       // 取左表达式的__proto__值
  while (true) {
    if (leftVaule === null) {
        return false;
      }
      if (leftVaule === rightProto) {
        return true;
      }
      leftVaule = leftVaule.__proto__;
  }
}
```

### Object.prototype.toString

toString是Object原型对象上的一个方法，该方法默认返回其调用者的具体类型，更严格的讲，是 toString运行时this指向的对象类型，返回的类型格式为`[object xxxx]`，xxxx时具体的数据类型，基本上所有对象的类型都可以通过这个方法获取到

```js
Object.prototype.toString.call('') ;              // [object String]
Object.prototype.toString.call(1) ;               // [object Number]
Object.prototype.toString.call(true) ;            // [object Boolean]
Object.prototype.toString.call(undefined) ;       // [object Undefined]
Object.prototype.toString.call(null) ;            // [object Null]
Object.prototype.toString.call(new Function()) ;  // [object Function]
Object.prototype.toString.call(new Date()) ;      // [object Date]
Object.prototype.toString.call([]) ;              // [object Array]
Object.prototype.toString.call(new RegExp()) ;    // [object RegExp]
Object.prototype.toString.call(new Error()) ;     // [object Error]
Object.prototype.toString.call(document) ;        // [object HTMLDocument]
Object.prototype.toString.call(window) ;          // [object global] window是全局对象global的引用
```

>注意：必须通过Object.prototype.toString.call来获取，而不能通过需要判断的对象的toString来获取，大部分对象都实现了自身的toString方法，这样会导致Object.toString的查找被终止，因此要用call来强制执行Object.toString方法。

## 数据类型转换

1. [] == ![]结果是什么？为什么？
    ==中，左右两边都需要转换成数字然后进行比较。[\]转换为数字0，![\]首先转换为布尔值，由于[\]作为一个引用类型转为布尔值true，因此![\]为false，进而转换为数字0。
    0 == 0，结果为true。
2. JavaScript中类型转化有哪几种？
类型转换有三种：
    * 转换为数字
    * 转换成布尔值
    * 转换成字符串
    ![数据类型转换](image/data_conversion.jpg?raw=true)
    > 注意"Boolean 转字符串"这行结果指的是 true 转字符串的例子
3. == 和 ===有什么区别？
    >===叫做严格相等，是指：左右两边不仅值要相等，类型也要相等，例如'1'===1的结果是false，因为一边是string，另一边是number。

    `==`不像`===`那样严格，对于一般情况，只要值相等，就返回true，但==还涉及一些类型转换，它的转换规则如下
    * 两边的类型是否相同，相同的话就比较值的大小，例如1==2，返回false
    * 判断的是否是null和undefined，是的话就返回true
    * 判断的类型是否是String和Number，是的话，把String类型转换成Number，再进行比较
    * 判断其中一方是否是Boolean，是的话就把Boolean转换成Number，再进行比较
    * 如果其中一方为Object，且另一方为String、Number或者Symbol，会将Object转换成字符串，再进行比较

4. 对象转原始数据是根据什么流程运行的？
    对象转原始类型，会调用内置的[ToPrimitive]函数，对于该函数而言，其逻辑如下：
    * 如果Symbol.toPrimitive()方法，优先调用再返回
    * 调用valueOf()，如果转换为原始类型，则返回
    * 调用toString()，如果转换为原始类型，则返回
    * 如果都没有返回原始类型，会报错

    ```js
    let obj = {
      value: 3,
      valueof() {
        return 4;
      },
      toString() {
        return '5'
      },
      [Symbol.toPrimitive]() {
        return 6
      }
    }
    console.log(obj + 1); // 7
    ```

## new做了什么

1. 创建一个空的简单JavaScript对象（即{}）；
2. 链接该对象（即设置该对象的构造函数）到另一个对象 ；
3. 将步骤1新创建的对象作为this的上下文 ；
4. 如果该函数没有返回对象，则返回this。

```js
function myNew(func, ...args) {
  const result = new Object(); // 创建空对象
  result.__proto__ = func.prototype // 第二条,继承原型上的属性或方法
  func.apply(result, args) //将构造函数func的this指向result对象，这样result就可以访问到func中的属性或方法
  if(typeof res === 'object') return res;
  return obj;
}
```

## JS事件轮询机制

### 概念

事件轮询是"一个解决和处理外部事件时将它们转换为回调函数的调用的实体"。JavaScript语言的一大特点就是单线程，同一个时间只能做一件事。所有任务都需要排队，前一个任务结束，才会执行后一个任务。

### 任务队列

"任务队列"是一个先进先出的数据结构，排在前面的事件，优先被主线程读取。主线程的读取过程基本上是自动的，只要执行栈一清空，"任务队列" 上第一位的事件就会自动进入主线程。一种是同步任务，另一种是异步任务。
同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务。异步任务指的是，不进入主线程，而进入"任务队列"的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

### 异步执行机制

JavaScript的异步是通过回调函数实现的，在主线程执行完当前的任务栈，主线程空闲后轮询任务队列，并将任务队列中的任务取出来执行。在浏览器中，不同的异步操作添加到的任务队列的时机也不同

* DOM Binding模块进行事件触发时处理，将回调函数添加到任务队列中

* timer模块进行延时处理，当时间到达的时候，才会将回调函数添加到任务队列中

* network模块处理网络请求，当网络请求完成返回时，才会将回调函数添加到队列中

所有同步任务都在主线程上执行，形成一个执行栈。主线程外，还存在以一个"任务队列"，只要异步任务有了运行结果，就在"任务队列"中放置一个事件。当全部同步任务执行完毕，就会不断轮询"任务队列"，对应的异步任务结束等待状态进入任务栈，开始执行。

```js
const foo = () => console.log("First");
const bar = () => setTimeout(() => console.log("Second"), 500);
const baz = () => console.log("Third");
bar();
foo();
baz();
```

![异步执行](image/event_loop.gif?raw=true)

### 宏任务和微任务

普通任务队列和延迟队列`setTimeout`，`setInterval`中的任务，都属于宏任务。对于每个宏任务而言，其内部都有一个微任务队列。在每一个宏任务中定义一个微任务队列，当该宏任务执行完成，会检查其中的微任务队列，如果为空则直接执行下一个宏任务，如果不为空，则依次执行微任务，执行完成才去执行下一个宏任务。
常见的微任务有MutationObserver、Promise.then(或.reject) 以及以 Promise 为基础开发的其他技术(比如fetch API), 还包括 V8 的垃圾回收过程。

```js
Promise.resolve().then(()=>{
  console.log('Promise1');
  setTimeout(()=>{
    console.log('setTimeout2');
  },0);
});
setTimeout(()=>{
  console.log('setTimeout1');
  Promise.resolve().then(()=>{
    console.log('Promise2');
  });
},0);
console.log('start');
// start Promise1 setTimeout1 Promise2 setTimeout2
```

### 任务队列优先级

process.nextTick > promise.then > setTimeout > setImmediate

```js
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(() => {
  console.log('setTimeout0');
}, 0);
setTimeout(() => {
  console.log('setTimeout3');
}, 3);
setImmediate(() => {
  console.log('setImmediate');
});
process.nextTick(() => {
  console.log('nextTick');
});
async1();
new Promise((resolve) => {
  console.log('promise1');
  resolve();
  console.log('promise2');
}).then(() => {
  console.log('promise3');
});
console.log('script end');
// script start
// async1 start
// async2
// promise1
// promise2
// script end
// nextTick
// async1 end
// parmise3
// setImmediate
// setTimeout0
// setTimeout3
```

## this指针

### 显示绑定

使用call、apply、bind可以进行显示绑定。

1. call模拟实现

    ```js
    Function.prototype.myCall = function (obj, ...args) {
      // 当指定的this值不存在时，则指向全局对象
      let context = obj || window;
      // 将函数赋值给要指向的对象 fn只是例子上写的 不考虑obj上有相同值的情况
      context.fn = this;
      // 执行函数 并将结果保存到 result
      let result = context.fn(...args);
      // 删除赋值
      delete context.fn;
      return result;
    }
    ```

2. apply模拟实现

    ```js
    Function.prototype.myApply = function (obj, args) {
      // 当指定的this值不存在时，则指向全局对象
      let context = obj || window;
      // 将函数赋值给要指向的对象
      context.fn = this;
      let result;
      if (args instanceof Array) {
        result = context.fn(...args);
      } else {
        result = context.fn();
      }
      // 删除赋值
      delete context.fn;
      return result;
    }
    ```

3. bind模拟实现

    ```js
    Function.prototype.myBind = function (context) {
      // 如果bind不是函数 则报错
      if (typeof this !== "function") {
        throw new Error("no function");
      }
      let args = Array.prototype.slice.call(arguments, 1);
      let self = this;
      // 这个回调的部分不是很懂
      let f = function () {
        let fArgs = args.concat(Array.prototype.slice.call(arguments));
        // 当bind的回调函数拿来当另外一个函数的构造函数时， this指向重新修改
        if (this instanceof f) {
          return self.apply(this, fArgs);
        } else {
          return self.apply(context, fArgs);
        }
      }
      if(this.prototype) {
        f.prototype = this.prototype;
      }
      return f;
    }
    ```

    >__将类数组转换成数组__  
    >`Array.prototype.slice.call`：类数组的原型对象是Object.prototype，并没有slice方法。通过call(obj)不仅改变了this指向，还是得类数组对象继承了Array.prototype中的slice方法。slice方法可以将一个类数组对象、集合转换成新数组。  
    >`Array.from`：将一个类数组对象或者可遍历对象转换成一个真正的数组。  
    >`[...arguments]`：结构展开字面量赋值到数组中。  

### 隐式绑定

1. 全局上下文
  全局上下文默认this指向window，严格模式下指向undefined。
2. 直接调用函数
  
  ```js
  let obj = {
    a: function () {
      console.log(this);
    }
  };
  let func = obj.a;
  func();
  ```

  这中情况是直接调用，this相当于全局上下文的情况。
3. 对象.方法形式调用
  
  ```js
  obj.a();
  ```

  这就是`对象.方法`的情况，this指向这个对象。
4. DOM事件绑定
  `on+事件`和`addEventerListener`中this默认指向绑定事件的元素。  
  IE比较奇异，使用attachEvent，this默认指向window。
5. new + 构造函数
  钩爪函数中的this指向实例对象。
6. 箭头函数
  箭头函数没有this，因此也不能绑定（使用显示绑定也不能改变this指向）。里面的this会指向当前最近的非箭头函数的this，找不到就是指向window（严格模式下的undefined）。
  
  ```js
  let obj = {
    a: function () {
      let arrow = () => {
        console.log(this);
      }
      arrow();
    }
  };
  obj.a(); // 找到最近的非箭头函数a，a绑定的是obj，因此箭头函数中的this是obj
  ```

## 闭包

### 作用域和作用域链

#### 什么是作用域

在一定的空间里可以对数据进行读写操作，这个空间就是数据的作用域。变量的作用域分为两种：全局作用域和局部作用域。

* 全局作用域：最外层函数定义的变量拥有全局作用域，对任何内部函数都是可以访问的。
* 局部作用域： 局部作用域一般只在固定的代码片段可以访问到，而对于函数外部是无法访问的。

在ES6之前，只有两种作用域：全局作用域和函数作用域。在ES6之后，新增了一种作用域：块级作用域。

#### 什么是作用域链

当访问一个变量时，解释器会首先在当前作用域查找标示符，如果没有找到，就去父作用域找，直到找到该变量的标示符或者不在父作用域中，这就是作用域链

### 什么是闭包

闭包是指有权访问另外一个函数作用域中的变量的函数。（其中变量，指在函数中使用的，但既不是函数参数arguments也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量。）

### 闭包有哪些表现形式

* 返回一个函数。
* 函数作为参数传递。
* 在异步函数中使用了回调函数。
* IIFE（立即执行函数表达式），保存了全局作用域和当前函数的作用域。

解决下方代码循环问题

```js
for(var i = 1; i <= 5; i ++){
  setTimeout(function timer(){
    console.log(i)
  }, 0)
}
```

* 利用IIFE当每次for循环的时候，把此时的i变量传递到定时器中

```js
for(var i = 1;i <= 5;i++){
  (function(j){
    setTimeout(function timer(){
      console.log(j)
    }, 0)
  })(i)
}
```

* 给定时器传入第三个参数，作为timer函数的第一个函数参数

```js
for(var i=1;i<=5;i++){
  setTimeout(function timer(j){
    console.log(j)
  }, 0, i)
}
```

* 使用ES6的let

```js
for(let i = 1; i <= 5; i++){
  setTimeout(function timer(){
    console.log(i)
  },0)
}
```

## 严格模式

严格模式可以应用到整个脚本或个别脚本。不要在封闭的大括弧`{}`内这样做，在这样的上下文中这么做是没有效果的。
为整个脚本文件开启严格模式，需要在所有语句之前放一个特定语句 "use strict"

```js
// 整个脚本都开启严格模式的语法
"use strict";
let v = "Hi!  I'm a strict mode script!";
```

```js
function strict() {
  // 函数级别严格模式语法
  'use strict';
  function nested() {
    return "And so am I!";
  }
  return "Hi!  I'm a strict mode function!  " + nested();
}
```

### 严格模式中的变化

1. 将过失错误转成异常
    * 无法再意外使用创建全局变量。

      ```js
      "use strict";
      mistypedVariable = 17; // 这一行代码会抛出 ReferenceError
      ```

    * 会使引起静默失败(不报错也没有任何效果)的赋值操作抛出异常。

      ```js
      "use strict";
      // 给不可写属性赋值
      let obj1 = {};
      Object.defineProperty(obj1, "x", { value: 42, writable: false });
      obj1.x = 9; // 抛出TypeError错误
      // 给只读属性赋值
      let obj2 = { get x() { return 17; } };
      obj2.x = 5; // 抛出TypeError错误
      // 给不可扩展对象的新属性赋值
      let fixed = {};
      Object.preventExtensions(fixed);
      fixed.newProp = "ohai"; // 抛出TypeError错误
      ```

    * 函数参数名唯一，正常模式下，最后一个重名参数会覆盖之前的重名参数，之前的参数任可以通过argumnets[i]来访问。

      ```js
      function sun (a, a, c) { // 语法错误
        "use strict"
        return a + a + c;
      }
      ```

    * 严格模式禁止八进制数字语法，ECMAScript并不包含八进制语法，但是浏览器支持以零开头的八进制语法。在ES6中支持以`0o`的前缀来表示八进制数。

      ```js
      "use strict";
      let a = 0o15 // ES6八进制
      let b = 015 // 语法错误
      ```

    * ES6中的严格模式禁止设置原始类型值的属性，不采用严格模式，设置属性将会简单忽略，采用严格模式将会抛出TypeError错误。

      ```js
      "use strict";
      false.true = "";              //TypeError
      "a".b = "c";      //TypeError
      ```

2. 简化变量的使用
    严格模式简化了代码中变量名字映射到变量定义的方式。JavaScript有些情况会使得代码中的名字到变量定义基本映射指回在运行时才会产生，严格模式移除了大多数这种情况的发生。

    * 禁止使用with

      ```js
      "use strict";
      let x = 17;
      with (obj) { // !!! 语法错误
        // 如果不运行代码，我们无法知道，因此，这种代码让引擎无法进行优化，速度也就会变慢。
        x;
      }
      ```

    * eval不再为上层范围（注：包围eval代码块的范围）引入新变量

      ```js
      var x = 17;
      var evalX = eval("'use strict'; var x = 42; x");
      console.assert(x === 17);
      console.assert(evalX === 42);
      ```

    * 禁止删除声明变量

      ```js
      "use strict";
      let x;
      delete x; // !!! 语法错误
      eval("let y; delete y;"); // !!! 语法错误
      ```

3. 让eval和arguments变的简单
  严格模式让arguments和eval少了一些奇怪的行为。
    * 名称eval和arguments不能通过程序语法被绑定或赋值

      ```js
      "use strict";
      eval = 17;
      arguments++;
      ++eval;
      let obj = { set p(arguments) { } };
      let eval;
      try { } catch (arguments) { }
      function x(eval) { }
      function arguments() { }
      let y = function eval() { };
      let f = new Function("arguments", "'use strict'; return 17;");
      ```

    * 参数的值不会随arguments对象的值的改变而变化

      ```js
      function f(a) {
        "use strict";
        a = 42;
        return [a, arguments[0]];
      }
      let pair = f(17);
      console.log(pair[0] === 42);
      console.log(pair[1] === 17);
      ```

    * 不再支持`arguments.callee`

      ```js
      "use strict";
      let f = function() { return arguments.callee; };
      f(); // 抛出类型错误
      ```

4. "安全的"JavaScript
    * this传递给一个函数的值不会被强制转换为一个对象

      ```js
      "use strict";
      function fun() { return this; }
      console.assert(fun() === undefined);
      console.assert(fun.call(2) === 2);
      console.assert(fun.apply(null) === null);
      console.assert(fun.call(undefined) === undefined);
      console.assert(fun.bind(true)() === true);
      ```

    * fun.caller和fun.arguments都是不可删除的属性而且在存值、取值时都会报错

      ```js
      function fun() {
        "use strict";
        restricted.caller;    // 抛出类型错误
        restricted.arguments; // 抛出类型错误
      }
      ```

5. 为未来的ECMAScript铺路
    * 保留关键字,包括`implements`，`interface`，`let`，`package`，`private`，`protected`，`public`，`static`和`yield`

    * 禁止了不在脚本或者函数层面上的函数声明

      ```js
      "use strict";
      if (true) {
        function f() { } // !!! 语法错误
        f();
      }
      for (var i = 0; i < 5; i++) {
        function f2() { } // !!! 语法错误
        f2();
      }
      function baz() { // 合法
        function eit() { } // 同样合法
      }
      ```

## 事件捕获和冒泡

事件捕获：当鼠标点击或者触发dom事件时（被触发dom事件的这个元素被叫作事件源），浏览器会从根节点 =>事件源（由外到内）进行事件传播。IE8及更早的版本不支持事件捕获。
事件冒泡：事件源 =>根节点（由内到外）进行事件传播。不支持事件冒泡的事件有：blur、focus、load、unload

DOM2级事件规定的事件流包括三个阶段：

* 事件捕获阶段
* 处于目标阶段
* 事件冒泡阶段

![原型链](image/capturing_bubbling.png?raw=true)

1. 当处于目标阶段，没有捕获与冒泡之分，执行顺序会按照`addEventListener`的添加顺序决定，先添加先执行。
2. 使用`stopPropagation()`取消事件传播时，事件不会被传播给下一个节点，但是，同一节点上的其他监听还是会被执行。

    ```js
    // list 的捕获
    $list.addEventListener('click', (e) => {
      console.log('list capturing');
      e.stopPropagation();
    }, true)
    // list 捕获 2
    $list.addEventListener('click', (e) => {
      console.log('list capturing2');
    }, true)
    // list capturing
    // list capturing2
    ```

    >如果想要同一层级的listener也不执行，可以使用`stopImmediatePropagation()`;

3. `preventDefault()`只是阻止默认行为，跟事件传播一点关系都没有。
4. 一旦发起了preventDefault()，在之后传递下去的事件里面也会有效果。

### 事件处理程序

1. HTML事件处理程序
    每种事件都可以使用一个与相应事件处理程序同名的HTML特性来指定，特性的值可以是能够执行的JavaScript代码，也可以是函数。在函数内部，this值等于事件的目标元素。

    ```html
    <button onclick="alert('hello')">按钮1</button>
    <button onclick="doSomething()">按钮2</button>
    ```

    缺陷：
    * 时差问题：用户在HTML元素一出现就触发相应的事件，如果JavaScript还未加载完成，则可能发生报错。为此HTML事件处理程序都会封装在一个try-catch块中。
    * 扩展事件处理程序的作用域链在不同浏览器导致不同的结果。
    * HTML代码和JavaScript代码紧密耦合。

2. DOM0级事件处理程序
    通过JavaScript指定事件处理程序的传统方式，将一个函数赋值给一个事件处理程序属性。使用DOM0级方法指定的事件处理程序被认为是元素的方法，因此this引用当前元素。

    ```js
    let btn = document.getElementById('btn');
    btn.onclick = function () {
      alert('hello');
    }
    btn.onclick = null;
    ```

    可以通过将事件处理程序设置为null来删除DOM0级方法指定的事件处理程序。
    缺陷：
    * 当写两个相同的事件处理程序时，后面的会覆盖前面的。
    * 不能控制事件流是冒泡还是捕获。

3. DOM2级事件处理程序
    DOM2级事件定义了两种方法，用于指定和删除事件处理程序：`addEventListener()`和`removeEventListener()`。接受三个参数：事件名称，事件处理程序，布尔值（false表示使用冒泡机制，true表示捕获机制，默认是false）。

    ```js
    let btn=document.getElementById("btn");
    btn.addEventListener('click', hello，false);
    btn.removeEventListener('click', hello，false);
    function hello(){
      alert("hello");
    }
    ```

    同一个元素可以绑定多个事件处理程序，`removeEventLister()`移除监听需要传入和添加事件处理程序时一摸一样的参数，因此匿名函数无法移除。

4. IE事件处理程序
    IE事件定义了两个方法，用于指定和删除事件处理程序：`attachEvent()`和`detachEvent()`。接受两个参数：事件名称，事件处理程序。由于IE8及跟早的版本只支持冒泡，所以attachEvent添加的事件都会被添加到冒泡阶段。

    ```js
    let btn=document.getElementById("btn");
    btn.attachEvent('onclick',hello);
    btn.detachEvent('onclick',hello);
    function hello(){
      alert("hello");
    }
    ```

    attachEvent与addEventListener的区别：
    * attachEvent添加的的事件名称需要加on，addEventListener则不要
    * 作用域不同，attachEvent事件处理程序会在全局作用于下运行，this指向window。

5. 跨浏览器事件处理程序
    保证多浏览器下一致的运行，只需要关注冒泡阶段。视情况分别使用DOM2、IE方法、DOM0级方法来添加和移除事件。
    * 先检查传入元素是否存在DOM2方法
    * 再检查传入的元素是否存在IE方法
    * 最后检查传入的元素是否存在DOM0级方法。

    ```js
    let EventUtil = {
      addHandler:function(element, type, handler) {
        if (element.addEventListener)
          element.addEventListener(type, handler, false);
        else if (element.attachEvent)
          element.attachEvent("on" + type, handler);
        else
          element["on" + type] = handler;
      },
      removeHandler:function(element, type, handler) {
        if (element.removeEventListener)
          element.removeEventListener(type, handler, false);
        else if (element.detachEvent)
          element.detachEvent(“on” + type, handler);
        else
          element["on" + type] = null;
      }
    }
    ```
