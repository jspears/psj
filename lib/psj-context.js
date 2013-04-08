var Parser = require('./psj-parser'), Q = require('q');
var ParsedTags = {

};
var Context = function (options, parent, resolver) {
    this.parent = parent;
    this.resolver = resolver;
    this.context = {
        taglib: {
            'jsp': 'http://java.sun.com/JSP/Page'
        },
        attribute: [],
        content: []
    };
    this.content = this.context.content;

};
Context.prototype.parse = function (content) {
    new Parser(this).parse(content);
    return this;
}
Context.prototype.parseTag = function(prefix,  tag, attr, buffer){
    var taglib = this.context.taglib[prefix];
    if (taglib){
        return taglib[tag](attr, buffer);
    }else{
        var defer = Q.deferred();
        this.resolver.require([taglib], function(taglib){
               defer.resolve(taglib[tag](attr, buffer));
        });
        return defer.promise();
    }

}

module.exports = Context;