var Q = require('q'), fs = require('fs'), path = require('path'), ctxMap = {
    'http://java.sun.com/jsp/jstl/core': __dirname+'/tag/core',
    'http://java.sun.com/JSP/Page': __dirname+'/tag/jsp',
    'http://java.sun.com/jsp/jstl/functions':__dirname+'/jstl'
}
function resolver(v, file) {
    var f = ctxMap[v.uri || v.tagdir || v] || path.join(process.cwd(), v.tagdir || v);
    var d = Q.defer();
    var fullPath = path.join(f, file);
    fs.readFile( fullPath+ '.tag', 'utf-8', d.makeNodeResolver());
    return d.promise;
}

module.exports = resolver;
