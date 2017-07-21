# Sublime Text 3

There are several great IDE and editors for JavaScript.

- [[InfoWorld] Review: The 10 best JavaScript editors](http://www.infoworld.com/article/3195951/application-development/review-the-10-best-javascript-editors.html)
- [[Slant] What are the best JavaScript IDEs or editors?](https://www.slant.co/topics/1686/~javascript-ides-or-editors)
- [[ourcodeworld] Top 7 : Best free web development IDE for JavaScript, HTML and CSS](http://ourcodeworld.com/articles/read/200/top-7-best-free-web-development-ide-for-javascript-html-and-css)
- [[dunebook] 5 BEST JAVASCRIPT IDE & JAVASCRIPT EDITORS](https://www.dunebook.com/5-best-javascript-ide-javascript-editors/)

Let's deep into `Sublime Text 3` aka `ST3`.

Reference: [[Delicious Insights] Sublime Text 3 & Plugins](https://installations.delicious-insights.com/software/st3.html) (in French).<br>
Especially read the nice comparison with some other tools.

## Installation

- [download](http://www.sublimetext.com/3) and install ST3.
- Adapt the global ST3 configuration (space & tab management, etc.)

Preferences > Settings - User

Add a comma after the last setting and append the following configuration before the closing bracket.

```javascript
  "auto_complete": true,
  "auto_complete_triggers":
  [
    {
      "characters": ".",
      "selector": "source.js"
    }
  ],
  "ensure_newline_at_eof_on_save": true,
  "folder_exclude_patterns":
  [
    "node_modules",
    ".git"
  ],
  "highlight_line": true,
  "highlight_modified_tabs": true,
  "tab_size": 2,
  "translate_tabs_to_spaces": true,
  "trim_trailing_white_space_on_save": true
```

Also deactivate the following menu option: View > Side Bar > Show Open Files

- Package Control

Copy [the ST3 installation code](https://packagecontrol.io/installation) into your clipboard.
Open the ST3 console: View > Show Console
Paste the code and press `Enter`.
Restart ST3 when completed.

Now you have the Package Control: Preferences > Package Control

- How to install a package?

Preferences > Package Control > Install Package<br>
\> Prefilter a name > Select one > See the progression in the status bar at the bottom of the editor.

## Recommended packages

### Theme and Font

- Theme: Install [Monokai Extended](https://packagecontrol.io/packages/Monokai%20Extended) then select it:
Preferences > Color Scheme > Monokai Extended > Monokai Extended
- Font: Install [Source Code Pro](https://github.com/adobe-fonts/source-code-pro#readme) then add this preference (see above):

```javascript
  "font_face": "Source Code Pro",
```

### General packages

- [SideBarEnhancements](https://packagecontrol.io/packages/SideBarEnhancements)
- [AdvancedNewFile](https://packagecontrol.io/packages/AdvancedNewFile)
- [AutoFileName](https://packagecontrol.io/packages/AutoFileName)
- [Terminal](https://packagecontrol.io/packages/Terminal)
- [Origami](https://packagecontrol.io/packages/Origami)
- [Color Highlighter](https://packagecontrol.io/packages/Color%20Highlighter)
- [Unicode Character Highlighter](https://packagecontrol.io/packages/Unicode%20Character%20Highlighter)
- [BracketHighlighter](https://packagecontrol.io/packages/BracketHighlighter)
- [DocBlockr](https://packagecontrol.io/packages/DocBlockr)

### Packages for Git

- [Git Config](https://packagecontrol.io/packages/Git%20Config)
- [GitGutter](https://packagecontrol.io/packages/GitGutter)
- [GitSyntaxes](https://packagecontrol.io/packages/GitSyntaxes)

### Packages for the Web development

- [SublimeLinter](https://packagecontrol.io/packages/SublimeLinter)
- [SublimeLinter-contrib-standard](https://packagecontrol.io/packages/SublimeLinter-contrib-standard)
- [StandardFormat](https://packagecontrol.io/packages/StandardFormat)
- [Emmet](https://packagecontrol.io/packages/Emmet)
- [ChangeQuotes](https://packagecontrol.io/packages/ChangeQuotes)
- [Sass](https://packagecontrol.io/packages/Sass) or [Stylus](https://packagecontrol.io/packages/Stylus)
- [Jade](https://packagecontrol.io/packages/Jade)
- [Babel](https://packagecontrol.io/packages/Babel)
- [tern_for_sublime](https://packagecontrol.io/packages/tern_for_sublime)
- [Better CoffeeScript](https://packagecontrol.io/packages/Better%20CoffeeScript)

### Addidional Node.JS setting for standardjs

You should have installed [node and npm](../node-and-npm/README.md) first.

```bash
npm install -g standard standard-format
```

### Packages for Markdown

- [Markdown Preview](https://packagecontrol.io/packages/Markdown%20Preview)
- [MarkdownEditing](https://packagecontrol.io/packages/MarkdownEditing)

Restart ST3 > Open a md file > Ctrl+Shift+P > Markdown Preview: Preview in Browser > github<br>
\> This previews the file in a browser.

## Useful tips

EDITOR in bash

Add this to your $HOME/.bash_profile

```bash
export EDITOR='subl -w'
```

ST3 commands

```bash
subl <file> # Opens this file
subl .      # Opens this directory
```

From a Windows Explorer to ST3

- Right-click somewhere in the blank area > Git Bash Here
- From Git Bash: subl .

From ST3 to bash

- Right-click on a file > Reveal (this shows the file in Windows Explorer)
- Right-click somewhere in the blank area > Git Bash Here

Or configure the default terminal to bash (the default is Windows Powershell).

- Preferences > Package Settings > Terminal > Settings Default
- Now specify `bash` as prefered terminal and `--login` as parameters.

```javascript
{
  // "terminal": "cmd.exe", // if to configure a DOS shell
  "terminal": "C:\\Program Files\\Git\\bin\\bash.exe",
  "parameters": ["--login"],
  "env": {}
}
```

Then:

- Right-click on a directory > Open Terminal Here (now opens bash).
