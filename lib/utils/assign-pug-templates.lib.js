/*jshint esversion: 6 */

'use-strict';

const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      { excludedJsChunks } = require('./globals.lib'),
      resolvePugData = require('./resolve-pug-data.lib');

module.exports = (globs, options) => {
  let pugFiles;
  globs.forEach(g => {
    if (g.name === 'pug' || g.name === 'jade') {
      pugFiles = g.files;
    }
  });
  const htmlWebpackPlugin = [];
  if (pugFiles && pugFiles.length > 0) {
    pugFiles.forEach(pugFile => htmlWebpackPlugin.push(
        new HtmlWebpackPlugin({
          inject: true,
          template: pugFile,
          filename: path.basename(pugFile, '.pug') + '.html',
          excludeJSWithCSS: true,
          excludeJSChunks: excludedJsChunks,
          excludeAssets: [/.*(scss|less).*\.js/, /.*(pug|jade).*\.js/],
          data: resolvePugData(),
          getData: resolvePugData
        })
      )
    );
  }
  return htmlWebpackPlugin;
};
