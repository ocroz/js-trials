# Git recommended installation

## Git installation

- [download](https://git-scm.com/downloads) and install Git.

[On Windows]

- Activate the Windows Explorer Integration.
- **Use Git from Git Bash only**.
- Keep the default line ending conversions.
- Keep the default terminal emulator MinTTY.
- Enable the file system caching.

## Git configuration

Reference: [[Delicious Insights] Git recommended installation and configuration](https://installations.delicious-insights.com/software/git.html) (in French).

### Benefits of a great git configuration

Having a great configuration realy helps when working with Git:

1- The prompt:

- One line prompt with **contextual git info** such as:
- Status of the workspace vs stage vs depot,
- Status of the ongoing merge or rebase.

This is really helpful to see the status of your git files at a quick glance.
The other command `git status` gives you more details.

2- The completion:

- Press `Tab` and git completes the *command* or the command *argurments* in function to the context.

3- The global Git configuration:

Git has 3 levels of configuration: system (all users), global (only you), and local (current repository).
The default `global` configuration is poor and could be much improved.

### Quick configuring your git

From your terminal (or Git Bash on Windows):

```bash
curl -O https://raw.githubusercontent.com/deliciousinsights/support-files/master/config-git.sh
source ./config-git.sh
```

Note: If you already have a global git configuration, the script will detect and keep your settings in favor of its own ones, case by case per setting. Otherwise it will ask for your complete name (first name and last name) and your email for the git commit identity.

### Result

You may need to relaunch a terminal to have the new settings. Then try and create a new git repo.

```bash
[10:21] markwatney@hab:~ $ cd /tmp
[10:21] markwatney@hab:/tmp $ mkdir foobar
[10:21] markwatney@hab:/tmp $ cd foobar
[10:21] markwatney@hab:/tmp/foobar $ git init
[10:21] markwatney@hab:/tmp/foobar (master \#) $
```

The prompt should show `(master #)` after you have done `git init`.

### git lg

Another result is the new command `git lg` which is an alias to the `git log` command with some clever options.

`git lg` and `git lg --all` helps a lot to look at the commit history:
- Each commit is one-line with only the relevant information,
- The graph history shows when a branch diverged and merged.

## Additional packages

### git-p4

#### Install git-p4.py and alias 'git p4' to it

Get and put [git-p4.py](http://git.kernel.org/cgit/git/git.git/plain/git-p4.py) into your $HOME/bin/. Also make sure it is executable.

Add an alias into your `$HOME/.gitconfig`.

```bash
[alias]
  p4 = !~/bin/git-p4.py
```

#### Install python

Obviously you need [Python](https://www.python.org/). Python 2.7 works fine.

Also update your `$HOME/.bash_profile` with:

```bash
export PATH=/c/Program\ Files\ \(x86\)/Python27:$PATH # Or whatever needful path
```

#### Command usage

See the official `git p4` documentation at [https://git-scm.com/docs/git-p4](https://git-scm.com/docs/git-p4).

See also:

- [Perforce knowledge base article on git-p4](http://answers.perforce.com/articles/KB/2790)
- [Atlassian article on work with git and perforce](https://developer.atlassian.com/blog/2015/01/work-with-git-and-perforce/)

#### Warnings and limitations and recommendations

- Do **not import an entire depot**, work on a **codeline basis instead**. Learn Git first.
  - Tip: See this [interesting git tutorial from Atlassian](https://www.atlassian.com/git/tutorials).
- Avoid using git-p4 if the codeline contains file types git does not manage:
  - Git does not manage line EOL and character encodings like Perforce.
    - Remember: Perforce stores text files in Unix format/with Unix EOL<br>and downloads files as indicated in the client specification.
  - Git does not support keyword expansion '+k'.
    - Tip: To remove the '+k' keyword, you should change the file type in Perforce.
- You may import the codeline HEAD revision only to start (done by default).
- Make sure the user you use to synchronise with Perforce has a valid login ticket.

### git-subrepo

Because `git-subrepo` is better than `git-submodule` and `git-subtree`. See its [benefits](https://github.com/ingydotnet/git-subrepo#benefits).

In summary:

- The **git submodules** feature is **very difficult to work with**, even if you are 100% aware of the known pitfalls.
- The **git subrepos** feature behaves similarily to *git subtrees*... in a **better way**.

See also [mastering git subtrees](https://delicious-insights.com/en/posts/mastering-git-subtrees/).

Get and put the files into a subdir of your $HOME/bin/.

```bash
cd $HOME/bin
git clone https://github.com/ingydotnet/git-subrepo
```

Then update your `$HOME/.bash_profile` with:

```bash
source $HOME/bin/git-subrepo/.rc
```
