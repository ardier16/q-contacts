const path = require('path')
const { merge } = require('webpack-merge')

const commonConfig = require('./webpack.config.common')

module.exports = merge(commonConfig, {
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },
})
