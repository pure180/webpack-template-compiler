/* jshint esversion: 6 */
/* jshint node: true */

'use strict';

module.exports ={
  execludeNoneTextExtensions          : /\.(js|jsx|ts|tsx|json)$/,
  execludeTextExtensionsBeginsWith    : /^(pug|jade|scss|less)/,
  execludeTextExtensionsEndsWith      : /(\.(pug|jade|scss|less|json)|(node_modules|bower_components))$/,
};