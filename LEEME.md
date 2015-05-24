<!-- multilang from README.md




NO MODIFIQUE ESTE ARCHIVO. FUE GENERADO AUTOMÁTICAMENTE POR multilang.js




-->
# multilang

Tools for multilanguage &amp; Markdown multilang


Herramientas multilenguaje (primeramente para Markdown)


[![version](https://img.shields.io/npm/v/multilang.svg)](https://npmjs.org/package/multilang)
[![downloads](https://img.shields.io/npm/dm/multilang.svg)](https://npmjs.org/package/multilang)
[![linux](https://img.shields.io/travis/codenautas/multilang/master.svg)](https://travis-ci.org/codenautas/multilang)
[![coverage](https://img.shields.io/coveralls/codenautas/multilang/master.svg)](https://coveralls.io/r/codenautas/multilang)
[![climate](https://img.shields.io/codeclimate/github/codenautas/multilang.svg)](https://codeclimate.com/github/codenautas/multilang)


<!--multilang buttons-->

idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)
también disponible en:
[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](README.md)


En un archivo tipo Markdown o html se escribe documentación en varios idiomas. 

Uno de esos lenguajes es el principal, los otros están comentados con [!-- y --]

Luego con `multilang` se extraen los otros lenguajes generando un archivo para cada uno de los otros lenguajes definidos


## Instalación


```sh
$ npm install multilang -g
```


## Uso


```
$ multilang doc-en.md
```


Genera los archivos especificados en la cabecera del archivo para los idiomas secundarios.


## Formato del documento multilenguaje

Un documento multilenguaje es un documento HTML o Markdown escrito en un idioma principal,
que contiene dentro del mismo documento la traducción a uno o varios idiomas secundarios. 

### Ejemplo


```
<!--multilanguage v0 en:README.md es:LEEME.md fr:LISEZMOI.md-->
<!--multilanguage buttons-->
language: English see also: [Spanish](README.md) [French](LISEZMOI.md)

<!--lang:en-->
This is a little example

<!--lang:es--]
Este es un pequeño ejemplo

[!--lang:fr--]
Ce est un petit exemple

[!--lang:*-->
All you need is multilang!

<!--lang:en-->
"*" means all languages

<!--lang:es--]
"*" es para indicar todos los idiomas

[!--lang:fr--]
"*" est d'indiquer toutes les langues
```


El documento tiene en algún lugar un renglón con la directiva multilenguaje. Ejemplo:


```
<!--multilanguage v0 en:README.md es:LEEME.md fr:LISEZMOI.md-->
```


 * *v0* es la versión del formato multilenguaje, 
 * *en* es el lenguaje principal [ISO 639-1](http://es.wikipedia.org/wiki/ISO_639-1), en este caso inglés
 * *README.md* es el nombre del archvio principal, el que contiene el documento que se está procesando
 * *es* y *fr* son los lenguajes secundarios (español y francés)
 * *LEEME.md* es el nombre del documento en español 
 * *LISEZMOID.md* es el nombre del documento en francés
 
El siguiente renglón después de la directiva multilenguaje es la directiva que indica 
la presencia de los links a los otros documentos. Tiene el siguiente formato


```
<!--multilanguage buttons-->
```


Lo siguientes renlgones son los botones y links a los otros lenguajes. 

Las directivas terminan con un renglón en blanco. 

El resto del documento tiene el texto en los distintos idiomas, 
intercalando los idiomas en el orden en que están definidos en la directiva multilenguaje. 

Las secciones o subsecciones donde se cambia de idioma están señaladas con la directiva


```
[!--lang:fr--]
```


 * *fr* en este ejemplo es indica que los renglones siguientes están escritos en francés
 * las secciones pueden empezar o terminar con [ o < y > o ]

Cuando una parte del texto sea para todos los idiomas se puede poner un asterisco "*" en vez del código de idioma.

Cuando empiece la sección del idioma principal en vez de un corchete "]" la directiva cierra con un signo de mayor ">";
así se cierra el comentario HTML. Cuando termina la sección del idioma principal el siguiente indicador de idioma comienza con 
un signo de menor "<" en vez de un corchete "[" para que empiece un nuevo cometario HTML 
y no se visualice el texto en los idiomas secundarios. 


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


(nota acerca del ejemplo anterior: no use funciones ***Sync***rónicas en producción, 
use las versiones asincrónicas 
o basadas en [promesas](http://npmjs.com/package/fs-promise)
como se ilustra en [codenautas](https://github.com/codenautas/codenautas/blob/master/examples/promises.md)

función              | uso
---------------------|-------------------------------
changeDoc(text,lang) | dado un texto multilang y un código de lenguaje obtiene el texto correspondiente a ese lenguaje
getWarnings(text)    | obtiene una lista de advertencias a partir de un texto multilang


## License

[MIT](LICENSE)

...................................