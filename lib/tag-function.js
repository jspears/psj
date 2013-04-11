var Context = require('./psj-context'),pslice = Array.prototype.slice, _ = require('underscore');
var Tag = function (taglib, tag, content) {
    this.tag = tag;
    this.taglib = taglib;
    this.context = new Context()
    this.context.parse(content);
    this.attr = this.context.context.attribute;
    this.keys = this.attr.map(function(v){ return v.name });
    this.required = {};
    this.attr.forEach(function(v){
            this[v.name] = ( v.required == "true" );
    }, this.required);
}
/**creates the validator **/
Tag.prototype.create = function () {

    var cstr = this.context.content.map(function(v){ return _.isFunction(v) ? v() : v}).join('\n');
    var str = "return with(obj){ "+cstr+" };";
    var args = ['dotag'].concat(this.keys).concat(str);
//    console.log('args', args);
 //   var f = Function.apply(Function, args);

//    return f(function(){
//        console.log('args', arguments);
//    }, 1, 2);
//    var func = function dotag(name) {
//        console.log('args', name);
//    }
    var required = this.required;
    /** the first function validates the args **/
    return function validator(obj) {
        console.log('str', str);
        var reqKeys = Object.keys(required);
        for (var i = reqKeys.length; i--;){
            if (required[reqKeys[i]] &&! (reqKeys[i] in obj))
                throw new Error("attribute ["+reqKeys[i]+"] is required." );
        }
        var objKeys = Object.keys(obj);
        for (var i = objKeys.length; i--;){
            if (!(objKeys[i] in required))
                throw new Error("attribute ["+objKeys[i]+"] is not defined in tag.");
        }
        /** this function **/
        return function execute(){
            console.log("do real stuff ", arguments);
        }
    }


}
module.exports = Tag;