# different method for is node or browser

Goal: Run different actions if in node or in browser

1. Dynamic solution: The code includes a if/else statement
2. Static solution: A part of the code excuted is different

## solution 1: run the very same code in node and in the browser

```bash
node src/solution1.js # run in node
chrome bundle/solution1.html # run in browser
```

## solution 2: replace the specific code for node with another specific code for the browser

This is achieved via a file replacement while creating the bundle for the browser

```javascript
// package.json
{
  "browser": { "./node.js": "./browser.js" }
}
```

### browserify

```bash
browserify src/solution2.js -o bundle/solution2-browserify.js
chrome bundle/solution2.html
```

### webpack

Webpack needs a configuration file.

```javascript
// webpack.config.js
const webpack = require('webpack')
module.exports = {
  entry: { main: './src/solution2.js' },
  output: { filename: './bundle/solution2-webpack-[name].js' },
  plugins: [ new webpack.optimize.CommonsChunkPlugin({ name: 'modules' }) ] // Save the webpack extra code in a separate file
}
```

```bash
webpack
chrome bundle/solution2.html
```

Webpack generates few more code than browerify.
Webpack is also much more configurable and flexible. See the other tuto 'zero-to-webpack'.

Note: 'webpack -p' builds and uglifies the code for the browser in ES5 and thus requires babel to transform the ES5+ code.

## solution 3: test the very same code with different environment inputs for node or the browser

Test your code with jest and tell jest if the environment is node or browser.

## solution 4: mock the specific part for the testing in node or in browser environment

Before testing your code with jest, mock (replace) files or functions with another implementation.
