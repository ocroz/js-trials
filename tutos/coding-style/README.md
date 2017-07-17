# Keep compliant with your favorite coding style

## Coding styles

Code [linting](http://en.wikipedia.org/wiki/Lint_(software)) is a type of static analysis that is frequently used to find problematic patterns or code that doesn’t adhere to certain style guidelines.

See [A Comparison of JavaScript Linting Tools](https://www.sitepoint.com/comparison-javascript-linting-tools/):

* The linter that started it it all for JavaScript is Douglas Crockford's JSLint. It is opinionated like the man himself.
* The next step in evolution was JSHint. It took the opinionated edge out of JSLint and allowed for more customization.
* [ESLint](http://eslint.org/) is the newest tool in vogue. It has learned from its predecessors and takes linting to the next level.

## ESLint rules

No [rules](http://eslint.org/docs/rules/) are enabled by default.
ESLint requires a configuration to know which rules to apply.

ESLint analyses the javascript code and reports a warning or an error on every non-compliance with the defined rules.

The rules are usually defined in a [configuration file](http://eslint.org/docs/user-guide/configuring#using-configuration-files).

Example: This rule [requires semicolons at the end of statements](http://eslint.org/docs/rules/semi). ESLint raises an error if not.

```javascript
// myconfig.json
{
  "rules": {
    "semi": "always"
  }
}
```

## Install and run eslint on the cli

First install eslint via npm.
Then run eslint to analyse the javascript code.
ESLint is even able to fix many rules automatically thanks to the option `--fix`.

```bash
npm install eslint-cli --global # install eslint-cli globally
npm install eslint --save-dev # > install eslint locally
eslint -c myconfig.json myfiletotest.js # eslint-cli uses the local eslint
eslint -c myconfig.json myfiletotest.js --fix # eslint updates the file with autofixes
```

## ESLint predefined rules

The easier way to use ESLint is to use a set of already predefined rules.

```javascript
// .eslintrc
{
  "extends": "eslint:recommended"
}
```

### Javascript coding styles powered by ESLint

* [eslint:recommended](http://eslint.org/docs/rules/) (see [code](https://github.com/eslint/eslint/blob/master/conf/eslint-recommended.js)) - enables rules that report common problems - defaults to ES5
* [standard](https://standardjs.com/) - One JavaScript Style to Rule Them All
* [semistandard](https://www.npmjs.com/package/semistandard) - standard, with semicolons (if you must)
* [eslint-config-es5](https://www.npmjs.com/package/eslint-config-es5) - ES5 ESLint config that following [Airbnb ES5 Style Guide](https://blog.javascripting.com/2015/09/07/fine-tuning-airbnbs-eslint-config/).

### standard

This module saves you (and others!) time in three ways:

* **No configuration.** The easiest way to enforce consistent style in your project. Just drop it in.
* **Automatically format code.** Just run standard `--fix` and say goodbye to messy or inconsistent code.
* **Catch style issues & programmer errors early.** Save precious code review time by eliminating back-and-forth between reviewer & contributor.

No decisions to make. No `.eslintrc`, `.jshintrc`, or `.jscsrc` files to manage. It just works.

```bash
npm install --global standard # install it globally
standard [--fix] src/* # no need any configuration
```

## ESLint and webpack

```javascript
// .eslintrc.js
module.exports = {
  extends: 'standard'
  // extends: 'semistandard'
  // extends: 'eslint:recommended'
}
```

```javascript
// webpack.config.js
const path = require('path')
module.exports = {
  entry: { main: './src/coding-style-errors.js' },
  output: { filename: './dist/bundle.js' },
  module: {
    rules: [{
      test: /\.js$/,
      include: [ path.resolve(__dirname, './src') ],
      loader: 'eslint-loader', // eslint uses the above configuration file
      exclude: /node_modules/,
      enforce: 'pre', // run eslint before any other webpack actions
      options: { fix: false } // don't autofix the javascript code
    }]
  }
}
```

```javascript
// package.json
  "scripts": {
    "build": "webpack",
    "test": "standard ./src/*"
  }
```

### install from scratch

```bash
npm init -y # this creates package.json: keep only name, version, description, license, and add "repository":{"type":"git"}
npm install # this creates package-lock.json, then add the above scripts in package.json

npm install webpack # install it locally

npm install eslint-loader --save-dev # install it locally too
npm install standard --save-dev # install locally either standard or any other coding style package

standard ./src/{file} # same as $(npm root)/.bin/eslint ./src/{file} excepted that it does not need any configuration

npm test # note: standard --fix {file} updates the file with autofixes
npm run build # run eslint on all the files concerned by the output bundle
```

### See also

* [Linting in Webpack](https://idirver.gitbooks.io/survivejs-webpack-and-react/content/manuscript/09_linting_in_webpack.html)
