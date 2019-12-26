/******/ (function(modules) { // webpack启动函数
/******/ 	// 这是 module 缓存器
/******/ 	var installedModules = {};
/******/
/******/ 	// chunks加载状态记录器
/******/ 	// key为chunks名称，值为 0 表示已加载
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	// 这是 require 函数（同步加载方法）
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// 检查 module 是否在缓存器中
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// 创建一个新的module, 并把他添加到缓存器中
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId, // 模块ID
/******/ 			l: false, // 加载状态
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// 执行module函数
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// 标记加载状态
/******/ 		module.l = true;
/******/
/******/ 		// 返回模块导出的内容
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// chunk 加载函数
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// 使用JavaScript的require()方法加载
/******/
/******/ 		// 在chunks记录器里面如果状态为 0 则表示已经加载过不需要加载
/******/ 		if(installedChunks[chunkId] !== 0) {
/******/ 			var chunk = require("./" + ({}[chunkId]||chunkId) + ".js");
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids;
/******/ 			for(var moduleId in moreModules) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 0;
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
/******/ 	// 为 exports 定义 getter 函数
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
/******/ 	__webpack_require__.oe = function(err) {
/******/ 		process.nextTick(function() {
/******/ 			throw err; // catch this error by using import().catch()
/******/ 		});
/******/ 	};
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
/* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a */ "./src/a.js");
 // 同步加载 这种方式必须把import放在module前面

let mode = {
  a: _a__WEBPACK_IMPORTED_MODULE_0__["default"], // import 加载方式
  b: __webpack_require__(/*! ./b.js */ "./src/b.js"), // require 加载方式
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