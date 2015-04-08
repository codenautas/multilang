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

multilang.generateButtons=function changeDoc(documentTextHeader,lang) {
    var r=null;
    if(this.langs) {
        var ln=this.langs[lang];
        if(ln) {
            r='<!--multilang buttons -->\n';
            r += 'idioma: !['+ln.name+'](https://github.com/codenautas/multilang/blob/master/img/lang-'+ln.abr+'.png)\n';
            r += 'also available in:';
            for(var lother in ln.languages) {
                var lname = ln.languages[lother];
                if(ln.name == lname) { continue; }
                r += '\n[!['+lname+'](https://github.com/codenautas/multilang/blob/master/img/lang-'+lother+'.png)](readme.md)';
            }
        }
    }
    return r;
}

module.exports = multilang;
