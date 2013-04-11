var Tag = require('../lib/tag-function'), fs = require('fs');


module.exports = {
//    'test tag': function (test) {
//        var tag = new Tag('test', 'tag', fs.readFileSync(__dirname + '/../lib/tag/core/out.tag', 'utf-8'));
//        var f = tag.create();
//        f({});
//        test.done();
//    },
    'test tag error': function (test) {
        var tag = new Tag('test', 'tag', fs.readFileSync(__dirname + '/../lib/tag/core/set.tag', 'utf-8'));
        var f = tag.create();
        var failed = false;
        try {
            f({});
        } catch (e) {
            failed = true;
        }
        test.equals(failed, true);
        test.done();
    },
    'test not valid attribute error': function (test) {
        var tag = new Tag('test', 'tag', fs.readFileSync(__dirname + '/../lib/tag/core/set.tag', 'utf-8'));
        var f = tag.create();
        var failed = false;
        try {
            f({var:'stuff',value:'stuff', not:'false'});
        } catch (e) {
            failed = true;
        }
        test.equals(failed, true);
        test.done();
    },
    'test parse tag': function (test) {

        test.done();
    }
}