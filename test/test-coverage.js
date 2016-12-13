"use strict";

var expect = require('expect.js');
var fs = require('fs-promise');
var multilang = require('..');
var stripBom = require('strip-bom-string');
var expectCalled = require('expect-called');
var path = require('path');


describe('multilang coverage', function(){

    describe('multilang.main', function(){
    var obtainLangsControl;
    var readFileControl;
    var changeDocControl;
    var writeFileControl;
    function tipicalTest(done, opts){
        var olcReturn={main:'mm', langs:{xx:{fileName:'xx.md'}}};
        obtainLangsControl=expectCalled.control(multilang,'obtainLangs',
                                                    {returns:[olcReturn, olcReturn, olcReturn]});
        readFileControl =expectCalled.control(fs,'readFile',{returns:[Promise.resolve('content of INPUT')]});
        changeDocControl=expectCalled.control(multilang,'changeDoc',{returns:['valid content']});
        writeFileControl=expectCalled.control(fs,'writeFile',{returns:[Promise.resolve()]});
        var old_stdout = process.stdout.write;
        var old_stderr = process.stderr.write;
        if(opts.turnOffOutput){
            process.stdout.write = function() {};
            process.stderr.write = function() {};
        }
        multilang.main({
            input:'INPUT.md',
            langs:opts.langs,
            output:'OUTPUT.md',
            directory: opts.noInputDir ? null : 'aDirectory',
            silent: ! opts.turnOffOutput
        }).then(function(exitCode){
            if(opts.esperaError){
                done(new Error('esperaba un error en esta prueba'));
            }else{
                process.stdout.write = old_stdout;
                process.stderr.write = old_stderr;
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
            process.stderr.write = old_stderr;
            readFileControl .stopControl();
            changeDocControl.stopControl();
            writeFileControl.stopControl();
            obtainLangsControl.stopControl();
        });
    }
    it('do simple task, verbose',function(done){
        tipicalTest(done,{langs:['xx'],turnOffOutput:true});
    });
    it('do another simple task, verbose',function(done){
        tipicalTest(done,{langs:null,turnOffOutput:true});
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
