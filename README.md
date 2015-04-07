<!--multilang v0 en:README.md es:LEEME.md -->
<!--multilang buttons -->
language: ![English](https://github.com/codenautas/multilang/blob/master/img/lang-en.png)
also available in:
[![Spanish](https://github.com/codenautas/multilang/blob/master/img/lang-es.png)](LEEME.md)

# multilang
<!--lang:en-->
Tools for multilanguage &amp; Markdown multilang

In a file type Markdown or HTML you writte documentation in multiple languages.

One of these languages ​​is the principal, the others are comented with &lt; and &gt;

Then with ` multilang` the other languages ​​are extracted to generate one file for each of the other languages ​​defined
<!--lang:es--]
Herramientas multilenguaje (primeramente para Markdown)

En un archivo tipo Markdown o html se escribe documentación en varios idiomas. 
Uno de esos lenguajes es el principal, los otros están comentados con &lt;!-- y --&gt;
Luego con `multilang` se extraen los otros lenguajes generando un archivo para cada uno de los otros lenguajes definidos
[!--lang:*-->

![designing](https://img.shields.io/badge/stability-desgining-red.svg)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]

<!--lang:en-->
## Install
<!--lang:es--]
## Instalación
[!--lang:*-->

```sh
$ npm install multilang -g
```
<!--lang:en-->
## Use

<!--lang:es--]
## Uso

[!--lang:*-->

```
$ multilang doc-en.md
```

<!--lang:en-->
Generates one the .md files for the other languages writed in `doc-en.md`
<!--lang:es--]
Genera los archivos especificados en la cabecera del archivo para los idiomas secundarios.
[!--lang:*-->

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/multilang.svg?style=flat
[npm-url]: https://npmjs.org/package/multilang
[travis-image]: https://img.shields.io/travis/codenautas/multilang/master.svg?label=linux&style=flat
[travis-url]: https://travis-ci.org/codenautas/multilang
[appveyor-image]: https://img.shields.io/appveyor/ci/emilioplatzer/multilang/master.svg?label=windows&style=flat
[appveyor-url]: https://ci.appveyor.com/project/emilioplatzer/multilang
[coveralls-image]: https://img.shields.io/coveralls/codenautas/multilang/master.svg?style=flat
[coveralls-url]: https://coveralls.io/r/codenautas/multilang
[downloads-image]: https://img.shields.io/npm/dm/multilang.svg?style=flat
[downloads-url]: https://npmjs.org/package/multilang
