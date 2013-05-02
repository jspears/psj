var tu = require('./text-util'), whitespace = tu.whitespace_at,
    Parser = require('exprjs/parser'),
    exprjs = new Parser({el: true}),
    funcs = require('../lib/psj-parsed-functions'),
    Q = require('q'),
    _ = require('underscore')
    ;
var IN_EVAL = 1;
function EvalExpr(ctx, evalexpr) {
    this.source = evalexpr;
    function invoke(prefix, name) {
        var promise = Q.invoke(funcs, 'resolve', ctx.resolver, ctx.context.taglib[prefix], name);
        ctx.promises.push(promise);
        return promise;
    }

    var functions = this.functions = {};
    this.expression = exprjs.parse(evalexpr, function (_, $0, $1, $2, $3, $4) {
        var fname = '__' + $1;
        invoke($1, $2).then(function (func) {
            (functions[fname] || ( functions[fname] = {}))[$2] = func;
            return func;
        });

        return fname + "." + $2 + "(" + $3 + ")";
    });
}
function empty(arg) {
    return !(arg && arg.length);
}
/**
 * Parses a string with an el expression and returns a function that when executed
 * returns a value;
 * EvalExpr.expression('hello ${value}')({value:'world'}) == 'hello world'
 *
 */

EvalExpr.expression = function (ctx, str) {
    var content = [], buffer = "";
    var depth = 0;
    var state = 0;
    for (var i = 0, l = str.length; i < l; i++) {
        var chr = str[i];
        if (str[i] === '\\' && str[i + 1] === '\\') {
            buffer += '\\';
            i++;
            continue;
        }
        if (state === IN_EVAL && chr === '}' && !--depth) {
            content.push(new EvalExpr(ctx, buffer).create());
            buffer = "";
            state = 0;
            continue;
        }
        if (chr === '$' && str[i + 1] === '{' && !depth++) {
            if (buffer !== '')
                content.push(buffer);
            buffer = "";
            state = IN_EVAL;
            i++;
            continue;
        }
        buffer += chr;
    }
    if (buffer.length && buffer !== '')
        content.push(buffer);
    return function (ctx) {
        if (content.length == 1) {
            var v = content[0];
            var ret = typeof v === 'function' ? v.call(this, ctx) : v;
            return ret;
        }
        return content.map(function (v) {
            return typeof v === 'function' ? v.call(this, ctx) : v;
        }, this).join('');
    }
}
EvalExpr.prototype.create = function EvalExpr_create() {
    var expr = this.expression;
    var functions = this.functions;
    return function execution(obj) {
        //should this copy?
        return exprjs.run(expr, _.extend(obj, functions));
    }
}

module.exports = EvalExpr;