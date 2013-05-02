var PsjEval = require('../lib/psj-eval-expression'), Context = require('../lib/psj-context'), Q = require('q'), ParsedFunctions = require('../lib/psj-parsed-functions');
var ctx = new Context();
ctx.context.taglib.fn = 'stuff';
ctx.context.taglib.core = 'http://java.sun.com/jsp/jstl/functions';
function tfunc(arg) {
    return arg == 2;
}
ParsedFunctions.FunctionMap.stuff = {
    func: tfunc,
    func_test: tfunc
}

function expression(expr) {
    return PsjEval.expression(ctx, expr);
}
module.exports = {
    'empty expression': function (test) {
        var out = expression(ctx, '${empty value}')({value: [1, 2, 3]});
        test.equals(out, false, "not empty");
        test.done();
    },
    'Expression.expression array out': function (test) {
        var out = expression('${value}')({value: [1, 2, 3]});
        test.ok(out.length === 3, "Number of items");
        test.equals(out[0], 1);
        test.equals(out[1], 2);
        test.equals(out[2], 3);
        test.done();
    }, 'Evaluate a JSTL expression': function (test) {
        var pe = new PsjEval(ctx, " noti lt default && noti eq not.d");
        var ev = pe.create();
        test.ok(ev({noti: 1, 'default': 2, 'not': {'d': 1}}), "Should be true 1");
        test.ok(!ev({noti: 2, 'default': 2, 'not': {'d': 2}}), "Should be false 2");
        test.ok(!ev({noti: 3, 'default': 1, 'not': {'d': 3}}), "Should be false 3");
        test.done();
    },

    'Expression.expression test': function (test) {
        console.log(expression('hello ${value}!')({value: 'world'}))
        test.equals(expression('hello ${value}!')({value: 'world'}), 'hello world!');

        test.done();
    },
    'Evaluate a string': function (test) {
        var pe = new PsjEval(ctx, '\'do and\" not me\'');
        var ev = pe.create();
        test.equals(ev(), 'do and\" not me');
        test.done();
    },

    'evaluate empty': function (test) {
        var pe = new PsjEval(ctx, " empty me");
        var ev = pe.create();
        test.ok(ev({me: ''}), "Should be true");
        test.ok(ev({me: []}), "Should be true");
        test.ok(!ev({me: 'stuff'}), "Should be true");
        test.ok(!ev({me: ['stuff']}), "Should be true");
        test.done();
    },
    'evaluate empty with stuff': function (test) {
        var pe = new PsjEval(ctx, " empty me ? 1 : 2");
        var ev = pe.create();
        test.equals(ev({me: ''}), 1, "Should be true");
        test.equals(ev({me: []}), 1, "Should be true");
        test.equals(ev({me: 'stuff'}), 2, "Should be true");
        test.ok(ev({me: ['stuff']}), 2, "Should be true");
        test.done();
    },
    'evaluate a custom function': function (test) {

        var pe = new PsjEval(ctx, "fn:func(1 ? 2 : 1) ? 1 : 2");
        var ev = pe.create();
        var obj = {}
        Q.allResolved(ctx.promises).then(function () {
            test.equals(ev(obj), 1, "Should be true");
            test.equals(ev(obj), 1, "Should be true");
            test.done();
        }, test.fail)

    },
    'evaluate a custom function borked': function (test) {
        var pe = new PsjEval(ctx, "true ? fn:func_test(1 ? 2 : 1) ? 1 : 2 : false");
        var ev = pe.create();
        var obj = {}
        Q.allResolved(ctx.promises).then(function () {
            test.equals(ev(obj), 1, "Should be true");
            test.equals(ev(obj), 1, "Should be true");
            test.done();

        }, test.fail)
    }


}