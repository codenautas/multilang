"use strict";

var _ = require('lodash');
var expect = require('expect.js');
var fs = require('fs-promise');
var multilang = require('..');
var stripBom = require('strip-bom');
var expectCalled = require('expect-called');
 
describe('multilang', function(){
    var frenchIncompleteExample={
        name: 'français',
        abr: 'fr',
        languages:{
            fr: 'français',
            en: 'anglais'
        },
        phrases:{
            language: 'langue',
        }
    };
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
            multilang.langs.fr=frenchIncompleteExample;
            var docLangs={
                main:'en',
                langs:{
                    en:{fileName:'readme.md'},
                    fr:{fileName:'lisezmoi.md'},
                }
            }
            var buttonSection = multilang.generateButtons(docLangs,'fr');
            expect(buttonSection).to.eql(
                '<!--multilang buttons-->\n'+
                'langue: ![français](https://github.com/codenautas/multilang/blob/master/img/lang-fr.png)\n'+ 
                'also available in:\n'+
                '[![anglais](https://github.com/codenautas/multilang/blob/master/img/lang-en.png)](readme.md)'
            );
        });
        it.skip('generate the button section from yamls', function(){
            var docLangs={
                main:'en',
                langs:{
                    en:{fileName:'multilanguage.md'},
                    es:{fileName:'multilenguaje.md'},
                    it:{fileName:'multilingua.md'  },
                    ru:{fileName:'мультиязычный.md'}
                }
            }
            var buttonSection = multilang.generateButtons(docLangs,'es');
            expect(buttonSection).to.eql(
                '<!--multilang buttons-->\n'+
                'idioma: ![castellano](https://github.com/codenautas/multilang/blob/master/img/lang-es.png)\n'+
                'también disponible en:\n'+
                '[![inglés](https://github.com/codenautas/multilang/blob/master/img/lang-en.png)](multilanguage.md) -\n'+
                '[![italiano](https://github.com/codenautas/multilang/blob/master/img/lang-it.png)](multilingua.md) -\n'+
                '[![ruso](https://github.com/codenautas/multilang/blob/master/img/lang-ru.png)](мультиязычный.md)'
            );
        });
        it.skip('separate the content of original doc', function(){
            var doc='\ufeffFirst lines\n'+
                '<!--multilang v0 xxxxxxxxxxxxxxxxx-->  \n'+ // ignored when split
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
                '```\n'+ // start of textual doc: Do not parse directives here!
                'textual text\n'+
                '<!--lang:es-->\n'+ // fake directive, is in textual section
                'more textual text\n'+
                '```\n'+ // end of textual section
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
                {
                    all:true, 
                    text:'this is for all langs\n'+
                        '```\n'+ 
                        'textual text\n'+
                        '<!--lang:es-->\n'+ 
                        'more textual text\n'+
                        '```\n'+ 
                        'last line could not have endline marker'
                }
            ]);
        });
        it('parse yaml files', function(){
            // quizás haya que borrar las llamadas a es e it y dejar solo ru (cuando haya que actualizar el caso)
            var parsedLang = multilang.parseLang('es');
            expect(parsedLang).to.eql({
                name: 'castellano',
                abr: 'es',
                languages: {
                    en: 'inglés'  , 
                    es: 'español' ,
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
                    'also available in': 'также доступны в',
                    'DO NOT MODIFY DIRECTLY': 'DO NOT MODIFY DIRECTLY THIS FILE WAS GENERATED BY multilang.js'
                }
            });
        });
    });
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
    describe('controls', function(){
        it/*.skip*/('generate the french text of the fake', function(done){
            multilang.langs.fr=frenchIncompleteExample;
            fs.readFile('./examples/multilanguage.md',{encoding: 'utf8'}).then(function(englishDoc){
                englishDoc=stripBom(englishDoc);
                var splitDocControl = expectCalled.control(multilang,'splitDoc',{returns:[[
                    {special: 'header', withBom:false}, 
                    {langs: {en: true}, text:"in other lang don't put"},
                    {langs: {fr: true}, text:"top line in french\r\n\n"},
                    {special: 'buttons'},
                    {langs: {en: true, es:true}, text:"two langs without fr"},
                    {langs: {fr: true}, text:'second section in french\n\n\n'},
                    {langs: {en: true, fr: true}, text:'section in mixed lang\nfor various langs\n\n'},
                    {all:true, text:'section for all'}
                ]]});
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
                            en:{fileName:'multilanguage.md'},
                            es:{fileName:'multilenguaje.md'},
                            it:{fileName:'multilingua.md'  },
                            ru:{fileName:'мультиязычный.md'}
                        }
                    },'fr']
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
        it.skip('generate warnings controling --lang:xx-- directive',function(){
            var doc='\n'+
                '<!--multilang v0 fr:nome.md es:nombre.md en:name.md-->\r\n'+
                '[--lang:es--]\r\n'+ // line 3
                'spanish text\n'+
                '\n'+
                '\t  [--lang:fr-->\n'+ // line 6
                '<--lang:*--]\n'+ // line 7
                '[--lang:fr-->\n'+ // line 8
                'french text\n'+ 
                '<--lang:es--] \t \r\n'+ 
                '<--lang:en--] \t \r\n'+ // line 11
                'you may inclue --lang:fr-- in the file, but not in this way\n'+ // line 12
                'if you want to include it you must enclose it in textual text like this:\n'+ 
                '```\n'+
                'example code with\n'+
                '<--lang:en--]\n'+ 
                'some directives\n'+
                '```\r\n'+
                '[--lang:ru--]\n'+ // line 19
                '[--lang:fr-->\n'+
                '';
            var warnings=multilang.getWarningsLangDirective(doc);
            warnings=_.sortByAll(warnings,_.keys(warnings[0]||{}));
            expect(warnings).to.eql([
                {line: 3, text:'unbalanced start "["'},
                {line: 6, text:'missing section for lang %', params:['en']}, // there must be sections for all languages
                {line: 7, text:'lang:* must be after other lang:* or after last lang section (%)', params:['en']},
                {line: 7, text:'lang:* must ends with ">"'},
                {line: 8, text:'main lang must end with ">" (lang:%)', params:['en']},
                {line:11, text:'unbalanced "<"'},
                {line:12, text:'lang clausule must no be included in text line'},
                {line:19, text:'lang:% not included in the header', params:['ru']},
                {line:21, text:'missing section for lang $', params:['es']},
                {line:21, text:'missing section for lang $', params:['en']} // at the end of the file
            ]);
        });
        it.skip('generate warnings controling buttons',function(){
            var doc='\ufeff'+
                '<!--multilang v0 fr:nome.md es:nombre.md it:name.md-->\r\n'+ // line 1
                'any text does not mind\n'+
                '\n'+
                '<!--multilang buttons-->\n' // line 4
                'the buttons section\n'+ 
                'ends here\n'+ 
                '\n'+
                'Text for all languages';
            var control=expectCalled.control(multilang,'generateButtons',{returns:[
                '<!--multilang buttons-->\n'+
                'the buttons section\n'+ 
                '<!--multilang buttons-->\n'+
                'ends here\n',
                '<!--multilang buttons-->\n'+
                'other button section for wrong answer\n',
                'the buttons section\n' // for incomplete 
            ]});
            var warnings=multilang.getWarningsButtons(doc);
            expect(warnings).to.eql([]); // ok, no warnings
            var warnings=multilang.getWarningsButtons(doc);
            expect(warnings).to.eql([{line:4, text:'button section does not match. Expected:\n'+'other button section for wrong answer\n'}]); 
            var warnings=multilang.getWarningsButtons(doc);
            expect(warnings).to.eql([{line:4, text:'button section does not match. Expected:\n'+'the buttons section\n'}]); 
            expect(control.calls.length).to.eql(1);
            expect(control.calls[0][1]).to.eql('fr');
            control.stopControl();
        });
        it.skip('generate warnings controling buttons position',function(){
            var doc='\ufeff'+
                '<!--multilang v0 fr:nome.md es:nombre.md it:name.md-->\r\n'+ // line 1
                '<!--lang:es-->\n'+
                'one spanish text\n'+
                'other spanish text\n'+
                'even more\n'+
                '<!--multilang buttons-->\n'+ // line 6
                'the buttons section\n'+ 
                'ends here\n'+ 
                '\n'+
                'Text for all languages';
            var control=expectCalled.control(multilang,'generateButtons',{returns:[
            ]});
            var warnings=multilang.getWarningsButtons(doc);
            expect(warnings).to.eql([{line:6, text:'button section must be in main language or in all languages'}]); 
            expect(control.calls.length).to.eql(0);
            control.stopControl();
        });
        it/*.skip*/('generate warnings by calling warning parts',function(){
            var doc='some doc';
            var getWarningsButtonsControl=expectCalled.control(multilang,'getWarningsButtons',{returns:[[
                {line:3, text:'this', params:[1,2,3]},
                {line:4, text:'other text'}
            ]]});
            var getWarningsLangDirectiveControl=expectCalled.control(multilang,'getWarningsLangDirective',{returns:[[
                {line:11, text:'one %', params:['es']},
                {line:1, text:'two'}
            ]]});
            var warnings=multilang.getWarnings(doc);
            warnings=_.sortByAll(warnings,_.keys(warnings[0]||{}));
            expect(warnings).to.eql([
                {line:1, text:'two'},
                {line:3, text:'this', params:[1,2,3]},
                {line:4, text:'other text'},
                {line:11, text:'one %', params:['es']}
            ]); 
            getWarningsLangDirectiveControl.stopControl();
            getWarningsButtonsControl.stopControl();
        });
    });
});
