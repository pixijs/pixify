#!/usr/bin/env node

var minimist = require('minimist');
var bundle = require('./lib/bundle');

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
bundle({
    compress: false,
    output: name + '.js'
});

// Create the compressed output
bundle({
    compress: true,
    output: name + '.min.js'
});