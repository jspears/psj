if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}
define(['./text-util', 'underscore', './psj-parse-tagcontent'], function (tu, _, parseTagContent) {
    var whitespace_swallow = tu.whitespace_swallow,
        countLines = tu.countLines,
        parseAttr = tu.parseAttr,
        whitespace = tu.whitespace,
        match_fwd = tu.match_fwd,
        States = (function () {
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

    function Parser(context, info) {
        var parseContent = context.parseContent.bind(context),
            parseEval = context.parseEval.bind(context),
            parseComment = context.parseComment.bind(context),
            parseEvalOut = context.parseEvalOut.bind(context),
            parseTag = context.parseTag.bind(context),
            parseEnd = context.parseEnd.bind(context),
            parseBodyEnd = context.parseBodyEnd.bind(context);

        function createError(message, str, pos) {
            return new Error(message + " @[" + countLines(str, pos) + "," + pos + '] ' + str.substring(pos - 8, pos) + '--"' + str[pos] + '"-- ' + str.substring(pos + 1, pos + 8))
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
                    var ctx = context.context[tag] || (context.context[tag] = []);
                    ctx.push(obj);
                    return obj;
                }
            }
        }

        this.parseBody = parseTagContent(context);
        this.parse = function (str, info) {
            var filename = info && info.filename || info;
            var state = 0, depth = 0;
            var buffer = "", prefix = "", tag = "", ntag = "", nprefix = "", attr = "", quote = null, pt = "", lineNumber = 0;
            for (var i = 0, n = 1, l = str.length; i < l; i++, n = i + 1) {

                if (state == States.TAG_END) {
                    parseHeadAttr(tag, attr ? parseAttr(attr) : null, filename, str, i);
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

                if (chr === '<' && next === '%') {
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
                        i+=3;
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
            this.parseBody(str.substring(i), info, parseEnd);
        }

    }

    return Parser;
});