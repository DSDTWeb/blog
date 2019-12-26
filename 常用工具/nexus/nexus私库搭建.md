# NPM私库搭建

现在搭建私库的方方案有很多，如`cnpm`、`CouchDB`、`Nexus`等等。本文主要讲解`Nexus 3`方案。`Nexus`是最受欢迎的私库管理工具。能支持`npm`、`bower`、`Docker`、`Maven`、`Ruby Gems`、`yum`、`rwa`、`pypl`等常见客户端命令工具的结合使用。

## [Nexus 安装](https://help.sonatype.com/repomanager3/installation)

- Nexus依赖与`Java 8`运行环境，所以请注意你的电脑是否安装了`Java 8`。你可以使用`java -version`命令查看你当前的`java`版本。
- 目前Nexus支持安装包直接安装和Docker安装两种方式，本文主要讲解直接安装模式。[Docker安装请查看官方文档](https://help.sonatype.com/repomanager3/installation/installation-methods#InstallationMethods-InstallingwithDocker)

### [安装包下载地址：](https://www.sonatype.com/download-nexus-repo-oss?submissionGuid=767b4d50-4964-45bc-9a56-58451eca1350)

- [Nexus Repository Manager OSS 3.x - Mac OS X](http://download.sonatype.com/nexus/3/latest-mac.tgz)
- [Nexus Repository Manager OSS 3.x - Windows 64位](https://sonatype-download.global.ssl.fastly.net/nexus/3/latest-win64.zip)
- [Nexus Repository Manager OSS 3.x - Unix](https://sonatype-download.global.ssl.fastly.net/nexus/3/nexus-3.19.1-01-unix.tar.gz)

### windows安装

下载成功后得到`latest-win64.zip`压缩包文件，然后将文件解压，会得到如下文件目录：

```txt
├───nexus-3.19.1-01
│   ├───.install4j
│   ├───bin
│   │   ├───contrib
│   │   ├───nexus.exe
│   │   └───nexus.vmoptions
│   ├───deploy
│   ├───etc
│   ├───jre
│   ├───lib
│   ├───public
│   └───system
└───sonatype-work
```

cmd命令工具进入到 */nexus-3.19.1-01/bin 目录，执行 `nexus /run` 便启动nexus项目。用户名: `admin`， 初始密码在`sonatype-work/nexus3/admin.password`文件中。

### Linxu安装

1. 下载安装包命令：`wget https://sonatype-download.global.ssl.fastly.net/nexus/3/nexus-3.19.1-01-unix.tar.gz`
2. 解压压缩包：`tar zxvf nexus-3.19.1-01-unix.tar.gz`，解压成功后目录结构与windows的大致相同。
3. 启动命令： `./nexus-3.19.1-01/bin/nexus start`

## Nexus使用

1. 浏览器打开`http://localhost:8081/`，点击右上角登录按钮，初次登录会把`admin`账号的密码生成`解压目录所在路径/sonatype-work/nexus3/admin.password`文件下，登录完成后会销毁次文件，所以务必按提示进行设置新密码。提示如下图：
![image](image/login.png?raw=true)

2. 登录后进入仓库管理页面，默认没有`npm`仓库，需要自己进行创建响应的`npm`仓库，如下图：
![image](image/manage_repositories.png?raw=true)

3. 创建仓库时`nexus`都提供了`hosted`、`group`、`proxy`三种类型的仓库。建议每种类型至少创建一个。具体说明如下：
仓库类型 | 类型说明
---|---
hosted | 本地仓库。即我们内部要上传组件的主要仓库
proxy | 代理仓库。可以代理到其他地方的仓库（如代理到`https://registry.npmjs.org`）
group | 组合仓库。可以组合多个仓库为一个服务地址，可以实现本地和外网仓库公用。
![image](image/create_repository.png?raw=true)

4. 创建`npm`的`hosted`仓库，一般只需要填写`仓库名称`；`Blob存储方案`（一般用默认即可，可以在`Blob Stores`下配置自己需求的方案，可以配置文件存储的形式和路径，容量限制等）；`部署策略`（目前只有`Allow redeploy（允许替换）`、`Disable redeploy（不允许替换）`、`Read-only（只读）`，默认为`Disable redeploy`），一般使用默认配置即可。如下图：
![image](image/create_hosted.png?raw=true)

5. 创建`npm`的`proxy`仓库，一般填写仓库名称和代理地址，其他使用默认配置即可。如下图：
![image](image/create_proxy.png?raw=true)

6. 创建`npm`的`group`仓库，如下图：
![image](image/create_group.png?raw=true)

7. 设置`nexus`的`Realms`，默认是未开启`npm`的登录验证的，需要自行设置开启。具体如下图：
![image](image/realms_npm.png?raw=true)

8. 登录`npm`， 命令： `npm login --registry=http://127.0.0.1:8081/repository/npm-hosted/`
![image](image/npm_login.png?raw=true)

9. 发布`npm`包， 命令： `npm publish --registry=http://127.0.0.1:8081/repository/npm-hosted/`，需要提交的文件在`package.json`文件的`files`属性中配置即可。具体如下：

```js
{
  "name": "nexus",
  "version": "1.0.0",
  "description": "基于nexus部署npm私库",
  "main": "index.js",
  "jsnext:main": "index.js",
  "scripts": {
    "login": "npm publish --registry=http://localhost:8081/repository/npm-hosted/",
    "publish": "npm publish --registry=http://localhost:8081/repository/npm-hosted/",
    "install": "npm install --registry=http://localhost:8081/repository/npm-group/"
  },
  "keywords": [
    "npm私库"
  ],
  "files": [
    "dist",
    "lib",
    "index.js"
  ],
  "author": "ztMin",
  "license": "ISC",
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  }
}
```

10. 安装依赖包命令：`npm install nexus --registry=http://localhost:8081/repository/npm-group/`。注意上传包的时候是需要直接上传到`hosted`仓库，不能使用`group`仓库的地址上传。安装的时候则建议使用`group`仓库地址，这样则避免内部私库依赖一些外部依赖包的时候无法安装上导致安装失败。
