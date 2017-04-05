var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var config = {
  output: {
    pathinfo: true,
    filename: "bundle.js",
    chunkFilename: '[name].js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: [
          ["es2015", { "modules": false }]
        ],
      }
    }, {
      test: /\.html$/,
      loader: 'raw-loader'
    }]
  },
  devtool: 'eval',
};

module.exports = config;
