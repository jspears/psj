var EvalExpr = require('./psj-eval-expression'), _ = require('underscore');
module.exports  = {
    'http://java.sun.com/JSP/Page': {
        doBody: function onValidateDoBody(attr,tagContent, info) {
            var contentScope =tagContent;
            var f;
            var args = arguments;
            return function onEvalDoBody(ctx, scope) {
                var tagContent = ctx.tagContent;
                var str,tscope={};
                f =  tagContent._template();
                try {

                    str= f.call(tagContent, _.extend({},ctx.scope, scope));
                }catch(e){
                    console.log('jsp:doBody error calling', e.message,'\nsource---\n\n',f.source, '\n\nwith---\n ', tagContent);
                    str="<!-- error in dobody -->";
                }
                return str;

//                f = f || contentScope._template();
//                var tscope = contentScope.createScope();
//                var str;
//                try {
//                 //   this.tagScope = tscope.tagScope;
////                    var fif = tscope.tagScope.$1.c.if;
////                    tscope.tagScope.$1.c.if = function(){
////                        return 'wf '+fif;
////
//                } catch (e) {
//                    var fif =  tscope && tscope.tagScope && tscope.tagScope.$1.c.if;
//                    console.log('error in jsp:doBody', e.message, '\n--source:', f.source, '\n--scope:', tscope);
//                }
//                return str;
            }
        }
    },
    'http://java.sun.com/jsp/jstl/core': {
//        'choose':function onChoose(attr, parent){
//            var args = arguments;
//            return function onChooseExec(ctx){
//                console.log('onChooseExec', args);
//                return '';
//            }
//        },
        'set': function onSet(attr, parent) {
            var valueExpr = 'value' in attr ? EvalExpr.expression(attr.value) : parent && parent.scope && parent.scope.contentScope && parent.scope.contentScope._template();
            var scopeName = (attr.scope || 'page') + 'Scope';
            var varName = attr.var;
            return function onSetExec(ctx, scope) {
                var val = valueExpr(scope);
                if (attr.target && attr.property)
                    scope[scopeName][attr.target][attr.property] = val
                if (varName)
                    scope[scopeName][varName] = val;
            }

        }
//        ,
//        'if':function onIf(attr, parent){
//
//            return function onDoIf(ctx, obj, me){
//                return parent.content.join('\n');
//            }
//        }
//        ,
//        forEach: function onForEach(attr, content) {
//            var valueExpr = EvalExpr.expression(attr.items);
//            var varStatus = attr.varStatus;
//            var begin = attr.begin;
//            var end = attr.end;
//            var step = attr.step;
//            var varName = attr.var;
//
//            return function onEvalForEach(ctx) {
//                var scope = ctx.createScope(), pageScope = scope.pageScope;
//                var items = valueExpr(scope);
//                var ret = "";
//                if (!(typeof items === "string" || Array.isArray(items))) {
//                    var keys = Object.keys(items);
//                    var nitems = keys.map(function (v) {
//                        return {key: v, value: items[v]}
//                    });
//                    items = nitems;
//                }
//                begin = begin || 0;
//                end = end || items.length;
//                step = step || 1;
//                for (var i = begin; i < end; i += step) {
//                    var current = items[i];
//                    if (varStatus)
//                        pageScope[varStatus] = {
//                            first: i == begin,
//                            last: begin + step >= end,
//                            current: current
//                        }
//                    if (varName)
//                        pageScope[varName] = current;
//                    ret += " "+ParsedTags['http://java.sun.com/JSP/Page'].doBody(attr, ctx)();
//                }
//                delete pageScope[varName];
//                delete pageScope[varStatus];
//                return ret;
//            }
//        }
    }
};