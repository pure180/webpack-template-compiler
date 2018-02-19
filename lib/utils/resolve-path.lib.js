/* jshint esversion: 6 */
/* jshint node: true */

'use-strict';

const fs = require('fs'),
      path = require('path');
// const appDirectory = path.resolve(__dirname, '../../');
const appDirectory = fs.realpathSync(process.cwd());

function resolvePath(relativePath) { 
  return path.resolve(appDirectory, relativePath);
}

module.exports = resolvePath;