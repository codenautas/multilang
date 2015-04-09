"use strict";

var _ = require("lodash");

var multilang={}

multilang.langs={
    en:{
        name: 'English',
        abr: 'en',
        languages:{
            en: 'English',
            es: 'Spanish',
            it: 'Italian',
            ru: 'Russian'
        },
        phrases:{
            language: 'language',
            'also available in': 'also available in',
            'DO NOT MODIFY DIRECTLY': 'DO NOT MODIFY DIRECTLY THIS FILE WAS GENERATED BY multilang.js'
        },
        defaultLang:true
    }
}
// esto se va a inicializar con los yaml de ./langs/lang-*.yaml

multilang.changeDoc=function changeDoc(documentText,lang){
    return "changed not implemented yet";
}

multilang.obtainLangs=function obtainLangs(documentTextHeader){
    var all_langs = [];
    var def_lang = null; 
    var langs = /<!--multilang v[0-9]+\s+(.+)(-->)/.exec(documentTextHeader);
    if(langs) {
        var lang_re = /([a-z]{2}):([^.]+\.(md|html))/g;
        var lang;
        while(null != (lang = lang_re.exec(langs[1]))) {
            if(null == def_lang) { def_lang = lang[1]; }
            all_langs[lang[1]] = {'fileName' : lang[2] };
        }
    }
    return {main:def_lang, langs:all_langs};
}

var imgUrl = 'https://github.com/codenautas/multilang/blob/master/img/';

multilang.generateButtons=function generateButtons(documentTextHeader,lang) {
    var obtainedLangs = multilang.obtainLangs(documentTextHeader);
    var ln = _.merge({}, this.langs.en, this.langs[lang]); 
    var r='<!--multilang buttons -->\n';
    r += ln.phrases.language+': !['+ln.name+']('+imgUrl+'lang-'+ln.abr+'.png)\n';
    r += ln.phrases['also available in']+':'; 
    for(var lother in obtainedLangs.langs) {
        if(lother == lang) { continue; } 
        var lname = ln.languages[lother];
        console.log('Bad',lother);
        r += '\n[!['+lname+']('+imgUrl+'lang-'+lother+'.png)]('+obtainedLangs.langs[lother].fileName+')';
    }
    return r;
}

module.exports = multilang;
