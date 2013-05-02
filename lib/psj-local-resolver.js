var Q = require('q'), fs = require('fs'), path = require('path'), ctxMap = require('./psj-namespace-map');

function resolver(v, file, reader) {
    reader = reader || function(fullPath, cb){
        fs.readFile(path.resolve(fullPath)+'.tag', 'utf-8', cb)
    }
    var f = ctxMap[v.uri || v.tagdir || v] || path.join(process.cwd(), v.tagdir || v);
    var d = Q.defer();
    var fullPath = file ? path.join(f, file) : f;
    reader( fullPath, d.makeNodeResolver());
    return d.promise;
}

module.exports = resolver;
