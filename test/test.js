"use strict";

var expect = require('expect.js');
var fs = require('fs-promise');
var multilang = require('..');
var stripBom = require('strip-bom');
var expectCalled = require('expect-called');
 
describe('multilang', function(){
    describe('integration', function(){
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
        it.skip('generate the button section overriding defaults', function(){
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
            var docLangs={
                main:'en',
                langs:{
                    en:'readme.md',
                    fr:'lisezmoi.md',
                }
            }
            var buttonSection = multilang.generateButtons(docLangs,'fr');
            expect(buttonSection).to.eql(
                '<!--multilang buttons -->\n'+
                'langue: ![français](https://github.com/codenautas/multilang/blob/master/img/lang-fr.png)\n'+ 
                'also available in:\n'+
                '[![anglais](https://github.com/codenautas/multilang/blob/master/img/lang-en.png)](readme.md)'
            );
        });
        it.skip('generate the button section from yamls', function(){
            var docLangs={
                main:'en',
                langs:{
                    en:'multilanguage.md',
                    es:'multilenguaje.md',
                    it:'multilingua.md',
                    ru:'мультиязычный.md'
                }
            }
            var buttonSection = multilang.generateButtons(docLangs,'es');
            expect(buttonSection).to.eql(
                '<!--multilang buttons -->\n'+
                'idioma: ![castellano](https://github.com/codenautas/multilang/blob/master/img/lang-es.png)\n'+
                'también disponible en:\n'+
                '[![inglés](https://github.com/codenautas/multilang/blob/master/img/lang-en.png)](multilanguage.md) -\n'+
                '[![italiano](https://github.com/codenautas/multilang/blob/master/img/lang-it.png)](multilingua.md) -\n'+
                '[![ruso](https://github.com/codenautas/multilang/blob/master/img/lang-ru.png)](мультиязычный.md)'
            );
        });
        it.skip('separate the content of original doc', function(){
            var doc='\ufeffFirst lines\n'+
                '<!--multilang v0 xxxxxxxxxxxxxxxxx-->  \n'+
                '<!--multilang buttons-->  \t \n'+
                'not blank line\n'+
                'other not blank line\n'+
                ' \t \r\n'+ // one blank line separates de header, may by has or not spaces or \r before the \n
                'if no prefix is for all languajes\n'+
                '<!--lang:xx--]  \t  \n'+ // don't mind whites spaces and not distingish < from [ neither ] from >
                'this is lang xx\r\n'+ // have DOS/Windows EOL
                'this too becauses is the same pharagraph\n'+
                '\n\n'+ // preserver white spaces
                '[!--lang:yy,zz--]\n'+ // to languages
                ''+ // zero lines
                '[!--lang:*--]\n'+
                'this is for all langs\n'+
                'last line could not have endline marker';
            var separatedDoc = multilang.splitDoc(doc);
            expect(separatedDoc).to.eql([
                {special: 'header', withBom:true},
                {all:true, text:'First lines\n'},
                {special: 'buttons'},
                {all:true, text:'if no prefix is for all languajes\n'},
                {   
                    langs:{ xx:true }, 
                    text:'this is lang xx\r\n'+
                        'this too becauses is the same pharagraph\n'+
                        '\n\n'
                },
                {langs:{ yy:true, zz:true }, text:''},
                {all:true, text:'this is for all langs\n'+'last line could not have endline marker'}
            ]);
        });
        it('parse yaml files', function(){
            // quizás haya que borrar las llamadas a es e it y dejar solo ru (cuando haya que actualizar el caso)
            var parsedLang = multilang.parseLang('es');
            expect(parsedLang).to.eql({
                name: 'castellano',
                abr: 'es',
                languages: {
                    en: 'inglés', 
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
    describe('controls', function(){
        it.skip('generate the spanish file of the example', function(done){
            fs.readFile('./examples/multilanguage.md',{encoding: 'utf8'}).then(function(englishDoc){
                englishDoc = stripBom(englishDoc);
                var splitDocControl = expectCalled.control(multilang,'splitDoc',{returns:[
                    {special: 'header', withBom:false}, 
                    {langs: {en: true}, text:"in other lang don't put"},
                    {langs: {fr: true}, text:"top line in french\r\n\n"},
                    {special: 'buttons'},
                    {langs: {en: true, es:true}, text:"two langs without fr"},
                    {langs: {fr: true}, text:'second section in french\n\n\n'},
                    {langs: {en: true, fr: true}, text:'section in mixed lang\nfor various langs\n\n'},
                    {all:true, text:'section for all'}
                ]});
                var generateButtonsControl = expectCalled.control(multilang,'generateButtons',{returns:[
                    '<--button line-->\n\r\nactual lang:<img src=this.png>\n'
                ]});
                var obtainLangsControl = expectCalled.control(multilang,'obtainLangs');
                var obtainedDoc = multilang.changeDoc(englishDoc,'fr');
                var fakeDoc='<!-- \n\n\n\n\n'+multilang.langs.en.phrases['DO NOT MODIFY DIRECTLY']+'\n\n\n\n\n-->\n'+
                    "top line in french\r\n\n"+
                    '<--button line-->\n\r\nactual lang:<img src=this.png>\n'+
                    'second section in french\n\n\n'+
                    'section in mixed lang\nfor various langs\n\n'+
                    'section for all';
                expect(obtainedDoc).to.eql(fakeDoc);
                expect(obtainLangsControl.calls.length).to.eql(1);
                expect(obtainLangsControl.calls[0][0]).to.contain(
                    '<!--multilang v0 en:multilanguage.md es:multilenguaje.md it:multilingua.md ru:мультиязычный.md -->'
                );
                expect(generateButtonsControl.calls).to.eql([
                    [{
                        main:'en',
                        langs:{
                            en:'multilanguage.md',
                            es:'multilenguaje.md',
                            it:'multilingua.md',
                            ru:'мультиязычный.md'
                        }
                    },'es']
                ]);
                expect(splitDocControl.calls.length).to.eql(1);
                splitDocControl.stopControl();
                generateButtonsControl.stopControl();
                obtainLangsControl.stopControl();
                done();
            }).catch(function(err){
                done(err);
            })
        });
    });
});
