var Parser = require('./psj-parser'),
    Eval = require('./psj-eval'),
    Tag = require('./tag-function'),
    ParsedTags = require('./parsed-tags'),
    Scope = require('./psj-scope'),
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
    this.promises = [];
    this.content = [];
    this.tagScope = {};
    if (parent)
        _.extend(this.context.taglib, parent.context.taglib);
};
Context.prototype.parseEnd = function (context, info) {
    // console.log('parseEnd');
}
Context.prototype.parseBodyEnd = function (context, info) {
//   console.log('parseBodyEnd');
}
Context.prototype.toString = function () {
    return (this.filename || '[unknown filename]')
}
Context.prototype.parseBody = function (content, info) {
    this.parser.parseBody(content, info);
    return this;
}
Context.prototype.parse = function (content, info) {

    this.parser.parse(content, info || {ctx: this, filename: this.filename});
    return this;
}

Context.prototype._scope = function (val) {
    var scope = this;
    for (var i = 1, l = arguments.length - 1; i < l; i++) {
        var arg = arguments[i];
        scope = arg in scope ? scope[arg] : (scope[arg] = {});
    }
    scope[arguments[arguments.length - 1]] = val;
    var path = pslice.call(arguments, 1).join('.');
    console.log('adding val to scope ', path, this.filename, this.parent && this.parent.filename);
    return 'this.'+path;
}

Context.prototype.parseTagContent = function parseTagContent(buffer, info, prefix, tag) {
    var tcx = this.tagContent = new Context(null, this, this.resolver, prefix + '/' + tag + '#tagContent');
    tcx.scope = this.scope;
    tcx.context = this.context;

    //  info.tagContent = tcx;
    //str,  ctx
//    var d = Q.defer();
//    tcx.promise  = d.promise;
//    this.promise.when(function(ctx){
//       tcx.promise.resolve(ctx);
//    });
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
    var self = this;
    var tf = ParsedTags[taglib] && ParsedTags[taglib][tag];
    if (tf) {
        this.content.push('<%=' + this._scope(tf(attr, tagContent, info), 'tagScope', '$' + (_scopeCount++), prefix, tag) + '(this, obj, "me") %>');
        return this;
    }
    var d = Q.defer();
    this.content.push(d.promise);
    this.resolver(taglib, tag).then(function (fileBuffer) {
        var tagO = new Tag(taglib, tag, new Context(null, null, this.resolver));

        tagO.parse(fileBuffer);
        tagO.create().then(function onTagCreateExec(tagFunc) {
            tagFunc.name = taglib + '/' + tag;
            (ParsedTags[taglib] || (ParsedTags[taglib] = {}))[tag] = tagFunc;
            d.resolve('<%= ' + this._scope(tagFunc(attr, tagContent, info), 'tagScope', '$' + (_scopeCount++), prefix, tag) + '(this, obj) %>');
        }.bind(this))
    }.bind(this));
    return this;
}


Context.prototype.parseExpr = function (content, char, line) {
    if (!content)
        return;
    //parse  here evaluate later;
    var f = new EvalExpr(content).create();
    this.content.push('<%=' + this._scope(function (obj) {
            var str;
            try {
                str = f.call(this, obj)
            }catch(e){
                console.log('error evaluating '+content+' line'+line);
            }
            return str;
        }, 'tagScope', '$' + (_scopeCount++), '_eleval'
    ) + "(obj) %>");
//    this.content.push(function () {
//        return f.apply(this, pslice.call(arguments));
//    }, this.context);
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
    this.template().then(function onContextRenderTemplate(promise) {
        var f = _.template(promise);
        var scope =  new Scope(obj);
        try {
            callback(null, scope.eval(f, this));
        } catch (e) {
            callback(e);
        }
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