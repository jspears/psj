var OContext = require('../../lib/psj-context'), util=require('util');
var Context = function(options, parent){
    OContext.apply(this, arguments);
}
util.inherits(Context, OContext);

util._extend(OContext.prototype, {
    parseComment: function parseComment(buffer) {
        this.content.push(function () {
            return buffer;
        });
    },

    parseTag: function parseTag(prefix, tag, attrs, buffer) {
        this.content.push(function () {
            return "prefix:" + prefix + ", tag:" + tag + " attrs: " + JSON.stringify(attrs ?attrs : {}) + (buffer ? ", buffer:" + buffer : '');
        });
    },

    parseEval: function parseEval(buffer) {
        this.content.push(function () {
            return "eval:" + buffer;
        });
    },

    parseContent: function parseContent(buffer) {
        if (buffer)
            this.content.push(function () {
                return "content:" + buffer;
            });
    },

    parseEvalOut: function parseEvalOut(buffer) {
        this.content.push(function () {
            return  buffer;
        })
    },
    parseEnd:function(){},
    parseBodyEnd:function(){}
});

module.exports = Context;