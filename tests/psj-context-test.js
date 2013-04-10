var Context = require('../lib/psj-context'), fs = require('fs'), Q = require('q'), path = require('path');

var ctxMap = {
    'http://java.sun.com/jsp/jstl/core': 'lib/tag/core',
    'http://java.sun.com/JSP/Page': 'lib/tag/jsp'
}
var core = '<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>'
function resolver(v, file) {
    var f = ctxMap[v.uri || v.tagdir || v] || v.uri || v.tagdir;
    var d = Q.defer();
    fs.readFile(path.join(f, file) + '.tag', 'utf-8', d.makeNodeResolver());
    return d.promise;

}

module.exports = {

    'test forEach tag': function (test) {
        var ctx = new Context(null, null, resolver);
        ctx.parse(core + '<c:forEach items="myitems" varStatus="loop">hello ${loop.begin} ${loop.count}</c:forEach>  this is some text');
        ctx.template().when(function (promise) {

            console.log(promise.valueOf());
            test.done();
        });

    }
    ,
    'test require tag': function (test) {
        var ctx = new Context(null, null, resolver);
        ctx.parse(core + '<c:out var="test"/>  this is some text');
        ctx.template().when(function (promise) {
            console.log(promise.valueOf());
            test.done();
        });

    }
}