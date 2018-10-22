<!-- multilang from LEEME.md




Bitte nicht direkt ändern, das es sich um generierte Inhalte multilang.js handelt!




-->
# multilang

Werkzeug für Mehrsprachigkeit &amp; Markdown multilang


<!-- cucardas -->
[![npm-version](https://img.shields.io/npm/v/multilang.svg)](https://npmjs.org/package/multilang)
[![downloads](https://img.shields.io/npm/dm/multilang.svg)](https://npmjs.org/package/multilang)
[![build](https://img.shields.io/travis/codenautas/multilang/master.svg)](https://travis-ci.org/codenautas/multilang)
[![coverage](https://img.shields.io/coveralls/codenautas/multilang/master.svg)](https://coveralls.io/r/codenautas/multilang)
[![dependencies](https://img.shields.io/david/codenautas/multilang.svg)](https://david-dm.org/codenautas/multilang)

<!--multilang buttons-->

Sprache: ![Deutsch](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-de.png)
ebenfalls verfügbar in:
[![Spanisch](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)](LEEME.md) -
[![Englisch](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](README.md)


## Installation


```sh
$ npm install multilang -g
```


## Nutzung


```
$ multilang doc-en.md
```


Es wird jeweils eine .md Datei pro Sprache aus `doc-en.md` erzeugt.


## Mehrsprachiges Dokumentenformat

Jedes HTML oder Markdown Dokument ist ein mehrsprachiges Dokument,
 wenn es eine *multilanguage* Direktive beinhaltet.

### Beispiel


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


In diesem Beispiel:


```
<!--multilanguage v0 en:README.md es:LEEME.md fr:LISEZMOI.md-->
```


ist die Direktive zur Deklaration der Sprache


```
<!--multilanguage buttons-->
```


ist die Direktive zur Deklaration der Platzierung für die Button-Section


```
[!--lang:fr--]
```


ist die Direktive zur Deklaration der Sprache für die nächste Section (der * gilt für alle Sprachen)


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


(Hinweis zum Beispiel: nutzen Sie die ***Sync*** Funktionen nicht produktiv,
sondern nutzen Sie async
oder [promise](http://npmjs.com/package/fs-promise) version
siehe [codenautas](https://github.com/codenautas/codenautas/blob/master/examples/promises.md)

Funktion             | Nutzung
---------------------|------------------------------
changeDoc(text,lang) | nutzt einen zu übersetzenden Text und die Zielsprache als Code und gibt den übersetzten Text zurück
warnings(text)       | nutzt eine Liste von Warnungen und gibt einen übersetzten Text zurück


## License

[MIT](LICENSE)

...................................
