'use-strict';

const fs                    = require('fs'),
      glob                  = require('glob');
      path                  = require('path');
      resolvePath           = require('./resolve-path.lib');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function resolveGlobs(folder) {
  const p = resolvePath(folder);
  const files = fs.readdirSync(p)
  if (!files || !files.length) { return undefined; }
  const entries = [];
  files.forEach(file => {
    const createGlob = `${folder}/${file}/*.${file}`;
    const g = glob.sync(resolvePath(createGlob));
    if (g && g.length) {
      entries.push({
        name: file,
        files: g
      });
    }
  })
  return entries;
}

function resolveFileName(file, e) {
  const ext = '.' + e;
  const name = path.basename(file, ext);
  return name.replace(/(-|\s)/g, '_'); 
}

module.exports = (p) => {
  const resolvedGlobs = resolveGlobs(p);
  if (!resolvedGlobs) { return undefined; }
  const entries = {}
  resolvedGlobs.forEach(folder => {
    if (folder.files && folder.files.length > 0) {
      folder.files.forEach(f => {
        const fileKey = capitalizeFirstLetter(resolveFileName(f, folder.name));
        const key = folder.name + fileKey;
        entries[key] = [f];
      })
    }
  });
  return {files: entries, globs: resolvedGlobs};
};