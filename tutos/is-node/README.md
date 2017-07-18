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

Webpack needs a configuration file too.

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

Note: `webpack -p` builds and uglifies the code for the browser in ES5 and thus requires `babel` to transform the ES5+ code.

## solution 3: test the very same code with different environment inputs for node or the browser

Test your code with jest and tell jest if the environment is node or browser.

```bash
jest solution3-node.test.js --env=node
jest solution3-browser.test.js --env=jsdom
```

jest mimics the browser environment with `--env=jsdom` which means the browser global `window` is available. However the node `global` is still available too.

## solution 4: mock the specific part for the testing in node or in browser environment

Before testing your code with jest, mock (replace) files or functions with another implementation.

```bash
jest solution4-node.test.js
jest solution4-browser.test.js
```

`solution4-node.test.js` calls and uses `src/lib/index.js`.<br>
`solution4-browser.test.js` calls src/lib/index.js and **mocks** it to use `src/lib/__mocks__/index.js` instead.

## solution 5: test in a true browser environment

Thanks to a high-level browser automation library such as `PhantomJS` or `NightmareJS`.

[Nightmare](https://www.npmjs.com/package/nightmare) uses [Electron](https://electron.atom.io/), which is similar to [PhantomJS](http://phantomjs.org/) but roughly [2 times faster](https://github.com/segmentio/nightmare/issues/484#issuecomment-184519591) and more modern:

* Every method is a simple English command: goto, refresh, click, type... you can check out [Nightmare's full API here](https://github.com/segmentio/nightmare#api).
* It [lets you simplify deeply nested callbacks into a few sequential statements](http://www.nightmarejs.org/).

```bash
jest solution5-browser.test.js
```

As opposed to let jest mimic the browser environment with `--env=jsdom`, nightmare is a pure browser environment so `window` is available and `global` is not (which is correct).

Some nightmare examples:

```javascript
// cnn.js
const Nightmare = require('nightmare')
const nightmare = Nightmare()
nightmare
  .goto('http://cnn.com')
  .evaluate(() => { return document.title })
  .end()
  .then((title) => {
    console.log(title)
    done()
  })
```

```javascript
// cnn.test.js
/* global describe it */
const Nightmare = require('nightmare')
describe('test cnn title', () => {
  it('title should be "CNN ..."', (done) => {
    Nightmare()
      .goto('http://cnn.com')
      .evaluate(() => { return document.title })
      .end()
      .then((title) => {
        expect(title).to.equal('CNN - Breaking News, U.S., World, Weather, Entertainment & Video News')
        done()
      })
  })
})
```

See also [Acceptance Testing React Apps with Jest and Nightmare](https://www.viget.com/articles/acceptance-testing-react-apps-with-jest-and-nightmare).
