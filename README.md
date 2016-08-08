# pixify

[![Build Status](https://travis-ci.org/pixijs/pixify.svg?branch=master)](https://travis-ci.org/pixijs/pixify)

Browserify bundle process for PIXI libraries.

This creates two build files, compressed and uncompressed. Both with sourcemaps and license headers. 

## Installation

```bash
npm install pixify --save-dev
```

## Usage

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

## License

This content is released under the [MIT License](http://opensource.org/licenses/MIT).
