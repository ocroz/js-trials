(function (modules) {
  var installedModules = {}
  function __webpack_require__ (moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    }
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
    module.l = true
    return module.exports
  }
  __webpack_require__.m = modules
  __webpack_require__.c = installedModules
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, {
        configurable: false,
        enumerable: true,
        get: getter
      })
    }
  }
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ? function getDefault () {
      return module['default']
    } : function getModuleExports () {
      return module
    }
    __webpack_require__.d(getter, 'a', getter)
    return getter
  }
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  }
  __webpack_require__.p = ''
  return __webpack_require__(__webpack_require__.s = 0)
})([ function (module, exports, __webpack_require__) {
  'use strict'
  var _require = __webpack_require__(1), testIsNode = _require.testIsNode
  testIsNode()
}, function (module, exports, __webpack_require__) {
  'use strict'
  var _require = __webpack_require__(2), isNode = _require.isNode, isBrowser = _require.isBrowser
  function testIsNode () {
    if (isBrowser()) {
      console.log('Running under browser')
    } else if (isNode()) {
      console.log('Running under node.js')
    } else {
      throw new Error('Unknown running context')
    }
  }
  module.exports = {
    testIsNode: testIsNode
  }
}, function (module, exports, __webpack_require__) {
  'use strict'
  function isNode () {
    return false
  }
  function isBrowser () {
    return true
  }
  module.exports = {
    isNode: isNode,
    isBrowser: isBrowser
  }
} ])
