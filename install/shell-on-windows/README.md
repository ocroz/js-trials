# Linux shell on Windows

Git on Windows usually relies on MinGW, a lighter linux-like environment on Windows than Cygwin.

See:
- [Download Git](https://git-scm.com/downloads)
- [MinGW vs Cygwin](https://en.wikipedia.org/wiki/MinGW)

Problems with MinGW:
- The output of the npm commands are not well rendered with *MinGW*.<br>
  Typically a `npm install` waits for the command being completed before to return.<br>
  Whereas a progress bar shows up on a *Windows Command Processor*.
- The colors are not well rendered on the command line terminal with *MinGW*.

Alternative solutions:

1. Run bash from the Windows Command Processor (perfect for Windows 10).
2. Install hyperjs - a command line terminal fully written in node.

## Run bash from the Windows Command Processor

Put this file somewhere in your PATH.

```dos
REM bash.bat
@echo off
"C:\Program Files\Git\bin\bash.exe" --login
```

Then run it: Open a Windows Command Processor and run `bash` then `exit` to return.

This is perfect to fix the above problems.<br>
Note: The Windows Command Processor cannot be resized dynamically on Windows 7. This has been fixed on Windows 10.

## hyperjs

See [hyper.is](https://hyper.is/)

Hyper.JS fixes all the above problems but have other painful ones:
- The shortcuts have different meanings. Example `ctrl w` closes the window rather than deleting the previous word.
- There is no sidebar to move the screen up and down. The alternate key combinations are `shift up` and `shift down`.
- The 'Edit > Preferences' do not open the configuration file if there's no `EDITOR` defined in the environment.

The Hyper.JS configuration file is located at %USERPROFILE%\.hyper.js

Especially you should configure:

```javascript
module.exports = {
  config: {
    shell: 'C:\\Program Files\\Git\\bin\\bash.exe',
    shellArgs: ['--login']
  }
}
```

Any plugin that enhances hyperjs are to be installed via npm locally in your $HOME.

- Run `cd $HOME` to jump into %USERPROFILE%
- `npm root -g` returns the global npm root at %USERPROFILE%\AppData\Roaming\npm\node_modules.
- `npm root` returns the local npm root at %USERPROFILE%\node_modules.
- `npm ls -depth 0` returns the packages installed for Hyper.JS (among others).
- The Hyper.JS plugins are also listed in the Hyper.JS configuration file.

## babun

See [Babun - a windows shell you will love](http://babun.github.io/).

I have not tested this one.
