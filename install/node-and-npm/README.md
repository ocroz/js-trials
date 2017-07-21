# Node and npm

There are several installation options:

- Simple installation
- Via NVM aka *Node Version Manager*
- Or even via RPM or compiling the sources

Let's discover the simple installation.

Reference: [[Delicious Insights] Node and npm](https://installations.delicious-insights.com/software/node.html) (in French).

## Installation

[download](https://nodejs.org/en/download/) and install `node.js`.

Then update `npm` aka *Node Package Manager* to its latest version.

```bash
npm install -g npm@latest
```

## npm root [-g]

`npm` installs the packages either into the *global root* or into the *local root*.

The global root is fixed and is known via `npm root -g`.<br>
The local root is contextual and known via `npm root`.

A local root is usually defined by the presence of a `package.json` file.

A package often installs an executable which is made available at `$(npm root [-g])/.bin/{executable}`.

## npm and Windows

The `package.json` file defines some scripts which use:
- The executables available at `$(npm root [-g])/.bin/`, or
- Any other system command.

On Windows (even from bash), npm interprets Windows commands only.

- So `cmd.exe` must be available in the `PATH`.
- A bash script must be prefixed with `bash` or the system cannot executes it.

Example:
```javascript
  "scripts": {"start": "bash script.sh"} # Because bash.exe
```

## npm and other tools

[Sublime Text 3](../sublime-text-3/README.md) needs *standard* and *standard-format*.<br>
These packages are installed globally and the command `standard` is available in the `PATH`.

[Hyper.JS](../shell-on-windows/README.md) is a `node.js` tool. Its plugins are installed via `npm` for which the `npm root` is under `$HOME`.
