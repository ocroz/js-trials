# Linux shell on Windows

Git on Windows usually relies on MinGW, a lighter linux-like environment on Windows than Cygwin.

See:
- [Download Git](https://git-scm.com/downloads)
- [MinGW vs Cygwin](https://en.wikipedia.org/wiki/MinGW)
- [Windows 10 Installation Guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

Problems with MinGW:
- The output of the npm commands are not well rendered with *MinGW*.<br>
  Typically a `npm install` waits for the command being completed before to return.<br>
  Whereas a progress bar shows up on a *Windows Command Processor*.
- The colors are not well rendered on the command line terminal with *MinGW*.

Alternative solutions:

1. Install Ubuntu on Windows 10
2. Run bash from the Windows Command Processor (perfect for Windows 10).
3. Install hyperjs - a command line terminal fully written in node.

## Install Ubuntu on Windows 10

1. Enable Developer Mode in Settings → Update & Security → For Developers → Developer Mode. You may be asked to reboot here.
2. To enable Windows Subsystem for Linux, open the Start menu and search for Turn Windows Features On or Off. A Windows will open. Tick the box next to the option that reads: Windows Subsystem for Linux(Beta). Hit OK to apply your changes.
3. Reboot.
4. Open the Start menu and search for Bash. Click on the icon that appears. Now, the first time you run Bash you will be asked to accept the terms of service. Doing so will proceed to download Bash on Ubuntu on Windows from the Windows Store.
5. Once you completed, you’ll then be prompted to create a user account and password for use in the Bash environment.

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
