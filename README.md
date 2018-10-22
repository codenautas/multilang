# multilang

Tools for multilanguage &amp; Markdown multilang


[![npm-version](https://img.shields.io/npm/v/multilang.svg)](https://npmjs.org/package/multilang)
[![downloads](https://img.shields.io/npm/dm/multilang.svg)](https://npmjs.org/package/multilang)
[![build](https://img.shields.io/travis/codenautas/multilang/master.svg)](https://travis-ci.org/codenautas/multilang)
[![coverage](https://img.shields.io/coveralls/codenautas/multilang/master.svg)](https://coveralls.io/r/codenautas/multilang)
[![dependencies](https://img.shields.io/david/codenautas/multilang.svg)](https://david-dm.org/codenautas/multilang)


language: ![English](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)
also available in:
[![Spanish](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)](LEEME.md) -
[![German](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-de.png)](LIESMICH.md)


In a Markdown or HTML-like file is written the documentation in multiple languages.

One of these languages ​​is the main, the others are commented with ![open](https://raw.githubusercontent.com/codenautas/multilang/master/img/comment-open.png) and ![close](https://raw.githubusercontent.com/codenautas/multilang/master/img/comment-close.png)

Then with ` multilang` the other languages ​​are extracted to generate one file for each of the other languages ​​defined


## Install


```sh
$ npm install multilang -g
```


## How to use


```
$ multilang doc-en.md
```


A .md file is generated for the other languages written in `doc-en.md` file


## Multilanguage document format

Any HTML or Markdown document is a multilenguage document if it has a main *multilanguage* directive.

### Example


```
<!--multilang v0 en:README.md es:LEEME.md fr:LISEZMOI.md de:LIESMICH.md -->
<!--multilang buttons-->

language: ![English](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)
also available in:
[Spanish](LEEME.md)  [French](LISEZMOI.md)  [German](LIESMICH.md)

<!--lang:en-->
This is a little example
<!--lang:es--]
Este es un pequeño ejemplo
[!--lang:fr--]
Ce est un petit exemple
[!--lang:de--]
Das ist ein Beispiel
[!--lang:*-->

<!--lang:en-->
"*" means all languages
<!--lang:es--]
"*" es para indicar todos los idiomas
[!--lang:fr--]
"*" est d'indiquer toutes les langues
[!--lang:de--]
"*" steht für alle Sprachen
[!--lang:*-->
All you need is multilang!
```


In this example:


```
<!--multilanguage v0 en:README.md es:LEEME.md fr:LISEZMOI.md-->
```


is the directive for declare the languages


```
<!--multilanguage buttons-->
```


is the directive for declaring the place for the button section


```
[!--lang:fr--]
```


is the directive for declaring the language of the next section (use * for all languages)


## API

```js

var fs = require('fs');
var multilang = require('multilang');

var englishText = fs.readFileSync('README.md', {encoding:'utf8'});

var warnings = multilang.getWarnings(englishText);
if(warnings.lengt){
    console.log('WARN', warnings);
}

var spanishText = multilang.changeDoc(englishText,'es');

console.log('spanish.md',spanishText);
```


(note about the example: do not use ***Sync*** functions in production,
use async
or [promise](http://npmjs.com/package/fs-promise) version
as you can see in [codenautas](https://github.com/codenautas/codenautas/blob/master/examples/promises.md)

function             | use
---------------------|------------------------------
changeDoc(text,lang) | receives a multilang text and a language code and returns de text of specified lang
warnings(text)       | receives a list of warnings and returns a multilang text


## License

[MIT](LICENSE)

...................................
