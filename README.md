# pixify

[![Build Status](https://travis-ci.org/pixijs/pixify.svg?branch=master)](https://travis-ci.org/pixijs/pixify)

Browserify bundle process for PIXI libraries.

This creates two build files, compressed and uncompressed. Both with sourcemaps and license headers. 

## Installation

```bash
npm install pixify --save-dev
```

## Commandline Usage

```bash
pixify --name [library-name]
```

For instance, 
```bash
pixify --name pixi
```

### Options

* **--name** or **-n** (required) The name of the output file. 
* **--source** or **-s** (default: `./src/index.js` Application source to build. 
* **--dest** or **-d** (default: `./bin/`) Destination folder for building.
* **--exclude** or **-e** (optional) Folder names in `--source` to ignore, for custom builds.

## API Usage

Alternatively, use the Node API:

```js
var pixify = require('pixify');
pixify({
	compress: true,
	output: 'library.min.js',
	source: './src/',
	dest: './bin/',
	name: 'library'
});
```

### Options

* **output** (`String`) Output file name (e.g. "library.js")
* **compress** (`Boolean`) `true` to compress output
* **source** (`String`) Output source name (e.g. "./src/")
* **name** (`String`) Standalone name for Browserify
* **dest** (`String`) Output folder (e.g. "./bin/")
* **exclude** (`String|String[]`)  List of modules to ignore from output. Useful for creating custom builds.

## License

This content is released under the [MIT License](http://opensource.org/licenses/MIT).
