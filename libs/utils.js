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

module.exports = {
  accessible: accessible,
  posfixCss: posfixCss
};
