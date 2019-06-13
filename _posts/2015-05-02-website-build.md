---
layout:       post
author:       Omega
authorurl:    http://www.omegaxy.com
categories:   Jekyll
tags:         AWS blog Jekyll
title:        在 AWS 上搭建一个 Jekyll 博客
---

**关键工具**：*Git*, *Jekyll*, *Apache*, *AWS*

**具体流程**：在本地用文本编辑器编写 **.md** 文件，通过 **Marboo** 预览。然后在服务器上建立 **Git 仓库**，欲发表的博文 **push** 到该仓库，同时网站的模版放置于公开的 **Github** 中，方便管理与同步。服务器为 **AWS EC2** 的虚拟主机，可以通过 **SSH** 登陆管理。服务器端配置好 **Apache** 服务器（同时可配置 **WebDav** 做同步盘），利用 **Crontab** 每天定时 **pull** 最新的博客文章，并使用 **Jekyll** 编译为可访问的网站。

![大致框架](/imgs/jekyll-aws.png)

> **一切为了什么**：我想这一切的一切都是因为 **电脑洁癖** ！

## 工作准备

1. 一个 [AWS EC2](http://aws.amazon.com) 主机，或者其它主机都可以，注意一定要是虚拟主机，不能是云主机。
2. 一个给力的网络，因为需要 SSH 登陆到主机操作，所以我觉得一个好的网络还是不错的
3. 一个 Github 账号，没有去申请就可以了。

## AWS EC2 服务器

### 申请开通

[AWS EC2](http://aws.amazon.com) 的申请开通很简单，去网上可以搜到很多教程。不过需要注意的是，现在的 AWS 服务好像变了，新注册的账号只能在美国的 `Virginia` 和 `Oregon` 这两个地区创建实例，可以发邮件申请换两个地区，而且可以用 [CloudPing](http://www.cloudping.info) 查看自己网络连接到各地区服务器的 Ping 值。

### SSH 连接

创建好合适地区的实例（**instance**）后就可以连接到服务器了(实例的安全规则里一定要有 SSH 的端口开放)

我选择的是新加坡的主机，系统选择的是 **Ubuntu 14.04 LTS** ，点击实例页面的连接，会教你怎么连接，具体命令是：

	ssh -i xxxx.pem ubuntu@xxx.xxx.xxx.xxx

`.pem`证书文件名和 IP 地址视你的实例而定

### 配置 Apache

配置 Apache 的话，需要服务器的 80 端口打开，在安全规则里面添加就可以。

#### 安装 LAMP

我图省事，直接在 Ubuntu 下安装的 LAMP，LAMP 是 Linux, Apache, Mysql, PHP5 的简称，话不多说，直接开始吧：

先 update 一下软件列表

	sudo apt-get update

发现网络真的是很赞，安装 LAMP

	sudo apt-get install tasksel
	sudo tasksel install lamp-server

接下来就是 LAMP 的配置，其实这时候你在浏览器访问你的主机 IP 就已经有个示例页面了：

![Apache 演示页面](/imgs/apache2-installed.png)

#### 更改网站目录

电脑洁癖又犯了，默认的网站页面文件是在 `/var/www`，赶紧调整到自己的 home 目录下吧，以后也好管理，我们以 000-default 的配置为基础，来创建自己的 site 配置：

	sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/mysite.conf

修改 /etc/apache2/sites-available/mysite，将其中所有的 /var/www 改为 /home/ubuntu/mysite，也就是我们站点的起始目录。你可以根据自己的情况选择合适的目录。

这样修改之后，访问者可能不具备访问 /home/ubuntu/mysite 的权限，可以修改 /etc/apache2/apache2.conf 文件，找到

	<Directory /var/www>
		Options Indexes FollowSymLinks
		AllowOverride None
		Require all granted
	</Directory>

将这一段复制，并粘贴在后面，将其中的 /var/www 改为 /home/ubuntu/mysite 就可以了。

#### 重新载入配置

可以使用下面的命令来查看现有的站点:

	apache2ctl -S

现在，我们要改用 mysite 配置。停止默认的站点，启动自定义站点：

	sudo a2dissite 000-default && sudo a2ensite mysite
	sudo service apache2 reload

默认站点可能不叫做 000-default。根据 apache2ctl -S 的返回结果，相应修改上面的命令。

最后重启Apache2，可以放一个 *index.html* 页面放在自定义的目录下测试一下。

	sudo service apache2 restart

自此，一个符合电脑洁癖者的 Apache 服务器就搭建好了。

**[Optinal]** 如果你想让你的服务器的 PHP5 支持 MySQL，你还可以安装：

	sudo apt-get install php5-mysql php5-curl php5-gd php5-intl php-pear php5-imagick php5-imap php5-mcrypt php5-memcache php5-ming php5-ps php5-pspell php5-recode php5-snmp php5-sqlite php5-tidy php5-xmlrpc php5-xsl

**[Optinal]** 安装 XCache 优化缓存

	sudo apt-get install php5-xcache

**[Optinal]** 安装phpmyadmin管理Mysql:

	sudo apt-get install phpmyadmin

### 配置 WebDav

WebDav 是一个基于 HTTP 1.1 的通信协议，搭建一个 WebDav 的服务器可以方便的当云盘使用，Apple 中有很多软件都支持 WebDav 同步。

Apache 内建了一些模块来支持 WebDav 功能，我们可以通过两个命令简单的开启：

	sudo a2enmod dav
	sudo a2enmod dav_fs

然后重启 Apache 服务就可以了，当然下面还需要详细配置一下。

#### 更改文件位置

首先和网站一样，需要配置一个 WebDav 的根目录，默认的 Apache 服务器的目录在 `/var/www`，我们在家目录下创建 WebDav 文件夹。

	mkdir webdav

然后把这个目录的所有者转给 `www-data`，这样这个目录就可以正常的展示了。

	sudo chown www-data webdav

#### 设置密码保护

我们可以通过建立 htpasswd 文件来建立认证，决定是否可访问该目录。

	sudo htpasswd -c /etc/apache2/webdav.password username

用户名自己定，而后会让你输入密码，如果没有 htpasswd 命令就安装`apache2-utils`。当然这个文件我们也要保护一下，重设一下这个文件的权限。

	sudo chown root:www-data /etc/apache2/webdav.password
	sudo chmod 640 /etc/apache2/webdav.password

#### 最后的配置

最后还需要修改一下`mysite.conf`，一是添加 Webdav 目录的权限，二是直接将服务器地址的`/webdav`关联到这一文件夹，用来方便的访问。

	<Directory /var/www>
		Options Indexes FollowSymLinks
		AllowOverride None
		Require all granted
	</Directory>
	
	Alias /webdav /home/ubuntu/webdav
	
	<Location /webdav>
		Options Indexes
		DAV On
		AuthType Basic
		AuthName "webdav"
		AuthUserFile /etc/apache2/webdav.password
		Require valid-user
	</Location>

保存并关闭文件，重启 Apache 就可以了。访问的地址就是`domain_or_IP_addr/webdav`, 输入用户名密码就 OK 了。

参考： [How to Configure WebDAV Access with Apache on Ubuntu 12.04](https://www.digitalocean.com/community/tutorials/how-to-configure-webdav-access-with-apache-on-ubuntu-12-04)

## Ubuntu 安装 Jekyll

### 安装 Ruby

这里有一个大坑，就是如果直接安装 **Ruby** 会安装的版本不高，达不到 **Jekyll** 的要求，所以我们通过 *RVM* 安装，安装 *RVM* 需要 curl，如果没有自己装上，使用 curl 下载 RVM：

	curl -sSL https://get.rvm.io | bash -s stable

如果它提示系统没有证书，按照它的提示装上就可以了：

	command curl -sSL https://rvm.io/mpapis.asc | gpg --import -

RVM 安装完成后，这里注意一下，RVM 是安装在自己 home 目录下的，以后执行要注意环境变量，第一次执行也要注销或者重启一下主机。利用 RVM 安装新版本的 ruby：

	rvm install 2.0.0

此处会比较久，应该是服务器配置不太高，需要编译一会儿，不过也还好，装完可以检查一下：

	ruby --version

### 安装 rubygems

直接用apt-get即可

	sudo apt-get install rubygems-integration

### 安装NodeJS或其他JavaScript runtime

推荐装nodejs(可选therubyracer),直接用apt-get

	sudo apt-get install nodejs

### 安装 Jekyll

	gem install jekyll

[Optinal]安装 rdiscount

	gem install rdiscount

## 使用 Git

### 配置 Github

我是从 Github 上拉取主题，所以先安装 git：

	sudo apt-get install git

产生 SSH 公钥

	ssh-keygen -t rsa -C xxxx@xxx.com

剩下来就没什么了，写个脚本 push/pull 数据，想方便还可以给远程端命个名：

	git remote add origin git@github.com:yourID/yourrepos.git

习惯是把远程端叫`origin` ，这样也好写统一的控制脚本，而且不同 git 目录是互不干扰的

## Cron 自动运行脚本

注意设置服务器时区！

	sudo cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

执行命令 `crontab -e` 就可以调出当前用户的系统定时任务。

## 总结

到此为止，一个搭建在 AWS 上的免费自动博客系统就完成了，如果不想这么麻烦的话，直接搭载在 github 上也很好，这里动手实践一下还是蛮爽的
