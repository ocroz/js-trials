# Debug both your app and server in Chrome

See [Debugging Node.js Apps](https://nodejs.org/en/docs/inspector/)

The principle is to start the server with `--inspect`.

```bash
node --inspect src/boot.js
```

Then to attach a debugger to the server.

## Example with the Chrome DevTools - inspector

### Get the application

```bash
git clone https://github.com/deliciousinsights/wazaaa
cd wazaa
git checkout finish # or etape-11 to get rid of authentication
npm install
```

### Prepare the mongo database

[On Windows]

* [download](https://www.mongodb.org/downloads) and install mongodb into your `C:\mongodb\`.

[From bash on `Windows Command Processor` or on `Hyper.JS` (don't use bash on ~~`MinGW`~~)]

* start the mongo deamon

```bash
mkdir -p /c/data/db
/c/mongodb/bin/mongod.exe [--dbpath /c/data/db] [--storageEngine mmapv1]
```

* prepare the database

```bash
cd wazaa # where you have cloned wazaa
/c/mongodb/bin/mongo.exe wazaaa mongo-scripts/*
```

### Run the application with development options

```bash
npm run dev:debug  # nodemon --inspect src/boot.js
npm run dev:client # webpack --progress --watch
npm run dev:test   # cross-env NODE_ENV=test jest --watch
```

Now whenever you change a file:

1. The server restarts automatically thanks to `nodemon` instead of `node`.
2. The client is rebundled automatically thanks to `--watch`.
3. The tests restart automatically thanks to `--watch` too.

### Debug both your client and server

- Client: Open [http://localhost:3000] > Press F12, view source, add breakpoints, etc.
- Server: Open `chrome://inspect` in another Chrome tab > Inspect > view source*, add breakpoints, etc.

*Deploy your sources under `(no domain)` > this shows the transpiled code files which you can debug ie add breakpoints, etc.
Adding a folder to the workspace pointing to same local directory path as under `(no domain)` shows the original code files not transpiled which you cannot debug.
