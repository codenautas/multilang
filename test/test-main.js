"use strict";

var expect = require('expect.js');
var Promises = require('best-promise');
var fs = require('fs-promise');
var multilang = require('..');
var stripBom = require('strip-bom-string');
var expectCalled = require('expect-called');
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
            {main:'mm', langs:{xx:{fileName:'xx.md'}}},
        ]});
        var readFileControl =expectCalled.control(fs,'readFile',{returns:[Promises.Promise.resolve(contentOfDoc)]});
        var changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:['valid content']});
        var writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promises.Promise.resolve()]});
        multilang.main({
            input:'INPUT.md',
            langs:['xx'],
            output:'OUTPUT.md',
            directory:'aDirectory',
            silent:opts.silent,
            verbose:opts.verbose,
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
        doSimpleSuccessTask(done, {silent:true});
    });
    it('do simple task with warnings',function(done){
        var getWarningsControl=expectCalled.control(multilang,'getWarnings',{returns:[[{line: 1, text:'this is the warning\n with 2 lines'}]]});
        var chanout = new MiniStreamCapture();
        var chanerr = new MiniStreamCapture();
        doSimpleSuccessTask(function(err){
            if(err){
                done(err);
            }else{
                try{
                    expect(chanout.getContent()).to.eql(
                        "Processing 'INPUT.md'...\n"+
                        "Generating 'xx', writing to 'aDirectory"+path.sep+"OUTPUT.md'...\n"+
                        "Generated 'xx', file 'aDirectory"+path.sep+"OUTPUT.md'.\n"
                    );
                    expect(chanerr.getContent()).to.eql("line 1: this is the warning\n with 2 lines\n");
                    expect(getWarningsControl.calls).to.eql([[contentOfDoc]]);
                    done();
                }catch(err){
                    done(err);
                }
            }
            getWarningsControl.stopControl();
        }, {silent:false, verbose:true, chanout:chanout, chanerr:chanerr});
    });
    it('fail on simple task',function(done){
        var readFileControl =expectCalled.control(fs,'readFile',{returns:[Promises.Promise.resolve('content of INPUT')]});
        var changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:['valid content']});
        var writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promises.reject(new Error("invalid name"))]});
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
    var originalContent='The content of the doc\nwith <!-- the comment -->\n comment';
    var strippedContent='The content of the doc\nwith\n comment';
    function testStripComments(done, opts, obtainedFile, expectedContent){
        var obtainLangsControl=expectCalled.control(multilang,'obtainLangs',{returns:[
            {main:'mm', langs:{xx:{fileName:obtainedFile}}},
            {main:'mm', langs:{xx:{fileName:obtainedFile}}},
        ]});
        var readFileControl =expectCalled.control(fs,'readFile',{returns:[Promises.Promise.resolve(originalContent)]});
        var changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:[expectedContent]});
        var writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promises.Promise.resolve()]});
        multilang.main({
            input:'INPUT.md',
            langs:['xx'],
            output:obtainedFile,
            directory:'aDirectory',
            silent:opts.silent,
            verbose:opts.verbose,
            chanout:opts.chanout,
            chanerr:opts.chanerr,
            stripComments:opts.stripComments
        }).then(function(exitCode){
            expect(readFileControl .calls).to.eql([['INPUT.md',{encoding: 'utf8'}]]);
            expect(changeDocControl.calls).to.eql([[originalContent,'xx']]);
            expect(writeFileControl.calls).to.eql([['aDirectory'+path.sep+obtainedFile,expectedContent]]);
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
    it('strip-comments default with README.md',function(done){
        testStripComments(done, {silent:true}, 'README.md', strippedContent);
    });
    it('strip-comments default with other.md',function(done){
        testStripComments(done, {silent:true}, 'normal.md', originalContent);
    });
    it('strip-comments false with README.md',function(done){
        testStripComments(done, {silent:true, stripComments:false}, 'README.md', originalContent);
    });
    it('strip-comments false with other.md',function(done){
        testStripComments(done, {silent:true, stripComments:false}, 'other.md', originalContent);
    });
    it('strip-comments true with README.md',function(done){
        testStripComments(done, {silent:true, stripComments:true}, 'README.md', strippedContent);
    });
    it('strip-comments true with other.md',function(done){
        testStripComments(done, {silent:true, stripComments:true}, 'other.md', strippedContent);
    });
    it('fail on overlapped input/output',function(done){
        var readFileControl =expectCalled.control(fs,'readFile',{returns:[Promises.Promise.resolve('content of INPUT')]});
        var changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:['valid content']});
        var writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promises.Promise.resolve()]});
        multilang.main({
            input:'aDirectory/INPUT.md',
            langs:['xx'],
            output:'INPUT.md',
            directory:'aDirectory',
            silent:true
        }).then(function(exitCode){
            done("Must fail because input and output are the same");
        }).catch(function(err){
            expect(err).to.be.a(Error);
            expect(err.message).to.match(/input and output should be different/);
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

