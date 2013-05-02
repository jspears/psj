var funcs = require('../lib/psj-parsed-functions'), local = require('../lib/psj-local-resolver'), Q = require('q');

function invoke(namespace, func) {
    return Q.invoke(funcs, 'resolve', local, namespace, func);
}
module.exports = {
    'test startsWith': function (test) {
        invoke('http://java.sun.com/jsp/jstl/functions', 'startsWith').then(function (func) {
            test.ok(func('yesSire', 'yes'), 'startsWith');
            test.ok(!func('yesSire', 'no'), 'startsWith');
            test.done();

        }, test.fail);
    },
    'endsWith': function (test) {
        invoke('http://java.sun.com/jsp/jstl/functions', 'endsWith').then(function (func) {
            test.ok(func('yesSire', 're'), 'endsWith');
            test.ok(!func('yesSire', 'no'), 'endsWith');
            test.done();

        }, test.fail);

    },
    'replace': function (test) {
        invoke('http://java.sun.com/jsp/jstl/functions', 'replace').then(function (func) {
            test.equals(func('abc123abc123', '123', 'X'), 'abcXabcX');
            test.equals(func('abc123abc123d', '123', 'X'), 'abcXabcXd');
            test.equals(func('abc123abc123', '123', 'X'), 'abcXabcX');
            test.equals(func('123abc123abc123', '123', 'X'), 'XabcXabcX');
            test.equals(func('abc', '123', 'def'), 'abc');
            test.done();

        }, test.fail);

    },
    'escapeXml': function (test) {
        invoke('http://java.sun.com/jsp/jstl/functions', 'escapeXml').then(function (func) {
            test.equals(func('<hello>&"\''), "&lt;hello&gt;&amp;&#034;&#039;");
            test.done();

        }, test.fail);

    }
}