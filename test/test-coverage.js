"use strict";

var _ = require('lodash');
var expect = require('expect.js');
var fs = require('fs-promise');
var multilang = require('..');
var stripBom = require('strip-bom');
var expectCalled = require('expect-called');
var Promise = require('promise');
var path = require('path');

describe('multilang coverage', function(){

    describe('multilang.main', function(){
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
            directory: opts.noInputDir ? null : 'aDirectory',
            silent: ! opts.turnOffStdOut
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
                done(err);
            }
        }).catch(
            done
        ).then(function(){
            process.stdout.write = old_stdout;
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
    it('generating errors in parameters.langs & output',function(done){
        tipicalTest(done,{langs:['mm', 'yy', 'pp'],esperaError:/parameter output with more than one lang/});
    });
    it('generating errors in parameters.directory',function(done){
        tipicalTest(done,{langs:null, noInputDir:true, esperaError:/no output directory specified/});
    });
});    

});