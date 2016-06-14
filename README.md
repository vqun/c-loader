# c-loader
c-loader是一个组件式开发的webpack loader，它可以根据require模块时添加参数来决定加载模块的依赖样式文件。

**在往下了解c-loader之前，建议先看看c-loader作者眼中的[组件](https://github.com/vqun/blog/blob/master/%E7%BB%84%E4%BB%B6.md)。**

## Install
> npm install c-loader --save-dev


## Using
```javascript
// in webpack.config.js
  module: {
    loaders: [{
      test: /\.js(?:\?.+)?$/,
      loader: 'c-loader'
    }, {
      test: /\.css(?:\?.+)?$/,
      loader: 'style!css' // because c-loader will require the css for the required module, you need the style and css loader to handle the css
    }]
  }
  // or
  module: {
    preloaders: [{
      test: /\.js(?:\?.+)?$/,
      loader: 'c-loader',
    }],
    loaders: [{
      test: /\.css(?:\?.+)?$/,
      loader: 'style!css' // because c-loader will require the css for the required module, you need the style and css loader to handle the css
    }]
  }
  
  // in your module
  var dialog = require('./dialog?css');
  // then the c-loader will product a require expression for the dialog module. In this example, it will require index.css relative to dialog file.
  // In fact, in webpack, c-loader will product like this:
  require('./index.css');
  ...// Here is dialog file content.
```

## How To Determin The Style File To Be Used
c-loader will resolve the require query, and determin the style file to be used. c-loader resolves the query and gets the '**css**' value, then require the file to the value.

### require('./dialog')
If there is no 'css' query in the require statement, c-loader will **not load any style**.

### require('./dialog?css') | require('./dialog?css=')
If the 'css' query gets null or empty, c-loader will load **the default style - index.css**.

### require('./dialog?css=styles/my-dialog')
If the 'css' query gets a value, c-loader will load **the given style - styles/my-dialog.css**.

Also, you can use less/sass or any other style. Just add the postfix, if not, c-loader will recognize it as a '.css' file.

Like this:
> require('./dialog?css=styles/my-dialog.less');

Then c-loader will keep the less, and load **styles/my-dialog.less**.

**REMEMBER**: c-loader does not resolve the style, it just load it. You need use corresponding loaders to resolve them.

## How To Determin The Style File's *Context*
After c-loader gets the 'css' query, it needs determin the **context** to get the file. For local module and NPM module, c-loader has a rule for them. This rule depends on the 'css' value.

### 'css' Has A Value
If the required module gets a 'css' value, use the '**context**' option in the webpack.config.js as the style's context. Exp:
```javascript
// in webpack.config.js
module.exports = {
  context: __dirname,
  // ... other configs
}
```

Then c-loader will get __dirname as the style's context. If we have:
```javascript
require('./dialog?css=styles/my-dialog.less'); // Local Module
// or
require('dialog?css=styles/my-dialog.less'); // NPM Module
```

then, c-loader will load the '**{webpack.config.context}/styles/my-dialog.less**'.

### 'css' is Null or Empty
If the required module gets a null or empty 'css', use the '**context of the module**' as the style's context. Exp:
```javascript
var localDialog = require('./dialog?css'); // Local Module

var npmDialog = require('dialog?css'); // NPM Module
```
then, c-loader will load '**{dialog_context}/styles/my-dialog.less**' for **localDialog**.

And load '**node_modules/dialog/styles/my-dialog.less**' for **npmDialog**.

##### **REMEMBER**: c-loader does not resolve the style, it just load it. You need use corresponding loaders to resolve them.
