#!/usr/bin/env node

var program = require('commander');
var Promise = require('promise');
var multilang = require('./multilang');

function langs(val) {
    return val.split(",")
}

program
    .version(require('../package').version)
    .usage('[options] input.md')
    .option('-i, --input [input.md]', 'Name of the input file')
    .option('-l, --langs lang1[,lang2,...]', 'List of languages to generate', langs)
    .option('-o, --output [name]', 'Name of the output file. Requires --lang!')
    .option('-v, --verify', 'Run multilang generating no files')
    .option('-s, --silent', 'Don\'t output anything')
//   .option('--chanout [stream]', 'Select standard output stream')
//   .option('--chanerr [stream]', 'Select error output stream')
    .parse(process.argv);

if(""==program.args && !program.input) {
    program.help();
}

var params = {};
params.input = program.input ? program.input : program.args[0];
params.out = program.output ? program.output : "salida.md";
// program.langs used below
params.verify = program.verify;
params.silent = program.silent;

function doneOK() {  if(!params.silent) { console.log("OK"); } }
function doneERR(e) {  if(!params.silent) { console.log("ERROR: ", e); } }

function callML(params, onErr, onOK) {
  return multilang.main(params).then(null, onErr).nodeify(onOK)
}

if(program.langs) {
    for(lang in program.langs) {
        params.lang = program.langs[lang];
        callML(params, doneERR, doneOK);
    }
} else {
    callML(params, doneERR, doneOK);
}
