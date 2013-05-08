if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(['path'], function (path) {
    var dir = __dirname ? __dirname + '/' : '';
    return {
        'http://java.sun.com/jsp/jstl/core': path.join(dir, '/tag/core'),
        'http://java.sun.com/JSP/Page': path.join(dir + '/tag/jsp'),
        'http://java.sun.com/jsp/jstl/functions': path.join(dir + '/tag/jstl/functions')
    }
});
