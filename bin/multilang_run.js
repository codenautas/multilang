"use strict";

var program = require('commander');
var Promise = require('promise');
var multilang = require('./multilang');

function langs(val) {
    return val.split(',')
}

program
    .version(require('../package').version)
    .usage('[options] input.md')
    .option('-i, --input [input.md]', 'Name of the input file')
    .option('-l, --lang [lang1]', 'Language to generate', langs)
    .option('-o, --output [name]', 'Name of the output file. Requires --langs!')
    .option('-v, --verify', 'Run multilang generating no files')
    .option('-s, --silent', 'Don\'t output anything')
    .parse(process.argv);

if( (""==program.args && !program.input) )
{
    program.help();
}

var params = {};
params.input = program.input ? program.input : program.args[0];
params.output = program.output;
params.verify = program.verify;
params.silent = program.silent;
params.langs = program.lang;

multilang.main(params).then(function(){
    process.stderr.write("Done!");
}).catch(function(err){
    process.stderr.write("ERROR\n"+err);
});
