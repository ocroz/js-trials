webpackJsonp([0], [
/* 0 */
  /***/ function (module, exports, __webpack_require__) {
    'use strict'

    const { testIsNode } = __webpack_require__(1)

    testIsNode()
  /***/ },
/* 1 */
  /***/ function (module, exports, __webpack_require__) {
    'use strict'

    const { isNode, isBrowser } = __webpack_require__(2)

    function testIsNode () {
      if (isBrowser()) {
        console.log('Running under browser')
      } else if (isNode()) {
        console.log('Running under node.js')
      } else {
        throw new Error('Unknown running context')
      }
    }

    module.exports = { testIsNode }
  /***/ },
/* 2 */
  /***/ function (module, exports, __webpack_require__) {
    'use strict'

    function isNode () { return false }
    function isBrowser () { return true }

    module.exports = { isNode, isBrowser }
  /***/ }
], [0])
