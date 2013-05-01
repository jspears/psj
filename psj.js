var Context = require('./lib/psj-context'), resolver = require('./lib/psj-local-resolver'), fs = require('fs');

var cache = {};
module.exports = function(source, options, fn){
    var psj = options.cache && cache[source] || (cache[source] = (function(){
        var content = fs.readFileSync(source, 'utf-8');
        var ctx = new Context(null, null, resolver, source);
        ctx.parse(content);
        return ctx;
    })());

    psj.render(options, function(err,out){
        console.log('sending ',out);
        fn(err,out);
    });
}