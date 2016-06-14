var path = require('path');
var loaderUtils = require('loader-utils');
var utils = require('./libs/utils');

var accessible = utils.accessible;
var hasPostfix = utils.hasPostfix;

module.exports = function(source) {
  this.cacheable();
  var query = loaderUtils.parseQuery(this.resourceQuery);
  if (!('css' in query)) {
    return source;
  }
  var css = query.css, context = this.options.context;
  if (!css || typeof css !== 'string') {
    css = 'index.css';
    context = this.context;
  }
  css = css.replace(/^\s+|\s+$/g, '');
  if (!hasPostfix(css)) {
    css = css + '.css';
  }
  css = path.resolve(context, css);

  if (accessible(css) instanceof Error) {
    return source;
  }
  css = path.relative(this.context, css);

  return 'require("./' + css + '");' + source;
};
