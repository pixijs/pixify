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
* **--source** or **-s** (default: `./src/` Application source to build. 
* **--dest** or **-d** (default: `./bin/`) Destination folder for building.
* **--exclude** or **-e** (optional) Folder names in `--source` to ignore, for custom builds.

## API Usage

Alternatively, use the Node API:

```js
var pixify = require('pixify');

// Full verbose options
pixify({
	output: 'library.min.js',
	name: 'library',
    source: './src/', 
    dest: './bin/',
    compress: true
});

// Short-hand with all defaults
pixify('library.min.js');
```

### Options

* **output** (`String`) Output file name (e.g. "library.js")
* **name** (`String`) Standalone name for Browserify (e.g. "library")
* **compress** (`Boolean`, default: `true`) `true` to compress output
* **source** (`String`, default: `"./src/"`) Output source name
* **dest** (`String`, default: `"./bin/"`) Output folder 
* **exclude** (`String|String[]`)  List of modules to ignore from output. Useful for creating custom builds.

## License

This content is released under the [MIT License](http://opensource.org/licenses/MIT).
