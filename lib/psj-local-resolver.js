var Q = require('q'), fs = require('fs'), path = require('path'), ctxMap = {
    'http://java.sun.com/jsp/jstl/core': 'tag/core',
    'http://java.sun.com/JSP/Page': 'tag/jsp',
    'http://java.sun.com/jsp/jstl/functions':'jstl'
}
function resolver(v, file) {
    var f = ctxMap[v.uri || v.tagdir || v] || v.uri || v.tagdir;
    var d = Q.defer();
    var fullPath = path.join(__dirname, f, file);
    fs.readFile( fullPath+ '.tag', 'utf-8', d.makeNodeResolver());
    return d.promise;
}

module.exports = resolver;
