var Parser = require('./support/psj-context'), fs = require('fs');
var parser;
var xmltests = {
    '<c:out var="has\'end"/>': "prefix:c, tag:out attrs: {\"var\":\"has'end\"}",
    "<c:out var='hasend'/>": "prefix:c, tag:out attrs: {\"var\":\"hasend\"}",
    '<c:out var="test"/><c:set var="junk" scope="request">I am <bold/></c:set>': 'prefix:c, tag:out attrs: {\"var\":\"test\"} prefix:c, tag:set attrs: {\"var\":\"junk\",\"scope\":\"request\"}, buffer:I am <bold/>',
    '<c:out var="test"/>': "prefix:c, tag:out attrs: {\"var\":\"test\"}",
    '<c:out var="test">hello<b/></c:out>': 'prefix:c, tag:out attrs: {\"var\":\"test\"}, buffer:hello<b/>',
    '<c:set var="#"/>': "prefix:c, tag:set attrs: {\"var\":\"#\"}",
    '<c:set var="#">hello</c:set>': "prefix:c, tag:set attrs: {\"var\":\"#\"}, buffer:hello",
    '<!-- hello <c:set var="#"/> me -->': "hello <c:set var=\"#\"/> me",
    '<c:choose><c:when test="abc">hello</c:when><c:otherwise>goodbye</c:otherwise></c:choose>': "prefix:c, tag:choose attrs: {}, buffer:<c:when test=\"abc\">hello</c:when><c:otherwise>goodbye</c:otherwise>",
    '<c:w t="abc">hell</c:w><c:o>h7n</c:o>': "prefix:c, tag:w attrs: {\"t\":\"abc\"}, buffer:hell prefix:c, tag:o attrs: {}, buffer:h7n",
    '<%@taglib prefix="core"  uri="http://java.sun.com/jsp/jstl/core" %>\n<core:choose><core:when test="${empty myitems}">hello</core:when><core:otherwise>goodbye</core:otherwise></core:choose>': "prefix:core, tag:choose attrs: {}, buffer:<core:when test=\"${empty myitems}\">hello</core:when><core:otherwise>goodbye</core:otherwise>",
    '<%@taglib prefix="core"  uri="http://java.sun.com/jsp/jstl/core" %>\n<core:when test=\"${empty myitems}\">hello</core:when><core:otherwise>goodbye</core:otherwise>': "prefix:core, tag:when attrs: {\"test\":\"${empty myitems}\"}, buffer:hello prefix:core, tag:otherwise attrs: {}, buffer:goodbye",
    '<c:out var="has>end"/>': "prefix:c, tag:out attrs: {\"var\":\"has>end\"}",
    '<c:out/>': 'prefix:c, tag:out attrs: {}',
    '<c:if test="stuff">hello</c:if><c:if test="nostuff">goodbye</c:if>': "prefix:c, tag:if attrs: {\"test\":\"stuff\"}, buffer:hello prefix:c, tag:if attrs: {\"test\":\"nostuff\"}, buffer:goodbye",
    '<c:out var="test">hello<c:out>what</c:out></c:out>': "prefix:c, tag:out attrs: {\"var\":\"test\"}, buffer:hello<c:out>what</c:out>",
    '<c:out var="test"><c:out>what</c:out></c:out>': "prefix:c, tag:out attrs: {\"var\":\"test\"}, buffer:<c:out>what</c:out>",
    '<c:out var="test">hello<c:out>what</c:out> more </c:out>': "prefix:c, tag:out attrs: {\"var\":\"test\"}, buffer:hello<c:out>what</c:out> more "
};
var tests = {
};

Object.keys(xmltests).forEach(function makeTestFunction(k) {
    tests[k] = makeTest(k, xmltests[k]);
});

var core = '<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>'
function printResult(result) {
    return result && result.content.map(function (v) {
        return typeof v === 'function' ? v() : v;
    }).join(' ');
}
function makeTest(xml, expected) {
    return function (test) {
        parser = new Parser();
        var result = parser.parse(core + xml);
        var val = printResult(result);
        test.equals(val, expected);
        test.done();
    }
}

module.exports = tests;