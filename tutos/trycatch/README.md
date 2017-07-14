# Always trycatch your main function

```javascript
// ./src/main.js
const { trycatch } = require('./lib/trycatch')

async function main() {
  // Whatever error is now catched
}

trycatch(main)
```

### Create your package.json

npm init -y

* Keep only name, version, description, license
* Add "repository": { "type": "git" }

From now 'npm ls -depth 0' no longer raise errors

### Install packages for tests

npm install --save-dev chai jest sinon sinon-chai

### Add few scripts

```javascript
  "scripts": {
    "test": "jest",
    "dev:test": "npm test -- --watch"
  },
```

### Run them

npm run test # One time test

npm run dev:test # The test restarts automatically every time a source file is saved

## Post scriptum

One will say to try catch all of your code will decrease the overal performance of your script because javascript cannot optimise the code that is within a try.
Well, if performance is not your main battle, you may accept such a non optimised code.
With a global try catch, you could gain in term of visibility rather than catching every individual error.

```javascript
async function main() {
  const file = './output.log'
  const writer = await openFile(file) // No need to catch individual error here
  const bytesWritten = await writeFile(writer, 'whatever')
  console.log('bytesWritten =', bytesWritten)
  await closeFile(writer) // This code is not executed if an error occured in previous async functions
}
```
