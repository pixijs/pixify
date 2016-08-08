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

// Build the uncompressed output
pixify({
    compress: false,
    output: name + '.js'
});

// Create the compressed output
pixify({
    compress: true,
    output: name + '.min.js'
});