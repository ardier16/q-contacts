const { merge } = require('webpack-merge')
const path = require('path')

const ZipPlugin = require('zip-webpack-plugin')
const commonConfig = require('./webpack.config.common')

module.exports = merge(commonConfig, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },

  plugins: [
    new ZipPlugin({
      path: '../',
      filename: 'q-contacts-extension',
    }),
  ],
})
