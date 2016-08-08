var pixify = require('../lib/pixify');
var rimraf = require('rimraf');
var assert = require('assert');

function validate(output, result){
    var lib = require('./bin/' + output);
    assert.strictEqual(result, lib(), 'Library standalone should work');
}

describe('pixify', function(){
    before(function(){
        process.chdir(__dirname);
    });

    after(function(){
        rimraf.sync('./bin');
    });

    it('should be debug mode', function(done){
        var output = 'test.js';
        pixify({
            output: output,
            name: 'test',
            compress: false
        }, function(){
            validate(output, true);
            done();
        });
    });

    it('should be build in release mode', function(done){
        var output = 'test.min.js';
        pixify(output, function(){
            validate(output, false);
            done();
        });
    });
});