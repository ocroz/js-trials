/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// standard errors
__webpack_require__(1)

// breakline errors
__webpack_require__(2)

/* http://benalman.com/news/2013/01/advice-javascript-semicolon-haters/ */

// No multiple statements in declaration
const b = 1, c = 2, d = 3, e = 4

// No parenthesis at beginning of line
try {
  const a = b + c
  (d + e).print()            // TypeError: c is not a function

  console.log(a)
} catch (err) {
  console.log(err.message)
}

var obj = {
  prop: 'success',
  undefined: [{prop: 'fail'}]
}

var logProp = function (obj) {
  console.log(obj.prop)
}

logProp(obj)                 // 'success'
logProp(obj['undefined'][0]) // 'fail'

// No bracket at beginning of line
var a = obj
[a].forEach(logProp)         // 'fail'


/***/ }),
/* 1 */
/***/ (function(module, exports) {

//missing space after //

// extra comma and semicolon
const obj = {
  isObj: true,
  hasProps: true,
};
console.log(obj);

// missing space after comma and double quotes
console.log(obj,'Hello,', "World!")

// extra blank lines


// extra breaklines and spaces
try
{
   console.log('Hello!')
}
catch (error)
{
    console.log(err.message)
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// No breakline after return
function bad1 () {
  return
  2
}

function bad2 () {
  let i = 1
  return
  (i = 2)
}

console.log(bad1(), bad2())   // undefined undefined


/***/ })
/******/ ]);