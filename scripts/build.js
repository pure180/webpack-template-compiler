/* jshint esversion: 6 */
/* jshint node: true */

'use strict';

const compiler = require('./compiler'),
      config = require('../config/webpack.config.prod'),
      fs = require('fs-extra'),
      paths = require('../config/paths');

const packageJson = require(paths.appPackageJson);

module.exports = () => {
  
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';

  process.on('unhandledRejection', err => {
    throw err;
  });

  console.log(`Build production of: "${packageJson.name}@${packageJson.version}"`);
  console.log(`Start cleaning destination folder at: "${paths.appDist}".`);
  fs.emptyDir(paths.appDist)
    .then(() => {
      console.log('Done cleaning destination folder!');
      console.log('Start compiling...');
      return compiler(config);
    })
    .catch(err => {
      console.error(err);
    });
};