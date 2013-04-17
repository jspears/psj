var PsjEval = require('../lib/psj-eval-expression');

module.exports = {
    'Expression.expression array out':function(test){
        var out = PsjEval.expression('${value}')({value:[1,2,3]});
        test.ok(out.length === 3, "Number of items");
        test.equals(out[0], 1);
        test.equals(out[1], 2);
        test.equals(out[2], 3);
        test.done();
    }
    ,'Evaluate a JSTL expression': function (test) {
        var pe = new PsjEval(" noti lt default and noti gt 0 and(not.d mod 3)");
        var ev = pe.create();
        test.ok(ev({noti: 1, 'default': 2, 'not': {'d': 1}}), "Should be true");
        test.ok(!ev({noti: 2, 'default': 2, 'not': {'d': 2}}), "Should be false");
        test.ok(!ev({noti: 3, 'default': 1, 'not': {'d': 3}}), "Should be false");
        test.done();
    },

    'Expression.expression test': function (test) {
        console.log (PsjEval.expression('hello ${value}!')({value: 'world'}))
        test.equals(PsjEval.expression('hello ${value}!')({value: 'world'}), 'hello world!');

        test.done();
    },
    'Evaluate a string': function (test) {
        var pe = new PsjEval('\'do and\" not me\'');
        var ev = pe.create();
        test.equals(ev(), 'do and\" not me');
        test.done();
    },

    'evaluate empty': function (test) {
        var pe = new PsjEval(" empty me");
        var ev = pe.create();
        test.ok(ev({me: ''}), "Should be true");
        test.ok(ev({me: []}), "Should be true");
        test.ok(!ev({me: 'stuff'}), "Should be true");
        test.ok(!ev({me: ['stuff']}), "Should be true");
        test.done();
    },
    'evaluate empty with stuff': function (test) {
        var pe = new PsjEval(" empty me ? 1 : 2");
        var ev = pe.create();
        test.equals(ev({me: ''}), 1, "Should be true");
        test.equals(ev({me: []}), 1, "Should be true");
        test.equals(ev({me: 'stuff'}), 2, "Should be true");
        test.ok(ev({me: ['stuff']}), 2, "Should be true");
        test.done();
    },
    'evaluate a custom function': function (test) {
        var pe = new PsjEval("fn:func(1 ? 2 : 1) ? 1 : 2");
        var ev = pe.create();
        var func = function (arg) {
            return arg == 2;
        };
        var obj = {fn: {func: func}}
        test.equals(ev(obj), 1, "Should be true");
        test.equals(ev(obj), 1, "Should be true");
        test.done();

    },
    'evaluate a custom function borked': function (test) {
        var pe = new PsjEval("true ? fn:func_test(1 ? 2 : 1) ? 1 : 2 : false");
        var ev = pe.create();
        var func = function (arg) {
            return arg == 2;
        };
        var obj = {fn: {func_test: func}}
        test.equals(ev(obj), 1, "Should be true");
        test.equals(ev(obj), 1, "Should be true");
//        test.equals(ev({me:'stuff'}), 2, "Should be true");
//        test.ok(ev({me:['stuff']}), 2, "Should be true");
        test.done();

    }


}