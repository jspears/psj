var EvalExpr = require('./psj-eval-expression'),
    _ = require('underscore'), tu = require('./text-util'),
    js_reserved = tu.js_reserved_delta,
    Q = require('q')
    ;
var Tag = function (taglib, tag,  context) {
    this.tag = tag;
    this.taglib = taglib;
    this.context = context;
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
Tag.prototype.toString = function(){
    return this.taglib+'/'+this.tag;
}
Tag.prototype.create = function(){
    var d = Q.defer();
    this.context.template().then(function(str){
        var func = this._create(str);
        d.resolve(func);
    }.bind(this));
    return d.promise;
}
/**creates the validator **/
Tag.prototype._create = function (str) {

    var f = _.template(str);
    var required = this.required;
    var attrMap = this.attrMap;
    var keys = this.keys;
    /** the first function validates the args **/
    var filename = this.taglib + '/' + this.tag;
    var scope = this.context.scope;
    var createScope = this.context.createScope.bind(this.context);
    var context = this.context;
    return function validator(obj, contentCtx) {
        obj = obj || {};

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
                obj[key] = EvalExpr.expression(obj[key]);
            }
        }
        for (var i = keys.length; i--;)
            if (!(keys[i] in obj))
                obj[keys[i]] = null;


        /** this function **/
        return function execute(currentPageContext) {
            var ret = _.extend({}, def, obj);
            var keys = ret ? Object.keys(ret) : [];
            console.log('context',context);
            var _scope = createScope(ret);
            for (var i = keys.length; i--;) {
                var key = keys[i];
                var val = _.isFunction(ret[key]) ? ret[key].call(this, _scope) : ret[key];

                if (~js_reserved.indexOf(key)) {
                    ret['_' + key] = val;
                    delete obj[key];
                } else {
                    ret[key] = val;
                }
            }
            try {
//                ret.scope = scope;
//                context.contentContext = contentCtx;
                var resp = f.call(this, _scope);
            } catch (e) {
                console.warn('\n\ncaught error ' + str, 'scope:\n',JSON.stringify(_scope),'\n----\nerror:\n', e.message,'\n----\nsource:\n', f.source,'\n\n');

            }
            return resp;
        }
    }


}
module.exports = Tag;