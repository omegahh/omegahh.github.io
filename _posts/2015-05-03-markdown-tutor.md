---
layout:       post
author:       Omega
authorurl:    http://www.omegaxy.com
categories:   Markown
tags:         markdown blog
title:        使用 Markdown 书写博客
---

Markdown 是一种方便记忆、书写的纯文本标记语言，用户可以使用这些标记符号以最小的输入代价生成极富表现力的文档：譬如您正在阅读的这份文档。它使用简单的符号标记不同的标题，分割不同的段落，**粗体** 或者 *斜体* 某些文字，更棒的是，它还可以方便的`引用`。

## 支持哪些功能

* 整理知识，学习笔记
* 发布日记，杂文，所见所想
* 撰写发布技术文稿（代码支持）
* 撰写发布学术论文（LaTeX 公式支持）

### 书写数学公式

$$E=mc^2$$

### 高亮特定的代码

这是一段 Python 代码：

~~~python
class AdView (object):
	def __init__ (self, name = None):
		self.name = name

	def test (self):
		if self.name == 'admin':
			return False
		else
			return True
~~~

这是一段 C++ 代码：

~~~cpp
#include <iostream>

int main(int argc, char *argv[]) {
	//* An annoying "Hello World" example
	for (auto i = 0; i < 0xFFFF; i++)
		cout << "Hello, World!" << endl;

	char c = '\n';
	unordered_map <string, vector<string> > m;
	m["key"] = "\\\\"; // this is an error

	return -2e3 + 12l;
}
~~~

### 便捷的插图

![insert image](/imgs/insert_a_image_quickly.webp)

> 插入一张图片只需要 \!\[foo](/path/toyour/picture.webp) 即可，路径既可以是相对路径也可以是绝对路径

### 兼容 HTML

Markdown 语法的目标是：成为一种适用于网络的 **书写** 语言。

Markdown 并不是想取代 HTML 的地位，而甚至接近它。它的语法种类很少，只对应 HTML 标记的一小部分。Markdown 的构想 **不是** 要使得 HTML 文档更容易书写。在我看来，HTML 已经很容易写了。Markdown 的理念是，能让文档更容易读、写和随意改。HTML 是一种 **发布** 的格式，Markdown 是一种 **书写** 的格式。就这样，Markdown 的格式语法只涵盖纯文本可以涵盖的范围。

不在 Markdown 涵盖范围之内的标签，都可以直接在文档里面用 HTML 撰写。不需要额外标注这是 HTML 或是 Markdown，只要直接加标签就可以了。

要制约的只有一些 HTML 区块元素――比如 `<div>`, `<table>`, `<pre>`, `<p>` 等标签，必须在前后加上空行与其它内容区隔开，还要求它们的开始标签与结尾标签不能用制表符或空格来缩进。Markdown 的生成器有足够智能，不会在 HTML 区块标签外加上不必要的 `<p>` 标签。

不过**请注意**，在 HTML 区块标签间的 Markdown 格式语法将不会被处理。比如，你在 HTML 区块内使用 Markdown 样式的`*强调*`会没有效果。

HTML 的区段（行内）标签如 `<span>`, `<cite>`, `<del>` 可以在Markdown 的段落、列表或是标题里随意使用。依照个人习惯，甚至可以不用 Markdown 格式，而直接采用 HTML 标签来格式化。举例说明：如果比较喜欢HTML 的 `<a>` 或 `<img>` 标签，可以直接使用这些标签，而不用 Markdown 提供的链接或是图像标签语法。

和处在 HTML 区块标签间不同，Markdown 语法在 HTML 区段标签间是有效的。

### 特殊字符自动转换

在 HTML 文件中，有两个字符需要特殊处理： `<` 和 `&` 。`<` 符号用于起始标签，`&` 符号则用于标记 HTML 实体，如果你只是想要显示这些字符的原型，你必须要使用实体的形式，像是 `&lt;` 和 `&amp;`。

`&` 字符尤其让网络文档编写者受折磨，如果你要打「`AT&T`」 ，你必须要写成「`AT&T`」。而网址中的 `&` 字符也要转换。比如你要链接到：

	http://images.google.com/images?num=30&q=larry+bird

你必须要把网址转换写为：

	http://images.google.com/images?num=30&amp;q=larry+bird

才能放到链接标签的 `href` 属性里。不用说也知道这很容易忽略，这也可能是 HTML 标准检验所检查到的错误中，数量最多的。

Markdown 让你可以自然地书写字符，需要转换的由它来处理好了。如果你使用的 `&` 字符是 HTML 字符实体的一部分，它会保留原状，否则它会被转换成 `&amp;`。

所以你如果要在文档中插入一个版权符号 `©`，你可以这样写：

	&copy;

Markdown 会保留它不动。而若你写：

	AT&T

Markdown 就会将它转为：

	AT&amp;T

类似的状况也会发生在 `<` 符号上，因为 Markdown 允许兼容 HTML，如果你是把 `<` 符号作为 HTML 标签的定界符使用，那 Markdown 也不会对它做任何转换，但是如果你写：

	4 < 5

Markdown 将会把它转换为：

	4 &lt; 5

不过需要注意的是，code 范围内，不论是行内还是区块， `<` 和 `&` 两个符号都*一定*会被转换成 HTML 实体，这项特性让你可以很容易地用 Markdown 写 HTML code （和 HTML 相对而言， HTML 语法中，你要把所有的 `<` 和 `&` 都转换为 HTML 实体，才能在 HTML 文件里面写出 HTML code。）

## 使用 kramdown 转换引擎

### 如何配置

使用 kramdown 作为 markdown 的转换引擎，是因为其支持使用 *MathJax* 来显示数学公式，但是他的代码块高亮在官方的推荐是使用 *coderay* 和 *rouge*。但是其实这两个高亮都不好用（不要安装这两个包），一个好的方法是使用 *highlight.js*

首先是`_config.yml`文件的配置：

~~~Makefile
markdown: kramdown
kramdown:
	input: GFM
	extensions:
		- autolink
		- footnotes
		- smart
~~~

在页面中加上需要加载的样式和脚本，[highligt.js](https://highlightjs.org/usage/)来达到高亮：

~~~javascript
<link rel="stylesheet" href="/path/to/styles/default.css">
<script src="/path/to/highlight.pack.js"></script>
<script>
	$(document).ready(function() {
		$("code[class*='language']").each(function(i, block) {
			hljs.highlightBlock(block);
		});
	});
</script>
~~~

最后就是在博客页面中加入*MathJax*用来支持数学公式了：

~~~javascript
<!--//数学公式支持-->
<script type="text/x-mathjax-config">
	MathJax.Hub.Config({
		tex2jax: {
			inlineMath: [ ['$','$'], ["\\(","\\)"] ],
			processEscapes: true
		}
	});
</script>

<script type="text/x-mathjax-config">
MathJax.Hub.Config({
	tex2jax: {
		skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
	}
});
</script>

<script type="text/x-mathjax-config">
MathJax.Hub.Queue(function() {
	var all = MathJax.Hub.getAllJax(), i;
	for(i=0; i < all.length; i += 1) {
		all[i].SourceElement().parentNode.className += ' has-jax';
	}
});
</script>
<script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
~~~

如此配置，就可以很方便的书写高亮代码和像 ${\LaTeX}$ 一样书写公式了。

### GFM

关于 kramdown 兼容的语法格式，在其[官网](http://kramdown.gettalong.org/syntax.html)有详尽的说明，有空整理下来。
