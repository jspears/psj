if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(['path'], function (path) {
    var dir = __dirname;
    return {
        'http://java.sun.com/jsp/jstl/core': path.join(dir, 'tags', 'c', 'tld'),
        'http://java.sun.com/JSP/Page': path.join(dir, 'tags', 'jsp', 'tld'),
        'http://java.sun.com/jsp/jstl/functions': path.join(dir, 'tags', 'fn', 'functions')
    }
});
