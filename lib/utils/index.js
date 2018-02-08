const assignPugTemplates    = require('./assign-pug-templates.lib'),
      excludeChunksArray    = require('./exclude-chunks-array.lib'),
      globals               = require('./globals.lib'),
      normalizeFileName     = require('./normalize-file-name.lib'),
      resolveEntries        = require('./entries.lib'),
      resolvePath           = require('./resolve-path.lib'),
      suppressChunks        = require('./suppress-chunks.lib');

module.exports = {
  assignPugTemplates,
  excludeChunksArray,
  globals,
  normalizeFileName,
  resolveEntries,
  resolvePath,
  suppressChunks,
};

