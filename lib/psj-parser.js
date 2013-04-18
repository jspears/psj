var fs = require('fs'), tu = require('./text-util'),
    whitespace = tu.whitespace,
    match_fwd = tu.match_fwd,
//  match_bckwd = tu.match_bkwd,
    whitespace_swallow = tu.whitespace_swallow,
    trim_end = tu.trim_end,
    whitespace_offset = tu.whitespace_offset,
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
        TAG_CONTENT:i++,
        $EVAL: i++,//$
        ATTR: i++,//<a attribute
        ATTR_END: i++,//> </end>
        CONTENT: i++,
        PREFIX: i++,
        HEAD_TYPE: i++,
        HEAD_ATTR: i
    }
})();

function Parser(context) {
    var parseContent = context.parseContent.bind(context),
        parseEval = context.parseEval.bind(context),
        parseComment = context.parseComment.bind(context),
        parseEvalOut = context.parseEvalOut.bind(context),
        parseTag = context.parseTag.bind(context),
        parseExpr = context.parseExpr.bind(context);

    var states = [parseContent, parseHeadAttr, parseEval, parseComment, parseEvalOut, parseTag];

    var taglibs = context.context.taglib;
    var attrRe = /([\w\-\.:]+)(\s*=\s*("([^"]*)"|'([^']*)'))?/g;

    function createError(message, str, pos) {
        return new Error(message + " @[" + countLines(str, pos) + "," + pos + '] ' + str.substring(pos - 8, pos) + '--"' + str[pos] + '"-- ' + str.substring(pos + 1, pos + 8))
    }

    function parseAttr(attr) {
        var buf = attr.trim();
        var match;
        var obj = {};
        while ((match = attrRe.exec(buf)) !== null) {
            obj[match[1]] = match[4] || match[5];
        }
        return obj;
    }

    function parseHeadAttr(tag, obj, filename, str, pos) {
        var known = false;
        switch (tag) {
            case 'taglib':
            {
                return (context.context.taglib[obj.prefix] = obj);
            }
            case 'attribute':
                known = true;
            case 'tag':
                known = true;
            case 'variable':
                known = true;
            case 'include':
                known = true;
            default:
            {
                if (!known)
                    throw createError("unknown tag [" + tag + "] in file " + filename, str, pos);
                context.context[tag].push(obj);
                return obj;
            }
        }
    }

    this.parse = function (str, filename) {
        this.filename = filename;
        var state = 0, depth = 0;
        var buffer = "", prefix = "", tag = "", ntag = "", nprefix = "", attr = "", quote = null, pt = "", lineNumber = 0;
        for (var i = 0, n = 1, l = str.length; i < l; i++, n = i + 1) {

            if (state == States.TAG_END) {
                parseHeadAttr(tag, attr ? parseAttr(attr) : null, this.filename, str, i);
                state = 0;
                nprefix = ntag = prefix = attr = tag = buffer = "";
                continue;
            }
            var chr = str[i], next = str[n];
            if (chr === '\n') lineNumber++;
            if (state == States.HEAD_ATTR) {
                if (!tag && whitespace(chr)) {
                    continue;
                } else if (!whitespace(chr)) {
                    tag += chr;
                    continue;
                } else {
//                    i = whitespace_swallow(str, i);
                    state = States.ATTR;
                    attr = "";
                    continue;
                }
            }

            if (match_fwd(str, i, "<%")) {
                if (match_fwd(str, n + 1, '--')) {
                    i += 3;
                    state = States.COMMENT;
                    continue;
                } else {
                    var j = whitespace_swallow(str, n + 1);

                    if (str[j] == '@') {
                        i = j;
                        state = States.HEAD_ATTR;
                        tag = "", attr = "";
                        continue;
                    } else {
                        break;
                        //throw createError('invalid charecter', str, i);
                    }
                }
            }
            if (state === States.COMMENT) {
                if (match_fwd(str, i, '--%>')) {
                    state = 0;
                    parseComment(buffer);
                    buffer = "";
                    continue;
                } else {
                    buffer += chr;
                    continue;
                }
            }
            if (state == States.ATTR) {
                if (!quote) {
                    if (chr === '"' || chr === '\'')
                        quote = chr;

                } else if (chr === quote) {
                    if (str[i - 1] !== '\\')
                        quote = null;
                }
                if (chr === '%' && next === '>') {
                    state = States.TAG_END;
                    continue;
                }

                attr += chr;
                continue;
            }
            buffer += chr;
            if (state === States.COMMENT) continue;
            if (whitespace(chr))
                continue;
            break;
        }
        if (state == States.COMMENT)
            throw createError("unended comment", str, i);
        this.parseBody(str.substring(i), filename, countLines(str.substring(0, i)));
    }

    this.parseBody = function parseBody(str, filename, lineNumber) {
        var state = 0, depth = 0, lineNumber = lineNumber || 0;
        var buffer = "", prefix = "", tag = "", ntag = "", nprefix = "", attr = "", quote = null, pt = "";
        for (var i = 0, n = 1, l = str.length; i < l; i++, n = i + 1) {
            if (state === States.TAG_END) {
                parseTag(prefix, tag, attr ? parseAttr(attr) : null, buffer);
                state = 0;
                nprefix = ntag = prefix = attr = tag = buffer = "";
                continue;
            }
            var chr = str[i], next = str[n];

            if (match_fwd(str, i, "<%")) {
                if (buffer.length) {
                    parseContent(buffer);
                    buffer = "";
                }
                i = whitespace_swallow(str, n + 1);
                chr = str[i]
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
            ;
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
                if (!quote && chr === '/' && next === '>') {
                    if (!depth) {
                        state = States.TAG_END;
                        if (buffer) parseContent(buffer);
                        buffer = "";
                        continue;
                    } else {
                        depth--;
                    }
                }
                if (quote ===  chr && next ==='>'){
                    state = States.TAG;
                    buffer ="";
                    i++;
                    attr+=chr;
                    continue;
                }
                if (!quote && chr === '>') {
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
            if (!state && match_fwd(str, i, '<!-- ')){
                parseContent(buffer);
                state = States.COMMENT;
                buffer = "";
                i+=4;
                continue;
            }
            if (!state && chr == '<' && !(next === '!' || next ==='/'))  {
                state = States.TAG_START;
                //buffer = trim_end(buffer, prefix.length + 1);
                ntag = "";
                buffer += chr;
                continue;
            }
            if (state == States.TAG_START) {
                if (chr == ':') {
                    if (ntag in taglibs) {
                        state = States.TAG_POSTFIX;
                        prefix = ntag;
                        ntag=""
                        buffer = "";
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
                if (chr === '>'){
                    state = States.TAG;
                    tag = ntag;
                    buffer="";
                    ntag = "";
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
            if (state === States.TAG) {
                if (next === '<') {
                    pt = '/'+prefix + ':' + tag+'>';
                    if (match_fwd(str, i+2, pt)) {
                        if (!depth) {
                            i += pt.length;
                            state = States.TAG_END;
                            buffer+=chr;
                            continue;
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
            if (state === States.COMMENT && match_fwd(str, i, "--%>")) {
                parseComment(buffer);
                state = 0;
                buffer = "";
            }
            if (state === States.COMMENT){
                if (match_fwd(str, i, ' -->')){
                    parseComment(buffer);
                    buffer = "";
                    state = 0;
                    i+=3;
                    continue;
                }else{
                    buffer+=chr;
                    continue;
                }
            }
            if (state && state < 5 && chr === '%' && next === '>') {
                if (state == States.COMMENT) {
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
        return context;
    }
}

module.exports = Parser;