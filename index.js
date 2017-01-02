#!/usr/bin/env node

"use strict";

const minimist = require('minimist');
const pixify = require('./lib/pixify');

// Get the commandline arguments
const args = minimist(process.argv.slice(2), {
    alias: {
        e: 'exclude',
        d: 'dest',
        l: 'license',
        s: 'source',
        n: 'name',
        o: 'outputName',
        w: 'watch',
        x: 'noExternal',
        p: 'plugin',
        t: 'transform',
        c: 'compress'
    },
    boolean: [
        'watch',
        'noExternal',
        'compress'
    ],
    string: [
        'name',
        'dest',
        'source',
        'outputName',
        'license',
        'plugin',
        'transform'
    ],
    default: {
        dest: './bin/',
        source: './src/',
        watch: false,
        noExternal: false,
        compress: true
    }
});

const outputName = args.outputName || args.name;

if (!outputName) {
    console.log('> ERROR: Must include name for output.');
    process.exit(1);
}

// Bundle and show the timestamps
function bundle(options, callback) {
    // Build time isn't needed using watchify
    // time and size are generated automatically
    let startTime;
    if (!args.watch) {
        startTime = Date.now();
    }
    options = Object.assign({}, args, options);
    pixify(options, function() {
        if (!args.watch) {
            // Display the output, on in non-watch mode
            const sec = (Date.now() - startTime) / 1000;
            console.log('> Built %s in %d seconds', options.output, sec);
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
    if (!args.watch && args.compress) {
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
