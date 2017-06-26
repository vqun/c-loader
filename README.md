# c-loader
c-loader是一个组件式开发的webpack loader，它可以根据模块引入时的参数来决定加载模块的依赖样式文件。

## Install
> npm install c-loader --save-dev
or
> yarn add c-loader --dev

## c-loader configs
* **css**: tell c-loader to load style
* **postfix**: tell c-loader what the style's postfix is, `'css'` by default
* **module**: [added in v0.4.0] tell c-loader what kind of import used, `'require'` by default
* **onlycss**: [added in v0.5.0] tell c-loader to load the style only (in react, when you just want to render the component's markup in server, not in client side, then you should load the style without the component's react codes)

## css options Can use `interpolate names` now (>= v0.8.0)
Start with v0.8.0, you can use the `interpolate names` in c-loader. Exp.:
```javascript
var dialog = require('./dialog?css=./[path][name].less&postfix=css');
```
c-loader will resolve the interpolate names, and use the resolved name as the request style name.

P.S. see [interpolateName](https://github.com/webpack/loader-utils#interpolatename) for more detail

## Usage 1
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
  // in your module
  var dialog = require('./dialog?css&postfix=css');
  // then the c-loader will product a require expression for the dialog module. In this example, it will require index.css relative to dialog file.
  // In fact, in webpack, c-loader will product like this:
  require('./index.css');
  ...// Here is dialog file content.
```

## Usage 2
Also, you can config the `css` and `postfix` in webpack.config.js instead of in `require` or `import` statement.

```javascript
// in webpack.config.js
  module: {
    loaders: [{
      test: /\.js(?:\?.+)?$/,
      loader: 'c-loader?css&postfix=less'
    }, {
      test: /\.css(?:\?.+)?$/,
      loader: 'style!css' // because c-loader will require the css for the required module, you need the style and css loader to handle the css
    }]
  }
```
Then in your module

> var dialog = require('./dialog'); // no `css` and `postfix` here

or

> import dialog from './dialog'); // no `css` and `postfix` here


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

### 'css' Has A Value With './' prefixed [Added in v0.8.0]
If the required module gets a 'css' value and 'css' starts with './', then use the '**context of the moudle**' as the style's context. Exp:

```javascript
var localDialog = require('./dialog?css=./[name].less'); // Local Module

var npmDialog = require('dialog?css=./[name].less'); // NPM Module
```
then, c-loader will load '**{dialog_context}/dialog.less**' for **localDialog**.

And load '**node_modules/dialog/dialog.less**' for **npmDialog**.

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
