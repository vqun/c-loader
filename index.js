var path = require('path');
var loaderUtils = require('loader-utils');
var utils = require('./libs/utils');

var accessible = utils.accessible, postfixCss = utils.postfixCss, assign = utils.assign;
var space = /^\s+|\s+$/g;

module.exports = function(source) {
  this.cacheable();
  var r = {
    query: this.resourceQuery
  }
  var query = assign({}, loaderUtils.getOptions(this), loaderUtils.getOptions(r));
  if (typeof query.css !== 'string' && !query.css) {
    return source;
  }
  var css = query.css, context = this.options.context, postfix = query.postfix;
  // !css: maybe ?css=&postfix=less
  if (!css || typeof css !== 'string') {
    css = 'index';
    context = this.context;
  } else {
    // if the css starts with './', then the context should be current resource context
    css.indexOf('./') === 0 && (context = this.context)
  }
  css = loaderUtils.interpolateName(this, css.replace(space, ''), this.options)

  css = postfixCss(css, postfix);
  css = path.resolve(context, css);

  if (accessible(css) instanceof Error) {
    return source;
  }
  css = path.relative(this.context, css);
  var moduleResolver = query.module || 'require'

  return (!query.module ? 'require("./' + css + '");' : query.module + ' "./' + css + '";') + (!!query.onlycss ? '' : source);
};