"use strict";

var expect = require('expect.js');
var fs = require('fs-promise');
var multilang = require('..');

describe('multilang', function(){
    describe('example test', function(){
        it.skip('generate the spanish file of the example', function(done){
            fs.readFile('./examples/multilanguage.md',{encoding: 'utf8'}).then(function(englishDoc){
                return fs.readFile('./examples/multilenguaje.md',{encoding: 'utf8'}).then(function(expectedSpanishDoc){
                    var obtainedSpanishDoc = multilang.changeDoc(englishDoc,'es');
                    expect(obtainedSpanishDoc).to.eql(expectedSpanishDoc);
                    done();
                });
            }).catch(function(err){
                done(err);
            })
        });
    });
    describe('step by step', function(){
        it('obtain languages from header', function(){
            var header='\n\n\n<!--multilang v0 ru:rusky.html fr:french.html de:german.html-->\n\n\n';
            var obtainedLangs = multilang.obtainLangs(header);
            expect(obtainedLangs).to.eql({
                main: 'ru',
                langs: {
                    ru: {fileName: 'rusky.html'}, 
                    fr: {fileName: 'french.html'},
                    de: {fileName: 'german.html'}
                }
            });
        });
        it('generate the button section overriding defaults', function(){
            var header='<!--multilang v0 en:readme.md fr:lisezmoi.md -->';
            expect(!!multilang.langs).to.be.eql(true);
            multilang.langs.fr={
                name: 'français',
                abr: 'fr',
                languages:{
                    fr: 'français',
                    en: 'anglais'
                },
                phrases:{
                    language: 'langue',
                }
            }
            var buttonSection = multilang.generateButtons(header,'fr');
            expect(buttonSection).to.eql(
                '<!--multilang buttons -->\n'+
                'langue: ![français](https://github.com/codenautas/multilang/blob/master/img/lang-fr.png)\n'+ 
                'also available in:\n'+
                '[![anglais](https://github.com/codenautas/multilang/blob/master/img/lang-en.png)](readme.md)'
            );
        });
        it.skip('generate the button section from yamls', function(){
            var header='<!--multilang v0 en:multilanguage.md es:multilenguaje.md it:multilingua.md ru:мультиязычный.md -->';
            var buttonSection = multilang.generateButtons(header,'es');
            expect(buttonSection).to.eql(
                '<!--multilang buttons -->\n'+
                'idioma: ![castellano](https://github.com/codenautas/multilang/blob/master/img/lang-es.png)\n'+
                'también disponible en:\n'+
                '[![inglés](https://github.com/codenautas/multilang/blob/master/img/lang-en.png)](multilanguage.md) -\n'+
                '[![italiano](https://github.com/codenautas/multilang/blob/master/img/lang-it.png)](multilingua.md) -\n'+
                '[![ruso](https://github.com/codenautas/multilang/blob/master/img/lang-ru.png)](мультиязычный.md)\n'
            );
        });
    });
});
