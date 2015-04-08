"use strict";

var multilang={}

multilang.langs={
}
// esto se va a inicializar con los yaml de ./langs/lang-*.yaml

multilang.changeDoc=function changeDoc(documentText,lang){
    return "changed not implemented yet";
}

multilang.obtainLangs=function obtainLangs(documentTextHeader){
    var all_langs = [];
    var def_lang = null; 
    var langs = /<!--multilang v[0-9]+\s+([^-]+)-->/.exec(documentTextHeader);
    var lang_re = /([a-z]{2}):([a-zA-Z]+\.html)/g;
    var lang;
    while(null != (lang = lang_re.exec(langs[1]))) {
        if(null == def_lang) { def_lang = lang[1]; }
        all_langs[lang[1]] = {'fileName' : lang[2] };
    }
    return {main:def_lang, langs:all_langs};
}

multilang.generateButtons=function changeDoc(documentTextHeader,lang){
    return "<--changed not implemented yet";
}


module.exports = multilang;
