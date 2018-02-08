'use-strict';

const path                  = require('path'),
      HtmlWebpackPlugin     = require('html-webpack-plugin'),
      { excludedJsChunks }      = require('./globals.lib');

function optionsToString(object) {
  if (!object) { return ''; }
  const keys = Object.keys(object);
  if(!keys && !keys.length) { return ''; }
  let optionsString = ''
  keys.forEach((key, index) => {
    let seperator = index !== (keys.length - 1) ? '&' : '';
    optionsString += `${key}=${object[key].toString()}${seperator}`;
  })
  return optionsString;
}

module.exports = (globs, options) => {
  let pugFiles;
  globs.forEach(g => {
    if (g.name === 'pug' || g.name === 'jade') {
      pugFiles = g.files;
    }
  })
  const htmlWebpackPlugin = [];
  if (pugFiles && pugFiles.length > 0) {
    const option = optionsToString(options);
    pugFiles.forEach(pugFile => htmlWebpackPlugin.push(
        new HtmlWebpackPlugin({
          inject: true,
          template: `!!pug-loader?${option}!${pugFile}`,
          filename: path.basename(pugFile, '.pug') + '.html', 
          excludeJSWithCSS: true,
          excludeJSChunks: excludedJsChunks,
          excludeAssets: [/.*(scss|less).*\.js/, /.*(pug|jade).*\.js/],
        }),
      )
    );
  }
  return htmlWebpackPlugin;
};