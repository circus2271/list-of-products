const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: path.join(__dirname, '../dist'),
    host: '0.0.0.0',
    watchFiles: path.join(__dirname, '../src/**/*')
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpe?g|gif|ico)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          outputPath: 'images',
          name: '[name].[ext]',
        }
      },
    ]
  }
})
