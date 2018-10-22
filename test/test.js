"use strict";

var expect = require('expect.js');
var fs = require('fs-promise');
var multilang = require('..');
var stripBom = require('strip-bom-string');
var expectCalled = require('expect-called');

var bestGlobals = require('best-globals');
 
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
        it('generate the button section overriding defaults', function(){
            expect(!!multilang.langs).to.be.eql(true);
            multilang.langs.fr=frenchIncompleteExample;
            var docLangs={
                main:'en',
                langs:{
                    en:{fileName:'readme.md'},
                    fr:{fileName:'lisezmoi.md'}
                }
            }
            var buttonSection = multilang.generateButtons(docLangs,'fr');
            expect(buttonSection).to.eql(
                '<!--multilang buttons-->\n'+
                '\n'+
                'langue: ![français](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-fr.png)\n'+ 
                'also available in:\n'+
                '[![anglais](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](readme.md)'
            );
        });
        it('generate the button section from yamls', function(){
            var docLangs={
                main:'en',
                langs:{
                    en:{fileName:'multilanguage.md'},
                    es:{fileName:'multilenguaje.md'},
                    it:{fileName:'multilingua.md'  },
                    ru:{fileName:'мультиязычный.md'},
                    de:{fileName:'mehrsprachig.md'}
                }
            };
            var buttonSection = multilang.generateButtons(docLangs,'es');
            expect(buttonSection).to.eql(
                '<!--multilang buttons-->\n'+
                '\n'+
                'idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)\n'+
                'también disponible en:\n'+
                '[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](multilanguage.md) -\n'+
                '[![italiano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-it.png)](multilingua.md) -\n'+
                '[![ruso](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-ru.png)](мультиязычный.md) -\n'+
                '[![alemán](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-de.png)](mehrsprachig.md)'
            );
        });
        it('separate the content of original doc', function(){
            var doc='\ufeffFirst lines\n'+
                '<!--multilang v0 xxxxxxxxxxxxxxxxx-->  \n'+ // ignored when split
                'Other lines\n'+
                '\n'+
                'Not ignored\n'+
                '<!--multilang buttons-->  \t \n'+
                '\n'+
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
            doc += '\n<!--lang:es--]\n'+
                   '# Multilenguaje (Multilanguage)\n'+
                   '\n'+
                   'Esto es una prueba de archivos markdown multilenguajes.\n'+
                   '\n'+
                   'El principal objetivo es escribir la documentación en un único fuente.\n'+
                   '\n';
            var separatedDoc = multilang.splitDoc(doc);
            expect(separatedDoc).to.eql([
                {special: 'header', withBom:true},
                {all:true, text:
                    'First lines\n'+
                    'Other lines\n'+
                    '\n'+
                    'Not ignored\n'
                },
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
                        'last line could not have endline marker\n'
                },
                {   
                    langs:{ es:true }, 
                    text:'# Multilenguaje (Multilanguage)\n'+
                         '\n'+
                         'Esto es una prueba de archivos markdown multilenguajes.\n'+
                         '\n'+
                         'El principal objetivo es escribir la documentación en un único fuente.\n'+
                         '\n'
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
                    ru: 'ruso',
                    de: 'alemán',
                    fr: 'francés',
                    ja: 'japonés'
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
                    ru: 'russo',
                    de: 'tedesco',
                    fr: 'francese',
                    ja: 'giapponese'
                },
                phrases: {
                    language: 'lingua', 
                    'also available in': 'disponibile anche in',
                    'DO NOT MODIFY DIRECTLY': 'DO NOT MODIFY DIRECTLY THIS FILE WAS GENERATED BY multilang.js'
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
                    ru: 'русский',
                    de: 'по-неме́цки',
                    fr: 'францу́зский',
                    ja: 'Японский'
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
        it('generate the spanish file of the example (multilanguaje)', function(done){
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
        it('generate the spanish file of the other example (with-spaces) (bug #9)', function(done){
            fs.readFile('./examples/with-spaces.md',{encoding: 'utf8'}).then(function(englishDoc){
                return fs.readFile('./examples/con-espacios.md',{encoding: 'utf8'}).then(function(expectedSpanishDoc){
                    var obtainedSpanishDoc = multilang.changeDoc(englishDoc,'es');
                    expect(obtainedSpanishDoc).to.eql(expectedSpanishDoc);
                    done();
                });
            }).catch(function(err){
                done(err);
            })
        });
        it('generate the english file from a spanish multilang file (bug #20)', function(done){
            fs.readFile('./examples/desde-es.md',{encoding: 'utf8'}).then(function(englishDoc){
                return fs.readFile('./examples/from-es.md',{encoding: 'utf8'}).then(function(expectedSpanishDoc){
                    var obtainedSpanishDoc = multilang.changeDoc(englishDoc,'en');
                    expect(obtainedSpanishDoc).to.eql(expectedSpanishDoc);
                    done();
                });
            }).catch(function(err){
                done(err);
            })
        });
    });
    describe('controls', function(){
        it('generate the french text of the fake', function(done){
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
                var fakeDoc='<!-- multilang from multilanguage.md\n\n\n\n\n'+multilang.langs.en.phrases['DO NOT MODIFY DIRECTLY']+'\n\n\n\n\n-->\n'+
                    "top line in french\r\n\n"+
                    '<--button line-->\n\r\nactual lang:<img src=this.png>\n\n\n'+
                    'second section in french\n\n\n'+
                    'section in mixed lang\nfor various langs\n\n'+
                    'section for all';
                expect(obtainedDoc).to.eql(fakeDoc);
                expect(obtainLangsControl.calls.length).to.eql(1);
                expect(obtainLangsControl.calls[0][0]).to.contain(
                    '<!--multilang v0 en:multilanguage.md es:multilenguaje.md it:multilingua.md ru:мультиязычный.md de:mehrsprachig.md -->'
                );
                expect(generateButtonsControl.calls).to.eql([
                    [{
                        main:'en',
                        langs:{
                            en:{fileName:'multilanguage.md'},
                            es:{fileName:'multilenguaje.md'},
                            it:{fileName:'multilingua.md'  },
                            ru:{fileName:'мультиязычный.md'},
                            de:{fileName:'mehrsprachig.md'}
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
        it('generate warnings controling --lang:xx-- directive',function(){
            var doc='\n'+
                '<!--multilang v0 fr:nome.md es:nombre.md en:name.md-->\r\n'+
                '[!--lang:es--]\r\n'+ // line 3
                'spanish text\n'+
                '\n'+
                '\t  [!--lang:fr-->\n'+ // line 6
                '<!--lang:*--]\n'+ // line 7
                '[!--lang:fr--]\n'+ // line 8
                'french text\n'+ 
                '<!--lang:es--] \t \r\n'+ // line 10
                '<!--lang:en--] \t \r\n'+ // line 11
                'you may include --lang:fr-- in the file, but not in this way\n'+ // line 12
                'if you want to include it you must enclose it in textual text like this:\n'+ 
                '```\n'+
                'example code with\n'+
                '<!--lang:en--]\n'+ 
                'some directives\n'+
                '```\r\n'+
                '[!--lang:ru--]\n'+ // line 19
                '[!--lang:fr-->\n'+
                '';
            var warnings=multilang.getWarningsLangDirective(doc);
            expect(warnings).to.eql([
                {line: 3, text:'unbalanced start "["'},
                {line: 7, text:'lang:* must be after other lang:* or after last lang section (%)', params:['en']},
                {line: 7, text:'lang:* must end with ">"'},
                {line: 7, text:'missing section for lang %', params:['es']}, // there must be sections for all languages
                {line: 7, text:'missing section for lang %', params:['en']}, // there must be sections for all languages
                {line: 8, text:'main lang must end with ">" (lang:%)', params:['fr']},
                {line: 10, text:'unbalanced "["'},
                {line:11, text:'unbalanced "["'},
                {line:12, text:'lang clause must not be included in text line'},
                {line:19, text:'"lang:%" not included in the header', params:['ru']},
                {line:21, text:'missing section for lang %', params:['es']},
                {line:21, text:'missing section for lang %', params:['en']}, // at the end of the file
                {line:20, text:'last lang must be \"*\" or \"%"\"', params:['en']}
            ]);
        });
        it('generate warnings controling buttons',function(){
            var doc='\ufeff'+
                '<!--multilang v0 fr:nome.md es:nombre.md it:name.md-->\r\n'+ // line 1
                'any text does not mind\n'+
                '\n'+
                '<!--multilang buttons-->\n'+ // line 4
                '\n'+
                'the buttons section\n'+ 
                'ends here\n'+ 
                '\n'+
                'Text for all languages';
            var control=expectCalled.control(multilang,'generateButtons',{returns:[
                '<!--multilang buttons-->\n'+
                '\n'+
                'the buttons section\n' +
                'ends here\n', // call #1
                '<!--multilang buttons-->\n'+
                '\n'+
                'other button section for wrong answer\n', // call #2
                'the buttons section\n' // call #3: for incomplete 
            ]});
            var warnings=multilang.getWarningsButtons(doc);
            expect(warnings).to.eql([]); // ok, no warnings
            var warnings=multilang.getWarningsButtons(doc);
            expect(warnings).to.eql([{line:6, text:'button section does not match. Expected:\n'+'other button section for wrong answer\n'}]); 
            var warnings=multilang.getWarningsButtons(doc);
            expect(warnings).to.eql([{line:4, text:'button section does not match. Expected:\n'+'the buttons section\n'}]); 
            control.stopControl();
        });
        it('generate warnings controling buttons (original)',function(){
            var doc='\ufeff'+
                '<!--multilang v0 fr:nome.md es:nombre.md it:name.md-->\r\n'+ // line 1
                'any text does not mind\n'+
                '\n'+
                '<!--multilang buttons-->\n'+ // line 4
                '\n'+
                'the buttons section\n'+ 
                'ends here\n'+ 
                '(nombre.md)\n'+
                '(name.md)\n'+
                'Text for all languages';
            var control=expectCalled.control(multilang,'generateButtons',{returns:[
                '<!--multilang buttons-->\n'+
                '\n'+
                'the buttons section\n' +
                'ends here\n', // call #1
                '<!--multilang buttons-->\n'+
                '\n'+
                'other button section for wrong answer\n', // call #2
                'the buttons section\n' // call #3: for incomplete 
            ]});
            var warnings=multilang.getWarningsButtons(doc);
            expect(warnings).to.eql([]); // ok, no warnings
            var warnings=multilang.getWarningsButtons(doc);
            expect(warnings).to.eql([{line:6, text:'button section does not match. Expected:\n'+'other button section for wrong answer\n'}]); 
            var warnings=multilang.getWarningsButtons(doc);
            expect(warnings).to.eql([{line:4, text:'button section does not match. Expected:\n'+'the buttons section\n'}]); 
            control.stopControl();
        });
        it('generate warnings controling buttons position',function(){
            var doc='\ufeff'+
                '<!--multilang v0 fr:nome.md es:nombre.md it:name.md-->\r\n'+ // line 1
                '<!--lang:es-->\n'+
                'one spanish text\n'+
                'other spanish text\n'+
                'even more\n'+
                '<!--multilang buttons-->\n'+ // line 6
                '\n'+ 
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
        it('generate warnings by calling warning parts',function(){
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
            warnings.sort(bestGlobals.compareForOrder([{column:'line'},{column:'text'}]));
            // warnings=_.sortByAll(warnings,_.keys(warnings[0]||{}));
            expect(warnings).to.eql([
                {line:1, text:'two'},
                {line:3, text:'this', params:[1,2,3]},
                {line:4, text:'other text'},
                {line:11, text:'one %', params:['es']}
            ]); 
            getWarningsLangDirectiveControl.stopControl();
            getWarningsButtonsControl.stopControl();
        });
        var headerEnEs3lines='\n'+
            '<!--multilang v0 en:README.md es:LEEME.md -->\n'+
            'english text (also seen in spanish)\n';
        it('generate warnings controling ] [ balanced',function(){
            var doc=headerEnEs3lines +
                '<!--lang:es--]\n'+ 
                'spanish text\n'+
                '\t  [!--lang:en-->\n'+
                'english text 2\n'+
                '<!--lang:es--]\n'+
                'spanhis text 2\n'+
                '[!--lang:*-->\n'+
                '';
            var warnings=multilang.getWarningsLangDirective(doc);
            expect(warnings).to.eql([]);
        });
        it('generate warnings in first or last ] [',function(){
            var doc=headerEnEs3lines +
                'spanish text\n'+
                '\t  [!--lang:en-->\n'+ // line 5
                'english text 2\n'+
                '<!--lang:es--]\n'+
                'spanhis text 2\n'+ // line 8
                '';
            var warnings=multilang.getWarningsLangDirective(doc);
            expect(warnings).to.eql([
                {line: 5, text:'unbalanced start "["'},
                {line: 7, text:'last lang directive could\'n finish in "]"'}
            ]);
        });
        it('generate warnings controlling missing language directives (bug #15)',function(){
            var doc=headerEnEs3lines +
                'spanish text\n'+
                '\t<!--lang:en-->\n'+
                'english text 2\n'+
                '<!--lang:es-->\n'+
                'spanish text\n'+
                '<!--lang:es-->\n'+ // line 9
                'more spanish text 2\n'+
                '';
            var warnings=multilang.getWarningsLangDirective(doc);
            expect(warnings).to.eql([
                {line: 9, text:'missing section for lang %', params:['en']}
            ]);
        });
        it('generate warnings controlling missing sections (#11)',function(){
            var doc='\n'+
                '<!--not multilang v0 en:README.md es:LEEME.md -->\n'+
                'english text (also seen in spanish)\n' +
                'spanish text\n'+
                '\t<!--lang:en-->\n'+
                'english text 2\n'+
                '<!--lang:es-->\n'+
                'spanish text\n'+
                '';
            var warnings=multilang.getWarnings(doc);
            expect(warnings).to.eql([
                {line:0, text:'missing section <!--multilang buttons-->'},
                {line:0, text:'missing section <!--multilang ...->'}
                
            ]);
        });
        describe('generate warnings incorrect button(s) definitions (#24) original version', function() {
            var docTemp = "<!--multilang v0 es:LEEME.md en:README.md -->\n"+
                          "# pru\n"+
                          "<!--lang:es-->\n"+
                          "pru module\n"+
                          "<!--lang:en--]\n"+
                          "pru module\n"+
                          "\n"+
                          "[!--lang:*-->\n"+
                          "\n"+
                          "<!-- cucardas -->\n"+
                          "![designing](https://img.shields.io/badge/stability-designing-red.svg)\n"+
                          "[![npm-version](https://img.shields.io/npm/v/pru.svg)](https://npmjs.org/package/pru)\n"+
                          "[![downloads](https://img.shields.io/npm/dm/pru.svg)](https://npmjs.org/package/pru)\n"+
                          "[![build](https://img.shields.io/travis/codenautas/pru/master.svg)](https://travis-ci.org/codenautas/pru)\n"+
                          "[![coverage](https://img.shields.io/coveralls/codenautas/pru/master.svg)](https://coveralls.io/r/codenautas/pru)\n"+
                          "[![climate](https://img.shields.io/codeclimate/github/codenautas/pru.svg)](https://codeclimate.com/github/codenautas/pru)\n"+
                          "[![dependencies](https://img.shields.io/david/codenautas/pru.svg)](https://david-dm.org/codenautas/pru)\n"+
                          "[![qa-control](http://codenautas.com/github/codenautas/pru.svg)](http://codenautas.com/github/codenautas/pru)\n"+
                          "\n"+
                          "\n"+
                          "<!--multilang buttons-->\n"+
                          "\n"+
                          "idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)\n"+
                          "también disponible en:\n"+
                          "[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)]({{esDOC}})\n"+
                          "\n"+
                          "<!--lang:es-->\n"+
                          "# Instalación\n"+
                          "<!--lang:en--]\n"+
                          "# Install\n"+
                          "[!--lang:*-->\n"+
                          "```sh\n"+
                          "$ npm install pru\n"+
                          "```\n"+
                          "\n"+
                          "<!--lang:es-->\n"+
                          "## Licencia\n"+
                          "<!--lang:en--]\n"+
                          "## License\n"+
                          "[!--lang:*-->\n"+
                          "\n"+
                          "[MIT](LICENSE)\n"+
                          "\n";
            it('no warnings',function(){
                var doc = docTemp.replace('{{esDOC}}', 'README.md');
                var warnings=multilang.getWarningsButtons(doc);
                expect(warnings).to.eql([]);
            });
            it('bad english .md',function(){
                var doc = docTemp.replace('{{esDOC}}', 'WRONG.md');
                var warnings=multilang.getWarningsButtons(doc);
                expect(warnings).to.eql([{
                    line: 25,
                    text: "referenced document 'WRONG.md' does not exists in multilang header, expecting 'README.md'"
                }]);
            });
        });
        describe('generate warnings incorrect button(s) definitions (#24)', function() {
            var docTemplate = "<!--multilang v0 es:LEEME.md en:README.md de:LESEN.md -->\n"+
                          "# pru\n"+
                          "<!--lang:es-->\n"+
                          "pru module\n"+
                          "<!--lang:en--]\n"+
                          "pru module\n"+
                          "\n"+
                          "[!--lang:*-->\n"+
                          "\n"+
                          "<!-- cucardas -->\n"+
                          "![designing](https://img.shields.io/badge/stability-designing-red.svg)\n"+
                          "[![npm-version](https://img.shields.io/npm/v/pru.svg)](https://npmjs.org/package/pru)\n"+
                          "[![downloads](https://img.shields.io/npm/dm/pru.svg)](https://npmjs.org/package/pru)\n"+
                          "[![build](https://img.shields.io/travis/codenautas/pru/master.svg)](https://travis-ci.org/codenautas/pru)\n"+
                          "[![coverage](https://img.shields.io/coveralls/codenautas/pru/master.svg)](https://coveralls.io/r/codenautas/pru)\n"+
                          "[![climate](https://img.shields.io/codeclimate/github/codenautas/pru.svg)](https://codeclimate.com/github/codenautas/pru)\n"+
                          "[![dependencies](https://img.shields.io/david/codenautas/pru.svg)](https://david-dm.org/codenautas/pru)\n"+
                          "[![qa-control](http://codenautas.com/github/codenautas/pru.svg)](http://codenautas.com/github/codenautas/pru)\n"+
                          "\n"+
                          "\n"+
                          "<!--multilang buttons-->\n"+
                          "\n"+
                          "idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)\n"+
                          "también disponible en:\n"+
                          "{{LINE1}} -\n"+
                          "{{LINE2}}\n"+
                          "\n"+
                          "<!--lang:es-->\n"+
                          "# Instalación\n"+
                          "<!--lang:en--]\n"+
                          "# Install\n"+
                          "[!--lang:*-->\n"+
                          "```sh\n"+
                          "$ npm install pru\n"+
                          "```\n"+
                          "\n"+
                          "<!--lang:es-->\n"+
                          "## Licencia\n"+
                          "<!--lang:en--]\n"+
                          "## License\n"+
                          "[!--lang:*-->\n"+
                          "\n"+
                          "[MIT](LICENSE)\n"+
                          "\n";
            function genLangLine(titulo, pngsuf, docu) {
                return "[!["+titulo+"](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-"+pngsuf+".png)]("+docu+")";
            }
            function lineEN() { return genLangLine('inglés', 'en', 'README.md'); }
            function lineDE() { return genLangLine('alemán', 'de', 'LESEN.md'); }
            it('no warnings',function(){
                var doc = docTemplate.replace('{{LINE1}}', lineEN()).replace('{{LINE2}}', lineDE());
                var warnings=multilang.getWarningsButtons(doc);
                expect(warnings).to.eql([]);
            });
            it('bad english',function(){
                var doc = docTemplate.replace('{{LINE1}}', genLangLine('inglés','en', 'WRONG.md')).replace('{{LINE2}}', lineDE());
                //fs.writeFileSync("bad_en.md", doc);
                var warnings=multilang.getWarningsButtons(doc);
                expect(warnings).to.eql([
                    {line:25, text:"referenced document 'WRONG.md' does not exists in multilang header, expecting 'README.md'"}
                ]);
            });
            it('bad english and german',function(){
                var doc = docTemplate.replace('{{LINE1}}', genLangLine('inglés','en', 'WRONG.md')).replace('{{LINE2}}', genLangLine('alemán','de', 'WORST.md'));
                var warnings=multilang.getWarningsButtons(doc);
                expect(warnings).to.eql([
                    {line:25, text:"referenced document 'WRONG.md' does not exists in multilang header, expecting 'README.md'"},
                    {line:26, text:"referenced document 'WORST.md' does not exists in multilang header, expecting 'LESEN.md'"}
                ]);
            });
            it('bad language line',function(){
                var doc = docTemplate.replace('{{LINE1}}', "[![inglés]https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png]README.md").replace('{{LINE2}}', lineDE());
                var warnings=multilang.getWarningsButtons(doc);
                expect(warnings).to.eql([
                    {line:25, text:"button section does not match. Expected:\n[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](README.md) -\n"}
                ]);
            });
        });
    });
    describe('auxiliary functions', function(){
        it('stringizeWarnings correct input', function(done){
            var warns = [
                {line: 2, text: 'text from line two'},
                {line: 57, text: 'this is the text of line fifty seven and has parameters (%)', params:'en'},
                {line: 4, text: 'this is the text of line four'}
            ];
            var stringizedWarn = multilang.stringizeWarnings(warns);
            expect(stringizedWarn).to.eql("line 2: text from line two\n" +
                                          "line 57: this is the text of line fifty seven and has parameters (en)\n" +
                                          "line 4: this is the text of line four\n");
            done();
        });
        it('stringizeWarnings with null input', function(done){
            var stringizedWarn = multilang.stringizeWarnings([]);
            expect(stringizedWarn).to.eql('');
            done();
        });
        function compareSCio(input, output) {
            var stripped = multilang.stripComments(input);
            expect(stripped).to.eql(output);
        }
        it('stripComments with identical input and output', function(){
            compareSCio('','');
            compareSCio('\n','\n');
            compareSCio('algo\n','algo\n');
            compareSCio('\nalgo','\nalgo');
            compareSCio('algo\nmas','algo\nmas');
        });
        it('stripComments input with comments', function(){
            compareSCio('linea con<!-- esto es un comentario --> una sola linea','linea con una sola linea');
            compareSCio('hola <!-- esto es un comentario -->\nlinea comun','hola \nlinea comun');
            compareSCio('hola <!-- esto es un comentario\nmultilinea -->\nlinea comun','hola \nlinea comun');
            compareSCio('primera\n<!-- esto es un comentario línea completa -->\nsegunda línea','primera\nsegunda línea');
            compareSCio('primera\n<!-- comentario dos líneas -->\nsegunda línea','primera\nsegunda línea');
            compareSCio('<!-- comentario al principio \n varias líneas -->\nprimera línea\n2\n3','primera línea\n2\n3');
            compareSCio('<!-- dos comentarios -->\nprimera línea\n2<!-- más -->+<!-- mucho más -->3=5','primera línea\n2+3=5');
            compareSCio('<!--multilang buttons-->', '');
            compareSCio('Comentario con <!--varias palabras buttons-->varias', 'Comentario con varias');
        });
        it('stripComments input with backticks', function(){
            compareSCio('linea con ticks `dentro` y una linea','linea con ticks `dentro` y una linea');
            compareSCio('linea con ticks\n```js\nvar js=true;\n```sigue','linea con ticks\n```js\nvar js=true;\n```sigue');
            compareSCio('linea con ticks\n```html<html><!-- comment --></html>```sigue',
                        'linea con ticks\n```html<html><!-- comment --></html>```sigue');
        });
        it.skip/*coming soon*/('stripComments input with backticks in one line', function(){
            compareSCio('abre `<!--` y cierra `-->`',
                        'abre `<!--` y cierra `-->`');
        });
    });
});
