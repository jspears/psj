var tu = require('./text-util'), whitespace = tu.whitespace_at,
    Parser = require('exprjs/parser'),
    exprjs = new Parser({el:true})
    ;
var IN_EVAL = 1;

function EvalExpr(evalexpr) {

        this.expression = exprjs.parse(evalexpr);

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

EvalExpr.expression = function (str) {
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
            content.push(new EvalExpr(buffer).create());
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
            return typeof v === 'function' ? v.call(this, ctx) : v;
        }
        return content.map(function (v) {
            return typeof v === 'function' ? v.call(this, ctx) : v;
        }, this).join('');
    }
}
EvalExpr.prototype.create = function EvalExpr_create() {
    var expr = this.expression;

    return function execution(obj) {
        return exprjs.run(expr, obj);
    }
}

module.exports = EvalExpr;