webpackJsonp([1],{

/***/ 237:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__reducers__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions__ = __webpack_require__(36);





let store = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["createStore"])(__WEBPACK_IMPORTED_MODULE_1__reducers__["default"])

// Log the initial state
console.log(store.getState())

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// Dispatch some actions
store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__actions__["addTodo"])('Learn about actions'))
store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__actions__["addTodo"])('Learn about reducers'))
store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__actions__["addTodo"])('Learn about store'))
store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__actions__["toggleTodo"])(0))
store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__actions__["toggleTodo"])(1))
store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__actions__["setVisibilityFilter"])(__WEBPACK_IMPORTED_MODULE_2__actions__["VisibilityFilters"].SHOW_COMPLETED))

// Stop listening to state updates
unsubscribe()


/***/ })

},[237]);