# JavaScript知识点(二)

汇集部分常见的 JavaScript 知识点

## 安全的类型检测

JavaScript 内置的类型检测机制并非完全可靠。比如 `typeof` 操作符，经常会导致检查数据类型时得到不靠谱的结果，Safari（直至第4版）在对正则表达式应用会返回"function"，因此很难确认某个值到底是不是函数。

再比如 `instanceof` 操作符在存在多个全局作用域（一个页面包含多个 frame ）的情况下。

```js
  var isArray = value instanceof Array;
```

以上代码要返回 true ，value 必须要是一个数组，还必须与 Array 构造函数在同个全局作用域中。如果 value 是另一个 frame 中定义的数组，那么上述代码也会返回 false 。  
解决上述问题的办法都一样，在任何值上调用 Object 原生的 toString() 方法，都会返回一个[object NativeConstructorName]格式的字符串。每个类在内部都有一个\[\[class]]属性，这个属性中就指定了上述字符串中构造函数名。

## 作用域安全的构造函数

```js
function Person (name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}
var person = new Person('zzz', 18, 'web');
```

Person 构造函数使用 this 对象给三个属性赋值，当和 new 操作符连用时，则会创建一个新的Person 对象，同时会给它分配这些属性。如果没有使用 new 的操作符来调用该构造函数，由于 this 对象是运行时绑定，会映射到全局对象 window 上，导致 window 属性意外增加。

```js
var person = Person('zzz', 18, 'web');
console.log(window.name, window.age, window.job); // zzz 18 web
```

作用域安全额构造函数在进行任何更改前，首先确认 this 对象是正确类型的实例。如果不是，会创建新的实例并返回。

```js
function Person (name, age, job) {
  if (this instanceof Person) {
    this.name = name;
    this.age = age;
    this.job = job;
  } else {
    return new Peroson(name, age, job);
  }
}
var person1 = Person("Nicholas", 29, "Software Engineer");
console.log(window.name); //""
console.log(person1.name); //"Nicholas"
var person2 = new Person("Shelby", 34, "Ergonomist");
console.log(person2.name); //"Shelby"
```

这段代码中 Person 构造函数添加了一个检查并确保 this 对象是 Person 实例的 if 语句，它表示要么使用 new 操作符，要么在现有的 Person 实例环境中调用构造函数。任何一种情况下，对象初始化都能正常进行。如果 this 并非 Person 的实例，那么会再次使用 new 操作符调用构造函数并返回结果。这样就避免了调用Person构造函数时无论是否使用了new 操作符，都会返回一个 Person 的新实例。

但是该操作有一个弊端，如果在使用构造函数继承的时候，这个继承会被破坏。

```js
function Polygon (sides) {
  if (this instanceof Polygon) {
    this.sides = sides;
    this.getArea = function () {
      return 0;
    };
  } else {
    return new Polygon(sides);
  }
}
function Rectangle(width, height){
  Polygon.call(this, 2);
  this.width = width;
  this.height = height;
  this.getArea = function(){
    return this.width * this.height;
  };
}
var rect = new Rectangle(5, 10);
console.log(rect.sides); //undefined
```

在这段代码中，Polygon 构造函数是作用域安全的，而 Rectangle 构造函数则不是。新创建一个 Rectangle 实例之后，这个实例通过 Polygon.call() 来继承 Polygon的 sides 属性。由于 Polygon 构造函数是作用域安全的，this对象并非 Polygon 的实例，所以会创建并返回一个新的 Polygon 对象。可以采用其他继承方式来解决这个问题。

## 惰性载入函数

```js
function createXHR(){
  if (typeof XMLHttpRequest != "undefined") {
    return new XMLHttpRequest();
  } else if (typeof ActiveXObject != "undefined") {
    if (typeof arguments.callee.activeXString != "string") {
      var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
      i,len;
      for (i=0,len=versions.length; i < len; i++) {
        try {
          new ActiveXObject(versions[i]);
          arguments.callee.activeXString = versions[i];
          break;
        } catch (ex){
          //跳过
        }
      }
    }
    return new ActiveXObject(arguments.callee.activeXString);
  } else {
    throw new Error("No XHR object available.");
  }
}
```

每次执行 createXHR() 的时候，都会进行大量的判断。如果浏览器支持内置的XHR，那么它就是一直支持的，没必要每次都调用。惰性载入函数表示函数执行的分支仅会发生一次，有两种实现惰性载入的方式：一种是在函数被调用时再处理函数，在第一次调用的过程中，该函数会被覆盖为另一个按合适方法执行的函数。另一种是声明函数时就指定适当的函数，这样在调用函数时不会损失性能，而在首次调用加载时会损失一点性能，都是为了避免执行不必要的代码。

第一种：

```js
function createXHR () {
  if (typeof XMLHttpRequest != "undefined") {
    createXHR = function () {
      return new XMLHttpRequest();
    }
  } else if (typeof ActiveXObject != "undefined") {
    createXHR = function () {
      if (typeof arguments.callee.activeXString != "string") {
        var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
        i,len;
        for (i=0,len=versions.length; i < len; i++) {
          try {
            new ActiveXObject(versions[i]);
            arguments.callee.activeXString = versions[i];
            break;
          } catch (ex){
            //跳过
          }
        }
      }
      return new ActiveXObject(arguments.callee.activeXString);
    }
  } else {
    createXHR = function () {
    throw new Error("No XHR object available.");
    }
  }
}
```

第二种：

```js
var createXHR = (function () {
  if (typeof XMLHttpRequest != "undefined") {
    return new XMLHttpRequest();
  } else if (typeof ActiveXObject != "undefined") {
    return function () {
      if (typeof arguments.callee.activeXString != "string") {
        var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
        i,len;
        for (i=0,len=versions.length; i < len; i++) {
          try {
            new ActiveXObject(versions[i]);
            arguments.callee.activeXString = versions[i];
            break;
          } catch (ex){
            //跳过
          }
        }
      }
      return new ActiveXObject(arguments.callee.activeXString);
    }
  } else {
    return function () {
      throw new Error("No XHR object available.");
    }
  }
})()
```

## 函数柯里化

柯里化，可以理解为提前接收部分参数，延迟执行，不立即输出结果，而是返回一个接受剩余参数的函数。因为这样的特性，也被称为部分计算函数。柯里化，是一个逐步接收参数的过程。

multi(2)(3)(4)=24？

简单实现

```js
function multi(a) {
    return function(b) {
        return function(c) {
            return a * b * c;
        }
    }
}
```

>利用闭包的原则，multi 函数执行的时候，返回 multi 函数中的内部函数，再次执行的时候其实执行的是这个内部函数，这个内部函数中接着又嵌套了一个内部函数，用于计算最终结果并返回

缺陷:

* 代码不够优雅，实现步骤需要一层一层的嵌套函数
* 可扩展性差，假如是要实现 multi(2)(3)(4)...(n) 这样的功能，那就得嵌套 n 层函数.

优化后

```js
function curry(fn, args) {
    var length = fn.length;
    var args = args || [];
    return function() {
        newArgs = args.concat(Array.prototype.slice.call(arguments));
        if(newArgs.length < length) {
            return curry.call(this,fn,newArgs);
        } else {
            return fn.apply(this,newArgs);
        }
    }
}
function multiFn(a, b, c) {
    return a * b * c;
}
var multi = curry(multiFn);
multi(2)(3)(4);
multi(2,3,4);
multi(2)(3,4);
multi(2,3)(4);
```

题目而言，是需要执行三次函数调用，那么针对柯里化后的函数，如果传入的参数没有 3 个的话，就继续执行 curry 函数接收参数，如果参数达到 3 个，就执行柯里化了的函数。

缺陷：
必须事先知道求值的参数个数，那能不能让代码更灵活点，达到随意传参的效果。

## 反函数柯里化

是一个泛型化的过程。它使得被反柯里化的函数，可以接收更多参数。目的是创建一个更普适性的函数，可以被不同的对象使用。

```js
function unCurrying(fn){
    return function(){
        var args = [].slice.call(arguments);
        var that = args.shift();
        return fn.apply(that, args);
    }
}
function Toast(option){
  this.prompt = '';
}
Toast.prototype = {
  constructor: Toast,
  show: function(){
    console.log(this.prompt);
  }
};
var obj = {
    prompt: '新对象'
};
var objShow = unCurrying(Toast.prototype.show);
objShow(obj); // 输出"新对象"
```

## 防篡改对象

对象属性的属性描述符有两种主要形式：`数据描述符`和`存取描述符`。数据描述符是一个具有值的属性，该值可能是可写的，也可能是不可写的。存取描述符是由 getter ，setter 函数对描述的属性。

`configurable`
当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。 表示能否通过delete删除属性从而重新定义属性，能否修改属性特性，能否把属性修改为访问器属性

```js
var a = {name: "aaa"};
Object.defineProperty(a, "name", {
  configurable: false
});
delete a.name;
Object.defineProperty(a, "name", { // throw error
  configurable: true
});
Object.defineProperty(a, "name", { // throw error
  enumerable: false
});
a.name = "bbb";
console.log(a.name);
Object.defineProperty(a, "name", {
  writable: false
});
a.name = "aaa";
console.log(a.name);
Object.defineProperty(person, "name", { // throw error
  writable: true
})
```

总结configurable为false时：

1. 不可以通过delete去删除该属性从而重新定义属性。
2. 不可以转换为访问器属性。
3. configurable和enumerable不可被修改
4. writable可以被单向修改为false，不可以由false修改为true。
5. value是否可以修改根据writable而定。

`enumerable`
当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中。

```js
var a = {};
Object.defineProperty(a, "a", {value: 1, enumerable: true});
Object.defineProperty(a, "b", {value: 2, enumerable: false});
for (var i in a) {
  console.log(i)
}
```

`writable`
当且仅当该属性的 writable 为 true 时，value 才能够被赋值运算。

```js
var a = {};
Object.defineProperty(a, "name", {
  value: "aaa"
});
console.log(a.name);
a.name = 'bbb';
console.log(a.name);
Object.defineProperty(a, "name", {
  writable: true
});
a.name = "bbb";
console.log(a.name);
```

`value`
该属性对应的值。可以是任何有效的JavaScript值。

`get`
一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入 this 对象。

`set`
一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法接受唯一参数，即该属性新的参数值。

```js
var a = {a: 0};
Object.defineProperty(a, "b", {
  get: () => {
    return this.a.a + 1;
  },
  set: (value) => {
    this.a.a = value;
  }
});
console.log(a.b);
a.a += 1;
console.log(a.b);
```

|| configurable  | enumerable  | value  | writable  | get  | set  |
|  ----  | ----  | ----  | ----  | ----  | ----  | ----  |
| 数据描述符  | Yes | Yes | Yes | Yes | No | No |
| 存取描述符  | Yes | Yes | No | No | Yes | Yes |

> 如果一个描述符不具有value，writable，get和set任意一个关键字，那么它将被认为是一个数据描述符。如果一个描述符同时有（value或writable）和（get或set）关键字，将会产生一个异常。

如果通过对象字面量方式或者构造函数创建对象，其布尔值特性默认值都是true，通过Object.defineProperty创建的属性，其布尔特性值都是false。

```js
var a = {name: 'aaa'}
var b = {};
Object.defineProperty(b, 'name', {value: 'bbb'});
console.log(Object.getOwnPropertyDescriptor(a, 'name'));
console.log(Object.getOwnPropertyDescriptor(b, 'name'));
```

### 不可扩展对象

默认情况下，所有对象都是可以扩展的。也就是说，任何时候都可以向对象中添加属性和方法。使用 `Object.preventExtensions()` 方法可以改变这个行为，不能再给对象添加属性和方法。使用`Object.isExtensible()`可以确定对象是否可以扩展。

```js
var a = {name: 'aaa'}
var b = {}
Object.preventExtensions(a);
a.b = 'bbb';
console.log(a.b);
console.log(Object.isExtensible(a));
console.log(Object.isExtensible(b));
console.log(Object.getOwnPropertyDescriptor(a))
```

### 密封对象

密封对象不可扩展，而且已有成员