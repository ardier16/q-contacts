const CopyPlugin = require('copy-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')
const HtmlPlugin = require('html-webpack-plugin')
const UnusedWebpackPlugin = require('unused-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const path = require('path')

const nodeEnv = (process.env.NODE_ENV || 'production').trim()
const envFile = path.resolve(__dirname, '../.env.local')

module.exports = {
  mode: nodeEnv,
  devtool: false,
  stats: 'minimal',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  entry: {
    background: './src/background/index.ts',
    popup: './src/popup/index.tsx',
    content: [
      './src/content-scripts/index.ts',
      './src/styles/content.scss',
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.scss'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, '../src')],
      },

      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, '../src')],
      },

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: false } }
        ],
      },

      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: false } },
          { loader: 'sass-loader', options: { sourceMap: false } }
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
  plugins: [
    new DotenvPlugin({
      path: path.resolve(__dirname, envFile),
    }),

    new CopyPlugin({
      patterns: [
        {
          from: './public/img',
          to: 'img',
        },
        {
          from: './public/manifest.json',
          to: '',
        }
      ],
    }),

    new HtmlPlugin({
      template: './public/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),

    new UnusedWebpackPlugin({
      directories: [path.resolve(__dirname, '../src')],
    }),
  ],
}
