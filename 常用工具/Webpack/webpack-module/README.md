### webpack是如何实现模块化加载？

&emsp;&emsp;webpack支持的模块规范有 [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) 、[CommonJS](http://www.commonjs.org/specs/modules/1.0/)、[ES2015 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 等规范。不管何种规范大致可以分为`同步加载`和`异步加载`两种情况。本文将介绍webpack是如何实现模块管理和加载。

同步加载如下：
```
import a from './a';
console.log(a);
```
异步加载如下：
```
import('./a').then(a => console.log(a));
```

webpacks实现的启动函数，直接将入口程序`module`传入启动函数内，并缓存在闭包内，如下：
```
(function(modules){
    ......
    // 加载入口模块并导出（实现启动程序）
    return __webpack_require__(__webpack_require__.s = 0);
})({
    0: (function(module, __webpack_exports__, __webpack_require__) {
        module.exports = __webpack_require__(/*! ./src/app.js */"./src/app.js");
    })
})
```
webpack在实现模块管理上不管服务端还是客户端大致是一样，主要由`installedChunks`记录已经加载的`chunk`，`installedModules`记录已经执行过的模块，具体如下：
```
/**
 * module 缓存器
 * key 为 moduleId (一般为文件路径)
 * value 为 module 对象 {i: moduleId, l: false, exports: {}}
 */
var installedModules = {};
/**
 * chunks加载状态记录器
 * key 一般为 chunk 索引
 * value undefined:未加载 0:已经加载 (客户端特有 null: 准备加载 [resolve, reject]: 加载中)
 */
var installedChunks = {
    "app": 0
}
```
不管是服务端还是客户端同步加载的方法都一样，主要是检测`installedModules`中是否已经缓存有要加载的`module`，有则直接返回，否则就创建一个新的`module`，并执行返回`module.exports`，具体实现如下：
```
// 编译后的同步加载
__webpack_require__(/*! ./src/app.js */"./src/app.js");

// 加载模块的方法，即require方法
function __webpack_require__(moduleId) {
    // 检查当前的module是否已经存在缓存中
    if(installedModules[moduleId]) {
        return installedModules[moduleId].exports; // 直接返回已缓存的 module.exports
    }
    // 创建一个新的 module， 并添加到缓存中
    var module = installedModules[moduleId] = {
        i: moduleId,
        l: false, // 是否已经加载
        exports: {} // 暴露的对象
    };
    // 执行当前 module 的方法
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // 标记 module 加载完成状态
    module.l = true;
    // 返回 module 暴露的 exports 对象
    return module.exports;
}
```
服务端的异步加载是通过node的`require`方法加载`chunk`并返回一个`promises`对象。所有`chunk`都是暴露出`ids`和`modules`对象，具体实现如下：
```
// 编译后的异步加载方法
__webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./c.js */ "./src/c.js"))

// chunk 0 代码如下（即0.js的代码）
exports.ids = [0];
exports.modules = {
    "./src/c.js": (function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        __webpack_exports__["default"] = (function () {
            console.log('c');
        })
    })
}

// 异步加载模块方法
__webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];
    if(installedChunks[chunkId] !== 0) {
        var chunk = require("./" + ({}[chunkId]||chunkId) + ".js");
        var moreModules = chunk.modules, chunkIds = chunk.ids;
        for(var moduleId in moreModules) {
            modules[moduleId] = moreModules[moduleId];
        }
        for(var i = 0; i < chunkIds.length; i++)
            installedChunks[chunkIds[i]] = 0;
    }
    return Promise.all(promises);
}
```
客户端的异步加载是通过`JSONP`原理进行加载资源，将`chunk`内容（`[chunkIds, modules]`）存到全局的`webpackJsonp`数组中，并改造`webpackJsonp`的`push`方法实现监听`chunk`加载完成事件。具体实现如下：
```
// 编译后的异步加载方法
__webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./c.js */ "./src/c.js"))

// chunk 0 代码如下（即0.js的代码）
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{
    "./src/c.js": (function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        __webpack_exports__["default"] = (function () {
            console.log('c');
        });
    })
}]);

// 加载成功的回调函数
function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1];
    
    // 将本次加载回来的 chunk 标记为加载完成状态，并执行回调
    var moduleId, chunkId, i = 0, resolves = [];
    for(;i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
            resolves.push(installedChunks[chunkId][0]); // 将chunk成功回调添加到要执行的队列中
        }
        installedChunks[chunkId] = 0; // 将chunk标记为加载完成
    }
    // 将本次加载回来的 module 添加到全局的 modules 对象
    for(moduleId in moreModules) {
        if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
            modules[moduleId] = moreModules[moduleId];
        }
    }
    // 判断 webpackJsonp 数组原始的push方法是否存在，存在则将数据追加到webpackJsonp中
    if(parentJsonpFunction) parentJsonpFunction(data);
    // 执行所有 chunk 回调
    while(resolves.length) {
        resolves.shift()();
    }
};

// 加载完成监听方法的实现
var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
jsonpArray.push = webpackJsonpCallback;
jsonpArray = jsonpArray.slice();
for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
var parentJsonpFunction = oldJsonpFunction;

// 异步加载模块方法
__webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];
    var installedChunkData = installedChunks[chunkId];
    if(installedChunkData !== 0) { // 0 时表示已经安装完成
        if(installedChunkData) { // 加载中
            promises.push(installedChunkData[2]);
        } else {
            // 创建一个回调的Promise，并将Promise缓存到installedChunks中
            var promise = new Promise(function(resolve, reject) {
                installedChunkData = installedChunks[chunkId] = [resolve, reject];
            });
            promises.push(installedChunkData[2] = promise);
            
            var script = document.createElement('script');
            var onScriptComplete;
            script.charset = 'utf-8';
            script.timeout = 120;
            if (__webpack_require__.nc) {
                script.setAttribute("nonce", __webpack_require__.nc);
            }
            script.src = jsonpScriptSrc(chunkId);
            
            var error = new Error();
            onScriptComplete = function (event) { // 加载完成回调
                // 避免IE内存泄漏。
                script.onerror = script.onload = null;
                clearTimeout(timeout); // 关闭超时定时器
                var chunk = installedChunks[chunkId];
                if(chunk !== 0) { // 未加载完成
                    if(chunk) { // 加载中
                        var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                        var realSrc = event && event.target && event.target.src;
                        error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                        error.name = 'ChunkLoadError';
                        error.type = errorType;
                        error.request = realSrc;
                        chunk[1](error);
                    }
                    installedChunks[chunkId] = undefined;
                }
            };
            var timeout = setTimeout(function(){ // 设置超时定时器
                onScriptComplete({ type: 'timeout', target: script });
            }, 120000);
            script.onerror = script.onload = onScriptComplete; // 设置加载完成回调
            document.head.appendChild(script);
        }
    }
    return Promise.all(promises);
};
```

更多可以查看编译后的代码 [客户端](https://github.com/ztMin/notes/blob/master/webpack/webpack-module/dist/client/app.js)、[服务端](https://github.com/ztMin/notes/blob/master/webpack/webpack-module/dist/server/app.js)
