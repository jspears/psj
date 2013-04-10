var tu = require('../lib/text-util'),
    whitespace = tu.whitespace,
    match_fwd = tu.match_fwd,
    match_bckwd = tu.match_bkwd,
    trim_end = tu.trim_end,
    whitespace_offset = tu.whitespace_offset;
var str = 'abcdefg';

module.exports = {
    'test whitespace chars': function (test) {
        test.equals(whitespace(' '), true);
        test.equals(whitespace('\n'), true);
        test.equals(whitespace('\t'), true);
        test.equals(whitespace('\r'), true);
        test.equals(whitespace('t'), false);
        test.done();
    },
    'match charecters going forward': function (test) {
        test.equals(match_fwd(str, 0, 'a'), true);
        test.equals(match_fwd(str, 1, 'bc'), true);
        test.equals(match_fwd(str, 3, 'def'), true);
        test.equals(match_fwd(str, 4, 'efg'), true);
        test.equals(match_fwd(str, str.length, 'g'), false);
        test.equals(match_fwd(str, str.length - 1, 'c'), false);
        test.equals(match_fwd(str, 0, 'abd'), false);
        test.done();
    },
    'match chars going backward': function (test) {
        test.equals(match_bckwd(str, 2, 'abc'), true);
        test.equals(match_bckwd(str, 4, 'de'), true);
        test.equals(match_bckwd(str, str.length - 1, 'g'), true);
        test.equals(match_bckwd(str, str.length - 1, 'gef'), false);
        test.equals(match_bckwd(str, str.length - 1, 'gfe'), false);

        test.equals(match_bckwd(str, 3, 'ab'), false);
        test.equals(match_bckwd(str, 4, 'cb'), false);
        test.equals(match_bckwd(str, str.length, 'k'), false);
        //   test.equals(match_bckwd(str, str.length-1, 'gef'), false);

        test.done();
    },
    'find the first whitespace':function(test){

        test.equals(whitespace_offset(" stuff is good",0), 0);
        test.equals(whitespace_offset("stuff is good",0), 5);
        test.equals(whitespace_offset("stuff is good",3), 5);
        test.equals(whitespace_offset("stuffisgood",3), 3);
        test.done();
    }
}