"use strict";

var _ = require('lodash');
var expect = require('expect.js');
var fs = require('fs-promise');
var multilang = require('..');
var stripBom = require('strip-bom');
var expectCalled = require('expect-called');
var Promise = require('promise');
 
describe('multilang.main', function(){
    it('do simple task',function(done){
        var obtainLangsControl=expectCalled.control(multilang,'obtainLangs',{returns:[{main:'mm', langs:{xx:{fileName:'xx.md'}}}]});
        var readFileControl =expectCalled.control(fs,'readFile',{returns:[Promise.resolve('content of INPUT')]});
        var changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:['valid content']});
        var writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promise.resolve()]});
        multilang.main({
            input:'INPUT.md',
            langs:['xx'],
            output:'OUTPUT.md',
            directory:'aDirectory',
            silent:true
        }).then(function(exitCode){
            expect(readFileControl .calls).to.eql([['INPUT.md',{encoding: 'utf8'}]]);
            expect(changeDocControl.calls).to.eql([['content of INPUT','xx']]);
            expect(writeFileControl.calls).to.eql([['aDirectory\\OUTPUT.md','valid content']]);
            expect(exitCode).to.eql(0);
            done();
        }).catch(function(err){
            done(err);
        }).then(function(){
            readFileControl .stopControl();
            changeDocControl.stopControl();
            writeFileControl.stopControl();
            obtainLangsControl.stopControl();
        });
    });
    it('fail on simple task',function(done){
        var readFileControl =expectCalled.control(fs,'readFile',{returns:[Promise.resolve('content of INPUT')]});
        var changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:['valid content']});
        var writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promise.reject(new Error("invalid name"))]});
        multilang.main({
            input:'INPUT.md',
            langs:['xx'],
            output:'OUTPUT.md',
            directory:'aDirectory',
            silent:true
        }).then(function(exitCode){
            done("Must return a reject promise, because writeFile fails");
        }).catch(function(err){
            expect(err).to.be.a(Error);
            expect(err.message).to.match(/invalid name/);
            done();
        }).then(function(){
            readFileControl .stopControl();
            changeDocControl.stopControl();
            writeFileControl.stopControl();
        }).catch(function(err){
            done(err);
        });
    });
});