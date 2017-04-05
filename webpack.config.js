'use strict'

var webpack = require('webpack')
var env = process.env.NODE_ENV

var regularExternal = {
  root: 'Regular',
  commonjs2: 'regularjs',
  commonjs: 'regularjs',
  amd: 'regularjs'
}

var reduxExternal = {
  root: 'Redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux'
}

var config = {
  externals: {
    'regularjs': regularExternal,
    'redux': reduxExternal
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        cacheDirectory: true,
        presets: [
          ["es2015", { "modules": false }]
        ],
        plugins: ['transform-object-rest-spread']
      }
    }, {
      test: /\.html$/,
      loader: 'raw-loader'
    }]
  },
  output: {
    library: 'RegularRedux',
    libraryTarget: 'umd'
  },
  plugins: [{
      apply: function apply(compiler) {
        compiler.parser.plugin('expression global', function expressionGlobalPlugin() {
          this.state.module.addVariable('global', "(function() { return this; }()) || Function('return this')()")
          return false
        })
      }
    },
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  )
}

module.exports = config