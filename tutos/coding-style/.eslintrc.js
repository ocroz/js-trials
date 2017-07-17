// This file takes precedence over package.json
module.exports = {
  extends: 'standard'
  // extends: 'semistandard'
  // extends: 'eslint:recommended',
  // extends: 'eslint-config-es5' // or use the below parserOptions with ecmaVersion = ES5
  // parserOptions: { 'ecmaVersion': 5 } // which is default with eslint:recommended
}

// eslint:recommended extended to ES2017
// module.exports = {
//   extends: 'eslint:recommended',
//   env: { node: true, es6: true },
//   parserOptions: { 'ecmaVersion': 2017 },
//   rules: { 'no-console': 'off' }
// }

// Taken from // https://survivejs.com/webpack/developing/linting/
// module.exports = {
//   env: {
//     browser: true,
//     commonjs: true,
//     es6: true,
//     node: true
//   },
//   extends: 'eslint:recommended',
//   parserOptions: {
//     sourceType: 'module'
//   },
//   rules: {
//     'comma-dangle': ['error', 'always-multiline'],
//     indent: ['error', 2],
//     'linebreak-style': ['error', 'unix'],
//     quotes: ['error', 'single'],
//     semi: ['error', 'always'],
//     'no-unused-vars': ['warn'],
//     'no-console': 0
//   }
// }
