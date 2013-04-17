var Parser = require('./psj-parser'),
    Eval = require('./psj-eval'),
    Tag = require('./tag-function'),
    Q = require('q'), _ = require('underscore'), EvalExpr = require('./psj-eval-expression')
js_reserved = require('./text-util').js_reserved_delta;
var pslice = Array.prototype.slice;
var ParsedTags = {
    'http://java.sun.com/JSP/Page': {
        doBody: function onValidateDoBody(attr, parent) {
            var args = arguments;
            var self = this;
            var tmpl = parent.scope.contentScope._template();
            var f = _.template(tmpl);
            return function onEvalDoBody(ctx) {
                var tscope = parent.createScope();
                var str = f(tscope);
                return str;
            }

        }
    },
    'http://java.sun.com/jsp/jstl/core': {
        forEach: function onForEach(attr, content) {
            var args = arguments;
            var self = this;
            var valueExpr = EvalExpr.expression(attr.items);
            var varStatus = attr.varStatus;
            var begin = attr.begin;
            var end = attr.end;
            var step = attr.step;
            var varName = attr.var;

            return function onEvalForEach(ctx) {
                var scope = ctx.createScope();
                var items = valueExpr(scope);
                var ret = "";
                begin = begin || 0;
                end = end || items.length;
                step = step || 1;
                var pageScope = scope.pageScope;
                for (var i = begin; i < end; i += step) {
                    if (varStatus)
                        pageScope[varStatus] = {
                            first: i == begin,
                            last: begin + step >= end,
                            current: items[i]
                        }
                    if (varName)
                        pageScope[varName] = items[i];
                    ret += ParsedTags['http://java.sun.com/JSP/Page'].doBody(attr, ctx)();
                }
                return ret;
            }
        }
    }
};
var Context = function (options, parent, resolver) {
    this.parent = parent;
    this.resolver = resolver || parent && parent.resolver;
    this.context = {
        taglib: {
            'jsp': 'http://java.sun.com/JSP/Page'
        },
        attribute: [],
        content: [],
        variable: [],
        tag: [],
        include: [],
        page: {}
    };
    this.scope = {pageScope: {}, applicationScope: {}, sessionScope: {}, requestScope: {}};
    this.content = this.context.content;

};
Context.prototype.toString = function () {
    return (this.filename || '[unknown filename]')
}
Context.prototype.parseBody = function (content, filename) {
    new Parser(this).parseBody(content);
    this.filename = filename;
    return this;
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
    var _scope = this._scope.bind(this);
    var taglib = this.context.taglib[prefix];
    taglib = taglib.uri || taglib.tagdir || taglib;
    var tagFunc = ParsedTags[taglib] && ParsedTags[taglib][tag];
    var filename = this.toString() + "#content";
    var parent = this.parent && this.parent.scope;
    var contentScope = buffer && new Context(null, this, this.resolver).parseBody(buffer, filename);

    _scope(contentScope, 'contentScope');
    if (tagFunc) {
//        this.content.push(this._scope(tagFunc(attr), 'tagScope', prefix, tag) + '(evalScope.attrs, ' + JSON.stringify(buffer) + ');');

        this.content.push('<%= ' + _scope(tagFunc(attr, parent), 'tagScope', prefix, tag) + '(this, arguments) %>');
        return this;
    }
    var d = Q.defer();
    this.content.push(d.promise);
    this.resolver(taglib, tag).then(function (tagContent) {
        var tagO = new Tag(taglib, tag, new Context(null, this, this.resolver).parse(tagContent));
        tagO.create().then(function onTagCreateExec(tagFunc) {
            (ParsedTags[taglib] || (ParsedTags[taglib] = {}))[tag] = tagFunc;
            d.resolve('<%= ' + _scope(tagFunc(attr, parent), 'tagScope', prefix, tag) + '(this, arguments) %>');
        }.bind(this))
    }.bind(this));
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
        if (v == 'contentScope') {
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
    var tmpl = this.context.content.map(function (p) {
        var val = p.valueOf();
        if (typeof val === 'function')
            return val();
        return val;
    }).join('\n')
    return tmpl;

}

Context.prototype.template = function () {
    var parent = this.parent;

    return Q.allResolved(this.context.content).then(function (promises) {
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