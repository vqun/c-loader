var fs = require('fs');

function accessible() {
  try {
    fs.accessSync.apply(fs, arguments);
    return true;
  } catch (e) {
    return e;
  }
}

function hasPostfix(c, postfix) {
  return !!postfix ? c.lastIndexOf(postfix) === 0 : /\.[a-zA-Z]+$/.test(c);
}

function postfixCss(css, postfix) {
  postfix = postfix || 'css'
  return hasPostfix(css, postfix) ? css : css + ('.' + postfix).replace(/\.{2,}/, '.');
}

function isObject(o) {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Object';
}
function assign() {
  var target = arguments[0]
  if(isObject(target) && arguments.length > 1) {
    for(var j = 1, l = arguments.length; j < l;) {
      var src = arguments[j++]
      for(var k in src) {
        if(src.hasOwnProperty(k)) {
          target[k] = src[k]
        }
      }
    }
  }
  return target;
}

module.exports = {
  accessible: accessible,
  postfixCss: postfixCss,
  assign: Object.assign || assign
};