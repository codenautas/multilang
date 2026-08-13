#!/usr/bin/env node

"use strict";

var program = require('commander').program;
var multilang = require('./multilang');
var fs = require('fs/promises');
var path = require('path');
var os = require('os');

function realPath(inFile) {
    return Promise.resolve().then(function() {
        if(!inFile) { throw new Error("null file"); }
        return fs.realpath(inFile);
    }).then(function(resolvedFile) {
        var cwd = process.cwd();
        if(resolvedFile !== cwd && !resolvedFile.startsWith(cwd + path.sep)) {
            throw new Error("'"+inFile+"' is outside the allowed directory");
        }
        return fs.stat(resolvedFile).then(function(stats) {
            if(!stats.isFile()) { throw new Error("'"+inFile+"' is not a file"); }
            return path.dirname(resolvedFile);
        });
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
    .argument('[input.md]', 'Name of the input file')
    .option('-i, --input [input.md]', 'Name of the input file')
    .option('-l, --lang [lang1]', 'Language to generate', langs)
    .option('-o, --output [name]', 'Name of the output file. Requires --langs!')
    .option('-d, --directory [name]', 'Name of the output directory.')
    .option('-c, --check', 'Run multilang generating no files')
    .option('-s, --silent', 'Do not output anything')
    .option('--strip-comments', 'Remove HTML comments from output')
    .option('--no-strip-comments', 'Do not remove HTML comments from output')
    .option('--eol <type>', 'End of line for the output files: LF or CRLF (default: the OS end of line)')
    .option('-v, --verbose', 'Output all progress informations')
    .parse(process.argv);

var options = program.opts();


function isLongOptionSet(ame) {
    var a=program.rawArgs;
    for(var e=0; e<a.length; ++e) {
        if(a[e]===ame) { return true; }
    }
    return false;
}

if( (""==program.args && !options.input) ){
    program.help();
}

var params = {};
params.input = options.input ? options.input : program.args[0];
params.output = options.output;
params.check = options.check;
params.silent = options.silent;
params.langs = options.lang;
params.directory = options.directory;
params.verbose = options.verbose;

var eolByName = {LF:'\n', CRLF:'\r\n'};
if(options.eol) {
    var eolName = String(options.eol).toUpperCase();
    if(! (eolName in eolByName)) {
        process.stderr.write("ERROR: invalid --eol value '"+options.eol+"', expected LF or CRLF\n");
        program.help();
    }
    params.eol = eolByName[eolName];
} else {
    params.eol = os.EOL;
}

if(isLongOptionSet('--no-strip-comments')) {
    params.stripComments = false;
} else if(isLongOptionSet('--strip-comments')) {
    params.stripComments = true;
}

var doneMsg = params.check ? 'Done checking!\n' : 'Done!\n';

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
} else {
    multilang.main(params).then(function(){
        if(! params.silent) { process.stderr.write(doneMsg); }
    }).catch(function(err){
        process.stderr.write("ERROR: "+err.message);
    });
}
