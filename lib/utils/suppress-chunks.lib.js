/* jshint esversion: 6 */
/* jshint node: true */

'use-strict';

const globals = require('./globals.lib');

module.exports = (keys) => {
  if (!keys && !keys.length) { return undefined; }
  const ignoredChunks = [];
  keys.forEach(key => {
    if (globals.execludeTextExtensionsBeginsWith.test(key)) {
      ignoredChunks.push({ name: key, match: /\.(js|js\.map)$/ });
    }
  });
  return ignoredChunks;
};