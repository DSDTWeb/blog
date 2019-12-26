/******/ (function(modules) { // webpack启动函数
/******/ 	// 加载chunk成功的回调函数
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// 将本次加载回来的 chunk 标记为加载完成状态，并执行回调
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]); // 将chunk成功回调添加到要执行的队列中
/******/ 			}
/******/ 			installedChunks[chunkId] = 0; // 将chunk标记为加载完成
/******/ 		}
/******/    // 将本次加载回来的 module 添加到全局的 modules 对象
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/    }
/******/    // 判断 webpackJsonp 数组原始的push方法是否存在，存在则将数据追加到webpackJsonp中
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/    // 执行所有 chunk 回调
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// 这是 module 缓存器
/******/ 	var installedModules = {};
/******/
/******/ 	// chunk加载状态记录器对象
/******/ 	// 值为 undefined 标识chunk未加载, null = chunk 预加载中
/******/ 	// Promise = chunk 加载中, 0 = chunk 加载完成
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// 获取js脚本完整路径
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({}[chunkId]||chunkId) + ".js"
/******/ 	}
/******/
/******/ 	// 加载模块的方法，即require方法
/******/ 	function __webpack_require__(moduleId) { // import a frome './a.js'  ./src/a.js
/******/
/******/ 		// 检查当前的module是否已经存在缓存中
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// 创建一个新的 module， 并添加到缓存中
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// 执行当前 module 的方法
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// 标记 module 加载完成状态
/******/ 		module.l = true;
/******/
/******/ 		// 返回 module 暴露的 exports 对象
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// chunk 加载函数，注意只能加载当前入口的chunk文件
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP方法加载chunk
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 表示已经加载完成
/******/
/******/ 			// 如果是一个Promise则表示加载中
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// 创建一个回调的Promise，并将Promise缓存到installedChunks中
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// 创建一个error以便在加载错误或者超时时提示
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) { // 加载完成回调
/******/ 					// 避免IE内存泄漏。
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout); // 关闭超时定时器
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) { // 未加载完成
/******/ 						if(chunk) { // 加载中
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type); // 错误类型
/******/ 							var realSrc = event && event.target && event.target.src; // 加载的地址
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')'; // 错误信息
/******/ 							error.name = 'ChunkLoadError'; // 错误名称
/******/ 							error.type = errorType; // 错误类型
/******/ 							error.request = realSrc; // 请求路径
/******/ 							chunk[1](error); // 执行 reject 回调
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined; // 将当前chunk标记为未加载状态
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){ // 设置超时定时器
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete; // 设置加载完成回调
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// 导出当前 modules 对象
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// 导出当前已经缓存的 module
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// 为 exports 定义 getter 函数 （如：实现const定义的常量）
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// 定义 exports 对象的 __esModule 属性标识（module每次执行的时候都会执行一次）
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// 判断对象是否存在某属性
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// webpack配置上的 publicPath 配置； __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// 运行时未知异常程序处理
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || []; // 定义全局的webpackJsonp = [[[chunkId], {moduleId: function (module, __webpack_exports__, __webpack_require__) {}}]]
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray); // 缓存webpackJsonp的push方法（下面将会改造掉push方法）
/******/ 	jsonpArray.push = webpackJsonpCallback; // 将webpackJsonp的push方法改造城加载完成回调方法
/******/ 	jsonpArray = jsonpArray.slice(); // 将已经加载到webpackJsonp的chunk执行回调（但要避免重复push回webpackJsonp中）
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// 加载入口模块并导出
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/a.js":
/*!******************!*\
  !*** ./src/a.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function () {
  console.log('a');
});

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        // import a from './a.js'
        /* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a */ "./src/a.js");
         // 同步加载 这种方式必须把import放在module前面

        let mode = {
          a: _a__WEBPACK_IMPORTED_MODULE_0__["default"],
          // import 加载方式
          b: __webpack_require__(/*! ./b.js */ "./src/b.js"),
          // require 加载方式
          c: __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./c.js */ "./src/c.js")) // 动态加载（返回Promise对象） 这种方式可以吧import放在任意地方

        };
        console.info(mode);
        mode.a();
        mode.b.default();
        mode.c.then(c => c.default());

/***/ }),

/***/ "./src/b.js":
/*!******************!*\
  !*** ./src/b.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function () {
  console.log('b');
});

/***/ }),

/***/ 0:
/*!**************************!*\
  !*** multi ./src/app.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/app.js */"./src/app.js");


/***/ })

/******/ });
//# sourceMappingURL=app.js.map