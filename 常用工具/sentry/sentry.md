# 简介

> Sentry 是什么？中文翻译过来是 哨兵 的意思，从字面中可以知道 『站岗、放哨、巡逻、稽查的士兵』，不错，Sentry 是程序的 哨兵 ，它可以监控我们在生产环境中项目的运行状态，一旦某段代码运行报错，或者异常，会第一时间把报错的 路由，异常文件，请求方式 等一些非常详细的信息以消息或者邮件给我们，让我们第一时间知道：程序出错了，然后我们可以从 Sentry 给我们的详细的错误信息中瞬间找到我们需要处理的代码，在老板不知情的情况下悄悄把 Bug 修复调，不用等着老板来找上门。实现系统监控治理功能！

# Sentry服务安装

官方提供了在线服务和本地部署两种方式；本地部署又分 [Docker](https://docs.sentry.io/server/installation/docker/) 与 [Python](https://docs.sentry.io/server/installation/python/) 安装！

小白参考地址： https://www.cnblogs.com/name/p/7918758.html

**注意事项：**
- 1、必须是上面的地址只适合于centos 7以后的版本
- 2、docker-ce 安装参考 https://blog.csdn.net/xixiworld/article/details/71438794 简单粗暴
- 3、创建数据库（[参考地址](https://www.cnblogs.com/name/p/7918758.html) 15小点 ）注意创建超级用户

# Sentry客户端系统使用

- **初次登录使用 创建数据库（[参考地址](https://www.cnblogs.com/name/p/7918758.html) 15小点 ） 时，所创建的超级用户！**
- **第一次使用需要配置 Root URL（站点根路径）、 Admin Email（超级用户邮箱）、 Allow Registration（是否允许所有人注册）、 Beacon（是否允许官方发邮件通知更新），如下图：**
![image](image/01.png?raw=true)

- **语言切换**
    
    1、进入用户设置，如下图：
    ![image](image/02.png?raw=true)

    2、选择自己的语言后刷新页面即可，如下图：
    ![image](image/03.png?raw=true)
    

- **先创建团队再创建项目；创建团队在右上角的 Add new... 创建团队；如下图：**
    ![image](image/04.png?raw=true)
    
- **队员邀请**
    
    注意邀请成员的时候尽量在团队中的成员页面添加，如下图：
    ![image](image/05.png?raw=true)
    
    如果邀请者没有收到邮件可以直接点解成员名称进入成员详情页面，复制邀请链接发送，如下图：
    ![image](image/06.png?raw=true)
    
    成员打开邀请链接后可以创建账号，完成后点击加入组织即可，如下图：
    ![image](image/07.png?raw=true)
    ![image](image/08.png?raw=true)
    ![image](image/09.jpg?raw=true)
    

- **创建项目**

    创建项目可以在首页的右上角Add new...列表中进入，也可以在组织设置的项目页面右上角进入；进入创建页面后注意选择自己项目的语言、所属团队和填写项目名称（注意项目名称不能有大写字母）；如下图：
    ![image](image/10.png?raw=true)
    
    创建完成后会进入一个安装指导页面（该页面不同的语言是有不同的教程，具体教程也可以查看官方文档 https://docs.sentry.io/clients/ ）；node项目提示如下图：
    ![image](image/11.png?raw=true)
    
    注意每个项目都有自己的 DSN ，它是Sentry SDK所需的配置信息，它主要协议，公钥，服务器地址和项目标识符信息；该信息可在 组织设置 -> 项目 -> 您的项目 -> Client Keys 中查看；如下图：
    ![image](image/12.png?raw=true)

- **日志排查处理**
    在首页可以直接点击项目即可进入项目控制台页面如下图：
    ![image](image/13.jpg?raw=true)

- **通知设置**
    在用户设置中进入通知设置，即可设置所有类型通知，如下图：
    ![image](image/14.png?raw=true)
    
