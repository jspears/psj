var tu = require('./text-util'), mf = tu.match_fwd, ws = tu.whitespace_swallow, whitespace = tu.whitespace_at,
    lt = tu.l_test, rt = tu.r_test, wo = tu.whitespace_offset, sc = tu.specialChars, identifier = tu.identifier,
    js_reserved = tu.js_reserved_delta
    ;
var STATE_WS = 1, IN_STR = 2;
function EvalExpr(expr) {
    var buffer = '', quote = null;
    var state = 0;
    EXPR: for (var i = 0, n = 1, l = expr.length; i < l; i++, n += i) {
        var chr = expr[i];
        if (quote !== null) {
            buffer += chr;
            if (chr === quote) quote = null;
            continue;
        } else if (chr === '\'' || chr === '"') {
            quote = chr;
            buffer += chr;
            continue;
        }

        if (chr === ':') {
            var ii = identifier(expr, i + 1);
            if (expr[ii] == '(') {
                buffer += "."
                while (i++ <= ii)
                    buffer += expr[i];
                continue;

            }
        }

        if (state === 0 && lt(expr, i)) {
            state = STATE_WS;
            var j = i;
            while (whitespace(expr, ++j))
                buffer += expr[j];
            i = j - 1;
            continue;
        }
        //else
        if (state == STATE_WS) {
            var j = i;//ws(expr, i);
            if (rt(expr, j + 2)) {
                if (mf(expr, j, 'or')) {
                    i = j + 1;
                    buffer += ' ||';
                    continue;
                } else if (mf(expr, j, 'lt')) {
                    i = j + 1;
                    buffer += ' <';
                    continue;
                } else if (mf(expr, j, 'gt')) {
                    i = j + 1;
                    buffer += ' >';
                    continue;
                } else if (mf(expr, j, 'le')) {
                    i = j + 1;
                    buffer += ' <=';
                    continue;
                } else if (mf(expr, j, 'ge')) {
                    i = j + 1;
                    buffer += ' >=';
                    continue;
                } else if (mf(expr, j, 'ne')) {
                    i = j + 1;
                    buffer += ' !=';
                    continue;
                } else if (mf(expr, j, 'eq')) {
                    i = j + 1;
                    buffer += ' ==';
                    continue;
                }
            }
            if (lt(expr, j + 3)) {

                if (mf(expr, j, 'not')) {
                    i = j + 2;
                    buffer += ' !=';
                    continue;
                }
                if (mf(expr, j, 'and')) {
                    i = j + 2;
                    buffer += ' &&';
                    continue;
                }
                if (mf(expr, j, 'div')) {
                    i = j + 2;
                    buffer += ' /';
                    continue;
                }
                if (mf(expr, j, 'mod')) {
                    i = j + 2;
                    buffer += ' %';
                    continue;
                }
            }
            if (lt(expr, j + 5) && mf(expr, j, 'empty')) {
                var e = wo(expr, j + 6);
                if (e == j + 6) e = expr.length;
                buffer += '__empty(' + expr.substring(j + 5, e) + ')';
                //e-1 because the i increments next time around.
                i = e - 1;
                state = 0;
                continue;

            }
            //fix up the reserved words, may need to rethink this
            if (lt(expr, j)) {
                j = ws(expr, j) + 1;
                for (var js = js_reserved.length; js--;) {
                    var key = js_reserved[js];
                    if (rt(expr, j + key.length) && mf(expr, j, key)) {
                        i = j + key.length - 1;
                        buffer += " _" + key;
                        state = 0;
                        continue EXPR;

                    }
                }
            }
        }
        state = 0;
        buffer += expr[i];

    }
    //console.log('orig', expr, '\n\n', 'buffer', buffer, '\n\n');
    this.expression = new Function('obj', 'with(obj){ return ' + buffer + '; } ');

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
    for (var i = 0, l = str.length; i < l; i++) {
        var chr = str[i];
        if (chr === '}' && !--depth) {
            content.push(new EvalExpr(buffer).create());
            buffer = "";
            continue;
        }
        if (chr === '$' && str[i + 1] === '{' && !depth++) {
            if (buffer !== '')
                content.push(buffer);
            buffer = "";
            i++;
            continue;
        }
        buffer += chr;
    }
    if (buffer.length && buffer !== '')
        content.push(buffer);
    return function (ctx) {
        if (content.length == 1){
            var v = content[0];
             return typeof v === 'function' ? v.call(this, ctx) : v;
        }
        return content.map(function (v) {
            return typeof v === 'function' ? v.call(this, ctx) : v;
        }, this).join('');
    }
}
EvalExpr.prototype.create = function EvalExpr_create() {
    var f = this.expression;

    return function execution(obj) {
        var ret = {};
        var keys = obj ? Object.keys(obj) : [];
        for (var i = keys.length; i--;) {
            var key = keys[i];
            if (~js_reserved.indexOf(key)) {
                ret['_' + key] = obj[key];
            } else {
                ret[key] = obj[key]
            }
        }
        ret.__empty = empty;
        return f.call(this, ret);
    }
}

module.exports = EvalExpr;