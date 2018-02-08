'use-strict';

const suppressChunks = require('./suppress-chunks.lib');

module.exports = (e) => {
  const excludedJsChunks = suppressChunks(Object.keys(e))
  const chunkstoBeExcluded = [];
  if (!excludedJsChunks && !excludedJsChunks.length) { return chunkstoBeExcluded; }
  excludedJsChunks.map(file => chunkstoBeExcluded.push(file.name));
  return chunkstoBeExcluded;
};