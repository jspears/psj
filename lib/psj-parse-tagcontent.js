var tu = require('./text-util'),
    whitespace = tu.whitespace,
    match_fwd = tu.match_fwd,
    _ = require('underscore'),
    whitespace_swallow = tu.whitespace_swallow,
    trim_end = tu.trim_end,
    parseAttr = tu.parseAttr,
    countLines = tu.countLines;

var States = (function () {
    var i = 1;
    return{
        HEAD: i++,//<%H
        EVAL: i++, //<%
        COMMENT: i++,//<%--
        EVAL_OUT: i++,//<%=
        TAG: i++, //<p
        TAG_END: i++,
        TAG_START: i++,//</p:tag>,
        TAG_POSTFIX: i++, // <p:postfix
        TAG_CONTENT: i++,
        $EVAL: i++,//$
        ATTR: i++,//<a attribute
        ATTR_END: i++,//> </end>
        CONTENT: i++,
        PREFIX: i++,
        HEAD_TYPE: i++,
        HEAD_ATTR: i
    }
})();
function createError(message, str, pos) {
    return new Error(message + " @[" + countLines(str, pos) + "," + pos + '] ' + str.substring(pos - 8, pos) + '--"' + str[pos] + '"-- ' + str.substring(pos + 1, pos + 8))
}

module.exports = function (context) {
    var parseContent = context.parseContent.bind(context),
        parseEval = context.parseEval.bind(context),
        parseComment = context.parseComment.bind(context),
        parseEvalOut = context.parseEvalOut.bind(context),
        parseTag = context.parseTag.bind(context),
        parseBodyEnd = context.parseBodyEnd.bind(context)
        ;
    var taglibs = context.context.taglib;
    var states = [parseContent, parseEval, parseComment, parseEvalOut, parseTag];


    return function parseBody(str, info, parseEndCb) {
        parseEndCb = parseEndCb || parseBodyEnd;
        var state = 0, depth = 0;
        var buffer = "", prefix = "", tag = "", ntag = "", nprefix = "", attr = "", quote = null, pt = "", fulltag = "";
        for (var i = 0, n = 1, l = str.length; i < l; i++, n = i + 1) {
            if (state === States.TAG_END) {
                parseTag(prefix, tag, attr ? parseAttr(attr) : null, buffer, _.extend(info, {line: countLines(str, i), chr: i}));
                depth = state = 0;
                quote = fulltag = pt = nprefix = ntag = prefix = attr = tag = buffer = "";
                continue;
            }
            var chr = str[i], next = str[n];

            if (state === States.EVAL && chr === '%' && next === '>') {
                parseEval(buffer);
                buffer = "";
                i++;
                state = 0;
                continue;
            }
            if (state === States.EVAL_OUT && chr === '%' && next === '>') {
                parseEvalOut(buffer);
                i++;
                buffer = "";
                state = 0;
                continue;

            }
            if (chr === '<' && next === '%') {
                if (buffer.length) {
                    parseContent(buffer);
                    buffer = "";
                }
                i = whitespace_swallow(str, n + 1);
                chr = str[i];
                if (chr === '=') {
//                    i += 2;
                    state = States.EVAL_OUT;
                    continue;
                }
                if (match_fwd(str, i, "--")) {
                    i += 3;
                    state = States.COMMENT;
                    continue;
                }
                if (chr === '@')
                    throw createError("Can not have tag directives in the body", str, i);

                //i++;
                state = States.EVAL;
                continue;
            }
            if (!state && chr === '$' && next === "{") {
                parseContent(buffer);
                buffer = "";
                state = States.$EVAL;
                i++;
                continue;
            }
            if (state === States.$EVAL && chr === '}') {
                parseEvalOut(buffer);
                buffer = "";
                state = 0;
                continue;
            }
            if (state === States.ATTR) {
                if (quote) {
                    if (chr === quote && str[i - 1] !== '\\' && str[i - 2] !== '\\')
                        quote = null;
                    attr += chr;
                    continue;
                } else {
                    if (chr === '"' || chr === '\'') {
                        attr += chr;
                        quote = chr;
                        continue;
                    }
                }
                if (chr === '/' && next === '>') {
                    if (!depth) {
                        state = States.TAG_END;
                        buffer = "";
                        continue;
                    } else {
                        depth--;
                    }
                }

                if (chr === '>') {
                    state = States.TAG;
                    buffer = "";
                    continue;
                }

                attr += chr;
                continue;
            }
            if (!state && match_fwd(str, i, '<!-- ')) {
                parseContent(buffer);
                state = States.COMMENT;
                buffer = "";
                i += 4;
                continue;
            }
            if (!state && chr == '<' && !(next === '!' || next === '/' || next === '-' || next === '%')) {
                state = States.TAG_START;
                //buffer = trim_end(buffer, prefix.length + 1);
                continue;
            }
            if (state === States.TAG_START) {
                if (chr === ':') {
                    if (ntag in taglibs) {
                        state = States.TAG_POSTFIX;
                        prefix = ntag;
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
            if (state === States.TAG_POSTFIX) {
                if (whitespace(chr)) {
                    tag = ntag;
                    ntag = "";
                    state = States.ATTR;
                    fulltag = prefix + ":" + tag;
                    continue;
                }
                if (chr === '>') {
                    state = States.TAG;
                    tag = ntag;
                    buffer = "";
                    ntag = "";

                    fulltag = prefix + ":" + tag;
                    continue;
                }

                if (chr === '/' && next === '>') {
                    buffer = "";
                    buffer = "";
                    tag = ntag;
                    state = States.TAG_END;
                    fulltag = prefix + ":" + tag;
                    continue;
                }
                ntag += chr;
                continue;
            }
            if (state === States.TAG) {

                if (chr === '<') {
                    pt = '/' + fulltag + '>';
                    if (match_fwd(str, i + 1, pt)) {
                        if (!depth) {
                            i += pt.length-1;
                            state = States.TAG_END;
                            continue;
                        } else {
                            depth--;
                            buffer += chr;
                        }
                        continue;
                    }
                    if (match_fwd(str, i + 1, fulltag)) {
                        var nt = str[i + fulltag.length + 1];
                        if (nt === '>' || whitespace(nt)){
                            depth++;
                            buffer+=chr;
                            continue;
                        }
                    }

                }
            }
            if (state === States.COMMENT && match_fwd(str, i, "--%>")) {
                parseComment(buffer);
                state = 0;
                buffer = "";
            }
            if (state === States.COMMENT) {
                if (match_fwd(str, i, ' -->')) {
                    parseComment(buffer);
                    buffer = "";
                    state = 0;
                    i += 3;
                    continue;
                } else {
                    buffer += chr;
                    continue;
                }
            }
            if (state && state < 5 && chr === '%' && next === '>') {
                if (state === States.COMMENT) {
                    if (buffer.substring(buffer.length - 2) != '--')
                        throw createError("Found '%>' but not end of comment", str, i);
                    buffer = trim_end(buffer, 2);
                }
                states[state].call(context, buffer, i, chr);
                i += 1;
                state = 0;
                buffer = "";
                continue;
            }
            buffer += chr;
        }
        if (state === States.COMMENT)
            throw createError("unended comment ", str, i);
        //     states[state] && states[state].call(context, buffer, i, chr);
        parseContent(buffer);
        parseEndCb(context, info);
        return context;
    }
};