var fs = require('fs');

var States = (function () {
    var i = 1;
    return{
        HEAD: i++,//<%@
        EVAL: i++, //<%
        COMMENT: i++,//<%--
        EVAL_OUT: i++,//<%=
        TAG: i++, //<p
        TAG_END: i++,
        TAG_START: i++,//</p:tag>,
        TAG_POSTFIX: i++, // <p:postfix
        $EVAL: i++,//$
        ATTR: i++,//<a attribute
        ATTR_END: i++,//> </end>
        CONTENT: i++,
        PREFIX: i
    }
})();
function whitespace(c) {
    return c === " " || c === "\t" || c === "\r" || c === "\n";
}

function Parser(context) {
    var parseContent = context.parseContent.bind(context),
        parseEval = context.parseEval.bind(context),
        parseComment = context.parseComment.bind(context),
        parseEvalOut = context.parseEvalOut.bind(context),
        parseTag = context.parseTag.bind(context);

    var states = [parseContent, parseHeadAttr, parseEval, parseComment, parseEvalOut, parseTag];

    var taglibs = context.context.taglib;
    var attrRe = /([\w\-\.:]+)(\s*=\s*("([^"]*)"|'([^']*)'))?/g;

    function parseAttr(attr) {
        var buf = attr.trim();
        var match;
        var obj = {};
        while ((match = attrRe.exec(buf)) !== null) {
            obj[match[1]] = match[4] || match[5];
        }
        return obj;
    }

    function parseHeadAttr(buffer) {
        var obj = parseAttr(buffer);
        if ('taglib' in obj) {
            delete obj.taglib;
            context.context.taglib[obj.prefix] = obj;
        } else if ('attribute' in obj) {
            delete obj.attribute;
            context.context.attribute.push(obj);

        }
        return obj;
    }

    this.parse = function parse(str) {
        var state = 0, depth = 0;
        var buffer = "", prefix = "", tag = "", ntag = "", nprefix = "", attr = "", quote = null, pt = "";
        for (var i = 0, n = 1, l = str.length; i < l; i++, n = i + 1) {
            if (state == States.TAG_END) {
                parseTag(prefix, tag, attr ? parseAttr(attr) : null, buffer);
                state = 0;
                nprefix = ntag = prefix = attr = tag = buffer = "";
                continue;
            }

            var chr = str[i], next = str[n];

            if (chr == '<' && next == '%') {
                if (buffer.length) {
                    parseContent(buffer);
                    buffer = "";
                }
                if (str[n + 1] == '@') {
                    i += 2;
                    state = States.HEAD;
                    continue;
                }
                if (str[n + 1] == '=') {
                    i += 2;
                    state = States.EVAL_OUT;
                    continue;
                }
                if (str[n + 1] == '-' && str[n + 2] == '-') {
                    i += 3;
                    state = States.COMMENT;
                    continue;
                }
                i++;
                state = States.EVAL;
                continue;
            }
            if (!state && chr == '$' && next == "{") {
                parseContent(buffer);
                buffer = "";
                state = States.$EVAL;
                i++;
                continue;
            }
            if (state == States.$EVAL && chr == '}') {
                parseEvalOut(buffer);
                buffer = "";
                state = 0;
                continue;
            }
            if (state == States.ATTR) {
                if (!quote && chr == '/' && next == '>') {
                    if (!depth) {
                        state = States.TAG_END;
                        if (buffer) parseContent(buffer);
                        buffer = "";
                        continue;
                    } else {
                        depth--;
                    }
                }
                if (!quote && chr == '>') {
                    state = States.TAG;
                    buffer = "";
                    continue;
                }
                if (!quote) {
                    if (chr === '"' || chr === '\'')
                        quote = chr;
                } else if (chr === quote) {
                    if (str[i - 1] !== '\\')
                        quote = null;
                }

                attr += chr;
                continue;
            }
            if (!state && chr == '<' && next !== '!') {
                state = States.TAG_START;
                buffer += chr;
                continue;
            }
            if (state == States.TAG_START) {
                if (chr == ':') {
                    if (ntag in taglibs) {
                        state = States.TAG_POSTFIX;
                        prefix = ntag;
                        buffer = buffer.substring(0, buffer.length - (prefix.length + 1));
                        ntag = "";
                        continue;
                    }
                    ntag = "";
                    buffer += chr;
                    state = 0;
                    continue;
                }

                ntag += chr;
            }
            if (state == States.TAG_POSTFIX) {
                if (whitespace(chr)) {
                    tag = ntag;
                    ntag = "";
                    state = States.ATTR;
                    continue;
                }
                if (chr == '/' && next == '>') {
                    //   buffer="";
                    parseContent(buffer);
                    buffer = "";
                    tag = ntag;
                    state = States.TAG_END;
                    continue;
                }
                ntag += chr;
                continue;
            }
            if (state == States.TAG) {
                if (chr == '<' && next == '/') {
                    pt = prefix + ':' + tag;
                    var end = n + 1 + pt.length;
                    if (pt + '>' == str.substring(n + 1, end + 1)) {
                        if (!depth) {
                            i = end - 1;
                            state = States.TAG_END;
                        } else {
                            depth--;
                            buffer += chr;
                        }
                        continue;
                    }
                } else if (str.substring(n - prefix.length + tag.length, i) == prefix + ":" + tag && chr == '/' && next == '>') {
                    state = States.TAG_END;
                    buffer = "";
                    i++;
                    continue;
                } else if (chr == '<') {
                    pt = prefix + ":" + tag;
                    var st = str.substring(n, n + pt.length);
                    if (st == pt && ((str[n + pt.length] == '>') || whitespace(str[n + pt.length]) || (str.substring(n + pt.length, n + pt.length + 2) == '/>'))) {
                        depth++;
                    }
                } else {
                    ntag += next;
                }

            }
            if (state && state < 5 && chr == '%' && next == '>') {
                if (state == States.COMMENT) {
                    if (buffer.substring(buffer.length - 2) != '--')
                        throw new Error("Found '%>' but not end of comment [" + i + "," + n + "]: " + buffer);
                    buffer = buffer.substring(0, buffer.length - 2);
                }
                states[state].call(context, buffer, i, chr);
                i += 1;
                state = 0;
                buffer = "";
                continue;
            }
            buffer += chr;
        }
        //     states[state] && states[state].call(context, buffer, i, chr);
        parseContent(buffer);
        return context;
    }

}

module.exports = Parser;