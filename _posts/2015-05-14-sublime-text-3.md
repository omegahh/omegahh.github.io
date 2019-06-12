---
layout:       post
author:       Omega
authorurl:    http://www.omegaxy.com
categories:   Memo
tags:         edit sublime
title:        Sublime text 3 (ST3) 的相关配置
---

在[官网](www.sublimetext.com)下载相应的安装包进行安装。

## Customizing Sublime Text 3

After downloading ST3 ...

### 开启终端支持

类似于其他工具，ST3 也提供了其命令行工具 `subl`，使用这个命令我们可以在终端里面打开一个文件，或者一个路径下所有文件或者一个目录。

启用这个命令，需要建立这个二进制文件的软链接到环境变量 `PATH` 目录中，例如

	sudo ln -s /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl /usr/bin/subl

### 安装Package Control管理插件

想要开始使用 Sublime Text 社区中各式各样的插件去拓展起功能，我们需要安装一个叫做 [Package Control](http://packagecontrol.io) 的包管理插件，以后就可以通过它搜索安装插件了（当然它本身要我们手动安装了= =）。

1. 首先在[这里](https://sublime.wbond.net/installation#st3)复制下安装这个插件的 Python 代码。点击 **View > Show Console** 打开 ST3 的终端，将这段代码粘贴到终端中，回车之行后重启 ST3。
2. 至此就可以通过快捷键 `Cmd`+`Shift`+`P` 来安装拓展插件。输入 **install** 会看到 **Package Control: Install Package** 出现，按下回车就可以搜索拓展包了。
3. 以后安装了相应插件后，可以通过快捷键 `Cmd`+`Shift`+`P` 后调用这些插件的功能，也可以通过绑定相应的快捷键执行这些功能。

可以在[官方文档](https://sublime.wbond.net/docs/usage)中去查看更多命令的用法。
![Package Control](/Pictures/subl-package-control.png)

### 创建一个 Custom Setting File

个性化的配置文件让我们能更自由的定制软件，在 **Sublime Text > Preferences > Settings-User** 定义整个软件的个性化配置。

~~~javascript
//Preferences.sublime-settings
{
	"auto_complete": false,
	"auto_complete_commit_on_tab": true,
	"auto_match_enabled": true,
	"bold_folder_labels": true,
	"caret_style": "phase",
	"color_scheme": "Packages/Predawn Monokai/Predawn Monokai.tmTheme",
	"detect_indentation": true,
	"draw_centered": false,
	"draw_indent_guides": true,
	"ensure_newline_at_eof_on_save": true,
	"file_exclude_patterns":
	[
		"*.DS_Store",
		"*.pyc",
		"*.git",
		"*.localized",
		"*.gitignore"
	],
	"find_selected_text": true,
	"flatland_square_tabs": true,
	"fold_buttons": true,
	"folder_exclude_patterns":
	[
		"*.git"
	],
	"font_face": "Menlo",
	"font_options":
	[
		"no_round"
	],
	"font_size": 16,
	"highlight_line": true,
	"highlight_modified_tabs": true,
	"ignored_packages":
	[
		"Vintage"
	],
	"indent_to_bracket": true,
	"line_padding_bottom": 0,
	"line_padding_top": 0,
	"match_brackets": true,
	"match_brackets_angle": false,
	"match_brackets_braces": true,
	"match_brackets_content": true,
	"match_brackets_square": true,
	"new_window_settings":
	{
		"hide_open_files": true,
		"show_tabs": true,
		"side_bar_visible": true,
		"status_bar_visible": true
	},
	"predawn_findreplace_small": true,
	"predawn_tabs_active_underline": true,
	"predawn_tabs_small": true,
	"preview_on_click": false,
	"remember_open_files": false,
	"remember_open_folders": true,
	"save_on_focus_lost": false,
	"scroll_past_end": false,
	"show_full_path": true,
	"show_minimap": false,
	"tab_size": 4,
	"theme": "predawn-DEV.sublime-theme",
	"translate_tabs_to_spaces": true,
	"trim_trailing_white_space_on_save": false,
	"use_simple_full_screen": true,
	"vintage_start_in_command_mode": false,
	"wide_caret": true,
	"word_wrap": true
}
~~~

(注意！使用上述配置前最好先安装一下主题 Predown，后装上也不会有问题，就是没装之前一直有 load 不了的警告！)

对于特定编程语言的配置，可以点击 **Sublime Text > Preferences > Settings-More > Syntax Specific-User** 建立一个命名为：*LANGUAGE.sublime-settings* 的文件，例如我的 Python 定制文件。

~~~javascript
//Python.sublime-settings
{
    // editor options
    "draw_white_space": "all",

    // tabs and whitespace
    "auto_indent": true,
    "rulers": [79],
    "smart_indent": true,
    "tab_size": 4,
    "trim_automatic_white_space": true,
    "use_tab_stops": true,
    "word_wrap": true,
    "wrap_width": 80
}
~~~

以及 markdown 文件的定制配置

~~~javascript
{
    "color_scheme": "Packages/Predawn/predawn-markdown.tmTheme",
    "draw_centered": true, // Centers the column in the window
    "draw_indent_guides": false,
    "font_size": 15,
    "trim_trailing_white_space_on_save": false,
    "word_wrap": true,
    "wrap_width": 80  // Sets the # of characters per line
}
~~~

## 拓展包

### SideBarEnhancements

[SideBarEnhancements](https://sublime.wbond.net/packages/SideBarEnhancements) 拓展了侧边栏的功能，安装了这个插件过后，ST3 的侧边栏对文件的操作更加丰富。

![SideBarEnhancements](/Pictures/subl-sidebar.png)

### SublimeCodeIntel

这是一个代码自动提示插件，需要配置好相应提示语言的系统安装目录就好了，快捷键上与系统的有点冲突，修改一下就好了。

~~~javascript
{
    "Python": {
        "python": '/usr/bin/python',
        "pythonExtraPaths": []...
    }
}
~~~

其默认的快捷键为：

    For Mac OS X:
      * Jump to definition = ``Control+Click``
      * Jump to definition = ``Control+Command+Alt+Up``
      * Go back = ``Control+Command+Alt+Left``
      * Manual CodeIntel = ``Control+Shift+space``

    For Linux:
      * Jump to definition = ``Super+Click``
      * Jump to definition = ``Control+Super+Alt+Up``
      * Go back = ``Control+Super+Alt+Left``
      * Manual CodeIntel = ``Control+Shift+space``

    For Windows:
      * Jump to definition = ``Alt+Click``
      * Jump to definition = ``Control+Windows+Alt+Up``
      * Go back = ``Control+Windows+Alt+Left``
      * Manual CodeIntel = ``Control+Shift+space``

### Python PEP8 Autoformat 插件

这是用来按 PEP8 自动格式化代码的。可以在包管理器中安装，快捷键 `Ctrl`+`Shift`+`R` 自动格式化 python 代码。

~~~javascript
{
     "auto_complete": false,
     "caret_style": "solid",
     "ensure_newline_at_eof_on_save": true,
     "find_selected_text": true,
     "font_size": 11.0,
     "highlight_modified_tabs": true,
     "line_padding_bottom": 0,
     "line_padding_top": 0,
     "scroll_past_end": false,
     "show_minimap": false,
     "tab_size": 4,
     "translate_tabs_to_spaces": true,
     "trim_trailing_white_space_on_save": true,
     "wide_caret": true,
     "word_wrap": true,
}
~~~

### Git & GitGutter

Git 插件可以在 Sublime 中实现所有的 git 的操作，包括 add, commit, branch, merge, checkout, push, pull。而 GitGutter 可已在行首显示文件的更改信息。

git push 命令用于将本地分支的更新，推送到远程主机。它的格式与 git pull 命令相仿。

	$ git push <远程主机名> <本地分支名>:<远程分支名>

如果省略远程分支名，则表示将本地分支推送与之存在”追踪关系”的远程分支(通常两者同名)，如果该远程分支不存在，则会被新建。

	$ git push origin master

上面命令表示，将本地的 master 分支推送到 origin 主机的 master 分支。如果后者不存在，则会被新建。

**注意**：如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支。

	$ git push origin :master
	# 等同于
	$ git push origin --delete master

上面命令表示删除origin主机的master分支。

如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略。

	$ git push origin

上面命令表示，将当前分支推送到origin主机的对应分支。

如果当前分支只有一个追踪分支，那么主机名都可以省略。

	$ git push

如果当前分支与多个主机存在追踪关系，则可以使用 -u 选项指定一个默认主机，这样后面就可以不加任何参数使用 git push。

	$ git push -u origin master

上面命令将本地的 master 分支推送到 origin 主机，同时指定 origin 为默认主机，后面就可以不加任何参数使用 git push 了。

不带任何参数的 git push，默认只推送当前分支，这叫做 simple 方式。此外，还有一种 matching 方式，会推送所有有对应的远程分支的本地分支。Git 2.0 版本之前，默认采用 matching 方法，现在改为默认采用 simple 方式。如果要修改这个设置，可以采用 git config 命令。

	$ git config --global push.default matching
	# 或者
	$ git config --global push.default simple

还有一种情况，就是不管是否存在对应的远程分支，将本地的所有分支都推送到远程主机，这时需要使用 –all 选项。

	$ git push --all origin

上面命令表示，将所有本地分支都推送到 origin 主机。

### 其他

其他插件还有很多，比如我的主题和配色是下载的 Predawn 和 Predawn Monikai。另外 Markdown Preview 可以预览 .md 文件。而 SublimeREPL 可以在 Sublime 中直接开启一些语言的交互。最后还有 ConvertToUTF8 对付一些文件的编码问题。
