"use strict";

var _ = require('lodash');
var expect = require('expect.js');
var fs = require('fs-promise');
var multilang = require('..');
var stripBom = require('strip-bom');
var expectCalled = require('expect-called');
var Promise = require('promise');
var path = require('path');

function MiniStreamCapture(){
    var internalContent = [];
    this.write = function write(message){
        internalContent.push(message);
    }
    this.getContent = function getContent(){
        return internalContent.join('');
    }
}

describe('multilang.main', function(){
    var contentOfDoc='The content of the doc';
    function doSimpleSuccessTask(done,opts){
        var obtainLangsControl=expectCalled.control(multilang,'obtainLangs',{returns:[
            {main:'mm', langs:{xx:{fileName:'xx.md'}}},
        ]});
        var readFileControl =expectCalled.control(fs,'readFile',{returns:[Promise.resolve(contentOfDoc)]});
        var changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:['valid content']});
        var writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promise.resolve()]});
        multilang.main({
            input:'INPUT.md',
            langs:['xx'],
            output:'OUTPUT.md',
            directory:'aDirectory',
            silent:opts.silent,
            chanout:opts.chanout,
            chanerr:opts.chanerr
        }).then(function(exitCode){
            expect(readFileControl .calls).to.eql([['INPUT.md',{encoding: 'utf8'}]]);
            expect(changeDocControl.calls).to.eql([[contentOfDoc,'xx']]);
            expect(writeFileControl.calls).to.eql([['aDirectory'+path.sep+'OUTPUT.md','valid content']]);
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
    }
    it('do simple task silently',function(done){
        doSimpleSuccessTask(done, {silent:true });
    });
    it('do simple task with warnings',function(done){
        var getWarningsControl=expectCalled.control(multilang,'getWarnings',{returns:['this is the warning\n with 2 lines']});
        var chanout = new MiniStreamCapture();
        var chanerr = new MiniStreamCapture();
        doSimpleSuccessTask(function(err){
            if(err){
                done(err);
            }else{
                try{
                    expect(chanout.getContent()).to.eql(
                        "Processing 'INPUT.md'...\n"+
                        "Generating 'xx', writing to 'aDirectory\\OUTPUT.md'...\n"+
                        "Generated 'xx', file 'aDirectory\\OUTPUT.md'.\n"
                    );
                    expect(chanerr.getContent()).to.eql('this is the warning\n with 2 lines');
                    expect(getWarningsControl.calls).to.eql([[contentOfDoc]]);
                    done();
                }catch(err){
                    done(err);
                }
            }
            getWarningsControl.stopControl();
        }, {silent:false, chanout:chanout, chanerr:chanerr});
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