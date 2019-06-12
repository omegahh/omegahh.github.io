---
layout:       post
author:       Omega
authorurl:    http://www.omegaxy.com
categories:   Jekyll
tags:         jekyll blog search
title:        为 Jekyll 博客添加快速搜索
---

**Jekyll** 是一个非常不错的静态博客生成工具，当然我没有用过 hexo，听说那个也不错。静态博客顾名思义就是网站只有纯粹的 **HTML** 代码构成，没有数据库等等。所以搜索功能什么的都需要自己想办法解决。有一部分人使用的是 [Swiftype](https://swiftype.com)，不得不说非常的酷，但是好像只给免费使用一段时间。搜索了一下，[Rimo](http://blog.moyizhou.cn/web/search-engine-for-static-pages/) 这里给出了一些可行方案，但我想要一个简洁风格的方案。最后从 [Codeboy](http://codeboy.me) 这里得到了启发。下面参照他的思路，在我的博客实现了这一功能。

这样的搜索实现其实非常简单，大致思路就是通过 **AJAX** 的 `get()` 方法获取数据，数据从文章索引中获取，而搜索框的实现就要依赖于 Web 开发神器 [Bootstrap](http://v2.bootcss.com/javascript.html) 了。总结起来就是如下几个步骤：

1. 生成文章索引
2. 设计页面搜索框结构
3. 设计页面交互
4. 搜索功能实现

下面是每一步的细节

## 生成文章索引

文章索引就是遍历 **Jekyll** 博客中的所有文章，获取其标题、标签、日期和文章链接，整合到一个 **json** 文件中。这个 **json** 文件我们可将其命名为`search.json` 以便我们后续的工作。

具体的写法如下：

~~~yaml
// Jekyll, 反斜杠是为了防止代码被解析
---
layout: null
---
{
  "code" : 0 ,
  "data" : [{\% for post in site.posts %\}
  {
    "title" : "{\{ post.title }\}",
    "tags" : "{\% for tag in post.tags %\}{\% if forloop.rindex != 1 %\}{\{ tag }\}_{\% else %\}{\{ tag }\}{\% endif %\}{\% endfor %\}",
    "date" : "{\{ post.date | date: '%Y-%m-%d' }\}",
    "url" : "{\{ post.url }\}"
  }{\% if forloop.rindex != 1  %\},{\% endif %\}{\% endfor %\}
  ]
}
~~~

这里要注意一下，如果为了代码便于阅读，将 **liquid** 代码缩进写好了，会发现在解析中这些代码会占空白行，所以此处的代码非常紧凑。

## 设计搜索框

到这一步就需要好好设计一下你的搜索框了，我的习惯是打开 Safari 的调试功能，不停地修改样式，直到达到自己理想的效果。首先设计**搜索按钮**，**搜索框**，**搜索关闭按钮**这三个关键 DOM 结构。我的搜索按钮是放在了导航栏，而其余两个元素是采用的聚光灯的设计。首先添加的 html 代码如下：

~~~markup
<div class="search-tool" style="position: fixed; top: 0px ; bottom: 0px; left: 0px; right:  0px;
      opacity: 0.95; background-color: #111111; z-index: 9999; display: none;">
    <input type="text" class="search-content" id="search-content" placeholder="Post Titles, Tags or Date"/>
    <div style="position: fixed; top: 16px; right: 16px;">
        <a class="search-close"><i class="icon-remove-circle" id="close-ban"></i></a>
    </div>
</div>
~~~

至此为止，我们已经在页面上添加好了相应的 DOM 结构，接下来就要设计一下样式，调整样式这个活是细活，需要慢慢来：

~~~css
.dropdown-menu {
  float: none;
  font-size: 20px;
  background: #fff;
  position: absolute;
  padding: 0 2%;
}
.search-tool ul{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  list-style-type: none;
  background-clip: padding-box;
  border-radius: 4px;
}
.search-content {
  position: absolute;
  padding: 0 2%;
  font-size: 22px;
  left: auto;
  right: auto;
  height: 50px;
  background-color: #eee;
  outline: none;
  color: black;
  opacity: 1.0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.search-tool .search-close {
  text-decoration: none;
  font: 500 30px/1 'PT Serif', 'Hiragino Sans GB', sans-serif;
}
~~~

除此之外还有动态大小支持，就是手机上和平板以及电脑的样式会略有不同。

~~~css
@media screen and (min-width: 768px) {
  .dropdown-menu  { width: 70%; margin: 0 13%; }
  .search-tool ul { width: 70%; margin: 0 13%; }
  .search-content { width: 70%; margin: 0 13%; top: 15%; }
}
@media screen and (max-width: 767px) {
  .dropdown-menu  { width: 90%; margin: 0 3%; }
  .search-tool ul { width: 90%; margin: 0 3%; }
  .search-content { width: 90%; margin: 0 3%; top: 6%; }
}
~~~

OK，样式已经设计完毕，接下来就是交互。

## 设计交互方式

页面的交互中肯定要有两个按钮：**打开搜索按钮**和**关闭搜索按钮**，因为移动设备并没有键盘，必须要在界面中有这两个可触摸的元素。此外，还可以加上双击 `Ctrl` 键打开搜索和按 `ESC` 退出搜索的交互方式。

首先，在大的 `$(document).ready()`中写下下面这个框架：

~~~javascript
/* quickly search */
$(document).ready(function() {
    var Theme = {
        Version: "1.0",
        Author: "Omega"
    };
    Theme.search = {
        _show: function(){},
        _fade: function(){},
        _keyup: function(){},
        _get: function(){},
        run: function(){
            var that = this;
            isShow = false;
            prevTime = 0;
            that._show();
            that._fade();
            that._keyup();
            that._get();
        }
    }
    Theme.init = {
        run: function(){
            Theme.search.run();
        }
    };
    Theme.init.run();
});
~~~

写下这个框架的目的是为了以后添加其它 `JS` 代码时，便于区分和调试。四个函数 `_show`, `_fade`, `_keyup`, `_get` 便是核心功能。首先是点击按钮：

~~~javascript
_show: function(){
    $("#search-btn").click(function(){
        $(".search-tool").css("display", "block");
        $("#search-content").val("");
        $("#search-content").focus();
        isShow = true;
    });
},
_fade: function(){
    $("#close-btn").click(function(){
        $(".search-tool").css("display", "none");
        isShow = false;
    });
},
~~~

我这里定义的 `isShow` 是全局变量。接下来是键盘的交互，设计的功能是双击 `Ctrl` 开启搜索，按 `ESC` 关闭搜索。

~~~javascript
_keyup: function(){
    $(document).keyup(function(e){
        var nextTime = new Date().getTime();
        if (e.keyCode == 17) {
            var gap = nextTime - prevTime;
            prevTime = nextTime;
            if (gap < 500) {
                if (isShow) {
                    $(".search-tool").css("display", "none");
                    isShow = false;
                } else {
                    $(".search-tool").css("display", "block");
                    $("#search-content").val("");
                    $("#search-content").focus();
                    isShow = true;
                }
                prevTime = 0;
            }
        } else if (e.keyCode == 27) {
            $(".search-tool").css("display", "none");
            isShow = false;
            prevTime = 0;
        }
    });
},
~~~

我写了这个函数后，遇到一个很奇怪的问题，页面第一次双击 `Ctrl` 有反应，但是随后失灵。可是奇怪的是鼠标点击一下页面又会成功一次，但是 `ESC` 没遇到这个情况，而且我写了一个测试的代码，没有这个问题，，，搞了好久，始终解决不了这个问题。也是醉了。。。

## 搜索功能实现

简单说明下原理：通过在输入框输入关键词，**Ajax** 匹配 `search.json` 中的文章标题里面的词语，并且通过 `typeahead.js` 完成智能提醒。点击提醒列表中的文章到达选中的文章。

~~~javascript
_get: function(){
    var names = new Array();
    var urls = new Array();
    $.getJSON("/path/search.json").done(function(data){
        if (data.code == 0) {
            for (var index in data.data) {
                var item = data.data[index];
                names.push(item.title);
                urls.push(item.url);
            }
            $("#search-content").typeahead({
                source: names,
                afterSelect: function(item) {
                    $(".search-tool").css("display", "none");
                    isShow = false;
                    window.location.href = ("http://omegaxy.com/blog/" + urls[names.indexOf(item)]);
                }
            });
        }
    });
},
~~~

至此，整个搜索功能就算完成了。

## 总结

搜索功能完成了后还有两个瑕疵，第一个是前面提到的双击键盘的问题，第二个就是在下拉菜单应该还支持更[丰富](http://blog.zuuii.com/bootstrap-typeahead-use-json-objects/)的功能，例如标签搜索，日期搜索等等，亟待下一步慢慢解决。