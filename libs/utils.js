var fs = require('fs');

function accessible() {
  try {
    fs.accessSync.apply(fs, arguments);
    return true;
  } catch (e) {
    return e;
  }
}

function hasPostfix(c) {
  return /\.[a-zA-Z]+$/.test(c);
}

function postfixCss(css, postfix) {
  return hasPostfix(css) ? css : css + ('.' + (postfix || 'css')).replace(/\.{2,}/, '.');
}

function isObject(o) {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Object';
}
function assign(target, src) {
  if(isObject(target) && isObject(src)) {
    for(var k in src) {
      if(src.hasOwnProperty(k) && !target.hasOwnProperty(k)) {
        target[k] = src[k];
      }
    }
  }
  return target;
}

module.exports = {
  accessible: accessible,
  postfixCss: postfixCss,
  assign: assign
};