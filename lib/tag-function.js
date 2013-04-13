var Context = require('./psj-context'),pslice = Array.prototype.slice, _ = require('underscore'), tu = require('./text-util'),
    js_reserved = tu.js_reserved_delta
    ;
var Tag = function (taglib, tag, content) {
    this.tag = tag;
    this.taglib = taglib;
    this.context = new Context()
    this.context.parse(content);
    this.attr = this.context.context.attribute;
    this.keys = this.attr.map(function(v){ return v.name });
    this.required = {};
    var attrMap = this.attrMap = {};
    this.attr.forEach(function(v){
            this[v.name] = ( v.required == "true" );
            attrMap[v.name] = v;
    }, this.required);
}
/**creates the validator **/
Tag.prototype.create = function () {

    var cstr = this.context.content.map(function(v){
        return _.isFunction(v) ? v() : v

    }).join('');
    var str = cstr;
    var f = _.template(str);
    var required = this.required;
    var attrMap = this.attrMap;
    /** the first function validates the args **/
    var filename = this.taglib+'/'+this.tag;
    return function validator(obj) {
        console.log('str', str);
        var reqKeys = Object.keys(required);
        for (var i = reqKeys.length; i--;){
            if (required[reqKeys[i]] &&! (reqKeys[i] in obj))
                throw new Error("attribute ["+reqKeys[i]+"] is required in "+filename+"." );
        }
        var objKeys = Object.keys(obj);
        for (var i = objKeys.length; i--;){
            if (!(objKeys[i] in required))
                throw new Error("attribute ["+objKeys[i]+"] is not defined in "+ filename+" tag.");
        }
        var def = {};
        for(var i=reqKeys.length; i--;){
            if (!(reqKeys[i] in obj))
                def[reqKeys[i]] = null;
        }
         objKeys = Object.keys(obj);
        for(var i=objKeys.length;i--;){
            var key =objKeys[i];
            if (attrMap[key] && attrMap[key].rtexprvalue =="true"){

            }
        }
        var evalKeys = _.filter()

        /** this function **/
        return function execute(){
            console.log("do real stuff ", arguments);
            var ret = _.extend({}, def, obj);
            var keys = ret ? Object.keys(ret) : [];

            for (var i = keys.length; i--;) {
                var key = keys[i];
                if (~js_reserved.indexOf(key)) {
                    ret['_' + key] = obj[key];
                    delete obj[key];
                } else {
                    ret[key] = obj[key]
                }
            }

            return f(ret);
        }
    }


}
module.exports = Tag;