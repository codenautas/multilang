# multilang
Tools for multilanguage &amp; Markdown multilang


[![version](https://img.shields.io/npm/v/multilang.svg)](https://npmjs.org/package/multilang)
[![downloads](https://img.shields.io/npm/dm/multilang.svg)](https://npmjs.org/package/multilang)
[![linux](https://img.shields.io/travis/codenautas/multilang/master.svg)](https://travis-ci.org/codenautas/multilang)
[![coverage](https://img.shields.io/coveralls/codenautas/multilang/master.svg)](https://coveralls.io/r/codenautas/multilang)
[![climate](https://img.shields.io/codeclimate/github/codenautas/multilang.svg)](https://codeclimate.com/github/codenautas/multilang)
[![dependencies](https://img.shields.io/david/codenautas/multilang.svg)](https://david-dm.org/codenautas/multilang)



language: ![English](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)
also available in:
[![Spanish](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)](LEEME.md)


In a Markdown or HTML-like file is written the documentation in multiple languages.

One of these languages ​​is the main, the others are commented with &lt;!-- and --&gt;

Then with ` multilang` the other languages ​​are extracted to generate one file for each of the other languages ​​defined


## Install


```sh
$ npm install multilang -g
```


## Use


```
$ multilang doc-en.md
```


A .md file is generated for the other languages written in `doc-en.md` file


## Multilanguage document format

Any HTML or Markdown document is a multilenguage document if it has a main *multilanguage* directive.

### Example


```
language: English see also: [Spanish](README.md) [French](LISEZMOI.md)

Este es un pequeño ejemplo

[!--lang:All you need is multilang!

"*" means all languages

