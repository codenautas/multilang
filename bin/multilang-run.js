#!/usr/bin/env node

"use strict";

var program = require('commander');
var multilang = require('./multilang');
var Promises = require('best-promise');
var fs = require('fs-promise');
var path = require('path');

function realPath(inFile) {
    return Promises.start(function() {
        if(!inFile) { throw new Error("null file"); }
        return fs.exists(inFile);
    }).then(function(exists) {
        if(! exists) { throw new Error("'"+inFile+"' does not exists"); }
        return inFile;
    }).then(function(inFile) {
        return path.dirname(path.resolve(inFile));
    }).catch(function(err) {
        return Promise.reject(err);
    });
};

function langs(val) {
    return val.split(',')
}

program
    .version(require('../package').version)
    .usage('[options] input.md')
    .option('-i, --input [input.md]', 'Name of the input file')
    .option('-l, --lang [lang1]', 'Language to generate', langs)
    .option('-o, --output [name]', 'Name of the output file. Requires --langs!')
    .option('-d, --directory [name]', 'Name of the output directory.')
    .option('-c, --check', 'Run multilang generating no files')
    .option('-s, --silent', 'Do not output anything')
    .option('--strip-comments', 'Remove HTML comments from output')
    .option('--no-strip-comments', 'Do not remove HTML comments from output')
    .option('-v, --verbose', 'Output all progress informations')
    .parse(process.argv);


function isLongOptionSet(ame) {
    var a=program.rawArgs;
    for(var e=0; e<a.length; ++e) {
        if(a[e]===ame) { return true; }
    }
    return false;
}

function isReadmeFile(filename) {
    return filename.match(/^(readme|leeme|lisezmoi|meleggere|Прочтименя)\.md$/i)==true;
}

//process.exit(0);

if( (""==program.args && !program.input) )
{
    program.help();
}

var params = {};
params.input = program.input ? program.input : program.args[0];
params.output = program.output;
params.check = program.check;
params.silent = program.silent;
params.langs = program.lang;
params.directory = program.directory;
params.verbose = program.verbose;

if(isLongOptionSet('--no-strip-comments')) {
    params.stripComments = false;
} else if(isLongOptionSet('--strip-comments')) {
    params.stripComments = true;
} // else { params.stripComments = undefined; }

var doneMsg = params.check ? 'Done checking!' : 'Done!';

//console.log("STRIP COMENTARIOS", params.stripComments);
//process.exit(0);

if(!params.directory) {
    realPath(params.input).then(function(dir) {
        params.directory = dir;
        multilang.main(params).then(function(){
            if(! params.silent) { process.stderr.write(doneMsg); }
        }).catch(function(err){
            process.stderr.write("ERROR\n"+err.stack);
        });
    }).catch(function(err) {
        process.stderr.write("ERROR: "+err.message);
        program.help();
    });
}
else {
    multilang.main(params).then(function(){
        if(! params.silent) { process.stderr.write(doneMsg); }
    }).catch(function(err){
        process.stderr.write("ERROR: "+err.message);
    });
}
