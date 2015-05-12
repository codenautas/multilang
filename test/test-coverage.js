"use strict";

var _ = require('lodash');
var expect = require('expect.js');
var fs = require('fs-promise');
var multilang = require('..');
var stripBom = require('strip-bom');
var expectCalled = require('expect-called');
var Promise = require('promise');
var path = require('path');
 
describe('multilang.main null input', function(){
    it('do simple task, verbose',function(done){
        var obtainLangsControl=expectCalled.control(multilang,'obtainLangs',{returns:[{main:'mm', langs:{xx:{fileName:'xx.md'}}}]});
        var readFileControl =expectCalled.control(fs,'readFile',{returns:[Promise.resolve('content of INPUT')]});
        var changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:['valid content']});
        var writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promise.resolve()]});
        var old_stdout = process.stdout.write;
        process.stdout.write = function() {};
        multilang.main({
            input:'INPUT.md',
            langs:['xx'],
            output:'OUTPUT.md',
            directory:'aDirectory',
            silent:false
        }).then(function(exitCode){
            process.stdout.write = old_stdout;
            expect(readFileControl .calls).to.eql([['INPUT.md',{encoding: 'utf8'}]]);
            expect(changeDocControl.calls).to.eql([['content of INPUT','xx']]);
            expect(writeFileControl.calls).to.eql([['aDirectory'+path.sep+'OUTPUT.md','valid content']]);
            expect(exitCode).to.eql(0);
            done();
        }).catch(function(err){
            process.stdout.write = old_stdout;
            done(err);
        }).then(function(){
            readFileControl .stopControl();
            changeDocControl.stopControl();
            writeFileControl.stopControl();
            obtainLangsControl.stopControl();
        });
    });
});