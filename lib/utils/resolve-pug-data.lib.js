/* jshint esversion: 6 */
/* jshint node: true */

const _ = require('lodash'),
      glob = require('glob'),
      path = require('path'),
      paths = require('../../config/paths'),
      fs = require('fs-extra');

function getJson (file) {
  let json = {};
  if (fs.existsSync(file)) {
    try {      
      json = JSON.parse(fs.readFileSync(file));
    } catch (error) {
      console.log(error);
      console.log(file);
    }
  }
  return json;
}
      
function getPugData (files) {
  if (!files && !files.length) { return undefined; }
  let data = {};
  files.forEach(file => {
    const newData = {};
    if (file.path && !file.array) {
      newData[file.name] = getJson(file.path);
    }
    if (!file.paths && file.array && file.array.length > 0) {
      newData[file.name] = getPugData(file.array);
    }
    data = _.assignIn(data, _.merge(data, newData));
  });
  return data;
}

function preparePugFileObject(pathToFile, name) {
  if (_.isArray(pathToFile)) {
    const array = [];
    if (!pathToFile && !pathToFile.length) { return null;}
    pathToFile.forEach(p => {
      array.push(preparePugFileObject(p, path.basename(p, '.json')));
    });
    return {
      name,
      path: undefined,
      array
    };
  } else if (typeof pathToFile === 'string') {
    return {
      name,
      path: pathToFile,
      array: undefined,
    };
  } else {
    return undefined;
  }
}

module.exports = () => {
  if (!fs.existsSync(paths.appPugData)) { return undefined; }
  const jsonGlob = glob.sync( `${paths.appPugData}/*.json`);
  const dataFiles = [];
  if (jsonGlob && jsonGlob.length > 0) {
    jsonGlob.forEach( jGlob => dataFiles.push( preparePugFileObject( jGlob, path.basename(jGlob, '.json')) ) );
  } 
  const jsonFolders = fs.readdirSync(paths.appPugData);
  if (jsonFolders && jsonFolders.length > 0) {
    jsonFolders.forEach(folder => {
      const exp = /\.json$/;
      if (!exp.test(folder)) {
        dataFiles.push(preparePugFileObject(glob.sync( `${paths.appPugData}/${folder}/**/*.json`), folder));
      }
    });
  }
  if (dataFiles && dataFiles.length > 0) {
    pugData = getPugData(dataFiles);
  }

  return pugData;
};