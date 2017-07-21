# bash settings on Windows

## Prerequisite

You should have installed [Git on Windows](../git/README.md) (which provides bash), and possibly have configured another [Shell on Windows](../shell-on-windows/README.md) too.

Notes:
- Personally I prefer not to mix the Windows and Linux environments.
- When working with my Windows machine, I expect to have only DOS commands in a DOS shell, and only bash commands in a bash shell.
- From bash there are only few exceptions if I'm willing to use `chrome` or few selected other Windows commands.
- Same from DOS if I'm willing to use `which` or few selected other Linux commands.

## Dealing with multiple HOME directories

In my case with my Windows machine, when I'm connected at work I get `$HOME=/U/`, whereas when I'm at home I get `$HOME=$USERPROFILE`.

Here's how I dealt with this difference and eventually have a unique home.

Here's my /U/.bash_profile

```bash
source $USERPROFILE/.bash_profile
```

Here's my $USERPROFILE/.bash_profile

```bash
windir=$(echo "/$WINDIR" | sed -e 's,\\,\/,g' -e 's/://')
home=$(echo "/$USERPROFILE" | sed -e 's,\\,\/,g' -e 's/://')

path=$(echo $PATH | tr ':' "\n" | grep -vi $windir | sed -r "s,$HOME/+,$home/,g" | awk '!seen[$0]++' | tr "\n" ':' | sed 's/:$//')

export WINDIR=$windir
export HOME=$home
export PATH=$path
unset windir home path
```

This will:
- Set HOME as USERPROFILE, and Change WINDIR and HOME as Linux paths
- Update PATH: Remove Windows paths, Update HOME paths, and Remove duplicate paths
- Export results and Unset intermediate variables

## Summary of the bash commands available on Windows

command | declared in | comment
--- | --- | ---
bash | %USERPROFILE%\winbin\bash.bat | see content below
chrome | Environment variable PATH | see detail below
dos2unix | %USERPROFILE%\winbin\dos2unix.exe |
tree | %USERPROFILE%\winbin\tree.exe |
unix2dos | %USERPROFILE%\winbin\unix2dos.exe |
which | %USERPROFILE%\winbin\which.bat | see content below

Environment variable PATH

```dos
set PATH=%PATH%;%USERPROFILE%\winbin
set PATH=%PATH%;C:\Program Files (x86)\Google\Chrome\Application
```

%USERPROFILE%\winbin\bash.bat

```dos
@echo off
"C:\Program Files\Git\bin\bash.exe" --login
```

%USERPROFILE%\winbin\which.bat

```dos
@echo off
"C:\Program Files\Git\usr\bin\which.exe" %*
```

## Summary of the Windows commands available on bash

The Linux environment is the result of:

1. The Windows environment (see §[Summary of the bash commands available on Windows](#summary-of-the-bash-commands-available-on-windows)),
2. A single HOME in bash (see §[Dealing with multiple HOME directories](#dealing-with-multiple-home-directories)),
3. The Git Configuration (see [git](../git/README.md)), and
4. The below additional commands (§[Summary of the Windows commands available on bash](#summary-of-the-windows-commands-available-on-bash)).

command | declared in | comment
--- | --- | ---
chrome | Environment variable PATH | Done on Windows side
cmd | \$HOME/winbin/cmd.exe | Copy of \$COMSPEC (C:\Windows\system32\cmd.exe)
dos2unix | $HOME/winbin/dos2unix.exe
net | $HOME/.bash_profile | alias net=/c/Windows/system32/net
ping | $HOME/.bash_profile | alias ping=/c/Windows/system32/ping
tree | $HOME/winbin/tree.exe
unix2dos | $HOME/winbin/unix2dos.exe
