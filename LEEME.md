-->
-->
# multilang

Tools for multilanguage &amp; Markdown multilang


Herramientas multilenguaje (primeramente para Markdown)


[![version](https://img.shields.io/npm/v/multilang.svg)](https://npmjs.org/package/multilang)
[![downloads](https://img.shields.io/npm/dm/multilang.svg)](https://npmjs.org/package/multilang)
[![linux](https://img.shields.io/travis/codenautas/multilang/master.svg)](https://travis-ci.org/codenautas/multilang)
[![coverage](https://img.shields.io/coveralls/codenautas/multilang/master.svg)](https://coveralls.io/r/codenautas/multilang)
[![climate](https://img.shields.io/codeclimate/github/codenautas/multilang.svg)](https://codeclimate.com/github/codenautas/multilang)
[![dependencies](https://img.shields.io/david/codenautas/multilang.svg)](https://david-dm.org/codenautas/multilang)


s-->
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
d-->
<!--multilanguage v0 en:README.md es:LEEME.md fr:LISEZMOI.md-->
s-->
<!--multilanguage buttons-->
language: English see also: [Spanish](README.md) [French](LISEZMOI.md)

n-->
<!--lang:en-->
This is a little example

*-->
[!--lang:*-->
All you need is multilang!

n-->
<!--lang:en-->
"*" means all languages

d-->
s-->
