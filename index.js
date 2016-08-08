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
    ],
    default: {
        dest: './bin/',
        source: './src/'
    }
});

if (!args.name) {
    console.log('> ERROR: Must include name for output.');
    process.exit(1);
}

// Build the uncompressed output
args.output = args.name + '.js';
args.compress = false;
bundle(args);

// Create the compressed output
args.output = args.name + '.min.js';
args.compress = true;
bundle(args);