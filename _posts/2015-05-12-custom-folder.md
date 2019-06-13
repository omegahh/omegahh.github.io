---
layout:       post
author:       Omega
authorurl:    http://www.omegaxy.com
categories:   Mac
tags:         customize mac
title:        Mac 下个性化文件夹
---

强迫症就是没有办法，看着 *home* 目录下系统自带文件夹都有图标，就想着给自己添加的文件夹也统一化。= =b 好吧，那就开始吧！

## 图标

更改文件夹的图标，首先找到 OSX 系统默认图标在哪里：

	/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/

1.  按下 'Command'＋‘Shift’＋‘G’ 打开 Go to 功能，
2.  粘贴以上路径并点击 Go 按钮，Finder 将进入此目录。

![图标文件夹](/imgs/icon-folder.png)

将自己想要个性化的文件夹在“显示简介”后就可以更改自己满意的图标了

## 中文化

系统自带文件夹实际上在你更改系统语言时会自动更改自己的语言，但是实际上他们是英文命名的文件夹，我们自己也可以设置中文化。

首先第一步是找到系统中英文对应的字符串资源文件，路径是

	/System/Library/CoreServices/SystemFolderLocalizations/zh_CN.lproj/SystemFolderLocalizations.strings

编辑文件显示是乱码，如图。

![显示是乱码](/imgs/error-codes.png)

因为这个文件在 Mac 系统中是二进制文件，需要先转化为 xml 格式的，

	sudo plutil -convert xml1 SystemFolderLocalizations.strings

再次编辑就正常了，这是添加自己想要的中英文对应条目，

![显示终于正常](/imgs/not-error-codes.png)

之后再把这个文件转换回二进制文件

	sudo plutil -convert binary1 SystemFolderLocalizations.strings

最后一步，在需要中文名的文件夹下，新建一个名为.localized的隐藏文件即可，或者简单点直接从系统文件夹里 copy 一个过来，重启 Finder 后就可以看到中文化的文件夹了，大功告成！

## SIP (System Integrity Protection)

在 **OS X El Capitan** 中，在内核下引入了 Rootless 机制，以下路径：

	/System
	/bin
	/sbin
	/usr (except /usr/local)

均属于 Rootless 范围，即使 root 用户无法对此目录有写和执行权限，只有 Apple 以及 Apple 授权签名的软件（包括命令行工具）可以修改此目录。

**修改方法：** 重启，开机按住 `Command + R`，以 Recovery 分区启动，命令行操作

	csrutil disable

完成过后可以 `enable` 和 `status` 启用和查看状态。
