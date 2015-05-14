"use strict";

var _ = require('lodash');
var expect = require('expect.js');
var fs = require('fs-promise');
var multilang = require('..');
var stripBom = require('strip-bom');
var expectCalled = require('expect-called');
var Promise = require('promise');
var path = require('path');
 
describe('multilang.main coverage 2', function(){
    var obtainLangsControl;
    var readFileControl;
    var changeDocControl;
    var writeFileControl;
    function tipicalTest(done, opts){
        obtainLangsControl=expectCalled.control(multilang,'obtainLangs',{returns:[{main:'mm', langs:{xx:{fileName:'xx.md'}}}]});
        readFileControl =expectCalled.control(fs,'readFile',{returns:[Promise.resolve('content of INPUT')]});
        changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:['valid content']});
        writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promise.resolve()]});
        var old_stdout = process.stdout.write;
        if(opts.turnOffStdOut){
            process.stdout.write = function() {};
        }
        multilang.main({
            input:'INPUT.md',
            langs:opts.langs,
            output:'OUTPUT.md',
            directory:'aDirectory',
            silent:false
        }).then(function(exitCode){
            if(opts.esperaError){
                done(new Error('esperaba un error en esta prueba'));
            }else{
                process.stdout.write = old_stdout;
                expect(readFileControl .calls).to.eql([['INPUT.md',{encoding: 'utf8'}]]);
                expect(changeDocControl.calls).to.eql([['content of INPUT','xx']]);
                expect(writeFileControl.calls).to.eql([['aDirectory'+path.sep+'OUTPUT.md','valid content']]);
                expect(exitCode).to.eql(0);
                done();
            }
        }).catch(function(err){
            if(opts.esperaError){
                expect(writeFileControl.calls.length).to.eql(0);
                expect(readFileControl .calls).to.eql([['INPUT.md',{encoding: 'utf8'}]]);
                expect(changeDocControl.calls.length).to.eql(0);
                expect(err.message).to.match(opts.esperaError);
                done();
            }else{
                process.stdout.write = old_stdout;
                done(err);
            }
        }).catch(
            done
        ).then(function(){
            readFileControl .stopControl();
            changeDocControl.stopControl();
            writeFileControl.stopControl();
            obtainLangsControl.stopControl();
        });
    }
    it('do simple task, verbose',function(done){
        tipicalTest(done,{langs:['xx'],turnOffStdOut:true});
    });
    it('do another simple task, verbose',function(done){
        tipicalTest(done,{langs:null,turnOffStdOut:true});
    });
    it('generating errors in parameters.langs',function(done){
        tipicalTest(done,{langs:['mm'],esperaError:/no lang specified \(or main lang specified\)/});
    });    
});    

describe.skip('multilang.main coverage', function(){
    var obtainLangsControl;
    var readFileControl;
    var changeDocControl;
    var writeFileControl;
    beforeEach(function(){
        obtainLangsControl=expectCalled.control(multilang,'obtainLangs',{returns:[{main:'mm', langs:{xx:{fileName:'xx.md'}}}]});
        readFileControl =expectCalled.control(fs,'readFile',{returns:[Promise.resolve('content of INPUT')]});
        changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:['valid content']});
        writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promise.resolve()]});
    });
    afterEach(function(){
        readFileControl .stopControl();
        changeDocControl.stopControl();
        writeFileControl.stopControl();
        obtainLangsControl.stopControl();
    });
    it('generating errors in parameters.langs',function(done){
        var invalidLangs = ['mm'];
        //console.log("obtainLangsControl", obtainLangsControl);
        obtainLangsControl.remainReturns[0].langs = invalidLangs;
        multilang.main({
            input:'INPUT.md',
            langs:invalidLangs,
            output:'OUTPUT.md',
            directory:'aDirectory',
            silent:true
        }).then(function(returnErr){
            done(returnErr);
        }).catch(function(err){
            // console.log("err", err);
            expect(writeFileControl.calls.length).to.eql(0);
            expect(readFileControl .calls).to.eql([['INPUT.md',{encoding: 'utf8'}]]);
            expect(changeDocControl.calls.length).to.eql(0);
            done();
        });
    });
    it('generating errors in parameters.langs & output',function(done){
        var invalidLangs = ['mm', 'yy', 'pp'];
        obtainLangsControl.remainReturns[0].langs = invalidLangs;
        multilang.main({
            input:'INPUT.md',
            langs:invalidLangs,
            output:'OUTPUT.md',
            directory:'aDirectory',
            silent:true
        }).then(function(returnErr){
            // console.log(returnErr);
            done(returnErr);
        }).catch(function(err){
            //console.log("err", err);
            expect(writeFileControl.calls.length).to.eql(0);
            expect(readFileControl .calls).to.eql([['INPUT.md',{encoding: 'utf8'}]]);
            expect(changeDocControl.calls.length).to.eql(0);
            done();
        });
    });
    it('generating errors in parameters.directory',function(done){
        multilang.main({
            input:'INPUT.md',
            langs:['xx'],
            output:'OUTPUT.md',
            directory:null,
            silent:true
        }).then(function(returnErr){
            // console.log(returnErr);
            done(returnErr);
        }).catch(function(err){
            //console.log("err", err);
            expect(writeFileControl.calls.length).to.eql(0);
            expect(readFileControl .calls).to.eql([['INPUT.md',{encoding: 'utf8'}]]);
            expect(changeDocControl.calls.length).to.eql(0);
            done();
        });
    });
});