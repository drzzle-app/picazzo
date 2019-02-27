const webpackConfigBase = require('./build/webpack.base.conf.js');
const webpackConfigDev = require('./build/webpack.dev.conf.js');
const merge = require('webpack-merge');
const webpack = require('webpack');

let webpackConfig = merge(webpackConfigBase, webpackConfigDev, {
  node: { fs: 'empty' },
  devtool: '#inline-source-map',
})

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],

    files: ['src/**/*.spec.js'],

    preprocessors: {
      '**/*.spec.js': ['webpack', 'sourcemap']
    },

    webpack: {
      devtool: 'inline-source-map',
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
    },

    reporters: ['spec'],

    browsers: ['Chrome']
  })
}
