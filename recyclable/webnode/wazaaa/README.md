# Node.JS wazaaa application by delicious-insights

This is the wazaaa application that serves as a guideline for the training [Node.js](https://delicious-insights.com/en/trainings/node-js/) by [Delicious Insights](https://delicious-insights.com/en/).

## Debug both your app and server in Chrome

The principle is to start the server with `--inspect`.

```bash
node --inspect src/boot.js
```

Then to attach a debugger to the server.

### Example with the Chrome DevTools - inspector

See [Debugging Node.js Apps](https://nodejs.org/en/docs/inspector/)

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
cd wazaaa # where you have cloned wazaaa
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

## Manage the server with pm2

[pm2](http://pm2.keymetrics.io/) is an advanced, production process manager for Node.js

Install pm2 globally

```bash
npm install pm2 -g
```

Start/Stop the serverAuto restart apps on file change

* Activate the cluster mode to spread the app across all CPUs without any code modifications with `-i 0`.
* Auto restart apps on file change with `--watch`.

```bash
cd wazaaa # where you have cloned wazaaa
pm2 start src/boot.js [-i 0] [--watch]
pm2 stop src/boot.js         # or 'pm2 restart' to run them both
pm2 delete src/boot.js       # or it keeps listed in 'pm2 list'
```

Monitor the processes launched

```bash
pm2 monit
```

List active servers, show one, etc.

```bash
pm2 list
pm2 show <id or app-name>
```

### PM2 Process Details Within a Git Repository

When navigating into the project folder of one of the managed processes, PM2 will additionally show revision control metadata if the project folder is also a revision control directory.

```bash
$ pm2 describe homepage # 'show' is an alias to 'describe'
Describing process with id 0 - name homepage
 -----------------------------------------------------------------------------
│ status            │ online                                                  │
│ name              │ homepage                                                │
│ id                │ 0                                                       │
│ path              │ /Users/marcuspoehls/Dev/FutureStudio/homepage/server    │
│ args              │                                                         │
│ exec cwd          │ /Users/marcuspoehls/Dev/FutureStudio/homepage           │
│ error log path    │ /Users/marcuspoehls/.pm2/logs/homepage-error-0.log      │
│ out log path      │ /Users/marcuspoehls/.pm2/logs/homepage-out-0.log        │
│ pid path          │ /Users/marcuspoehls/.pm2/pids/homepage-0.pid            │
│ mode              │ fork_mode                                               │
│ node v8 arguments │                                                         │
│ watch & reload    │ ✘                                                      │
│ interpreter       │ node                                                    │
│ restarts          │ 0                                                       │
│ unstable restarts │ 0                                                       │
│ uptime            │ 31m                                                     │
│ created at        │ 2015-09-21T11:06:52.342Z                                │
 -----------------------------------------------------------------------------

Revision control metadata
 ------------------------------------------------------------------------
│ revision control │ git                                                 │
│ remote url       │ ssh://gitserver@futustudio.io/urlto/homepage.git    │
│ repository root  │ /Users/marcuspoehls/Dev/FutureStudio/homepage       │
│ last update      │ 2015-09-21T11:37:51.000Z                            │
│ revision         │ ab555c55d555e55555555fg55h555ij555klm555            │
│ comment          │ latest commit message                               │
│ branch           │ develop                                             │
 ------------------------------------------------------------------------
```

The revision control metadata can be helpful in cases when the app doesn’t work properly and you’re wondering if you pulled the latest code changes from your co-workers.

See also [pm2 pull - "No versioning system found for process..."](https://github.com/Unitech/PM2/issues/1563). This fails on Windows or with an old git.
