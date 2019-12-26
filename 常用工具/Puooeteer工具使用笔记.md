## 简介
Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。[更多](https://github.com/GoogleChrome/puppeteer)

## 安装
有梯安装（由于国内网络被墙，无法正常安装`chromium`）
```
npm i puppeteer
# or "yarn add puppeteer"
```
无梯安装
```
npm config set PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors // 设置下载`chromium`下载地址
npm i puppeteer --ignore-scripts // 忽略安装`chromium`
```
手动下载`chromium`，[下载地址](https://npm.taobao.org/mirrors/chromium-browser-snapshots/)；注意版本号，在`node_modules/puppeteer/package.json`中的`puppeteer.chromium_revision`[查看](https://github.com/GoogleChrome/puppeteer/blob/master/package.json#L11);

下载成功后解压到项目根目录下的`chromium`目录

Centos 7.*依赖安装
```
yum install libatk-bridge-2.0.so.0

yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y

yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y
```
注意：centos 6.* 无法使用yum安装`libatk-bridge-2.0.so.0`只能自行按错误提示找到对应的包一个个安装。

在项目根目录下创建一个`index.js`，拷贝如下代码：
```
const path = require('path');
const puppeteer = require('puppeteer');
const os = require('os'), sysType = os.type();
let executablePath = '';
if (sysType == 'Windows_NT') { // window系统的启动文件路径
  executablePath = 'win/chrome.exe';
} else if (sysType == 'Linux') {
  executablePath = 'linux/chrome'; // Linux系统的启动文件路径
} else {
  executablePath = 'mac/Chromium.app/Contents/MacOS/Chromium'; // Mac系统的启动文件路径
}
(async () => {
  const browser = await puppeteer.launch({
    executablePath:  path.join(__dirname, '../chromium/chrome-' + executablePath), // 设置浏览器启动文件路径
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // 传递给浏览器实例的其他参数。
    defaultViewport: {width: 1920, height: 1080} // 设置浏览器的宽高
  });
  const page = await browser.newPage();
  await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'});
  await page.pdf({path: 'hn.pdf', format: 'A4'}); // 导出PDF（样式与使用chrome右键打印样式一致）
  await page.screenshot({path: 'example.png'}); // 截屏保存图片
  await browser.close(); // 关闭浏览器
})();
```
运行：
```
node index.js
```

