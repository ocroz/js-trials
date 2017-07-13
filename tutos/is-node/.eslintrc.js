// https://idirver.gitbooks.io/survivejs-webpack-and-react/content/manuscript/09_linting_in_webpack.html
// 1. The linter that started it it all for JavaScript is Douglas Crockford's JSLint. It is opinionated like the man himself.
// 2. The next step in evolution was JSHint. It took the opinionated edge out of JSLint and allowed for more customization.
// 3. ESLint is the newest tool in vogue. It has learned from its predecessors and takes linting to the next level.
// See also https://www.sitepoint.com/comparison-javascript-linting-tools/

module.exports = {
  extends: 'standard'
  // extends: 'semistandard'
  // extends: 'eslint:recommended'
  // extends: 'eslint-config-es5'
}

// https://survivejs.com/webpack/developing/linting/
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
