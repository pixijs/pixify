var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var vfs = require('vinyl-fs');
var uglify = require('gulp-uglify');
var empty = require('gulp-empty');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');

/**
 * Create the bundle
 * @function bundle
 * @param {Object} options The options
 * @param {String} options.output Output file name (e.g. "library.js")
 * @param {Boolean} options.compress `true` to compress output
 * @param {String} options.source Output source name (e.g. "./src/")
 * @param {String} options.name Standalone name for Browserify
 * @param {String} options.dest Output folder (e.g. "./bin/")
 * @param {Array|String} [options.exclude] List of folders to exclude.
 */
module.exports = function(args) {

    var bundler = browserify({
        entries: args.source,
        standalone: args.name,
        debug: true
    });

    // Get the license for the header
    bundler.plugin(
        path.join(__dirname, 'header.js'),
        { file: path.join(__dirname, 'license.js') }
    );

    // Exclude certain modules
    if (args.exclude) {
        var excludes = args.exclude;
        if (!Array.isArray(excludes)) {
            excludes = [excludes];
        }
        excludes.forEach(function(exclude){
            try {
                bundler.ignore(require.resolve(process.cwd(), args.source, exclude));
                console.log('> Ignoring module \'%s\'', exclude);
            }
            catch(e){
                console.log('> ERROR: Module not found for \'%s\'', exclude);
            }
        });
        console.log('');
    }
    bundler.bundle()
        .pipe(source(args.output))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(!args.compress ? empty() : uglify({
                mangle: true,
                preserveComments: function(node, comment) {
                    if (/\@preserve/m.test(comment.value)) {
                        return true;
                    }
                }
            }))
        .pipe(sourcemaps.write('./'))
        .pipe(vfs.dest(args.dest));
};