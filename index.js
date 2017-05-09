var path = require('path');
var loaderUtils = require('loader-utils');
var utils = require('./libs/utils');

var accessible = utils.accessible, postfixCss = utils.postfixCss, assign = utils.assign;
var space = /^\s+|\s+$/g;

module.exports = function(source) {
  this.cacheable();
  var query = assign(loaderUtils.parseQuery(this.resourceQuery), loaderUtils.parseQuery(this.query));
  if (!('css' in query)) {
    return source;
  }
  var css = query.css, context = this.options.context, postfix = query.postfix;
  if (!css || typeof css !== 'string') {
    css = postfixCss('index', postfix);
    context = this.context;
  }
  css = css.replace(space, '');
  css = postfixCss(css, postfix);
  css = path.resolve(context, css);

  if (accessible(css) instanceof Error) {
    return source;
  }
  css = path.relative(this.context, css);
  var moduleResolver = query.module || 'require'

  return (!query.module ? 'require("./' + css + '");' : query.module + ' "./' + css + '";') + source;
};