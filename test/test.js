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
        it.skip('separate the content of original doc', function(){
            var doc='first lines\n'+
                '<!--multilang v0 xxxxxxxxxxxxxxxxx-->  \n'+
                '<!--multilang buttons-->  \t \n'+
                'not blank line\n'+
                'other not blank line\n'+
                '\n'+ // one blank line separates de header
                'if no prefix is for all languajes\n'+
                '<!--lang:xx--]  \t  \n'+ // don't mind whites spaces and not distingish < from [ neither ] from >
                'this is lang xx\n'+
                'this too becauses is the same pharagraph\n'+
                '\n\n'+ // preserver white spaces
                '[!--lang:yy,zz--]\n'+ // to languages
                ''+ // zero lines
                '[!--lang:*--]\n'+
                'this is for all langs\n'+
                'last line could not have endline marker';
            var separatedDoc = multilang.splitDoc(doc);
            expect(separatedDoc).to.eql([
                {   
                    all:true,
                    text:'first lines\n'
                },{
                    header:true
                },{
                    all:true,
                    text:'if no prefix is for all languajes\n'
                },{
                    langs:{ xx:true },
                    text:'this is lang xx\n'+
                        'this too becauses is the same pharagraph\n'+
                        '\n\n'
                },{
                    langs:{ yy:true, zz:true },
                    text:''
                },{
                    all:true,
                    text:'this is for all langs\n'+
                        'last line could not have endline marker'
                }
            ]);
        });
        it('parse yaml files', function(){
            var parsedLang = multilang.parseLang('es');
            expect(parsedLang).to.eql({
                name: 'castellano',
                abr: 'es',
                languages: {
                    en: 'inlgés', 
                    es: 'español',
                    it: 'italiano',
                    ru: 'ruso'
                },
                phrases: {
                    language: 'idioma', 
                    'also available in': 'también disponible en',
                    'DO NOT MODIFY DIRECTLY': 'NO MODIFIQUE ESTE ARCHIVO. FUE GENERADO AUTOMÁTICAMENTE POR multilang.js'
                }
            });
            parsedLang = multilang.parseLang('it');
            expect(parsedLang).to.eql({
                name: 'italiano',
                abr: 'it',
                languages: {
                    en: 'inlgese', 
                    es: 'spagnolo',
                    it: 'italiano',
                    ru: 'russo'
                },
                phrases: {
                    language: 'lingua', 
                    'also available in': 'disponibile anche in',
                    'DO NOT MODIFY DIRECTLY': 'NO MODIFIQUE ESTE ARCHIVO. FUE GENERADO AUTOMÁTICAMENTE POR multilang.js'
                }
            });
            parsedLang = multilang.parseLang('ru');
            expect(parsedLang).to.eql({
                name: 'русский',
                abr: 'ru',
                languages: {
                    en: 'английский', 
                    es: 'испанский',
                    it: 'итальянский',
                    ru: 'русский'
                },
                phrases: {
                    language: 'язык', 
                    'also available in': 'также доступны в'
                }
            });
        });
    });
});
