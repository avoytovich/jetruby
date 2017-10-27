const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const VENDOR_LIBS = [
  'react'
];

module.exports = {
  entry: {
    bundle: './app/src/app.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.resolve('./', 'build'),
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [{
      use: 'babel-loader',
      test: /\.js$/,
      exclude: /node_modules/
    },
    {
      loader: ExtractTextPlugin.extract({
        use: 'css-loader'
      }),
      test: /\.css$/
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/,
      use: [
        {
          loader: 'url-loader',
          options: { limit: 20000 }
        },
        'image-webpack-loader'
      ]
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: './app/src/index.html'
    }),
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env.Node_ENV': JSON.stringify(process.env.Node_ENV)
    })
  ]
};
