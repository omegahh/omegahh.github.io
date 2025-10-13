---
layout:       post
author:       Omega
authorurl:    http://www.omegaxy.com
categories:   markdown
tags:         marboo memo
title:        关于软件 Marboo 的一些备忘整理
---

## 下载 Marboo

可以直接在 [Apple 商店](http://itunes.apple.com/us/app/marboo/id880375426?l=zh&ls=1&mt=12)下载得到，作者的[博客](http://blog.marboo.biz)也很好找到。装好 Marboo 之后，工作目录目前就在配置目录，比较深。这里注意 `.media` 文件夹，里面有当前目录的所有配置，包括 **CSS** 样表、软件配置、更改公式支持等等。。。

![Marboo](/imgs/Marboo/marboo-screenshot.webp)

> Marboo 的界面分为三栏，左栏－目录栏，中栏－文件栏，右栏－页面栏，支持 vim 操作。

## 基本操作

1. **新建笔记**：点击中栏 **+ 新建** 按钮来新建笔记。或者快捷键 `⌘ n`。
2. **移动焦点**：Marboo 支持使用 `h j k l` 来移动焦点。
3. **预览笔记**：编辑器中保存文件后，右栏会立刻刷新生成的 HTML 页面。
4. **打开目标**：在不同的焦点位置，可以打开对应的文件/文件夹，包括右栏的 HTML 文件，此处建议将 Marboo 的配置中打开文件调成“与 Finder 中打开方式一致”，这样各类文件都可以正确按照默认方式打开。

## 快捷键

| 功能 | 快捷键 | 备注 |
|------+-------+------|
| 新建文件 | **Command + n** | |
| 复制当前焦点路径 | **Command + c** | 文件路径与目录路径皆可|
| 折叠／展开目录| **Space** | 焦点在最右栏时是**向下翻页** |
| 上下左右移动 | **`h` `j` `k` `l`** ||
| 打开目录／文件 | **o** ||
| 到开始处 | **g** ||
| 到结尾处 | **G** ||
| 刷新当前文件 | **r** | 位于文件栏时 |
| 切换锁定 | **Command + l** | 右下角会有**锁**字提示，锁住后右栏不会自动跳到最后修改的文件 |

## 自定义配置

### 边栏的修改

默认的左边栏显示我们并不需要，可以在 `marboo_config.json` 中修改

~~~javascript
"comment": "配置左栏根文件夹分组， only for Pro",
    "group_folders": [{
        "name": "Blogs",
        "display_name": "博客",
        "show": 1
    },{
        "name": "Notes",
        "display_name": "笔记",
        "show": 1
    },{
        "name": "Drafts",
        "display_name": "手稿",
        "show": 1
    },{
        "name": "Papers",
        "display_name": "论文",
        "show": 1
    },{
        "name": "Scores",
        "display_name": "乐谱",
        "show": 1
    },{
        "name": ".media",
        "display_name": "配置文件",
        "show": 0
    }],

    "comment": "在左栏显示Marboo配置文件夹",
    "show_media_dir": false,
~~~

### 自定义新建文件

新建文件时提供几种默认文件格式，以及显示名称。

~~~javascript
    "comment": "设置新建笔记时的笔记类型列表",
    "new_file_types": [{
        "display_name": "Markdown",
        "file_extension": "md"
    },{
        "display_name": "Music Scores",
        "file_extension": ".vextab"
    },{
        "display_name": "Custom",
        "file_extension": ""
    }],
~~~

### 自定义Markdown默认模版

程序提供新建文件时按照模版新建，可以自定义新建 *.md* 文件时的默认初始样式。

~~~
---
layout:       post
author:       Omega
authorurl:    http://www.omegaxy.com
categories:   cate list
tags:         tag list
title:        THIS IS A TITLE
---

\[TOC\]
~~~

### 修改默认引擎

根据文件的后缀名进行配置，在相应的 `rules.json` 文件中设置。相关配置如下：

~~~javascript
//./packages/markdown/rules.json
    "pips": [{
        "name": "md2html"
    },{
        "name": "markdownTemplate",
        "template_path": "tex.md.html" // 统一使用tex.md.html即可
    },{
        "name": "remarkTemplate",
        "template_path": "remark.md.html"
    },{
        "name": "mathJaxTemplate",
        "template_path": "tex.md.html"
    }],
~~~

以及依据后缀名调用引擎

~~~javascript
"piplines": [{
    "filename": "*.vextab",
    "pipline": ["vextabTemplate"]
}],
~~~

### 添加自定义的JS脚本

添加自定义脚本 `custom.js`，其中有三个功能。

~~~javascript
//.media/js/custom.js
$(document).ready(function(){
    // parser of YAML title
    var old_title = document.getElementById("toc_0");
    var text = old_title.innerText.split('title:')[1];
    var new_title = document.createElement("h1");
    new_title.innerText = text;
    old_title.previousElementSibling.remove();
    old_title.previousElementSibling.remove();
    old_title.parentElement.insertBefore(new_title,old_title)
    old_title.remove()

    // remove the first TOC item which refers to Title
    $("[href='#toc_0']").parent().remove()

    // A Solution of picture path
    var getPics = document.getElementsByTagName("img");
    for (var i = getPics.length - 1; i >= 0; i--) {
        var picUrl = getPics[i].src;
        var ins = picUrl.indexOf("/imgs");
        var oldSrc = picUrl.substring(ins,picUrl.length);
        var newSrc = ".." + oldSrc;
        if (oldSrc.indexOf("/imgs") == 0) {
            $("img[src*='"+oldSrc+"']").attr('src',newSrc);
        }
    }

});
~~~

其中包括三个功能：

#### YAML头修正

因为 Marboo 中对 YAML 头并没有识别，所以我写的博客文件在 Marboo 中显示并不美观。

![Ugly Title](/imgs/Marboo/marboo_title_origin.webp)

> **YAML** 头信息完全识别错误

我们查看相应的 HTML 代码，发现其解析结果如下所示。

![HTML Source](/imgs/Marboo/marboo_html_code.webp)

> 解析结果可以看到我们可以发现其误分析的规则

利用其误分析的规则，我就可以添加一段 **JS** 来美化一下标题部分了，修改过后就如同正常标题一样居中显示了。

![Finished Title](/imgs/Marboo/marboo_title_handled.webp)

> 处理过后的标题显示

#### TOC目录修正

标题会在 TOC 中显示，需要去除，在上面的脚本中一句话即可。

#### IMG路径修正

在博客中，图片位置是在 Apache Server 的根目录下，然而在 Marboo 中，图片和文章在同一目录下的两个文件夹中，所以两者的相对目录需要添加一个 `..`

最后在 `tex.md.html` 中添加对脚本的引用

~~~html
<script type="text/javascript" src="{{root}}/.media/js/custom.js"></script>
~~~

### 添加个性化样式

添加个性化样式文件 `.media/css/custom.css`，并引用：

~~~html
<link rel="stylesheet" type="text/css" href="{{root}}/.media/css/custom.css" media="screen" />
~~~

### 总结

所有的修改和个性化设置备份如下

~~~
- marboo_config.json 修改，自定义左侧边栏；新建文件时的显示列表
- ./packages/markdown/rules.json 修改，默认转化模版为 tex.md.html
- ./css/custom.css 文件添加，同时修改 tex.md.html 中主题CSS 为 custom.css
- ./js/custom.js 文件添加，该脚本修正标题修正与图片引用位置不对问题；同时在 tex.md.html 中引用该脚本
- 修改 MathJax 脚本版本号为 2.6.1
- 修改 ./packages/vextab/rule.json 转化 pip 直接为 .vextab
- 添加功能，修改 custom.js，使其可以修正 TOC 显示 title 问题
- 修改 ./packages/markdown/default.md, 改成默认的样式
- 添加本地包 Mathjax 位于 ./lib/mathjax, 同时在 ./packages/markdown/tex.md.html 中修改引用
~~~
