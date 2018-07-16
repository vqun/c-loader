const path = require('path');
const loaderUtils = require('loader-utils');
const SourceNode = require("source-map").SourceNode;
const SourceMapConsumer = require("source-map").SourceMapConsumer;
const utils = require('./libs/utils');

const accessible = utils.accessible, postfixCss = utils.postfixCss, assign = utils.assign;
const SPACE = /^\s+|\s+$/g;

module.exports = function(source, sourceMap) {
  if(this.cacheable) this.cacheable();
  console.log('======111')
  const query = assign({}, loaderUtils.getOptions(this), loaderUtils.getOptions({
    query: this.resourceQuery
  }));
  console.log('======222')
  if (typeof query.css !== 'string' && !query.css) {
    return source;
  }
  console.log('======333')
  let css = query.css, context = this.rootContext
  const postfix = query.postfix
  // !css: maybe ?css=&postfix=less
  if (!css || typeof css !== 'string') {
    css = 'index';
    context = this.context;
  } else {
    // if the css starts with './', then the context should be current resource context
    css.indexOf('./') === 0 && (context = this.context)
  }
  // TODO: no this.options in webpack 4
  css = loaderUtils.interpolateName(this, css.replace(SPACE, ''), {
    content: source,
    context: this.rootContext
  })

  css = postfixCss(css, postfix);
  css = path.resolve(context, css);

  console.log('4444', css)

  if (accessible(css) instanceof Error) {
    return source;
  }
  css = path.relative(this.context, css);

  const styleImports = !query.module ? '\nrequire("./' + css + '");' : query.module + ' "./' + css + '";'
  
  if(sourceMap) {
		const currentRequest = loaderUtils.getCurrentRequest(this);
		const node = SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(sourceMap));
		node.add(styleImports);
		const result = node.toStringWithSourceMap({
			file: currentRequest
		});
		this.callback(null, result.code, result.map.toJSON());
		return;
	}

  return  (!!query.onlycss ? '' : source) + styleImports;
}