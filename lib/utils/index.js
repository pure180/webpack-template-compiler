/* jshint esversion: 6 */
/* jshint node: true */

const assignPugTemplates = require('./assign-pug-templates.lib'),
      excludeChunksArray = require('./exclude-chunks-array.lib'),
      globals = require('./globals.lib'),
      normalizeFileName = require('./normalize-file-name.lib'),
      resolveEntries = require('./entries.lib'),
      resolvePath = require('./resolve-path.lib'),
      resolvePugData = require('./resolve-pug-data.lib');
      suppressChunks = require('./suppress-chunks.lib');

module.exports = {
  assignPugTemplates,
  excludeChunksArray,
  globals,
  normalizeFileName,
  resolveEntries,
  resolvePath,
  resolvePugData,
  suppressChunks,
};

