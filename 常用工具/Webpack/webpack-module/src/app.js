
import a from './a'; // 同步加载 这种方式必须把import放在module前面
let mode = {
    a: a, // import 加载方式
    b: require('./b.js'), // require 加载方式
    c: import('./c.js') // 动态加载（返回Promise对象） 这种方式可以吧import放在任意地方
}
console.info(mode);
mode.a();
mode.b.default();
mode.c.then(c => c.default());