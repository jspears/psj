var Tag = require('../lib/tag-function'), fs = require('fs'), Context = require('../lib/psj-context'), resolver = require('../lib/psj-local-resolver');
function context(content){
    return new Context(null,null,resolver).parse(content);
}
module.exports = {
//    'test tag': function (test) {
//        var tag = new Tag('test', 'tag', fs.readFileSync(__dirname + '/../lib/tag/core/out.tag', 'utf-8'));
//        var f = tag.create();
//        f({});
//        test.done();
//    },
    'test tag forEach':function(test){
        var ctx =  context(fs.readFileSync(__dirname + '/../lib/tag/core/forEach.tag', 'utf-8'));
        var tag = new Tag('test', 'tag', ctx);
        tag.create().then(function onTagCreateTest(resp){
            console.log('create', resp({
                items:"${myitems}",
                varStatus:'loop'
            },  new Context(null, tag.context, resolver).parseBody('hello-loop ${loop.current}'))({myitems:[1,2,3]}));
//            ctx.render({}, function(str){
//                console.log('render string', str);
//                test.done();
//
//            });
        });

//        test.equals(f({value:'my stuff'})(), 'my stuff');
 //       test.equals(f({'value':null, 'default':'my stuff'})(), 'my stuff');
//        test.done()
    }
//    ,
//    'test tag execute':function(test){
//        var tag = new Tag('test', 'tag', context(fs.readFileSync(__dirname + '/../lib/tag/core/out.tag', 'utf-8')));
//        var f = tag.create();
//
////        test.equals(f({value:'my stuff'})(), 'my stuff');
//        test.equals(f({'value':null, 'default':'my stuff'})(), 'my stuff');
//        test.done()
//    },
//    'test tag error': function (test) {
//        var tag = new Tag('test', 'tag', context(fs.readFileSync(__dirname + '/../lib/tag/core/set.tag', 'utf-8')));
//        var f = tag.create();
//        var failed = false;
//        try {
//            f({});
//        } catch (e) {
//            console.log(e.message);
//            failed = true;
//        }
//        test.equals(failed, true);
//        test.done();
//    },
//    'test not valid attribute error': function (test) {
//        var tag = new Tag('test', 'tag', context(fs.readFileSync(__dirname + '/../lib/tag/core/set.tag', 'utf-8')));
//        var f = tag.create();
//        var failed = false;
//        try {
//            f({var:'stuff',value:'stuff', not:'false'});
//        } catch (e) {
//            console.log(e.message);
//            failed = true;
//        }
//        test.equals(failed, true);
//        test.done();
//    }
}