var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var vfs = require('vinyl-fs');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var header = require('gulp-header');
var sourcemaps = require('gulp-sourcemaps');
var preprocess = require('gulp-preprocess');
var path = require('path');
var watchify = require('watchify');
var fs = require('fs');
require('colors');

/**
 * Create the bundle
 * @function bundle
 * @param {Object|String} options The options or the output name
 * @param {String} options.output Output file name (e.g. "library.js")
 * @param {String} options.name Standalone name for Browserify (e.g. "library")
 * @param {Boolean} [options.compress=true] `true` to compress output
 * @param {String} [options.source='./src/'] Output source name (e.g. "./src/")
 * @param {String} [options.dest='./bin/'] Output folder (e.g. "./bin/")
 * @param {Boolean} [options.external=true] `true` to bundle external modules.
 * @param {Array|String} [options.exclude] List of folders to exclude.
 * @param {Function} [callback] Optional callback when complete
 */
module.exports = function(options, callback) {

    if (typeof options === "string") {
        options = { output: options };
    }

    options = Object.assign({
        compress: true,
        source: './src/',
        dest: './bin/',
        cli: false,
        watch: false,
        external: true,
        name: path.parse(options.output).name
    }, options);

    var bundler = browserify({
        entries: options.source,
        standalone: options.name,
        bundleExternal: options.external,
        debug: true,
        cache: {},
        packageCache: {}
    });

    function done(err) {
        if (err) {
            if (options.cli) {
                console.log('> ERROR: %s'.red, err.message);
            }
            else {
                console.error(err.message);
            }
        }
        if (callback) {
            callback(err);
        }
    }

    if (options.watch) {
        bundler.plugin(watchify);
    }

    var license = fs.readFileSync(path.join(__dirname, 'license.js'), 'utf8');
    var packageInfo;

    try {
        packageInfo = require(path.resolve(process.cwd(), 'package.json'));  
    }
    catch(e) {
        done(new Error('No package.json found in the current directory'));
        return;
    }

    // Exclude certain modules
    if (options.exclude) {
        var excludes = options.exclude;
        if (!Array.isArray(excludes)) {
            excludes = [excludes];
        }
        excludes.forEach(function(exclude){
            try {
                var excludePath = path.resolve(process.cwd(), options.source, exclude);
                bundler.ignore(require.resolve(excludePath));
                if (options.cli) {
                    console.log('> Ignoring module \'%s\'', exclude);
                }
            }
            catch(e){
                if (options.cli) {
                    console.log('> WARNING: Module not found for \'%s\''.yellow, exclude);
                }
                else {
                    console.warn('Module not found for \'%s\'', exclude);
                }
            }
        });
    }

    function rebundle() {
        return bundler.bundle()
            .on('error', done)
            .pipe(source(options.output))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(preprocess({
                    context: {
                        DEBUG: !options.compress,
                        RELEASE: !!options.compress
                    }
                }))
                .pipe(gulpif(options.compress, uglify()))
                .pipe(header(license, {
                    date: (new Date()).toString(),
                    name: packageInfo.name,
                    version: packageInfo.version,
                    pkg: packageInfo
                }))
            .pipe(sourcemaps.write('./', { sourceRoot: '' }))
            .pipe(vfs.dest(options.dest))
            .on('end', done);
    }
    bundler.on('update', rebundle);
    bundler.on('log', function(message) {
        if (options.cli) {
            console.log('>', message);
        }
        else {
            console.log(message);
        }
    });
    rebundle();
};