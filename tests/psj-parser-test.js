var Parser = require('./psj-test-context'), fs = require('fs');
var parser;
var xmltests = {
    '<c:out var="has>end"/>':"prefix:c, tag:out attrs: {\"var\":\"has>end\"}",
    '<c:out var="has\'end"/>':"prefix:c, tag:out attrs: {\"var\":\"has'end\"}",
    "<c:out var='hasend'/>":"prefix:c, tag:out attrs: {\"var\":\"hasend\"}",
    '<c:out var="test"/><c:set var="junk" scope="request">I am <bold/></c:set>':'prefix:c, tag:out attrs: {\"var\":\"test\"} prefix:c, tag:set attrs: {\"var\":\"junk\",\"scope\":\"request\"}, buffer:I am <bold/>',
    '<c:out/>':'prefix:c, tag:out attrs: {}',
    '<c:out var="test"/>':"prefix:c, tag:out attrs: {\"var\":\"test\"}",
    '<c:out var="test">hello<c:out>what</c:out></c:out>': 'prefix:c, tag:out attrs: {\"var\":\"test\"}, buffer:hello<c:out>what</c:out>',
    '<c:out var="test">hello<b/></c:out>':'prefix:c, tag:out attrs: {\"var\":\"test\"}, buffer:hello<b/>',
    '<c:set var="#"/>':"prefix:c, tag:set attrs: {\"var\":\"#\"}",
    '<c:set var="#">hello</c:set>':"prefix:c, tag:set attrs: {\"var\":\"#\"}, buffer:hello",
    '<!-- hello <c:set var="#"/> me -->':"content:<!-- hello  prefix:c, tag:set attrs: {\"var\":\"#\"} content: me -->"
};
var tests = {}, junk={
    'test if taglib parsed': function (test) {
        parser = new Parser();
        var result = parser.parse('<%@ taglib prefix="p" tagdir="."%>')
        test.equal(result.taglib.p.prefix, 'p');
        test.equal(result.taglib.p.tagdir, '.');
        test.done();

    },

    'parsing attributes parsed': function (test) {
        parser = new Parser();
        var result = parser.parse('<%@ attribute name="people" type="Array"%>')
        test.equal(result.attribute[0].name, 'people');
        test.equal(result.attribute[0].type, 'Array');
        test.done();

    },
    'do comments work': function (test) {
        parser = new Parser();
        var result = parser.parse('<%-- hello\n this is a comment --%>');

        test.equal(result.content[0](), ' hello\n this is a comment ');
        test.done();
    },
    'do comments work not ended': function (test) {
        parser = new Parser();
        var e = null;
        try {
            var result = parser.parse('<%-- hello\n this is a comment %>');
        } catch (err) {
            e = err;
        }
        test.ok(e != null);
        test.done();
    },
    'parsing of ${} eval statements': function (test) {
        parser = new Parser();
        var result = parser.parse('stuff ${isneat} really');
        var evl = result.content[1]()
        console.log('result', evl);
        test.equal('isneat', evl);
        test.done();

    },
    'parsing a jsp tag file ': function (test) {
        parser = new Parser();
        var str = fs.readFileSync('example/tags/people.tag', 'utf-8');
        var result = parser.parse(str);
        console.log('result', result);
        test.done();
    }
};

Object.keys(xmltests).forEach(function makeTestFunction(k){
    tests[k] = makeTest(k, xmltests[k]);
});

var core = '<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>'
function printResult(result) {
    return result && result.content.map(function (v) {
        return v()
    }).join(' ');
}
function makeTest(xml, expected){
    return function(test){
        parser = new Parser();
        var result = parser.parse(core+xml);
        var val = printResult(result);
        test.equals(val, expected);
        test.done();
    }
}

module.exports = tests;