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
params.directory = program.directory;

if(!params.directory) {
    realPath(params.input).then(function(dir) {
        params.directory = dir;
        //console.log("Using directory: ", params.directory);
        multilang.main(params).then(function(){
            process.stderr.write("Done!");
        }).catch(function(err){
            process.stderr.write("ERROR\n"+err);
        });
    }).catch(function(err) {
    	//console.log("DIR", err);
        process.stderr.write("ERROR: "+err.message);
        program.help();
    });
}
else {
    multilang.main(params).then(function(){
        process.stderr.write("Done!");
    }).catch(function(err){
    	//console.log("ELSE", err);
        process.stderr.write("ERROR: "+err.message);
    });
}
