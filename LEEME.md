# multilang
<!--lang:es-->
Herramientas multilenguaje (primeramente para Markdown)

<!--lang:en--]
Tools for multilanguage &amp; Markdown multilang

[!--lang:*-->

<!-- cucardas -->
[![npm-version](https://img.shields.io/npm/v/multilang.svg)](https://npmjs.org/package/multilang)
[![downloads](https://img.shields.io/npm/dm/multilang.svg)](https://npmjs.org/package/multilang)
[![build](https://img.shields.io/travis/codenautas/multilang/master.svg)](https://travis-ci.org/codenautas/multilang)
[![coverage](https://img.shields.io/coveralls/codenautas/multilang/master.svg)](https://coveralls.io/r/codenautas/multilang)
[![climate](https://img.shields.io/codeclimate/github/codenautas/multilang.svg)](https://codeclimate.com/github/codenautas/multilang)
[![dependencies](https://img.shields.io/david/codenautas/multilang.svg)](https://david-dm.org/codenautas/multilang)
[![qa-control](http://codenautas.com/github/codenautas/multilang.svg)](http://codenautas.com/github/codenautas/multilang)

<!--multilang v0  es:LEEME.mden:README.md -->

<!--multilang buttons-->

idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)
también disponible en:
[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](README.md)

<!--lang:es-->

En un archivo tipo Markdown o html se escribe la documentación en varios idiomas. 

Uno de esos lenguajes es el principal, los otros están comentados con [!-- y --]

Luego con `multilang` se extraen los otros lenguajes generando un archivo para cada uno de los otros lenguajes definidos

<!--lang:en--]

In a Markdown or HTML-like file is written the documentation in multiple languages.

One of these languages ​​is the main, the others are commented with &lt;!-- and --&gt;

Then with ` multilang` the other languages ​​are extracted to generate one file for each of the other languages ​​defined

[!--lang:es-->

## Instalación

<!--lang:en--]

## Install

[!--lang:*-->

```sh
$ npm install multilang -g
```

<!--lang:es-->

## Uso

<!--lang:en--]

## Use

[!--lang:*-->

```
$ multilang doc-en.md
```

<!--lang:es-->

Genera los archivos especificados en la cabecera del archivo para los idiomas secundarios.

<!--lang:en--]

A .md file is generated for the other languages written in `doc-en.md` file

[!--lang:es-->

## Formato del documento multilenguaje

Un documento multilenguaje es un documento HTML o Markdown escrito en un idioma principal,
que contiene dentro del mismo documento la traducción a uno o varios idiomas secundarios. 

### Ejemplo

<!--lang:en--]

## Multilanguage document format

Any HTML or Markdown document is a multilenguage document if it has a main *multilanguage* directive. 

### Example

[!--lang:*-->

```
<!--multilanguage v0 en:README.md es:LEEME.md fr:LISEZMOI.md-->
<!--multilanguage buttons-->
language: English see also: [Spanish](README.md) [French](LISEZMOI.md)

<!--lang:es-->
Este es un pequeño ejemplo

<!--lang:en--]
This is a little example

[!--lang:fr--]
Ce est un petit exemple

[!--lang:*-->
All you need is multilang!

<!--lang:es-->
"*" means all languages

<!--lang:en--]
"*" es para indicar todos los idiomas

[!--lang:fr--]
"*" est d'indiquer toutes les langues
```

<!--lang:es-->

El documento tiene en algún lugar un renglón con la directiva multilenguaje. Ejemplo:

<!--lang:en--]

In this example:

[!--lang:*-->

```
<!--multilanguage v0 en:README.md es:LEEME.md fr:LISEZMOI.md-->
```

<!--lang:es-->

 * *v0* es la versión del formato multilenguaje, 
 * *en* es el lenguaje principal [ISO 639-1](http://es.wikipedia.org/wiki/ISO_639-1), en este caso inglés
 * *README.md* es el nombre del archivo principal, el que contiene el documento que se está procesando
 * *es* y *fr* son los lenguajes secundarios (español y francés)
 * *LEEME.md* es el nombre del documento en español 
 * *LISEZMOID.md* es el nombre del documento en francés
 
El siguiente renglón después de la directiva multilenguaje es la directiva que indica 
la presencia de los links a los otros documentos. Tiene el siguiente formato

<!--lang:en--]

is the directive for declare the languages

[!--lang:*-->

```
<!--multilanguage buttons-->
```

<!--lang:es-->

Lo siguientes renglones son los botones y links a los otros lenguajes. 

Las directivas terminan con un renglón en blanco. 

El resto del documento tiene el texto en los distintos idiomas, 
intercalando los idiomas en el orden en que están definidos en la directiva multilenguaje. 

Las secciones o subsecciones donde se cambia de idioma están señaladas con la directiva

<!--lang:en--]

is the directive for declaring the place for the button section

[!--lang:*-->

```
[!--lang:fr--]
```

<!--lang:es-->

 * *fr* en este ejemplo se indica que los renglones siguientes están escritos en francés
 * las secciones pueden empezar o terminar con [ o < y > o ]

Cuando una parte del texto sea para todos los idiomas se puede poner un asterisco "*" en vez del código de idioma.

Cuando empiece la sección del idioma principal en vez de un corchete "]" la directiva cierra con un signo de mayor ">";
así se cierra el comentario HTML. Cuando termina la sección del idioma principal el siguiente indicador de idioma comienza con 
un signo de menor "<" en vez de un corchete "[" para que empiece un nuevo cometario HTML 
y no se visualice el texto en los idiomas secundarios. 

<!--lang:en--]

is the directive for declaring the language of the next section (use * from all languages)

[!--lang:*-->

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

<!--lang:es-->

(nota acerca del ejemplo anterior: no use funciones ***Sync***rónicas en producción, 
use las versiones asincrónicas 
o basadas en [promesas](http://npmjs.com/package/fs-promise)
como se ilustra en [codenautas](https://github.com/codenautas/codenautas/blob/master/examples/promises.md)

función              | uso
---------------------|-------------------------------
changeDoc(text,lang) | dado un texto multilang y un código de lenguaje obtiene el texto correspondiente a ese lenguaje
getWarnings(text)    | obtiene una lista de advertencias a partir de un texto multilang

<!--lang:en--]

(note about the example: do not use ***Sync*** functions in production, 
use async 
or [promise](http://npmjs.com/package/fs-promise) version 
as you can see in [codenautas](https://github.com/codenautas/codenautas/blob/master/examples/promises.md)

function             | use
---------------------|------------------------------
changeDoc(text,lang) | receives a multilang text and a language code and returns de text of specified lang
warnings(text)       | receives a list of warnings and returns a multilang text

[!--lang:*-->

## License

[MIT](LICENSE)

...................................
