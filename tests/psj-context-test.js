var Context = require('../lib/psj-context'),
    _ = require('underscore'),
    resolver = require('../lib/psj-local-resolver'),
    fs = require('fs'), Q = require('q'), path = require('path'), Tag = require('../lib/tag-function');

var core = '<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>'

module.exports = {
//    'test content':function(test){
//        var str = fs.readFileSync('./tests/support/foreach-junk.js', 'utf-8');
//
//        _.template(str);
//        test.done();
//    },
    'test forEach tag': function (test) {
        var ctx = new Context(null, null, resolver);
        ctx.parse(core + '<c:forEach items="${myitems}" var="item" varStatus="loop">hello "${item}" - "${loop.first}" - "${loop.current}"</c:forEach>  this is some text');
        ctx.render({myitems:'abcd'.split('')}, function(out){
             out = out.replace(/\s+/g, ' ');
            console.log('out', out);
            test.equals(out,"hello \" a \" - \" true \" - \" a \"hello \" b \" - \" false \" - \" b \"hello \" c \" - \" false \" - \" c \"hello \" d \" - \" false \" - \" d \" this is some text");
            test.done()
        })
    }
//    ,
//    'test require tag': function (test) {
//        var ctx = new Context(null, null, resolver);
//        ctx.parse(core + '<c:out var="test"/>  this is some text');
//        ctx.template().when(function (promise) {
//            console.log(promise.valueOf());
//            test.done();
//        });
//
//    }
}