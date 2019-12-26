
var path = require('path');
module.exports = [{
  entry: {
    app: ['./src/app.js']
  },
  // 输入配置
  output: {
    path: path.join(__dirname, '/dist/client/'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  node: {
    fs: 'empty'
  },
  mode: 'development',
  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, './src')
    ],
    extensions: ['.js', '.jsx', '.css', '.scss', '.jpg', '.gif', '.png']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 文件名称规则
        exclude: /node_modules/, // 忽略的目录
        loader: 'babel-loader',
        query: {
          cacheDirectory: false, // 缓存的目录
          presets: [['@babel/preset-env', {targets: {node: 'current'}}], '@babel/preset-react'] // 预先设置编译插件
        }
      }
    ]
  },
  plugins: []
}, {
  entry: {
    app: ['./src/app.js']
  },
  // 输入配置
  output: {
    path: path.join(__dirname, '/dist/server/'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  mode: 'development',
  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, './src')
    ],
    extensions: ['.js', '.jsx', '.css', '.scss', '.jpg', '.gif', '.png']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 文件名称规则
        exclude: /node_modules/, // 忽略的目录
        loader: 'babel-loader',
        query: {
          cacheDirectory: false, // 缓存的目录
          presets: [['@babel/preset-env', {targets: {node: 'current'}}], '@babel/preset-react'] // 预先设置编译插件
        }
      }
    ]
  },
  plugins: []
}]