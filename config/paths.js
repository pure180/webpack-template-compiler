'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
} 

module.exports = {
  appDist:                  resolveApp('dist'),
  appEntry:                 resolveApp('src'),
  appHtml:                  resolveApp('src/app/pug/index.pug'),
  appIndex:                 resolveApp('src/app/js/index.js'),
  appIndexJs:               resolveApp('src/app/ts/index.ts'),
  appMedia:                 resolveApp('src/media/**/*'),
  appNodeModules:           resolveApp('node_modules'),
  appPackageJson:           resolveApp('package.json'),
  appPublic:                resolveApp('public'),
  dotenv:                   resolveApp('.env'),
  publicUrl:                getPublicUrl(resolveApp('package.json')),
  servedPath:               getServedPath(resolveApp('package.json')),
}