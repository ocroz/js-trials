# javascript trials for browsers and node

## disclaimer

I initially created this js-trials git repo to train myself on javascript.
This was more convenient whenever I  was coding at the office or at home.
Everything being generic, this is a great opportunity to share my understanding with others. Feel free to pick up whatever you find interresting.
Any comment is welcome.

## install

First thing to care about is the development environment.
I like node (which provides npm), git (which provides bash on Windows), and working with a great source code editor. I much prefer when they are configured the same way everywhere.

## recyclable

When I started with node.js, I thought I would be autonomous to script anything on server side after knowing how to:

- Run system commands and process their output,
- Read and Write files on the file system, and
- Fetch data from any URL.

PS: Dealing with a database is another important knowledge too*.

The most difficult for me was to make it asynchronous.

See my first trials at [async](recyclable/node/src/async/).
Start with [async-spawn.js](recyclable/node/src/async/async-spawn.js), then [async-file.js](recyclable/node/src/async/async-file.js), then [async-fetch.js](recyclable/node/src/async/async-fetch.js).

*I did not document anything about databases yet. I would first start with mongo because it stores the elements in json, and plug it with mongoose in javascript.

Later I learned react and its ecosystem. There's no tuto for this yet. My incremental approach is available at [app-react-redux](recyclable/webnode/app-react-redux/).

## tutos

Best way to share some knowledge with others is to document a step by step approach to various aspects of javascript.
People can learn from very simple things to more complex ones.

When learning something new, I may put my code under recyclable, then I may write a better documented tuto.

Enjoy your journey here :-).
