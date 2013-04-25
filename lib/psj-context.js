var Parser = require('./psj-parser'),
    Eval = require('./psj-eval'),
    Tag = require('./tag-function'),
    ParsedTags = require('./parsed-tags'),
    Q = require('q'), _ = require('underscore'), EvalExpr = require('./psj-eval-expression')
js_reserved = require('./text-util').js_reserved_delta;
var pslice = Array.prototype.slice;

var _scopeCount = 0;

var Context = function (options, parent, resolver, filename) {
    this.filename = filename;
    this.parent = parent;
    this.resolver = resolver || parent && parent.resolver;
    this.context = {
        taglib: {
            'jsp': 'http://java.sun.com/JSP/Page'
        },
        attribute: [],
        variable: [],
        tag: [],
        include: [],
        page: {}
    };
    this.parser = new Parser(this);
    this.scope = {pageScope: {}, applicationScope: {}, sessionScope: {}, requestScope: {}};
    this.promises = [];
    this.content = [];
    if (parent)
        _.extend(this.context.taglib, parent.context.taglib);
};
Context.prototype.parseEnd = function(context, info){
   console.log('parseEnd');
}
Context.prototype.parseBodyEnd = function(context, info){
   console.log('parseBodyEnd');
}

Context.prototype.toString = function () {
    return (this.filename || '[unknown filename]')
}
Context.prototype.parseBody = function (content, info) {
    this.parser.parseBody(content, info);
    content.parent = this;
    return this;
}
Context.prototype.parse = function (content, info) {
    this.parser.parse(content, info || {ctx: this, filename: this.filename});
    return this;
}

Context.prototype._scope = function (val) {
    var scope = this.scope;
    for (var i = 1, l = arguments.length - 1; i < l; i++) {
        var arg = arguments[i];
        scope = arg in scope ? scope[arg] : (scope[arg] = {});
    }
    scope[arguments[arguments.length - 1]] = val;
    var path = pslice.call(arguments, 1).join('.');
    console.log('adding val to scope ', path, this.filename, this.parent && this.parent.filename);
    return path;
}

Context.prototype.parseTagContent = function parseTagContent(buffer, info, prefix, tag) {
    var tcx = this.tagContent = new Context(null, this, this.resolver, prefix + '/' + tag + '#tagContent');
    tcx.scope = this.scope;
    tcx.context = this.context;

    //  info.tagContent = tcx;
    //str,  ctx

    tcx.parseBody(buffer, info);
    return tcx;
}
Context.prototype.parseFileContent = function parseFileContent(buffer) {
    this.parseBody(buffer, {isFileContent: true, parent: this});
    return this;
}

Context.prototype.parseTag = function (prefix, tag, attr, buffer, info) {
    var _scope = this._scope.bind(this);
    var taglib = this.context.taglib[prefix];
    taglib = taglib.uri || taglib.tagdir || taglib;

    //  var tagContent = info.ctx.tagContent;
    var tagContent = this.parseTagContent(buffer, info, prefix, tag);

    //The $0 allows for multiple existing instances of tagFunc, imagine calling.
    // tagScope.tag.c it would only call the last one set for a scope otherwise,
    // we can find a better way, proba
    var self =this;
    var tf = ParsedTags[taglib] && ParsedTags[taglib][tag];
    if (tf){
        this.content.push('<%=' + this._scope(tf(attr, tagContent, info), 'tagScope', '$' + (_scopeCount++), prefix, tag) + '(this, arguments) %>');
        return this;
    }
    var d = Q.defer();
    this.content.push(d.promise);
    this.resolver(taglib, tag).then(function (fileBuffer) {
        var tagO = new Tag(taglib, tag, new Context(null, null, this.resolver));

        tagO.parse(fileBuffer);
        tagO.create().then(function onTagCreateExec(tagFunc) {
            tagFunc.name = taglib+'/'+tag;
            (ParsedTags[taglib] || (ParsedTags[taglib] = {}))[tag] = tagFunc;
            d.resolve('<%= ' + this._scope(tagFunc(attr, tagContent, info), 'tagScope', '$' + (_scopeCount++), prefix, tag) + '(this, arguments) %>');
        }.bind(this))
    }.bind(this));
    return this;
}

Context.prototype.createScope = function (evalScope) {
    evalScope = evalScope || {};
    var descend = ['application', 'session', 'request', 'eval'];
    var scopes = ['application', 'session', 'request', 'page', 'eval', 'content'].map(function (v) {
        return v + "Scope"
    });
    var keyedScopes = [];
    var scopeArgs = scopes.map(function (v) {
        var val = v === 'evalScope' ? evalScope : this.scope[v];
        if (v == 'contentScope' || v == 'tagScope') {
            return;
        }
        if (
        //v !== 'pageScope' &&
            this.parent) {
            var resolve = [];
            var parent = this;
            while (parent != null) {
                resolve.push(parent.scope[v])
                parent = parent.parent;
            }
            obj = _.extend.apply(_, [
                {}
            ].concat(resolve.reverse()).concat(val));
        } else {
            var obj = {};
            obj[v] = val;
        }
        keyedScopes.push(obj)
        return val;
    }, this);

    var copy = _.extend.apply(_, [
        {}
    ].concat(scopeArgs.concat(keyedScopes)));
    copy.contentScope = this.scope.contentScope;
    copy.tagScope = this.scope.tagScope;
    return copy;
}
Context.prototype.parseExpr = function (content, char, line) {
    if (!content)
        return;
    //parse  here evaluate later;
    var f = new EvalExpr(content).create();
    this.content.push(function () {
        return f.apply(this, pslice.call(arguments));
    }, this.context);
}

Context.prototype.parseEvalOut = function (content, char, line) {
    if (!content) return;
    //evaluate later;
    var ret = new Eval(content).create()()
    this.content.push("<%=" + ret + "%>");

}
Context.prototype.parseEval = function (content, char, line) {
    if (!content)
        return;
    //evaluate later;
    var str = new Eval(content).create()()
    this.content.push('<%' + str + '%>');

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
Context.prototype.render = function (obj, callback) {
    _.extend(this.scope.pageScope, obj);
    var createScope = this.createScope.bind(this);
    this.template().then(function onContextRenderTemplate(promise) {
        var f = _.template(promise);
        var scope = createScope();
        callback(f.call(this, scope))

    }.bind(this), function (e) {
        console.log('Errrorrr', e);
    })
}
Context.prototype._template = function () {
    var tmpl = this.content.map(function (p) {
        var val = p.valueOf();
        if (typeof val === 'function') {
            try {
                return val();
            } catch (e) {
                console.log('Context._template: ' + this.filename + ' ' + val.source);
            }
        }
        return val;
    }).join('\n')
    var f;
    try {
        f = _.template(tmpl);
    } catch (e) {
        console.log('error: ' + this.filename + '\n\n message:' + e.message + ' source:' + tmpl);
    }
    return f;
}

Context.prototype.template = function () {
    var parent = this.parent;

    return Q.allResolved(this.content).then(function (promises) {
        var tmpl = promises.map(function (p) {
            var val = p.valueOf();
            if (typeof val === 'function')
                return val();
            return val;
        }).join('\n')
        return tmpl;
    });
}
var checkdefined = ['parseEval', 'parseContent', 'parseComment', 'parseExpr', 'parseEvalOut', 'parseTag'];
checkdefined.forEach(function (v) {
    if (!this[v])
        this[v] = function () {
            console.log('function: [' + v + '] is not implemented', arguments);
        }
}, Context.prototype);

module.exports = Context;