const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
module.exports = {
  target: 'web',
  mode: 'development', // 设置模式 production
  devtool: 'source-map', // 建立js映射文件，方便调试
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/bundle.js',
  },
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
  resolve: {
    extensions: ['.js', '.json', '.mjs', '.vue', '.ts', 'jsx'], // import导入模块的时候后缀名在这里加了，导入时可以不加
    alias: {
      "@": path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
        ]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader",
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset',
        generator: {
          filename: 'image/[name]_[hash:8][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        }
      },
      {
        test: /\.(eot|ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name]_[hash:8][ext]'
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
      // {
      //   test: /\.js/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //      presets: [
      //        '@babel/preset-env'
      //      ]
      //     }
      //   }
      // },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'test-title'
    }),
    new DefinePlugin({
      BASE_URL: "'./'", // 定义变量，比如模板html中的变量
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: "./",
          globOptions: {
            ignore: [
              "**/index.html"
            ]
          }
        }
      ]
    }),
    new VueLoaderPlugin(),
  ],
}
