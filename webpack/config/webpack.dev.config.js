const { merge } = require('webpack-merge')
const commonPageConfig = require('./webpack.comm.config')

module.exports = merge(commonPageConfig, {
  mode: 'development', // 设置模式
  devtool: 'source-map', // 建立js映射文件，方便调试
  devServer: {
    hot: true, // 模块热替换
    host: '0.0.0.0',
    port: '8000',
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:xxxx",
        pathRewrite: {
          '^/api': '',
        },
        changeOrigin: true,
      }
    }
  },
})
