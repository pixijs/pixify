#!/usr/bin/env node

var minimist = require('minimist');
var pixify = require('./lib/pixify');

// Get the commandline arguments
var args = minimist(process.argv.slice(2), {
    alias: { 
        e: 'exclude',
        d: 'dest',
        s: 'source',
        n: 'name'
    },
    string: [
        'name',
        'dest',
        'source'
    ]
});

var name = args.name;

if (!name) {
    console.log('> ERROR: Must include name for output.');
    process.exit(1);
}

// Bundle and show the timestamps
function bundle(options, callback) {
    var startTime = Date.now();
    pixify(options, function() {
        // Display the output
        var sec = (Date.now() - startTime) / 1000;
        console.log('> Built %s in %d seconds', name + '.js', sec);
        callback();
    });
}

// Do the debug build
bundle({
    compress: false,
    output: name + '.js'
},
// Do the release build
bundle.bind(null, {
    compress: true,
    output: name + '.min.js'
}, 
// Add an extra line
function(){
    console.log('');
}));
