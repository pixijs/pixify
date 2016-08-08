var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var vfs = require('vinyl-fs');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');

/**
 * Create the bundle
 * @function bundle
 * @param {Object|String} options The options or the output name
 * @param {String} options.output Output file name (e.g. "library.js")
 * @param {String} options.name Standalone name for Browserify (e.g. "library")
 * @param {Boolean} [options.compress=true] `true` to compress output
 * @param {String} [options.source='./src/'] Output source name (e.g. "./src/")
 * @param {String} [options.dest='./bin/'] Output folder (e.g. "./bin/")
 * @param {Array|String} [options.exclude] List of folders to exclude.
 */
module.exports = function(options) {

    if (typeof options === "string") {
        options = { output: options };
    }

    options = Object.assign({
        compress: true,
        source: './src/',
        dest: './bin/',
        name: path.parse(options.output).name
    }, options);

    var bundler = browserify({
        entries: options.source,
        standalone: options.name,
        debug: true
    });

    // Get the license for the header
    bundler.plugin(
        path.join(__dirname, 'header.js'),
        { file: path.join(__dirname, 'license.js') }
    );

    // Exclude certain modules
    if (options.exclude) {
        var excludes = options.exclude;
        if (!Array.isArray(excludes)) {
            excludes = [excludes];
        }
        excludes.forEach(function(exclude){
            try {
                bundler.ignore(require.resolve(process.cwd(), options.source, exclude));
                console.log('> Ignoring module \'%s\'', exclude);
            }
            catch(e){
                console.log('> ERROR: Module not found for \'%s\'', exclude);
            }
        });
        console.log('');
    }
    bundler.bundle()
        .pipe(source(options.output))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(gulpif(options.compress, uglify({
                mangle: true,
                preserveComments: function(node, comment) {
                    if (/\@preserve/m.test(comment.value)) {
                        return true;
                    }
                }
            })))
        .pipe(sourcemaps.write('./'))
        .pipe(vfs.dest(options.dest));
};