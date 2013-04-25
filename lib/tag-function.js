var EvalExpr = require('./psj-eval-expression'),
    _ = require('underscore'), tu = require('./text-util'),
    js_reserved = tu.js_reserved_delta,
    Q = require('q')
    ;
var Tag = function (taglib, tag,  context) {
    this.tag = tag;
    this.taglib = taglib;
    this.context = context;

    return this;
}
Tag.prototype.parse = function doTagParse(buffer){
    this.context.parse(buffer, {
        lineNumber:0,
        ctx:this.context,
        inTagFile:true,
        tagfile:this.tagfile+'/'+this.tag

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
    var filename = this.context.filename || '[unknown]';
    var scope = this.context.scope;
    var createScope = this.context.createScope.bind(this.context);
    var context = this.context;
    var self = this;
    return function validator(obj, tagContent, current, info) {
        console.log('tag-funct: '+self.tag+'#validator');
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
                obj[key] = EvalExpr.expression(obj[key]);
            }else  if (attrMap[key] && attrMap[key].fragment == "true"){
                var ctx = new Context(null, this.parent, null, filename+"#fragment["+key+"]").parseBody(obj[key]);
                obj[key] = function(){
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
        return function execute($scope) {
            console.log('tag-funct: '+self.tag+'#execute');
            var ret = _.extend({}, def, obj);
            var keys = ret ? Object.keys(ret) : [];
           // _.extend(currentPageContext.scope.tagScope,scope.tagScope, current.scope.tagScope, $scope && $scope.scope && $scope.scope.tagScope);
            var _scope = self.context.createScope(ret);
            var evalScope = tagContent.createScope();
            for (var i = keys.length; i--;) {
                var key = keys[i];
                var val = _.isFunction(ret[key]) ? ret[key].call(this, evalScope) : ret[key];

                if (~js_reserved.indexOf(key)) {
                    _scope['_' + key] = val;
                    delete obj[key];
                } else {
                    _scope[key] = val;
                }
            }
 //           _scope.pageScope = {};
            var resp;
            try {
//                ret.scope = scope;
//                context.contentContext = contentCtx;
                var _tag = {tagContent: tagContent, scope:scope};
                resp = f.call(_tag, _scope);
            } catch (e) {
                console.warn('\n\ncaught error executing tag function\n\nmessage:\n' + e.message, 'source:', f.source, 'arguments:\n', args, 'scope:\n',_scope,'\n----\nsource:\n\n');

            }
            return resp;
        }
    }


}
module.exports = Tag;