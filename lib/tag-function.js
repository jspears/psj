if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}
define(['./psj-eval-expression', './psj-scope', 'underscore', './text-util', 'q'], function (EvalExpr, Scope, _,tu,  Q) {
    var js_reserved = tu.js_reserved_delta;
    var Tag = function (taglib, tag, context) {
        this.tag = tag;
        this.taglib = taglib;
        this.context = context;

        return this;
    }
    Tag.prototype.parse = function doTagParse(buffer) {
        this.context.parse(buffer, {
            lineNumber: 0,
            ctx: this.context,
            inTagFile: true,
            tagfile: this.tagfile + '/' + this.tag

        });
        this.attr = this.context.context.attribute;
        this.keys = this.attr.map(function (v) {
            return v.name
        });
        this.required = {};
        var attrMap = this.attrMap = {};
        this.attr.forEach(function (v) {
            this[v.name] = ( v.required == "true" );
            attrMap[v.name] = v;
        }, this.required);

        return this;
    }
    Tag.prototype.toString = function () {
        return this.taglib + '/' + this.tag;
    }
    Tag.prototype.create = function () {
        var d = Q.defer();
        this.context.template().then(function (str) {
            var func = this._create(str);
            d.resolve(func);
        }.bind(this));
        return d.promise;
    }
    /**creates the validator **/
    Tag.prototype._create = function (str) {

        var f = _.template(str);
        var required = this.required || {};
        var attrMap = this.attrMap;
        var keys = this.keys;
        /** the first function validates the args **/
        var filename = this.context.filename || '[unknown]';
        var self = this;
        var tagScope = this.context.tagScope;
        var variables = this.context.context.variable  || [];

        return function validator(obj, tagContent, current, info) {
            console.log('tag-funct: ' + self.tag + '#validator');
            obj = obj || {};
            this.tagContent = tagContent;
            var reqKeys = Object.keys(required || {});
            for (var i = reqKeys.length; i--;) {
                if (required[reqKeys[i]] && !(reqKeys[i] in obj))
                    throw new Error("attribute [" + reqKeys[i] + "] is required in " + filename + ".");
            }
            var objKeys = Object.keys(obj);
            for (var i = objKeys.length; i--;) {
                if (!(objKeys[i] in required))
                    throw new Error("attribute [" + objKeys[i] + "] is not defined in " + filename + " tag.");
            }
            var def = {};
            for (var i = reqKeys.length; i--;) {
                if (!(reqKeys[i] in obj))
                    def[reqKeys[i]] = null;
            }
            objKeys = Object.keys(obj);
            for (var i = objKeys.length; i--;) {
                var key = objKeys[i];
                if (attrMap[key] && attrMap[key].rtexprvalue == "true" && obj[key]) {
                    obj[key] = EvalExpr.expression(tagContent, obj[key]);
                } else if (attrMap[key] && attrMap[key].fragment == "true") {
                    var ctx = new Context(null, this.parent, null, filename + "#fragment[" + key + "]").parseBody(obj[key]);
                    obj[key] = function () {
                        return ctx._template();
                    }
                }
            }
            for (var i = keys.length; i--;)
                if (!(keys[i] in obj))
                    obj[keys[i]] = null;

            var args = arguments;
//        var currentPageContext = info.ctx.tagContent;
            /** this function **/
            return function execute($scope, scope) {
                var evalScope = new Scope(scope);
                var ret = _.extend({}, def, obj);
                var keys = ret ? Object.keys(ret) : [];
                var tScope = new Scope(evalScope);
                var _scope = tScope.scope.pageScope = {};
                for (var i = keys.length; i--;) {
                    var key = keys[i];
                    var val = _.isFunction(ret[key]) ? evalScope.eval(ret[key], this) : ret[key];

                    if (~js_reserved.indexOf(key)) {
                        _scope['_' + key] = val;
                        delete obj[key];
                    } else {
                        _scope[key] = val;
                    }
                }
                var resp;
                var vars = {};
                _.each(variables, function(v){
                    vars[v.name] = {};
                })
                scope = _.extend({}, scope, vars);
                try {
//                ret.scope = scope;
//                context.contentContext = contentCtx;
                    var _tag = {tagContent: tagContent, _attrs:obj, tagScope: tagScope, scope: scope};
                    resp = f.call(_tag, tScope.asContext(scope));
                } catch (e) {
                    console.warn('\n\ncaught error executing tag function\n\nmessage:\n' + e.message, 'source:', f.source, 'arguments:\n', args, 'scope:\n', _scope, '\n----\nsource:\n\n');

                }
                return resp;
            }
        }


    }
    return Tag;
});