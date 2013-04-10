var Parser = require('./psj-parser'), Q = require('q'), _ = require('underscore');
var pslice = Array.prototype.slice;
var ParsedTags = {

};
var Context = function (options, parent, resolver) {
    this.parent = parent;
    this.resolver = resolver;
    this.context = {
        taglib: {
            'jsp': 'http://java.sun.com/JSP/Page'
        },
        attribute: [],
        content: [],
        variable:[],
        tag:[],
        include:[],
        page:{}
    };
    this.scope = {};
    this.content = this.context.content;

};
Context.prototype.toString = function(){
    return (this.filename || '[unknown filename]')
}
Context.prototype.parse = function (content, filename) {
    new Parser(this).parse(content);
    this.filename = filename;
    return this;
}
Context.prototype._scope = function (val) {
    var scope = this.scope;
    for (var i = 1, l = arguments.length; i < l; i++) {
        var arg = arguments[i];
        if (!(arg in scope))
            scope = scope[arg] = i + 1 == arguments.length ? val : {};
    }
    return pslice.call(arguments, 1).join('.');
}
Context.prototype.parseTag = function (prefix, tag, attr, buffer) {
    var taglib = this.context.taglib[prefix];
    var tagFunc = ParsedTags[taglib] && ParsedTags[taglib][tag];
    if (tagFunc) {
        this.content.push(this._scope(tagFunc, 'pageScope', prefix, tag) + '(evalScope.attrs, ' +JSON.stringify(buffer)+');');

    }
    var d = Q.defer();
    var _scope = this._scope.bind(this);
    var content = this.content;
    this.resolver(taglib, tag, attr, buffer).then(function (promise) {
        var ctx = new Context(null, this, this.resolver);
        ctx.parse(promise.valueOf(), taglib+'/'+tag+'.tag');
        ctx.template().then(function(resp){
            if (!ParsedTags[taglib]) ParsedTags[taglib] = {};
            if (!ParsedTags[taglib][tag]) ParsedTags[taglib][tag] = resp;
            d.resolve((ctx._scope(resp, 'pageScope', prefix, tag) + '(evalScope.attrs, ' +JSON.stringify(buffer)+');'));

        });
    }.bind(this))
    content.push(d.promise);

}
Context.prototype.parseEvalOut = function (content, char, line) {
    return this.content.push('<%=' + content + '%>');
}
Context.prototype.parseEval = function (content, char, line) {
    return this.content.push('<%=' + content + '%>');
}
Context.prototype.parseContent = function (content, char, line) {
//    var ctx = new Context(null,this,this.resolver);
//    ctx.parse(content, this.filename);
//    var d = Q.defer();
//    ctx.template().then(function(ret){
//       return  ret;
//    });
    return this.content.push(content);
}

Context.prototype.template = function () {
    var parent = this.parent;
    return Q.allResolved(this.context.content).then(function (promises) {
        var tmpl = promises.map(function (p) {
            var val = p.valueOf();

            return val;
        }).join('\n')
        return tmpl;
    });
}
var checkdefined = ['parseEval', 'parseContent', 'parseComment', 'parseEvalOut', 'parseTag'];
checkdefined.forEach(function (v) {
    if (!this[v])
        this[v] = function () {
            console.log('function: [' + v + '] is not implemented', arguments);
        }
}, Context.prototype);

module.exports = Context;