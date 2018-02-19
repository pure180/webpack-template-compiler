/*jshint esversion: 6 */
/* jshint node: true */

'use strict';

module.exports = (ext, targetExt, path) => {
  return {
    filename: (getPath) => {
      return getPath(`${path ? path : ''}[name].${targetExt}`).replace(ext, '').toLowerCase();
    },
    allChunks: true
  };
};