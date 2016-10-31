#!/usr/bin/env node

var minimist = require('minimist');
var pixify = require('./lib/pixify');

// Get the commandline arguments
var args = minimist(process.argv.slice(2), {
    alias: { 
        e: 'exclude',
        d: 'dest',
        l: 'license',
        s: 'source',
        n: 'name',
        o: 'outputName',
        w: 'watch',
        x: 'noExternal'
    },
    boolean: [
        'watch',
        'noExternal'
    ],
    string: [
        'name',
        'dest',
        'source',
        'outputName',
        'license'
    ],
    default: {
        dest: './bin/',
        source: './src/',
        watch: false,
        noExternal: false
    }
});

var outputName = args.outputName || args.name;

if (!outputName) {
    console.log('> ERROR: Must include name for output.');
    process.exit(1);
}

// Bundle and show the timestamps
function bundle(options, callback) {
    // Build time isn't needed using watchify
    // time and size are generated automatically
    if (!args.watch) {
        var startTime = Date.now();
    }
    options = Object.assign({}, options, args);
    pixify(options, function() {
        if (!args.watch) {
            // Display the output, on in non-watch mode
            var sec = (Date.now() - startTime) / 1000;
            console.log('> Built %s in %d seconds', outputName + '.js', sec);
        }
        callback();
    });
}

// Do the debug build
bundle({
    cli: true,
    compress: false,
    output: outputName + '.js',
    external: !args.noExternal
},
function() {
    // Don't do minify release when watching
    // it's too slow because of uglify
    if (!args.watch) {
        // Do the release build
        bundle({
            cli: true,
            compress: true,
            output: outputName + '.min.js',
            external: !args.noExternal
        }, finish);
    }
    else {
        finish();
    }
});

// Adds an extra line
function finish(){
    console.log('');
}
